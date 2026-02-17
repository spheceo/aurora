import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-20 border-t border-border bg-background">
      <div className="px-4 md:px-15 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="inline-block cursor-pointer">
              <h1 className="text-2xl font-medium">Aurora.</h1>
            </Link>
            <p className="text-sm text-[#9A9A9A] leading-relaxed">
              Earth's Beauty, Captured in Crystal. Curated natural crystals for
              your space.
            </p>
          </div>

          {/* Shop Column */}
          <div className="space-y-4">
            <h3 className="text-xs font-medium uppercase tracking-wider">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/shop"
                  className="text-sm text-[#9A9A9A] hover:text-foreground transition-colors cursor-pointer"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-sm text-[#9A9A9A] hover:text-foreground transition-colors cursor-pointer"
                >
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-4">
            <h3 className="text-xs font-medium uppercase tracking-wider">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-[#9A9A9A] hover:text-foreground transition-colors cursor-pointer"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-[#9A9A9A] hover:text-foreground transition-colors cursor-pointer"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Column */}
          <div className="space-y-4">
            <h3 className="text-xs font-medium uppercase tracking-wider">Connect</h3>
            <ul className="space-y-2">
              {/* <li>
                <a
                  href="https://www.instagram.com/aurora_crystalss/"
                  target="_blank"
                  className="text-sm text-[#9A9A9A] hover:text-foreground transition-colors cursor-pointer"
                >
                  Instagram
                </a>
              </li> */}
              {/* <li>
                <a
                  href="https://www.tiktok.com/@aurora_crystalss"
                  target="_blank"
                  className="text-sm text-[#9A9A9A] hover:text-foreground transition-colors cursor-pointer"
                >
                  TikTok
                </a>
              </li> */}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#9A9A9A]">
              © {currentYear} Aurora. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-xs text-[#9A9A9A] hover:text-foreground transition-colors cursor-pointer"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-xs text-[#9A9A9A] hover:text-foreground transition-colors cursor-pointer"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
