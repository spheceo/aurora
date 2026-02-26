import {
  ArrowRight,
  Gift,
  Headphones,
  PackageSearch,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Cart from "@/components/cart";

const supportTiles = [
  {
    title: "Order Tracking",
    copy: "Need an update on a current order? We will check status and courier movement.",
    href: "mailto:hello@aurora.crystals?subject=Order%20Tracking",
    icon: PackageSearch,
  },
  {
    title: "Returns & Exchanges",
    copy: "Wrong fit for your space? We can help with fast return and exchange guidance.",
    href: "mailto:hello@aurora.crystals?subject=Returns%20and%20Exchanges",
    icon: RefreshCcw,
  },
  {
    title: "Gift Recommendations",
    copy: "Share the vibe and budget, and we will suggest gift-ready crystal options.",
    href: "mailto:hello@aurora.crystals?subject=Gift%20Recommendations",
    icon: Gift,
  },
];

const shoppingAssist = [
  {
    label: "Bestsellers",
    copy: "Start with high-rated customer favorites.",
    href: "/shop",
  },
  {
    label: "Under R300",
    copy: "Great entry-level pieces with premium finish.",
    href: "/shop?price=0-150",
  },
  {
    label: "Custom Bundle",
    copy: "Create a curated set for your intent or space.",
    href: "mailto:hello@aurora.crystals?subject=Custom%20Bundle",
  },
];

export default function ContactCommerceConceptPage() {
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

      <main>
        <section className="px-4 pb-12 pt-14 md:px-15 md:pb-16 md:pt-18">
          <div className="max-w-5xl">
            <p className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.22em] uppercase text-[#8a7a7b]">
              <Sparkles className="h-3 w-3" />
              Contact us
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl leading-tight md:text-6xl">
              Shopping Support That Feels
              <br />
              Like Part of the Store
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#7a6d6e] md:text-base">
              Built for ecommerce flow: quick help categories, shopping-oriented
              contact paths, and clear next actions without a heavy form-first
              experience.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-xs font-semibold tracking-[0.18em] uppercase text-background transition-colors hover:bg-foreground/90"
              >
                Continue Shopping
                <ArrowRight className="h-3 w-3" />
              </Link>
              <a
                href="mailto:hello@aurora.crystals?subject=Shopping%20Help"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-xs font-semibold tracking-[0.18em] uppercase text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                Email Support
              </a>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-[#faf8f8] px-4 py-6 md:px-15">
          <div className="grid gap-3 sm:grid-cols-3">
            {shoppingAssist.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group rounded-2xl border border-[#e8e2e3] bg-white p-4 transition-colors hover:border-[#d7cbcd]"
              >
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#8a7779]">
                  {item.label}
                </p>
                <p className="mt-2 text-sm text-[#4b4142]">{item.copy}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[#4b4142]">
                  Open
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="px-4 py-10 md:px-15 md:py-14">
          <div className="grid gap-4 lg:grid-cols-3">
            {supportTiles.map((tile) => {
              const Icon = tile.icon;

              return (
                <a
                  key={tile.title}
                  href={tile.href}
                  className="group rounded-2xl border border-border bg-white p-5 transition-colors hover:border-[#c9babc]"
                >
                  <span className="inline-flex rounded-full border border-[#e6dbdc] bg-[#fcf8f8] p-2 text-[#811A21]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h2 className="mt-4 text-xl">{tile.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#6f6162]">
                    {tile.copy}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold tracking-[0.16em] uppercase text-[#4b4142]">
                    Contact Team
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </a>
              );
            })}
          </div>
        </section>

        <section className="px-4 pb-18 md:px-15 md:pb-24">
          <div className="rounded-3xl border border-border bg-[#f7f4f4] p-6 md:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#8a7879]">
                  [Crystal Concierge]
                </p>
                <h2 className="mt-3 max-w-xl text-3xl leading-tight md:text-4xl">
                  Not sure what to buy? Tell us your mood, space, and budget.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#6e6061]">
                  We will recommend pieces that fit your use case, from home
                  styling to gifts and intentional bundles.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href="mailto:hello@aurora.crystals?subject=Concierge%20Request"
                    className="inline-flex items-center gap-2 rounded-full bg-[#811A21] px-6 py-3 text-xs font-semibold tracking-[0.18em] uppercase text-white transition-colors hover:bg-[#6f161d]"
                  >
                    Start Concierge
                    <ArrowRight className="h-3 w-3" />
                  </a>
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 rounded-full border border-[#d6cacc] bg-white px-6 py-3 text-xs font-semibold tracking-[0.18em] uppercase text-[#4b4142] transition-colors hover:bg-white/70"
                  >
                    Browse First
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-[#e4dbdc] bg-white p-5">
                <h3 className="inline-flex items-center gap-2 text-sm font-medium">
                  <Headphones className="h-4 w-4 text-[#811A21]" />
                  Why customers use concierge
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-[#65595a]">
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#811A21]" />
                    Quick recommendations without browsing dozens of products.
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#811A21]" />
                    Better gift outcomes with budget and intention matching.
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#811A21]" />
                    Personalized bundle ideas for events and special moments.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
