"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// Dialog Root
interface DialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DialogContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

function Dialog({ children, open: controlledOpen, onOpenChange }: DialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (controlledOpen === undefined) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [controlledOpen, onOpenChange]
  );

  // Scroll lock
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

// Dialog Trigger
interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children: React.ReactNode;
}

function DialogTrigger({ asChild = false, children, onClick, ...props }: DialogTriggerProps) {
  const context = React.useContext(DialogContext);
  if (!context) throw new Error("DialogTrigger must be used within Dialog");

  const { setOpen } = context;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(true);
    onClick?.(e);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: handleClick,
    });
  }

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  );
}

// Dialog Portal
interface DialogPortalProps {
  children: React.ReactNode;
}

function DialogPortal({ children }: DialogPortalProps) {
  const context = React.useContext(DialogContext);
  if (!context) throw new Error("DialogPortal must be used within Dialog");

  const { open } = context;

  if (typeof window === "undefined" || !open) return null;

  return ReactDOM.createPortal(children, document.body);
}

// Dialog Overlay
interface DialogOverlayProps extends React.HTMLAttributes<HTMLDivElement> {}

function DialogOverlay({ className, ...props }: DialogOverlayProps) {
  const context = React.useContext(DialogContext);
  if (!context) throw new Error("DialogOverlay must be used within Dialog");

  const { setOpen } = context;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
        className
      )}
      onClick={() => setOpen(false)}
      {...props}
    />
  );
}

// Dialog Content
interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  showCloseButton?: boolean;
  variant?: "default" | "bottom";
}

function DialogContent({
  children,
  className,
  showCloseButton = true,
  variant = "default",
  onWheel,
  onTouchMove,
  ...props
}: DialogContentProps) {
  const context = React.useContext(DialogContext);
  if (!context) throw new Error("DialogContent must be used within Dialog");

  const { setOpen } = context;
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Close on ESC
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [setOpen]);

  // Stop click on content from closing the dialog
  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    onWheel?.(e);
    e.stopPropagation();
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    onTouchMove?.(e);
    e.stopPropagation();
  };

  return (
    <DialogPortal>
      <DialogOverlay />
      <div
        ref={contentRef}
        onClick={handleContentClick}
        onWheel={handleWheel}
        onTouchMove={handleTouchMove}
        className={cn(
          "fixed z-50 bg-background border shadow-lg outline-none",
          variant === "default"
            ? "top-[50%] left-[50%] max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] rounded-lg p-6 sm:max-w-lg max-h-[90vh] overflow-y-auto"
            : "left-[50%] -translate-x-1/2 bottom-0 w-[95%] sm:w-[600px] max-h-[80vh] overflow-y-auto rounded-t-3xl p-0",
          className
        )}
        style={{
          animation: "zoomIn 0.2s ease-out forwards",
        }}
        {...props}
      >
        {children}
        {showCloseButton && (
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 disabled:pointer-events-none outline-none cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span className="sr-only">Close</span>
          </button>
        )}
      </div>
    </DialogPortal>
  );
}

// Dialog Header
interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

function DialogHeader({ className, ...props }: DialogHeaderProps) {
  return (
    <div
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

// Dialog Footer
interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

function DialogFooter({ className, ...props }: DialogFooterProps) {
  return (
    <div
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

// Dialog Title
interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

function DialogTitle({ className, ...props }: DialogTitleProps) {
  return (
    <h2 className={cn("text-lg leading-none font-semibold", className)} {...props} />
  );
}

// Dialog Description
interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  return (
    <p className={cn("text-muted-foreground text-sm", className)} {...props} />
  );
}

// Dialog Close
interface DialogCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

function DialogClose({ onClick, ...props }: DialogCloseProps) {
  const context = React.useContext(DialogContext);
  if (!context) throw new Error("DialogClose must be used within Dialog");

  const { setOpen } = context;

  return (
    <button
      onClick={(e) => {
        setOpen(false);
        onClick?.(e);
      }}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
