"use client";

import Image from "next/image";
import Link from "next/link";
import remarkBreaks from "remark-breaks";
import { Streamdown } from "streamdown";
import type { z } from "zod";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/custom-carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/custom-dialog";
import type { CollectionsResponseSchema } from "@/lib/collections";

type Collections = z.infer<typeof CollectionsResponseSchema>;

const FALLBACK_IMAGE = "/categories/protection.png";
const TRUNCATE_LIMIT = 80;

const truncate = (text: string, limit: number) => {
  const trimmed = text.trim();
  if (trimmed.length <= limit) return trimmed;
  return `${trimmed.slice(0, limit).trim()}…`;
};

export default function HeroCarousel({
  collections,
}: {
  collections: Collections;
}) {
  if (!collections || collections.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-8 md:py-12 lg:py-16 mt-6 md:mt-10 mb-12 md:mb-20 overflow-hidden">
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        {/* Slides */}
        <CarouselContent className="-ml-4 pl-4 md:pl-8 lg:pl-[120px]">
          {collections.map((collection) => (
            <CarouselItem
              key={collection.id}
              className="pl-4 basis-[85%] md:basis-[60%] lg:basis-[48%] group"
            >
              <div className="relative h-[300px] md:h-[350px] lg:h-[420px] w-full overflow-hidden">
                <Image
                  src={collection.image?.url || FALLBACK_IMAGE}
                  alt={collection.image?.altText || collection.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="mb-2 text-sm opacity-80">Collection</p>
                  <h2 className="text-2xl font-semibold">{collection.title}</h2>
                  <p className="mt-2 text-sm opacity-80">
                    {truncate(
                      collection.description || "No description available yet.",
                      TRUNCATE_LIMIT,
                    )}
                  </p>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="absolute bottom-6 right-6 flex h-10 w-10 items-center justify-center bg-white/90 text-xl text-[#811A21] backdrop-blur transition-all cursor-pointer hover:bg-white"
                    >
                      +
                    </button>
                  </DialogTrigger>

                  <DialogContent className="overflow-hidden sm:max-w-xl rounded-none">
                    <DialogHeader className="mb-4 gap-3">
                      <DialogTitle>{collection.title}</DialogTitle>
                      <DialogDescription>Shop by intention</DialogDescription>
                    </DialogHeader>
                    <div className="overflow-y-auto max-h-[60vh] pr-2">
                      <Streamdown
                        className="mb-6 mt-2 text-foreground"
                        remarkPlugins={[remarkBreaks]}
                        components={{
                          p: ({ children }) => (
                            <p className="mb-4 leading-normal last:mb-0">
                              {children}
                            </p>
                          ),
                          ul: ({ children }) => (
                            <ul className="mb-4 list-disc pl-5 last:mb-0">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="mb-4 list-decimal pl-5 last:mb-0">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="mb-2 last:mb-0">{children}</li>
                          ),
                          a: ({ children, href }) => (
                            <a
                              href={href}
                              className="underline underline-offset-4 hover:opacity-80"
                            >
                              {children}
                            </a>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold">
                              {children}
                            </strong>
                          ),
                          em: ({ children }) => (
                            <em className="italic">{children}</em>
                          ),
                        }}
                      >
                        {collection.description ||
                          "No description available yet."}
                      </Streamdown>
                      <Link
                        href={`/shop?collection=${collection.handle}`}
                        className="inline-flex items-center justify-center px-5 py-2.5 bg-foreground text-background hover:bg-foreground/90 transition-colors text-xs font-medium tracking-wider uppercase cursor-pointer"
                      >
                        View Products
                      </Link>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CarouselItem>
          ))}
          <div className="min-w-[120px] shrink-0" aria-hidden="true" />
        </CarouselContent>

        {/* Bottom controls */}
        <div className="mt-8 flex items-center gap-4 pl-4 md:pl-8 lg:pl-[120px]">
          <CarouselPrevious className="static translate-y-0 rounded-none cursor-pointer" />
          <CarouselNext className="static translate-y-0 rounded-none cursor-pointer" />
        </div>
      </Carousel>
    </section>
  );
}
