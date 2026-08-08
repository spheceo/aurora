import Image from "next/image";
import Link from "next/link";
import Cart from "@/components/cart";

export default function PrivacyPolicyPage() {
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
              src="/aurora-logo.png"
              alt="Aurora logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
          </Link>
          <Cart />
        </div>
      </nav>

      <main className="px-4 py-10 md:px-15 md:py-14">
        <section className="mx-auto max-w-3xl">
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#8a7678]">
            Privacy policy
          </p>
          <h1 className="mt-3 text-2xl leading-tight md:text-4xl">
            How we collect and
            <br />
            protect your data
          </h1>
          <p className="mt-2 text-xs text-[#7a6d6e]">
            Last updated: {currentDate}
          </p>

          <div className="mt-6 space-y-5 text-sm leading-relaxed text-[#65595a]">
            <div>
              <h2 className="text-sm font-medium text-foreground">
                Information We Collect
              </h2>
              <p className="mt-2">
                We collect details required to process orders and support your
                experience, including contact information, shipping details, and
                order activity.
              </p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-foreground">
                How We Use It
              </h2>
              <p className="mt-2">
                Your information is used to fulfill purchases, provide support,
                send updates, improve our store experience, and comply with
                legal obligations.
              </p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-foreground">Security</h2>
              <p className="mt-2">
                Payments are processed through secure providers. We implement
                safeguards to protect your personal information and review our
                practices regularly.
              </p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-foreground">
                Your Rights
              </h2>
              <p className="mt-2">
                You may request access, correction, or deletion of your personal
                data where applicable. Contact us and we will assist.
              </p>
            </div>
          </div>

          <p className="mt-7 text-sm text-[#65595a]">
            Questions about privacy?{" "}
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
