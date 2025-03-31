import { IAuthRegister } from "./Auth";
import { ShoppingCartProduct } from "./Cart";
import { Response } from "@/models/Layout";

export interface IHold {
  orderId: string;
  items: ShoppingCartProduct[];
}

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

export interface ICartUpdated {
  _id: string;
  quantity: number;
}

export interface ICheckout {
  items: ShoppingCartProduct[];
  amount: number;
  paymentMethod: string;
  profile: string | undefined;
  phoneNumber: string;
  paidAmount: number;
  changeAmount: number;
  totalDiscountPercentage: number;
  totalDiscountValue: number;
  totalAmount: number;
  totalPoints: number;
  orderId: string;
  others?: string;
}

export interface PurchasedOrderList extends Response {
  orders: ShoppingCartProduct[];
  purchasedId: string;
  amount: string;
  paymentMethod: string;
  createdBy: string | IAuthRegister;
  totalDiscountPercentage: number;
  totalDiscountValue: number;
  totalPoints: number;
  totalAmount: number;
  paidAmount?: number;
  changeAmount?: number;
  member?: MemberInfo;
  others?: string;
  orderStatus: number;
  paymentStatus: number;
}

export interface MemberInfo {
  fullname: string;
  type: string;
  phoneNumber: string;
}
