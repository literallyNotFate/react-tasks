import React, { createContext } from "react";
import { Toaster } from "react-hot-toast";

interface IToastContextProps {
  children: React.ReactNode;
}

const ToastContext = createContext(null);

const ToastProvider: React.FC<IToastContextProps> = ({ children }) => {
  return (
    <ToastContext.Provider value={null}>
      <Toaster />
      {children}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
