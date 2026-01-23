"use client";

import * as React from "react";
import { X } from "lucide-react";

export type ToastProps = {
  id: string;
  message: string;
  type: "default" | "success" | "error" | "loading";
};

// Global state for toasts
let toasts: ToastProps[] = [];
let listeners: Set<() => void> = new Set();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function addToast(message: string, type: ToastProps["type"] = "default"): string {
  const id = Math.random().toString(36).substr(2, 9);
  const newToast: ToastProps = { id, message, type };
  toasts = [...toasts, newToast];
  notifyListeners();

  if (type !== "loading") {
    setTimeout(() => removeToast(id), 4000);
  }

  return id;
}

function updateToast(id: string, updates: Partial<Omit<ToastProps, "id">>) {
  toasts = toasts.map((t) => (t.id === id ? { ...t, ...updates } : t));
  notifyListeners();
}

function removeToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  notifyListeners();
}

// Toast API
export function toast(message: string, type: ToastProps["type"] = "default") {
  addToast(message, type);
}

toast.promise = function <T,>(
  promise: Promise<T>,
  { loading, success, error }: { loading: string; success: string | ((data: T) => string); error: string }
): Promise<T> {
  const id = addToast(loading, "loading");

  return promise
    .then((data) => {
      const successMessage = typeof success === "function" ? success(data) : success;
      updateToast(id, { message: successMessage, type: "success" });
      setTimeout(() => removeToast(id), 4000);
      return data;
    })
    .catch((err) => {
      updateToast(id, { message: error, type: "error" });
      setTimeout(() => removeToast(id), 4000);
      throw err;
    });
};

// Hook to use toasts in a component
export function useToasts() {
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  React.useEffect(() => {
    listeners.add(forceUpdate);
    return () => {
      listeners.delete(forceUpdate);
    };
  }, []);

  return { toasts, removeToast };
}

// Toast Container Component
export function ToastContainer() {
  const { toasts: currentToasts, removeToast: remove } = useToasts();

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
      {currentToasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={remove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: ToastProps; onRemove: (id: string) => void }) {
  const [isExiting, setIsExiting] = React.useState(false);

  React.useEffect(() => {
    if (toast.type === "loading") return;

    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.type, onRemove]);

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return (
          <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center shrink-0">
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case "error":
        return (
          <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center shrink-0">
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case "loading":
        return (
          <div className="w-4 h-4 shrink-0">
            <svg className="animate-spin w-full h-full text-foreground" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="pointer-events-auto flex items-center gap-3 px-4 py-3 bg-background border border-border shadow-lg min-w-[300px] max-w-md"
      style={{
        animation: "zoomIn 0.2s ease-out forwards",
        opacity: isExiting ? 0 : 1,
        transition: "opacity 0.3s ease-out",
      }}
    >
      {getIcon()}
      <span className="flex-1 text-sm text-foreground">{toast.message}</span>
      {toast.type !== "loading" && (
        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(() => onRemove(toast.id), 300);
          }}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
