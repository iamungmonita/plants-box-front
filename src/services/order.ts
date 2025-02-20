import API_URL from "@/lib/api";
import { orderResponse, PurchasedOrderList } from "@/schema/order";
import { GET } from ".";

//GET
export function getOrder(): Promise<PurchasedOrderList[]> {
  const url = `${API_URL}/order/retrieve`;
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
