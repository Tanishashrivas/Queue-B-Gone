import React, { createContext, useContext, ReactNode } from "react";
import { useToast } from "./use-toast";
import { Toaster } from "./toaster";

// Define the context type
type ToastContextType = ReturnType<typeof useToast>;

// Create the context with a default value
export const ToastContext = createContext<ToastContextType>({
  toastList: [], // Correct property name
  addToast: () => { },
  removeToast: () => { },
});

interface ToastProviderProps {
  children?: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children = null }) => {
  const toastHelpers = useToast(); // Use the custom hook

  return (
    <ToastContext.Provider value={toastHelpers}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  );
};

// Hook for accessing the context
export const useToastContext = (): ToastContextType => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }

  return context;
};
