import React, { createContext, useContext } from "react";
import { useToast } from "./use-toast";
import { Toaster } from "./toaster";

export const ToastContext = createContext<ReturnType<typeof useToast>>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});

export const ToastProvider: React.FC<{ children?: React.ReactNode }> = ({ children = null }) => {
  const toastHelpers = useToast();

  return (
    <ToastContext.Provider value={toastHelpers}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  );
};

// Hook to access toast context easily
export const useToastContext = () => useContext(ToastContext);
