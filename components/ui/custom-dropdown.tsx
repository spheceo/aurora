"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { cn } from "@/lib/utils";

// Dropdown Menu Root
interface DropdownMenuProps {
  children: React.ReactNode;
  modal?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DropdownMenuContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
} | null>(null);

function DropdownMenu({ children, modal = true }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef }}>
      {children}
    </DropdownMenuContext.Provider>
  );
}

// Dropdown Menu Trigger
interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children: React.ReactNode;
}

function DropdownMenuTrigger({ asChild = false, children, ...props }: DropdownMenuTriggerProps) {
  const context = React.useContext(DropdownMenuContext);
  if (!context) throw new Error("DropdownMenuTrigger must be used within DropdownMenu");

  const { open, setOpen, triggerRef } = context;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(!open);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      ref: triggerRef,
      onClick: (e: React.MouseEvent) => {
        handleClick(e);
        const childOnClick = (children as React.ReactElement<any>).props.onClick;
        if (childOnClick) childOnClick(e);
      },
    });
  }

  return (
    <button
      ref={triggerRef}
      onClick={handleClick}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}

// Dropdown Menu Content
interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "end";
  sideOffset?: number;
}

function DropdownMenuContent({
  children,
  align = "start",
  sideOffset = 4,
  className,
  ...props
}: DropdownMenuContentProps) {
  const context = React.useContext(DropdownMenuContext);
  if (!context) throw new Error("DropdownMenuContent must be used within DropdownMenu");

  const { open, setOpen, triggerRef } = context;
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const [isMounted, setIsMounted] = React.useState(false);

  const positionDropdown = React.useCallback(() => {
    if (!triggerRef.current || !contentRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();
    const viewportPadding = 8;
    const contentWidth = contentRect.width || contentRef.current.offsetWidth || 220;
    const contentHeight = contentRect.height || contentRef.current.offsetHeight || 0;

    let left = align === "end" ? triggerRect.right - contentWidth : triggerRect.left;
    let top = triggerRect.bottom + sideOffset;

    // Keep within horizontal viewport bounds.
    left = Math.min(
      Math.max(left, viewportPadding),
      window.innerWidth - contentWidth - viewportPadding
    );

    // Flip above trigger when there's no room below.
    if (top + contentHeight > window.innerHeight - viewportPadding) {
      top = triggerRect.top - contentHeight - sideOffset;
    }

    top = Math.max(top, viewportPadding);

    setPosition({ top, left });
    setIsMounted(true);
  }, [align, sideOffset, triggerRef]);

  // Calculate/recalculate position while open.
  React.useEffect(() => {
    if (!open) {
      setIsMounted(false);
      return;
    }

    const raf = requestAnimationFrame(positionDropdown);
    const handleReposition = () => positionDropdown();

    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [open, positionDropdown]);

  // Click outside to close
  React.useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        contentRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        !contentRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [open, setOpen]);

  // Close on ESC
  React.useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, setOpen]);

  if (!open) return null;
  if (typeof window === "undefined") return null;

  return ReactDOM.createPortal(
    <div
      ref={contentRef}
      className={cn(
        "fixed z-[99999] min-w-[200px] rounded-md border border-[#8D8D8D] shadow-lg backdrop-blur-md text-white bg-background",
        "animate-zoom-in",
        className
      )}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        opacity: isMounted ? 1 : 0,
        transition: "opacity 0.1s ease-out",
      }}
      {...props}
    >
      {children}
    </div>,
    document.body
  );
}

// Dropdown Menu Item
interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

function DropdownMenuItem({ children, className, onClick, ...props }: DropdownMenuItemProps) {
  const context = React.useContext(DropdownMenuContext);
  if (!context) throw new Error("DropdownMenuItem must be used within DropdownMenu");

  const { setOpen } = context;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    setOpen(false);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "w-full flex cursor-pointer items-center gap-2 px-3 py-2 text-sm outline-none select-none text-foreground text-left",
        "hover:bg-secondary transition-colors duration-150",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// Dropdown Menu Label
interface DropdownMenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean;
  children: React.ReactNode;
}

function DropdownMenuLabel({ inset, className, children, ...props }: DropdownMenuLabelProps) {
  return (
    <div
      className={cn(
        "px-3 py-2 text-sm font-medium text-foreground",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Dropdown Menu Separator
interface DropdownMenuSeparatorProps extends React.HTMLAttributes<HTMLHRElement> {}

function DropdownMenuSeparator({ className, ...props }: DropdownMenuSeparatorProps) {
  return (
    <hr
      className={cn("bg-white/20 my-1 h-px mx-2", className)}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
};
