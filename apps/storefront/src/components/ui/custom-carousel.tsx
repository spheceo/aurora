"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CarouselOptions = {
  align?: "start" | "center" | "end";
  loop?: boolean;
};

type CarouselContextValue = {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  scrollPrev: () => void;
  scrollNext: () => void;
};

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}

interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  opts?: CarouselOptions;
  setApi?: (api: unknown) => void;
}

function Carousel({
  opts = {},
  setApi,
  className,
  children,
  ...props
}: CarouselProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const checkScroll = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Check if we can scroll in either direction
    const hasScrollableSpace = el.scrollWidth > el.clientWidth;
    const isAtStart = Math.abs(el.scrollLeft) < 1;
    const isAtEnd = Math.abs(el.scrollWidth - el.clientWidth - el.scrollLeft) < 1;

    setCanScrollPrev(hasScrollableSpace && !isAtStart);
    setCanScrollNext(hasScrollableSpace && !isAtEnd);
  }, []);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Initial check with a small delay to ensure DOM is ready
    const timeoutId = setTimeout(checkScroll, 100);

    // Add scroll listener
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll, { passive: true });

    // Use MutationObserver to watch for content changes
    const observer = new MutationObserver(checkScroll);
    observer.observe(el, { childList: true, subtree: true });

    return () => {
      clearTimeout(timeoutId);
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
      observer.disconnect();
    };
  }, [checkScroll]);

  const scrollPrev = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  }, []);

  const scrollNext = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }, []);

  // Keyboard navigation
  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext]
  );

  // Expose API via setApi callback
  React.useEffect(() => {
    if (setApi) {
      setApi({
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      });
    }
  }, [setApi, scrollPrev, scrollNext, canScrollPrev, canScrollNext]);

  return (
    <CarouselContext.Provider
      value={{ scrollRef, canScrollPrev, canScrollNext, scrollPrev, scrollNext }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { scrollRef } = useCarousel();

  return (
    <div
      ref={scrollRef}
      className="overflow-x-auto overflow-y-hidden scroll-smooth"
      data-slot="carousel-content"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <div
        className={cn("flex", className)}
        {...props}
      />
    </div>
  );
}

function CarouselItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn("min-w-0 shrink-0 grow-0", className)}
      {...props}
    />
  );
}

interface CarouselPreviousProps extends React.ComponentProps<typeof Button> {}

function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon",
  ...props
}: CarouselPreviousProps) {
  const { canScrollPrev, scrollPrev } = useCarousel();

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 size-8 rounded-full",
        "left-0",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
}

interface CarouselNextProps extends React.ComponentProps<typeof Button> {}

function CarouselNext({
  className,
  variant = "outline",
  size = "icon",
  ...props
}: CarouselNextProps) {
  const { canScrollNext, scrollNext } = useCarousel();

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 size-8 rounded-full",
        "right-0",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight />
      <span className="sr-only">Next slide</span>
    </Button>
  );
}

export {
  type CarouselOptions,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
