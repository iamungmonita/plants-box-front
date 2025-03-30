import { updateCartItems } from "@/helpers/addToCart";
import { ShoppingCartProduct } from "@/models/Cart";
import { useEffect, useState } from "react";

export const useCartItems = () => {
  const [items, setItems] = useState<ShoppingCartProduct[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const updateCart = () => {
    const { items, total } = updateCartItems();
    setItems(items);
    setAmount(total);
  };
  useEffect(() => {
    updateCart();

    window.addEventListener("cartUpdated", updateCart);
    return () => {
      window.removeEventListener("cartUpdated", updateCart);
    };
  }, []);

  return { items, amount };
};
