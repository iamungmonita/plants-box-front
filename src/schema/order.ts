import { ShoppingCartProduct } from "@/components/ShoppingCart";
import { FieldValues } from "react-hook-form";
import * as yup from "yup";

export interface Product extends FieldValues {
  description: string;
  name: string;
  pictures: File[]; // Array of image URLs
  price: string; // Assuming price is a string; you can change it to a number if needed
  type: string;
  size: string; // e.g., "Small", "Medium", "Large"
  temperature: string; // e.g., "60-75°F", "18-25°C"
  instruction: string; // Detailed care instructions
  habit: string; // Growth pattern, size, etc.
  stock: number; // Number of plants available in stock
}
/*{
  "_id": "67ab5c0f174de7c22479db5a",
  "orders": [
      {
          "id": "67aac06b9a359c0c8b4fd4ab",
          "price": 15.99,
          "quantity": 1,
          "_id": "67ab5c0f174de7c22479db5b"
      },
      {
          "id": "67aac1399a359c0c8b4fd4ad",
          "price": 22.5,
          "quantity": 1,
          "_id": "67ab5c0f174de7c22479db5c"
      }
  ],
  "createdAt": "2025-02-11T14:17:51.522Z",
  "updatedAt": "2025-02-11T14:17:51.522Z",
  "__v": 0
*/
export interface OrderReturn {
  __v: number;
  _id: string;
  createdAt: string;
  updatedAt: string;
  orders: Order[];
}

export interface orderResponse {
  message: string;
  orderIds: OrderReturn[];
  count: number;
}

export interface Order {
  id: string;
  price: number;
  quantity: number;
  _id: string;
}

export interface Response {
  _v: number;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchasedOrderList extends Response {
  orders: ShoppingCartProduct[];
  purchasedId: string;
  amount: string;
  paymentMethod: string;
  createdBy: string;
  discount: number;
  calculatedDiscount: number;
  totalAmount: number;
}
