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
            <Image src="/logo.png" alt="Aurora logo" width={34} height={34} />
          </Link>
          <Cart />
        </div>
      </nav>

      <main className="px-4 py-10 md:px-15 md:py-14">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_0.9fr]">
          <section className="overflow-hidden rounded-xl border border-[#e7dede] bg-white lg:h-full">
            <div className="relative h-[320px] md:h-[540px] lg:h-full">
              <Image
                src="/cover/01.png"
                alt="Privacy and trust"
                fill
                className="object-cover"
                priority
              />
            </div>
          </section>

          <section className="rounded-xl border border-[#e7dede] bg-white p-5 md:p-7">
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
                  experience, including contact information, shipping details,
                  and order activity.
                </p>
              </div>

              <div>
                <h2 className="text-sm font-medium text-foreground">
                  How We Use It
                </h2>
                <p className="mt-2">
                  Your information is used to fulfill purchases, provide
                  support, send updates, improve our store experience, and
                  comply with legal obligations.
                </p>
              </div>

              <div>
                <h2 className="text-sm font-medium text-foreground">
                  Security
                </h2>
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
                  You may request access, correction, or deletion of your
                  personal data where applicable. Contact us and we will assist.
                </p>
              </div>
            </div>

            <p className="mt-7 text-sm text-[#65595a]">
              Questions about privacy?{" "}
              <a
                href="mailto:hello@aurora.crystals"
                className="underline underline-offset-2"
              >
                hello@aurora.crystals
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
