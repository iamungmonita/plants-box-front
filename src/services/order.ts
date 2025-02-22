import API_URL from "@/lib/api";
import { orderResponse, PurchasedOrderList } from "@/schema/order";
import { GET } from ".";
import query from "query-string";
import { queryParam } from "./products";

//GET
export function getOrder(
  params: queryParam = {}
): Promise<PurchasedOrderList[]> {
  const queryString = query.stringify(params);

  const url = `${API_URL}/order/retrieve?${queryString}`;
  return GET<PurchasedOrderList[], {}>(url, {});
}
export interface Params {
  purchasedId?: string;
}
export function getPurchasedOrderByProductId(
  id: string,
  purchasedId: string
): Promise<PurchasedOrderList[]> {
  const url = `${API_URL}/order/retrieve/${id}?purchasedId=${purchasedId}`;
  return GET<PurchasedOrderList[], {}>(url, {});
}

export function getOrderById(id: string): Promise<orderResponse> {
  const url = `${API_URL}/order/` + id;
  return GET<orderResponse, {}>(url, {});
}
