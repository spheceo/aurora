# Aurora
This is the Aurora ecommerce project.

It consists of:
- A Next.js frontend
- An oRPC backend API 

## Environment Variables

- `SHOPIFY_TOKEN`: Storefront API access token.
- `SHOPIFY_DOMAIN`: Shopify Storefront API domain (usually your `*.myshopify.com` domain).
- `SHOPIFY_CHECKOUT_DOMAIN` (optional): Forces checkout/cart redirect host. Use this when your app and Shopify storefront domain overlap and checkout redirects resolve to the wrong server.
- `RESEND_API_KEY`: Resend API key used for transactional emails.
- `ADMIN_NOTIFICATION_EMAIL`: Admin inbox that receives payment success notifications.
- `EMAIL_SENDER_DOMAIN` (optional): Domain used for sender address (`orders@<domain>`). Falls back to Resend's `onboarding@resend.dev` sender if unset.
- `APP_URL` (optional): Canonical app URL used for webhook email links and logo URLs.

## Payment Success Webhook

- Endpoint: `POST /api/webhooks/payment-succeeded`
- Content-Type: `application/json`
- Expected Shopify topic: `Order payment` (`orders/paid`)
- Delivery behavior:
  - Always sends an admin order-update email for every accepted Shopify payload.
  - Sends a customer email when a customer email address exists in the payload.
  - Email copy reflects the payload `financial_status` (e.g. `paid`, `voided`, etc.).
  - Returns non-2xx (`502`) when required email sending fails so webhook providers can retry.

Example payload:

```json
{
  "id": 6176577044736,
  "name": "#1012",
  "order_number": 1012,
  "contact_email": "customer@example.com",
  "processed_at": "2026-02-16T10:20:00.000Z",
  "updated_at": "2026-02-16T10:20:30.000Z",
  "created_at": "2026-02-16T10:19:10.000Z",
  "current_total_price": "259.99",
  "currency": "USD",
  "customer": {
    "email": "customer@example.com",
    "first_name": "Jane",
    "last_name": "Doe"
  },
  "line_items": [
    {
      "title": "Rose Quartz Point",
      "quantity": 1,
      "price": "259.99"
    }
  ],
  "shipping_address": {
    "address1": "123 Crystal Lane",
    "city": "Cape Town",
    "province": "Western Cape",
    "zip": "8001",
    "country": "South Africa"
  }
}
```

## Important Things to Note for Devs

### Lenis + GSAP ScrollTrigger Initialization

When using GSAP ScrollTrigger with Lenis smooth scroll, there's an initialization timing conflict. ScrollTrigger can calculate incorrect scroll positions before Lenis fully initializes, causing animations to jump to their end state on page load.

**Solution:** Delay ScrollTrigger creation and explicitly set initial state:

```typescript
useGSAP(() => {
  // Set initial state explicitly
  gsap.set(elementRef.current, { y: 0, scale: 1 });

  // Delay ScrollTrigger creation to let Lenis initialize
  const timeout = setTimeout(() => {
    ScrollTrigger.create({
      trigger: "#target-element",
      start: "top bottom",
      end: "top top",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.set(elementRef.current, {
          y: -50 * progress,
          scale: 1 - 0.02 * progress,
        });
      },
    });
    ScrollTrigger.refresh();
  }, 100);

  return () => clearTimeout(timeout);
}, { scope: elementRef });
```

See `components/hero.tsx` for a working implementation.

## TODO (Before Production)
- Implement transactional email flow (e.g., Resend):
  - On contact form submit: notify Aurora owner and send user confirmation email.
- Tighten payment webhook security:
  - Restrict to Shopify webhook source only.
  - Add Shopify HMAC verification and replay protection.
- Add error handling + user-friendly fallbacks for Shopify API failures (products/collections/checkout).
- Add product pagination (or infinite scroll) to avoid loading all products at once.
- Add collection-filter-aware empty states and loading states.
- Add monitoring/alerting (error tracking and uptime checks).
- Add basic tests for critical flows (products fetch, checkout creation, webhook handling).
