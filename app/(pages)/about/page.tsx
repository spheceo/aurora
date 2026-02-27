import Image from "next/image";
import Link from "next/link";
import Cart from "@/components/cart";

const values = [
  {
    title: "Authenticity",
    copy: "Every crystal we offer is natural and selected for genuine beauty.",
  },
  {
    title: "Quality",
    copy: "Each piece is checked for clarity, color, and overall finish.",
  },
  {
    title: "Sustainability",
    copy: "We work with partners who prioritize responsible sourcing practices.",
  },
  {
    title: "Connection",
    copy: "We help you find crystals that suit your space, intention, and style.",
  },
];

export default function AboutPage() {
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
                src="/cover/03.png"
                alt="About Aurora crystals"
                fill
                className="object-cover"
                priority
              />
            </div>
          </section>

          <section className="rounded-xl border border-[#e7dede] bg-white p-5 md:p-7">
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#8a7678]">
              About us
            </p>
            <h1 className="mt-3 text-2xl leading-tight md:text-4xl">
              Bringing Nature&apos;s
              <br />
              Beauty to You
            </h1>
            <p className="mt-5 text-sm leading-relaxed text-[#65595a]">
              Aurora connects people with thoughtfully curated natural crystals.
              Every piece in our collection is selected for visual character,
              quality, and the atmosphere it brings into a space.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {values.map((value) => (
                <article
                  key={value.title}
                  className="rounded-sm border border-[#ece6e7] bg-[#faf8f8] p-3"
                >
                  <h2 className="text-sm font-medium">{value.title}</h2>
                  <p className="mt-2 text-xs leading-relaxed text-[#6f6162]">
                    {value.copy}
                  </p>
                </article>
              ))}
            </div>

            <Link
              href="/shop"
              className="mt-7 inline-flex w-full items-center justify-center rounded-sm bg-[#811A21] px-5 py-3 text-xs font-semibold tracking-[0.18em] uppercase text-white transition-colors hover:bg-[#6f161d]"
            >
              Shop Collection
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
