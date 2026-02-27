import Image from "next/image";
import Link from "next/link";
import Cart from "@/components/cart";

export default function ContactPage() {
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
                src="/cover/02.png"
                alt="Aurora crystal collection"
                fill
                className="object-cover"
                priority
              />
            </div>
          </section>

          <section className="rounded-xl border border-[#e7dede] bg-white p-5 md:p-7">
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#8a7678]">
              Contact us
            </p>
            <h1 className="mt-3 text-2xl leading-tight md:text-4xl">
              Questions about your order
              <br />
              or shopping support?
            </h1>

            <form className="mt-6 space-y-3">
              <input
                type="text"
                placeholder="Name *"
                className="w-full rounded-sm border border-[#ece6e7] bg-[#faf8f8] px-4 py-3 text-sm outline-none transition-colors focus:border-[#811A21]"
              />
              <input
                type="email"
                placeholder="Email *"
                className="w-full rounded-sm border border-[#ece6e7] bg-[#faf8f8] px-4 py-3 text-sm outline-none transition-colors focus:border-[#811A21]"
              />
              <input
                type="tel"
                placeholder="Phone number"
                className="w-full rounded-sm border border-[#ece6e7] bg-[#faf8f8] px-4 py-3 text-sm outline-none transition-colors focus:border-[#811A21]"
              />
              <textarea
                rows={6}
                placeholder="Message"
                className="w-full resize-none rounded-sm border border-[#ece6e7] bg-[#faf8f8] px-4 py-3 text-sm outline-none transition-colors focus:border-[#811A21]"
              />
              <button
                type="button"
                className="w-full rounded-sm bg-[#811A21] px-5 py-3 text-xs font-semibold tracking-[0.18em] uppercase text-white transition-colors hover:bg-[#6f161d]"
              >
                Send Message
              </button>
            </form>

            <p className="mt-7 text-sm text-[#65595a]">
              For sales and support, contact{" "}
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
