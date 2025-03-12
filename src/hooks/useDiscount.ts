import { useCartItems } from "@/hooks/useCartItems";

export const useDiscount = () => {
  const { items } = useCartItems();

  const value = items.reduce((acc, item) => {
    const discount = Number(item.discount) || 0; // Ensure a valid number
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;

    return acc + (discount / 100) * price * quantity;
  }, 0);

  const percentage = () => {
    const isDiscountableItems = items.filter((item) => item.isDiscountable);
    const value = items.reduce((acc, item) => {
      const discount = Number(item.discount) || 0;

      return acc + discount;
    }, 0);
    return value / isDiscountableItems.length || value / items.length;
  };
  return { value, percentage };
};
