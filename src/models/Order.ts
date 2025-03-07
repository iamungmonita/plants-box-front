import { ShoppingCartProduct } from "./Cart";

export interface IHold {
  orderId: string;
  items: ShoppingCartProduct[];
}
