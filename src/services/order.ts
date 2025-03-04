import API_URL from "@/lib/api";
import { orderResponse, PurchasedOrderList } from "@/schema/order";
import { GET } from ".";
import query from "query-string";
import { queryParam } from "./products";
import { ILayout } from "@/app/(private)/admin/settings/roles/create/page";

//GET
export function getOrder(
  params: queryParam = {}
): Promise<ILayout<IOrderResponse>> {
  const queryString = query.stringify(params);
  const url = `${API_URL}/order/retrieve?${queryString}`;
  console.log(url);
  return GET<ILayout<IOrderResponse>, {}>(url, {});
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
export interface IOrderResponse {
  orders: PurchasedOrderList[];
  amount: number;
  count: number;
}

export { PurchasedOrderList };
// export function getTotalAmountToday(
//   params: queryParam = {}
// ): Promise<ILayout<orderresponse>> {
//   const queryString = query.stringify(params);
//
//   const url = `${API_URL}/order/order-today?${queryString}`;
//   console.log(url);
//   return GET<ILayout<totalAmountResponse>, {}>(url);
// }
