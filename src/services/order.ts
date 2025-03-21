import API_URL from "@/lib/api";

import { GETWithToken, POSTWithToken } from ".";
import query from "query-string";
import { ILayout, queryParam } from "@/models/Layout";
import { ICheckout } from "@/models/Order";
import {
  IOrderResponse,
  ISelectedOrder,
  PurchasedOrderList,
} from "@/models/Order";

//GET
export function getOrder(params: queryParam): Promise<ILayout<IOrderResponse>> {
  const queryString = query.stringify(params);
  const url = `${API_URL}/order/retrieve?${queryString}`;
  return GETWithToken<ILayout<IOrderResponse>>(url);
}

export function getPurchasedOrderByPurchasedId(
  purchasedId: string
): Promise<ILayout<ISelectedOrder>> {
  const url = `${API_URL}/order/retrieve/` + purchasedId;
  return GETWithToken<ILayout<ISelectedOrder>>(url);
}

export function CreateOrder(
  data: ICheckout
): Promise<ILayout<PurchasedOrderList>> {
  const url = `${API_URL}/order/create`;
  return POSTWithToken<ILayout<PurchasedOrderList>, ICheckout>(url, data);
}
