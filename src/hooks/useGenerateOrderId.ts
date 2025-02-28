import { useEffect, useState } from "react";

const useOrderId = () => {
  const [orderId, setOrderId] = useState<string>("");
  const generateNextOrderId = (): string => {
    let lastOrderId = localStorage.getItem("lastOrderId");
    let currentOrderId = localStorage.getItem("currentOrderId");

    if (!lastOrderId) {
      lastOrderId = "PO-00001"; // Start from 0, next will be PO-00001
    }

    if (currentOrderId === lastOrderId) {
      localStorage.removeItem("currentOrderId");
      return currentOrderId;
    }

    const orderNumber = parseInt(lastOrderId.split("-")[1]) + 1;
    const nextOrderId = `PO-${orderNumber.toString().padStart(5, "0")}`;
    localStorage.setItem("lastOrderId", nextOrderId);
    return nextOrderId;
  };

  useEffect(() => {
    const lastOrderId = localStorage.getItem("lastOrderId");
    setOrderId(lastOrderId ?? "PO-00001");
  }, []);
  return { orderId, generateNextOrderId };
};
export default useOrderId;
