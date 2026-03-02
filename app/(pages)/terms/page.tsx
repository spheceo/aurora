import Image from "next/image";
import Link from "next/link";
import Cart from "@/components/cart";

export default function TermsPage() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-dvh bg-background">
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3 md:px-15 md:py-4">
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/logo.png"
              alt="Aurora logo"
              width={34}
              height={34}
              className="rounded-lg"
            />
          </Link>
          <Cart />
        </div>
      </nav>

      <main className="px-4 py-10 md:px-15 md:py-14">
        <section className="mx-auto max-w-3xl">
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#8a7678]">
            Terms of service
          </p>
          <h1 className="mt-3 text-2xl leading-tight md:text-4xl">
            Purchases, shipping,
            <br />
            returns, and usage
          </h1>
          <p className="mt-2 text-xs text-[#7a6d6e]">
            Last updated: {currentDate}
          </p>

          <div className="mt-6 space-y-5 text-sm leading-relaxed text-[#65595a]">
            <div>
              <h2 className="text-sm font-medium text-foreground">Products</h2>
              <p className="mt-2">
                Crystal products are natural and may vary in color, shape, and
                size. Product images are representative and minor variation is
                expected.
              </p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-foreground">
                Orders and Payment
              </h2>
              <p className="mt-2">
                Orders may be declined or cancelled for availability, pricing
                errors, or fraud concerns. Payments are securely handled by our
                checkout provider.
              </p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-foreground">
                Shipping and Returns
              </h2>
              <p className="mt-2">
                Processing and delivery times are estimates. Return windows,
                item condition requirements, and exclusions apply according to
                our policy.
              </p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-foreground">Liability</h2>
              <p className="mt-2">
                To the extent allowed by law, Aurora is not liable for indirect
                or consequential loss arising from use of the site or products.
              </p>
            </div>
          </div>

          <p className="mt-7 text-sm text-[#65595a]">
            For full terms and assistance, contact{" "}
            <a
              href="mailto:aurora.collab1@gmail.com"
              className="underline underline-offset-2"
            >
              aurora.collab1@gmail.com
            </a>
          </p>
        </section>
      </main>
    </div>
  );
}
