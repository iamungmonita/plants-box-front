const generateNextOrderId = (): string => {
  let lastOrderId = localStorage.getItem("lastOrderId");
  let currentOrderId = localStorage.getItem("currentOrderId");

  if (!lastOrderId) {
    lastOrderId = "PO-00001";
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
export default generateNextOrderId;
