import { useState } from "react";

type ToastType = 'success' | 'error' | 'info' | 'destructive' | 'default';

export const useToast = () => {
  const [toastList, setToastList] = useState<{ title: string; description: string; type: ToastType }[]>([]);

  const addToast = (
    title: string,
    description: string,
    type: ToastType = "info",
    timeout: number | null = 3000
  ) => {
    const toast = { title, description, type };

    setToastList((prev) => [...prev, toast]);

    if (timeout) {
      setTimeout(() => {
        setToastList((prev) => prev.filter((toast) => toast !== toast));
      }, timeout);
    }
  };

  return { addToast, toastList };
};
