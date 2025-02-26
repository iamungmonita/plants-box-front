// import { useEffect, useState } from "react";
// import { updateCartItems } from "./addToCart";
// import { ShoppingCartProduct } from "@/components/ShoppingCart";
// const [items, setItems] = useState<ShoppingCartProduct[]>([]);
//
// useEffect(() => {
//   const { items, total } = updateCartItems();
//   setItems(items);
//   const handleCartUpdate = () => {
//     const { items, total } = updateCartItems();
//     setItems(items);
//   };
//
//   window.addEventListener("cartUpdated", handleCartUpdate);
//   return () => {
//     window.removeEventListener("cartUpdated", handleCartUpdate);
//   };
// }, []);
//
// const OnHoldOrder = ({
//   orderId,
//   setOrderId,
// }: {
//   orderId: string;
//   setOrderId: () => string;
// }) => {
//   if (items.length === 0) return; // Prevent saving an empty cart
//
//   const heldOrders = JSON.parse(localStorage.getItem("heldOrders") || "[]");
//
//   const newOrder = {
//     orderId,
//     items,
//   };
//
//   heldOrders.push(newOrder);
//   localStorage.setItem("heldOrders", JSON.stringify(heldOrders));
//
//   localStorage.setItem("plants", JSON.stringify([]));
//   window.dispatchEvent(new Event("cartUpdated"));
//   setOrderId(setOrderId); // Generate new order ID
//   setRefresh(!refresh);
// };
//
// useEffect(() => {
//   const getHeldCarts = () => {
//     const holdCart = JSON.parse(localStorage.getItem("heldOrders") || "[]");
//     setHoldCustomers(holdCart ?? []);
//   };
//   getHeldCarts();
// }, [refresh]);
//
// //
// const restoreHeldCart = (selectedPurchaseId: string) => {
//   const selectedCart = holdCustomers.find(
//     (cart: any) => cart.orderId === selectedPurchaseId
//   );
//
//   if (selectedCart) {
//     setOrderId(selectedCart.orderId);
//     localStorage.setItem("plants", JSON.stringify(selectedCart.items));
//     const updatedHeldOrders = holdCustomers.filter(
//       (cart: any) => cart.orderId !== selectedPurchaseId
//     );
//     localStorage.setItem("heldOrders", JSON.stringify(updatedHeldOrders));
//     window.dispatchEvent(new Event("cartUpdated"));
//     const lastOrderId = localStorage.getItem("lastOrderId");
//     localStorage.setItem("currentOrderId", lastOrderId as string);
//   }
//   setRefresh(!refresh);
// };
