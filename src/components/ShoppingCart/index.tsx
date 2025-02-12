import React, { useEffect, useState } from "react";
import { CloseSharp } from "@mui/icons-material";
import Link from "next/link";

export interface ShoppingCartProduct {
  _id: string;
  price: number;
  stock: number;
  quantity: number;
}

const ShoppingCart = () => {
  const [items, setItems] = useState<ShoppingCartProduct[]>([]);
  const [total, setTotal] = useState(0);
  // Function to update state with localStorage data
  const updateCartItems = () => {
    const storedItems: ShoppingCartProduct[] = JSON.parse(
      localStorage.getItem("plants") || "[]"
    );
    if (Array.isArray(storedItems)) {
      setItems([...storedItems]);
      const amount = storedItems.reduce(
        (acc, sum) => acc + Number(sum.price),
        0
      );
      setTotal(amount);
    }
  };

  // Listen for changes in localStorage
  useEffect(() => {
    updateCartItems(); // Load cart items on mount

    // Listen for "cartUpdated" event and update state
    const handleCartUpdate = () => {
      updateCartItems();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  const clearLocalStorage = () => {
    localStorage.removeItem("plants");
    setItems([]);
    window.dispatchEvent(new Event("cartUpdated")); // Notify all components
  };

  const removeItem = (id: string) => {
    const updatedItems = items.filter((item) => item._id !== id);
    localStorage.setItem("plants", JSON.stringify(updatedItems));
    setItems(updatedItems);
    window.dispatchEvent(new Event("cartUpdated"));
  };
  const settleCheckout = async () => {
    try {
      // Update stock for each item
      await Promise.all(
        items.map((item) =>
          handleCheckout(item._id, item.stock - item.quantity)
        )
      );

      // Place the order after stock updates are done
      handleOrder(items);

      // Clear cart
      clearLocalStorage();
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  const handleOrder = async (order: ShoppingCartProduct[]) => {
    await fetch(`http://localhost:4002/order/create`, {
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

  const handleCheckout = async (id: string, qty: number) => {
    await fetch(`http://localhost:4002/product/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ stock: qty }),
    })
      .then((result) => result.json())
      .then((result) => console.log(result.product))
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <button type="submit" onClick={clearLocalStorage}>
        Clear
      </button>
      <div>
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item._id}>
              <div>
                {item._id} - {item.stock} - {item.price} - {item.quantity}
                <span onClick={() => removeItem(item._id)}>
                  <CloseSharp />
                </span>
              </div>
            </div>
          ))
        ) : (
          <p>No items added yet.</p>
        )}
      </div>
      {total}
      <Link href="/order" type="button">
        Check Out
      </Link>
    </div>
  );
};

export default ShoppingCart;
