import API_URL from "@/lib/api";
import {
  IOrderResponse,
  ISelectedOrder,
  orderResponse,
  PurchasedOrderList,
} from "@/schema/order";
import { GET } from ".";
import query from "query-string";
import { ILayout, queryParam } from "@/models/Layout";

//GET
export function getOrder(
  params: queryParam = {}
): Promise<ILayout<IOrderResponse>> {
  const queryString = query.stringify(params);
  const url = `${API_URL}/order/retrieve?${queryString}`;
  console.log(url);
  return GET<ILayout<IOrderResponse>, {}>(url, {});
}

export function getPurchasedOrderByPurchasedId(
  purchasedId: string
): Promise<ILayout<ISelectedOrder>> {
  const url = `${API_URL}/order/retrieve/` + purchasedId;
  return GET<ILayout<ISelectedOrder>, {}>(url, {});
}

export function getOrderByPurchasedId(id: string): Promise<orderResponse> {
  const url = `${API_URL}/order/` + id;
  return GET<orderResponse, {}>(url, {});
}
