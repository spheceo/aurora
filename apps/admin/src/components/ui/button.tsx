import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap border text-xs font-semibold tracking-widest uppercase transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#811A21]/30",
  {
    variants: {
      variant: {
        default: "border-[#811A21] bg-[#811A21] text-white hover:bg-[#6f161d]",
        outline:
          "border-[#d8c8ca] bg-[#fffdfd] text-[#2b2021] hover:bg-[#faf8f8]",
        destructive:
          "border-[#811A21] bg-[#fff8f8] text-[#811A21] hover:bg-[#f5e9ea]",
        ghost:
          "border-transparent bg-transparent text-[#811A21] hover:bg-[#faf8f8]",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 px-3 text-[10px]",
        lg: "h-12 px-6",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Component = asChild ? Slot : "button";
  return (
    <Component
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
