import API_URL from "@/lib/api";
import { getProductById, updateProductStockById } from "@/services/products";
import AlertPopUp from "@/components/AlertPopUp";
import { useState } from "react";
import { ShoppingCartProduct } from "@/components/ShoppingCart";
type CartItem = {
  _id: string;
  price: string;
  stock: number;
  quantity: number;
  name: string;
  discount: number | string | undefined;
};

export const addToCart = async <
  T extends {
    _id: string;
    price: number;
    stock: number;
    pictures: string;
    name: string;
    size: string;
    discount: number | string;
  }
>(
  id: string,
  productType: string = "default",
  setSnackbarMessage?: (message: string) => void // Pass a function to update Snackbar
) => {
  try {
    const productData = await getProductById(id);
    const { _id, price, stock, pictures, name, discount } = productData;
    const imagePaths = `${API_URL}${pictures}`;

    // Get existing items from localStorage
    const storedItems: CartItem[] = JSON.parse(
      localStorage.getItem(productType) || "[]"
    );

    // Find if the item is already in the cart
    const existingItemIndex = storedItems.findIndex((item) => item._id === id);

    if (existingItemIndex !== -1) {
      // If the item exists, update the quantity and price
      if (storedItems[existingItemIndex].quantity >= stock) {
        setSnackbarMessage?.(
          `Sorry, we only have ${stock} of ${name} in stock.`
        );
        return;
      } else {
        storedItems[existingItemIndex].quantity *
          parseFloat(storedItems[existingItemIndex].price);
        storedItems[existingItemIndex].quantity += 1;
        storedItems[existingItemIndex].stock = stock;
        setSnackbarMessage?.(`Another one of ${name} has been added to cart`);
      }
    } else {
      // If it's a new item, add it to the cart
      storedItems.push({
        _id,
        discount: 0,
        price,
        stock: stock,
        quantity: 1,
        name,
      });
      setSnackbarMessage?.(`${name} has been added to cart`);
    }

    // Update localStorage with the new cart
    localStorage.setItem(productType, JSON.stringify(storedItems));

    // Dispatch custom event to notify other components about the cart update
    window.dispatchEvent(new Event("cartUpdated"));
  } catch (err) {
    console.error("Error adding to cart:", err);
  }
};

export const updateCartItems = () => {
  const storedItems: ShoppingCartProduct[] = JSON.parse(
    localStorage.getItem("plants") || "[]"
  );

  if (Array.isArray(storedItems)) {
    const amount = storedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    return { items: storedItems, total: amount };
  }

  return { items: [], total: 0 }; // Return empty items and 0 if cart is empty
};

export const clearLocalStorage = () => {
  localStorage.removeItem("plants");
  localStorage.removeItem("membership");
  window.dispatchEvent(new Event("cartUpdated"));
  window.dispatchEvent(new Event("memberUpdated"));
  return { items: [], total: 0 }; // Notify all components
};

export const removeItem = (id: string) => {
  const { items } = updateCartItems();
  const updatedItems = items.filter((item) => item._id !== id);
  localStorage.setItem("plants", JSON.stringify(updatedItems));
  window.dispatchEvent(new Event("cartUpdated"));
  return { items: updatedItems };
};

export const handleCheckout = async (id: string, qty: number) => {
  try {
    const response = await updateProductStockById(id, { qty: qty });
    console.log("Stock updated successfully:", response);
  } catch (error) {
    console.error("Error updating stock:", error);
  }
};

export const handleDecrement = (id: string, currentQty: number) => {
  if (currentQty > 1) {
    const newQty = currentQty - 1;
    const { items } = handleQuantityChange(id, newQty);
    return { items: items };
  } else {
    const { items } = removeItem(id);
    return { items: items }; // If quantity is 1, remove the item instead of decrementing
  }
};

export const handleOrder = async (
  orders: ShoppingCartProduct[],
  amount: number,
  paymentMethod: string,
  profile: string | undefined,
  discount: number,
  calculatedDiscount: number,
  totalAmount: number,
  orderId: string
) => {
  await fetch(`${API_URL}/order/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      orders,
      amount,
      paymentMethod,
      profile,
      discount,
      calculatedDiscount,
      totalAmount,
      orderId,
    }),
  })
    .then((result) => result.json())
    .then((a) => console.log(a))
    .catch((err) => console.log(err));
};

export const handleQuantityChange = (id: string, quantity: number) => {
  const { items } = updateCartItems();
  const updatedItems = items.map((item) =>
    item._id === id ? { ...item, quantity } : item
  );

  localStorage.setItem("plants", JSON.stringify(updatedItems));
  window.dispatchEvent(new Event("cartUpdated"));
  return { items: updatedItems };
};

export const settlement = async (
  items: ShoppingCartProduct[],
  amount: number,
  paymentMethod: string,
  profile: string | undefined,
  discount: number,
  calculatedDiscount: number,
  totalAmount: number,
  orderId: string
) => {
  try {
    await Promise.all(
      items.map(({ _id, quantity }) => handleCheckout(_id, quantity))
    );
    handleOrder(
      items,
      amount,
      paymentMethod,
      profile,
      discount,
      calculatedDiscount,
      totalAmount,
      orderId
    );

    return {
      items: clearLocalStorage().items,
      total: clearLocalStorage().total,
    };
  } catch (error) {
    console.error("Checkout failed:", error);
  }
};
