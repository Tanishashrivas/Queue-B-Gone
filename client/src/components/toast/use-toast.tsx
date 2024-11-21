import { useState } from "react";

type ToastType = "success" | "error" | "info" | "destructive" | "default";

export const useToast = () => {
  const [toastList, setToastList] = useState<
    { id: string; title: string; description: string; type: ToastType }[]
  >([]);

  const addToast = (
    title: string,
    description: string,
    type: ToastType = "info",
    timeout: number | null = 3000
  ) => {
    const id = Math.random().toString(36).substring(7); 
    const newToast = { id, title, description, type };

    setToastList((prev) => [...prev, newToast]);

    if (timeout !== null) {
      setTimeout(() => {
        setToastList((prev) => prev.filter((toast) => toast.id !== id)); 
      }, timeout);
    }
  };

  return { addToast, toastList };
};
