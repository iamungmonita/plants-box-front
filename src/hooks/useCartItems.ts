import { updateCartItems } from "@/helpers/addToCart";
import { ShoppingCartProduct } from "@/models/Cart";
import { useCallback, useEffect, useState } from "react";

export const useCartItems = () => {
  const [items, setItems] = useState<ShoppingCartProduct[]>([]);
  const [amount, setAmount] = useState<number>(0);

  const getCartFromStorage = useCallback(() => {
    const storedCart = localStorage.getItem("plants");
    const parsedCart = storedCart ? JSON.parse(storedCart) : [];

    if (Array.isArray(parsedCart)) {
      const amount = parsedCart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      return { items: parsedCart, total: amount };
    }

    return { items: [], total: 0 };
  }, []);

  const updateCart = () => {
    const { items, total } = getCartFromStorage();
    setItems(items);
    setAmount(total);
  };

  useEffect(() => {
    const { items, total } = getCartFromStorage();
    setItems(items);
    setAmount(total);

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "plants") {
        const { items, total } = getCartFromStorage();
        setItems(items);
        setAmount(total);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [getCartFromStorage]);

  useEffect(() => {
    window.addEventListener("cartUpdated", updateCart);
    return () => {
      window.removeEventListener("cartUpdated", updateCart);
    };
  }, [updateCart]);

  return { items, amount };
};
