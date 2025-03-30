"use client";
import { updateCartItems } from "@/helpers/addToCart";
import { useCartItems } from "@/hooks/useCartItems";
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

// Create context with a default value
const ScreenContext = createContext<ScreenContextType | undefined>(undefined);

// Custom hook to access the context
export const useScreenContext = () => {
  const context = useContext(ScreenContext);
  if (!context) {
    throw new Error("screenContext must be used within a screenProvider");
  }
  return context;
};

// TitleProvider component
export const ScreenProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<ShoppingCartProduct[]>([]);

  const { items } = useCartItems();
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "plants") {
        // Check if it's the cart data
        // Trigger your state update logic
        console.log("LocalStorage changed!", event);
        // Update state if needed
        // For example, re-fetch cart data
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
