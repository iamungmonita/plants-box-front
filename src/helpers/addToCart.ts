import {
  getProductById,
  updateProductStockById,
  getAllProducts,
} from "@/services/products";
import { ShoppingCartProduct } from "@/models/Cart";
import { CreateOrder } from "@/services/order";
import { ICheckout } from "@/models/Order";

export const addToCart = async (id: string, productType: string = "plants") => {
  try {
    const productData = await getProductById(id);
    if (productData.data) {
      const { _id, price, stock, name, isDiscountable, pictures } =
        productData.data;
      const storedItems: ShoppingCartProduct[] = JSON.parse(
        localStorage.getItem(productType) || "[]"
      );

      // Find if the item is already in the cart
      const existingItemIndex = storedItems.findIndex(
        (item) => item._id === id
      );
      if (existingItemIndex !== -1) {
        if (storedItems[existingItemIndex].quantity >= stock) {
          return;
        } else {
          storedItems[existingItemIndex].quantity += 1;
          storedItems[existingItemIndex].stock = stock;
        }
      } else {
        storedItems.push({
          _id,
          discount: "0",
          price,
          stock: stock,
          quantity: 1,
          name,
          isDiscountable,
          convertedPoints: 0,
        });
      }
      localStorage.setItem(productType, JSON.stringify(storedItems));
      window.dispatchEvent(new Event("cartUpdated"));
    }
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
    //     localStorage.setItem("plants", JSON.stringify(storedItems));
    //
    //     // ✅ Dispatch event so components can react
    //     window.dispatchEvent(new Event("cartUpdated"));
    return { items: storedItems, total: amount };
  }
  return { items: [], total: 0 };
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
    await updateProductStockById(id, { qty: qty });
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

export const handleQuantityChange = (id: string, quantity: number) => {
  const { items } = updateCartItems();
  const updatedItems = items.map((item) =>
    item._id === id ? { ...item, quantity } : item
  );
  localStorage.setItem("plants", JSON.stringify(updatedItems));
  window.dispatchEvent(new Event("cartUpdated"));
  return { items: updatedItems };
};

export const settlement = async (data: ICheckout) => {
  const { items = [], ...param } = data;
  if (!items || !Array.isArray(items)) {
    console.error("Items are missing or not an array");
    return;
  }

  try {
    await Promise.all(
      items.map(({ _id, quantity }) => {
        handleCheckout(_id, quantity);
        return { _id, quantity };
      })
    );
    const updatedData = { ...param, items };
    const response = await handleOrder(updatedData);
    return {
      response,
      items: clearLocalStorage().items,
      total: clearLocalStorage().total,
    };
  } catch (error) {
    console.error("Checkout failed:", error);
  }
};

export const handleOrder = async (data: ICheckout) => {
  try {
    await CreateOrder(data);
    return true;
  } catch (error) {
    return false;
  }
};

export const placeOrder = async (data: ICheckout) => {
  for (const item of data.items) {
    const product = await getProductById(item._id);
    if (product.data) {
      if (product.data.stock < item.quantity) {
        return false;
      }
    } else {
      return false;
    }
  }
  const response = await settlement(data);
  return response?.response;
};

export const filterCartsByOrderId = (carts: any[], orderId: string) => {
  return carts.filter((cart: any) => cart.orderId !== orderId);
};
