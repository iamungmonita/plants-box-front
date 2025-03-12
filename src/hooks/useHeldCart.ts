import { IHold } from "@/models/Order";
import { useEffect, useState } from "react";

export const useHeldCarts = (effects: any[] = []) => {
  const [carts, setCarts] = useState<IHold[]>([]);

  useEffect(() => {
    const getHeldCarts = () => {
      const heldOrders = JSON.parse(localStorage.getItem("heldOrders") || "[]");
      setCarts(heldOrders ?? []);
    };
    getHeldCarts();
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "heldOrders") {
        getHeldCarts();
      }
    };

    const handleCartUpdate = () => getHeldCarts();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, effects);

  return carts;
};
