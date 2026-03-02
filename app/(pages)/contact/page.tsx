import Image from "next/image";
import Link from "next/link";
import Cart from "@/components/cart";

export default function ContactPage() {
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
        <div className="mx-auto max-w-6xl border border-[#e7dede] lg:grid lg:grid-cols-[1fr_0.9fr] lg:divide-x lg:divide-[#e7dede]">
          <section className="overflow-hidden bg-white lg:h-full">
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

          <section className="bg-white p-5 md:p-7">
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
                className="w-full border border-[#ece6e7] bg-[#faf8f8] px-4 py-3 text-sm outline-none transition-colors focus:border-[#811A21]"
              />
              <input
                type="email"
                placeholder="Email *"
                className="w-full border border-[#ece6e7] bg-[#faf8f8] px-4 py-3 text-sm outline-none transition-colors focus:border-[#811A21]"
              />
              <input
                type="tel"
                placeholder="Phone number"
                className="w-full border border-[#ece6e7] bg-[#faf8f8] px-4 py-3 text-sm outline-none transition-colors focus:border-[#811A21]"
              />
              <textarea
                rows={6}
                placeholder="Message"
                className="w-full resize-none border border-[#ece6e7] bg-[#faf8f8] px-4 py-3 text-sm outline-none transition-colors focus:border-[#811A21]"
              />
              <button
                type="button"
                className="w-full bg-[#811A21] px-5 py-3 text-xs font-semibold tracking-[0.18em] uppercase text-white transition-colors hover:bg-[#6f161d]"
              >
                Send Message
              </button>
            </form>

            <p className="mt-7 text-sm text-[#65595a]">
              For sales and support, contact{" "}
              <a
                href="mailto:aurora.collab1@gmail.com"
                className="underline underline-offset-2"
              >
                aurora.collab1@gmail.com
              </a>
            </p>

            <div className="mt-4 flex items-center gap-4 text-sm text-[#65595a]">
              <a
                href="https://www.instagram.com/aurora_za_"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Instagram
              </a>
              <a
                href="https://www.tiktok.com/@aurora_za_"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                TikTok
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
