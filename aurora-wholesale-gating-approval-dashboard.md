# Aurora — Wholesale Gating + Approval Dashboard

## Context

Aurora is moving to a **wholesale-only pricing model**. Prices and checkout must be
invisible to the public and available only to buyers who are (1) authenticated and
(2) manually approved by staff. Today neither app has auth, and there is no database
anywhere in the monorepo — approval state has nowhere to live.

The storefront currently leaks pricing through **four** separate doors, only one of
which is a React component. Any plan that only edits UI is not a gate:

| Door | Location | Risk |
|---|---|---|
| Server-rendered HTML | `shop/page.tsx`, `product/[id]/page.tsx` call `getProducts()` directly | Price sits in the RSC payload before client code runs |
| Public RPC | `app/rpc/[[...rest]]/route.ts` — no auth, `context: {}` | `api.products()` is curl-able by anyone |
| Checkout | `lib/checkout.ts:41` mints a live Shopify cart + `checkoutUrl` | Anyone can POST `/rpc/checkout` today and get a working checkout link |
| JSON-LD | `product/[id]/layout.tsx:87-95` `offers` block | Price published to crawlers |

The saving grace: **`lib/products.ts` is a true chokepoint.** `getProducts` and
`getProductById` each build the price string in exactly one place (lines 179 and 223),
and every one of the four doors flows through them. Redacting there closes all four.

Decisions already made with the user: approve the **company** (not the individual email),
catalog stays **public with prices hidden**, **Neon + Drizzle**, and staff sign into
admin via the **same WorkOS** with a staff-org check.

---

## Phase 0 — Repo prep

- `pnpm-workspace.yaml`: add `packages/*` (currently `apps/*` only).
- **`apps/admin/.next` is committed to git** (~40 build artifacts, incl. turbopack cache,
  from commit `705d400`). Add `.next/` to a new `apps/admin/.gitignore` and
  `git rm -r --cached apps/admin/.next`.
- `turbo.json` `globalEnv`: add `DATABASE_URL`, `WORKOS_API_KEY`, `WORKOS_CLIENT_ID`,
  `WORKOS_COOKIE_PASSWORD`, `NEXT_PUBLIC_WORKOS_REDIRECT_URI`, `WORKOS_STAFF_ORG_ID`.

## Phase 1 — `packages/db`

New workspace package (`@aurora/db`): Drizzle + `@neondatabase/serverless`, consumed by
both apps.

```
accounts            id, workos_organization_id, company_name, email_domain (unique),
                    registration_number, vat_number, phone, status
                    ('pending'|'approved'|'rejected'|'suspended'),
                    approved_at, approved_by, notes, created_at, updated_at

account_members     id, account_id → accounts, workos_user_id (unique), email,
                    first_name, last_name, role ('owner'|'buyer'), created_at

approval_events     id, account_id → accounts, actor_email, action
                    ('submitted'|'approved'|'rejected'|'suspended'|'reinstated'),
                    reason, created_at
```

`email_domain` is the join key for company-level inheritance. `approval_events` is the
audit trail the dashboard timeline renders — never mutate rows, only append.

## Phase 2 — WorkOS auth on the storefront

`@workos-inc/authkit-nextjs` (session/middleware) + `@workos-inc/node` (creating Orgs).

- `apps/storefront/src/middleware.ts` — `authkitMiddleware()` for session refresh. No
  route is blocked here; the catalog stays public.
- `app/callback/route.ts` — AuthKit callback.
- `app/account/apply/page.tsx` — wholesale application form (company name, registration
  no., VAT no., phone). Shown when an authenticated user has no `account_members` row.
- `app/account/pending/page.tsx` — "under review" state.

Application submit (server action):
1. Derive `email_domain` from the user's email.
2. **Domain matches an `approved` account** → insert member, immediately approved (this is
   the company-level inheritance the user asked for).
3. **No match** → create WorkOS Organization, insert `accounts` (status `pending`) +
   member (`owner`) + `approval_events` `submitted`.

## Phase 3 — Price gating (the actual security work)

**`lib/auth/pricing.ts`** — one primitive, wrapped in React `cache()` so it costs one
query per request:

```ts
getPricingAccess(): Promise<{ approved: boolean; accountId?: string; status?: AccountStatus }>
```

**`lib/products.ts` redacts by default.** Rather than redacting at call sites (which is
where things get forgotten), `getProducts`/`getProductById` call `getPricingAccess()`
themselves and blank `price` + `variants[].price`, setting a new `pricingLocked: boolean`
on `ProductSchema`. An explicit `{ trustedPriceAccess: true }` option is the only escape
hatch. This makes all four doors safe at once and makes leaking the *non*-default.

- **RPC**: an oRPC middleware throwing `FORBIDDEN` on `checkout` when not approved.
  `products`/`productById` need no blocking — redaction already happened inside.
- **JSON-LD**: `product/[id]/layout.tsx` omits the `offers` block unless approved.
- **UI (5 sites)**: `ShopClient.tsx:483`, `ProductClient.tsx:361/409/541`,
  `signaturepicks.tsx:75`, `search.tsx:228`. Each already has a `soldOut ? "—" :` seam —
  add a `pricingLocked` branch rendering "Sign in for pricing". Hide "Add to Cart"
  (`ShopClient.tsx:487`) and block the cart's checkout button (`cart.tsx:29`) when locked.

Note: root layout already sets `export const revalidate = 0`, so every page is dynamic —
there is no static-cache risk of one user's prices being served to another.

## Phase 4 — Admin dashboard

Admin is a bare scaffold (3 files, no Tailwind). Add Tailwind v4 + the storefront's
`cn()`/Button/Card primitives.

**Design language, lifted from the storefront** (extracted from actual usage):
maroon `#811A21` (hover `#6f161d`), warm off-whites `#faf8f8`/`#fffdfd`, borders
`#e7dede`/`#d8c8ca`, muted text `#9A9A9A`/`#8a7678`, Google Sans Flex,
**sharp corners** (`rounded-none` is the most-used radius in the storefront), and
`text-[10px] font-semibold tracking-widest uppercase` micro-labels for badges/column
headers. Light theme only — no `.dark` block.

Routes:
- `/` — pending queue count, approved total, recent approval activity.
- `/accounts` — table with status filter + search.
- `/accounts/[id]` — company details, member list, approve/reject (with reason), staff
  notes, and the `approval_events` timeline.

Mutations are **server actions**, not oRPC (single trusted consumer; no client API needed).
Every mutation writes an `approval_events` row in the same transaction.

`middleware.ts` gates the whole app on WorkOS session + membership of `WORKOS_STAFF_ORG_ID`.

## Phase 5 — Approval emails

Reuse the existing `AuroraEmailShell` (`lib/email/templates/components/`) and Resend setup.
Send on approve ("your wholesale account is active") and reject.

Since both apps now send mail, move `storefront/src/lib/email/` → `packages/email`
(`@aurora/email`) — a mechanical move, updating the storefront's `@/lib/email/*` imports.
Skippable if you'd rather not touch the working webhook path yet; the cost is a duplicated
shell that will drift.

---

## Verification

1. `pnpm --filter @aurora/db db:push` against a Neon branch; confirm 3 tables.
2. **Logged out**: `/shop` and `/product/[id]` render the catalog with "Sign in for
   pricing", no "Add to Cart". View source — confirm no price in the RSC payload and no
   `offers` in the JSON-LD.
3. **Raw RPC** (the real test):
   `curl -X POST localhost:3000/rpc/products -H 'content-type: application/json' -d '{}'`
   → prices blank. Same for `/rpc/checkout` → `FORBIDDEN`.
4. **Pending**: sign up, submit the application, confirm redirect to `/account/pending`
   and that pricing is still locked.
5. **Approve** in admin → same user reloads `/shop`, prices appear, checkout reaches
   Shopify.
6. **Inheritance**: sign up a second user on the same email domain → approved immediately,
   no queue entry, prices visible on first load.
7. **Revoke**: set the account to `suspended` → prices lock again on next request.
8. `pnpm lint && pnpm build` at the root.

## Out of scope

Per-account pricing tiers / negotiated rates, purchase orders and net terms, SSO or SCIM
(WorkOS makes these additive later — no re-architecture), and self-serve account
management for buyers.
