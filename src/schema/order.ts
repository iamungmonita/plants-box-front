import { ShoppingCartProduct } from "@/models/Cart";
import { Response } from "@/models/Layout";
import { FieldValues } from "react-hook-form";
import * as yup from "yup";

export interface OrderReturn {
  __v: number;
  _id: string;
  createdAt: string;
  updatedAt: string;
  orders: Order[];
}

export interface orderResponse {
  message: string;
  data: OrderReturn[];
  count: number;
}

export interface IOrderResponse {
  orders: PurchasedOrderList[];
  amount: number;
  count: number;
}

export interface Order {
  id: string;
  price: number;
  quantity: number;
  _id: string;
}
export interface ISelectedOrder {
  success: boolean;
  data: PurchasedOrderList[];
  message: string;
}
export interface PurchasedOrderList extends Response {
  orders: ShoppingCartProduct[];
  purchasedId: string;
  amount: string;
  paymentMethod: string;
  createdBy: string;
  overallDiscount: number;
  calculatedDiscount: number;
  convertedPoints: number;
  totalAmount: number;
  paidAmount?: number;
  changeAmount?: number;
  member?: MemberInfo;
}

export interface MemberInfo {
  fullname: string;
  type: string;
  phoneNumber: string;
}
