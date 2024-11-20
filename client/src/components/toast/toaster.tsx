"use client";

import { ToastProvider, Toast, ToastClose, ToastDescription, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { useToast } from "./use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, type = "default" }) => (
        <Toast key={id} className={`toast-${type || "default"}`}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}
