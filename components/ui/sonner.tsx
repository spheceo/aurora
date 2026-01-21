"use client";

import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      position="top-center"
      toastOptions={{
        style: {
          background: "var(--main)",
          color: "white",
          border: "none",
        },
      }}
      {...props}
    />
  );
}

export { Toaster, toast };
