import Image from "next/image";
import Link from "next/link";
import Cart from "@/components/cart";

export default function AboutPage() {
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
        <div className="mx-auto max-w-6xl border border-[#e7dede] lg:grid lg:grid-cols-[1fr_0.9fr] lg:divide-x lg:divide-[#e7dede]">
          <section className="overflow-hidden bg-white lg:h-full">
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

          <section className="bg-white p-5 md:p-7">
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#8a7678]">
              About us
            </p>
            <h1 className="mt-3 text-2xl leading-tight md:text-4xl">
              Find Your Obsession
            </h1>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-[#65595a]">
              <p>
                At Aurora, we believe in the refined power of energy,
                intention, and elevated living. Our collection extends beyond
                natural crystals to include a curated selection of energy tools
                designed to uplift your frequency and support intentional
                wellness practices.
              </p>
              <p>
                Each piece is thoughtfully selected for its rarity, quality,
                and energetic presence. From statement crystals to
                transformative tools, every item is chosen to enhance your
                space, encourage balance, and promote clarity of mind and calm
                within your environment.
              </p>
              <p>
                We view wellness as a lifestyle, one rooted in alignment,
                awareness, and refinement. Aurora is not about trends. It is
                about intentional luxury, conscious living, and surrounding
                yourself with pieces that support both inner wellbeing and outer
                beauty.
              </p>
              <p>
                Our mission at Aurora is to curate refined crystals and
                intentional energy tools that elevate both space and self. We
                are dedicated to offering rare, high-quality pieces that support
                balance, clarity, and conscious living.
              </p>
              <p>
                We believe true wellness begins with intention. Through
                carefully selected products designed to uplift your energy and
                enhance your frequency, we aim to help you create environments
                that inspire calm, confidence, and alignment.
              </p>
              <p>
                Aurora exists to make elevated living accessible to those who
                value rarity, craftsmanship, and meaningful transformation.
                Every piece we offer is chosen with purpose, so you can live
                with intention and surround yourself with energy that reflects
                your highest standard.
              </p>
            </div>

            <Link
              href="/shop"
              className="mt-7 inline-flex w-full items-center justify-center bg-[#811A21] px-5 py-3 text-xs font-semibold tracking-[0.18em] uppercase text-white transition-colors hover:bg-[#6f161d]"
            >
              Shop Collection
            </Link>

            <div className="mt-6 flex items-center gap-4 text-sm text-[#65595a]">
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
