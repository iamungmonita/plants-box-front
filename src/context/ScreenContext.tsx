"use client";

import { ShoppingCartProduct } from "@/models/Cart";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface ScreenContextType {
  cart: ShoppingCartProduct[];
}

const ScreenContext = createContext<ScreenContextType | undefined>(undefined);

// Custom hook to access the context
export const useScreenContext = () => {
  const context = useContext(ScreenContext);
  if (!context) {
    throw new Error("screenContext must be used within a screenProvider");
  }
  return context;
};

export const ScreenProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<ShoppingCartProduct[]>([]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "plants") {
        const updatedItems = JSON.parse(localStorage.getItem("plants") || "[]");
        setCart(updatedItems);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  return (
    <ScreenContext.Provider value={{ cart }}>{children}</ScreenContext.Provider>
  );
};
