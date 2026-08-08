# Design QA — Storefront account control

- Source visual truth: user-provided conversation attachment showing the Aurora desktop hero header (1833 × 290 px; the attachment is not filesystem-backed).
- Implementation screenshots:
  - `artifacts/qa/storefront-account-desktop.png`
  - `artifacts/qa/storefront-account-mobile.png`
- Desktop viewport: 1920 × 873 CSS px at device scale factor 1; implementation capture is 1920 × 873 px.
- Mobile viewport: 390 × 844 CSS px at device scale factor 1; implementation capture is 390 × 844 px.
- State: signed out, WorkOS/Neon not configured in development.
- Density normalization: source and implementation were inspected at their native 1× density. The comparison used the visible desktop header region rather than comparing the source's short crop with the full implementation viewport.

## Full-view comparison evidence

The desktop implementation preserves the source hero image, white navigation, spacing rhythm, search and cart controls, and adds the requested circular user control immediately after the cart at the far right. The control remains visually subordinate to the text navigation and uses the same fine white stroke treatment as the existing utility icons.

The mobile implementation keeps the logo and utility controls on one line in the order search, cart, account, menu. No overlap, clipping, or horizontal overflow is visible at 390 px.

## Focused region comparison evidence

The header utility region was inspected at desktop and mobile widths. The account icon is optically aligned with the search/cart icons, has a 32 px target, and maintains a consistent gap after the cart. No additional focused crop was necessary because all relevant controls are clearly legible in the browser captures.

## Required fidelity surfaces

- Fonts and typography: unchanged from the existing Google Sans Flex storefront typography; menu labels use the storefront's established sizes and weights.
- Spacing and layout rhythm: the new control follows existing 16–24 px header gaps and does not alter the hero composition.
- Colors and visual tokens: white/translucent-white on the hero and foreground/border tokens on light headers match the existing navigation states.
- Image quality and asset fidelity: the supplied hero and logo assets remain unchanged; the account glyph comes from the project's existing icon library. WorkOS profile images render at their native URL without transformation.
- Copy and content: signed-out copy is “Sign in”; signed-in options are Profile, Wholesale account/status, and Sign out.

## Interaction verification

- The signed-out account link is uniquely exposed to assistive technology as “Sign in.”
- Clicking it navigates to `/account/sign-in` and renders the expected branded authentication entry screen.
- `/`, `/shop`, `/account/sign-in`, and `/api/account/session` returned successfully in development.
- Desktop and mobile browser consoles showed no errors.
- Authenticated avatar/menu behavior could not be exercised locally because WorkOS credentials are intentionally absent; its data and rendering contracts passed TypeScript validation.

## Findings

No actionable P0, P1, or P2 visual or interaction mismatches were found in the available signed-out state.

## Comparison history

- Pass 1: desktop and mobile signed-out captures matched the requested placement and existing header design. No P0/P1/P2 fixes were required.

## Follow-up polish

- P3 test gap: repeat the menu interaction check with a real WorkOS user to visually confirm a remote profile image and every authenticated menu destination.

final result: passed
