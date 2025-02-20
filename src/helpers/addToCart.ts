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
  picture: string[];
  name: string;
  size: string;
};

export const addToCart = async <
  T extends {
    _id: string;
    price: number;
    stock: number;
    pictures: string[];
    name: string;
    size: string;
  }
>(
  id: string,
  productType: string = "default",
  setSnackbarMessage?: (message: string) => void // Pass a function to update Snackbar
) => {
  try {
    const productData = await getProductById(id);
    const { _id, price, stock, pictures, name, size } = productData;
    const imagePaths = pictures.map((path) => `${API_URL}${path}`);

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
        setSnackbarMessage?.(`Another one of ${name} has been added to cart`);
      }
    } else {
      // If it's a new item, add it to the cart
      storedItems.push({
        _id,
        price,
        stock,
        quantity: 1,
        picture: imagePaths,
        name,
        size,
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
  window.dispatchEvent(new Event("cartUpdated"));
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
    const response = await updateProductStockById(id, { stock: qty });
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

export const handleOrder = async (order: ShoppingCartProduct[]) => {
  await fetch(`${API_URL}/order/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(order),
  })
    .then((result) => result.json())
    .then((a) => console.log(a.saveOrder))
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

export const settlement = async (items: ShoppingCartProduct[]) => {
  try {
    await Promise.all(
      items.map(({ _id, stock, quantity }) =>
        handleCheckout(_id, stock - quantity)
      )
    );
    handleOrder(items);
    return {
      items: clearLocalStorage().items,
      total: clearLocalStorage().total,
    };
  } catch (error) {
    console.error("Checkout failed:", error);
  }
};
