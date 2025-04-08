import API_URL from "@/lib/api";

import { GETWithToken, POSTWithToken, PUTWithToken } from ".";
import query from "query-string";
import { ILayout, queryParam } from "@/models/Layout";
import { ICheckout, orderResponse } from "@/models/Order";
import {
  IOrderResponse,
  ISelectedOrder,
  PurchasedOrderList,
} from "@/models/Order";

export interface Params {
  total: number;
}

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

export function cancelOrderById(id: string): Promise<orderResponse> {
  const url = `${API_URL}/order/update-cancel/` + id;
  return PUTWithToken<orderResponse>(url);
}
export function retrieveOrderById(
  id: string,
  params: Params
): Promise<orderResponse> {
  const url = `${API_URL}/order/update-retrieve/` + id;
  return PUTWithToken<orderResponse, Params>(url, params);
}

export function getMonthlySale(): Promise<
  ILayout<{ month: string; sale: number }>
> {
  const url = `${API_URL}/order/sale/monthly`;
  return GETWithToken<ILayout<{ month: string; sale: number }>>(url);
}
