import { orderResponse, OrderReturn } from "@/schema/order";
import { ProductReturn } from "@/schema/products";
import { error } from "console";

export function getProductById(id: string): Promise<ProductReturn> {
  const API_URL = "http://localhost:4002/product/" + id;
  return GET<ProductReturn, {}>(API_URL, {});
}
export function getOrder(): Promise<orderResponse> {
  const API_URL = "http://localhost:4002/order/retrieve";
  return GET<orderResponse, {}>(API_URL, {});
}
export function getOrderById(id: string): Promise<orderResponse> {
  const API_URL = "http://localhost:4002/order/" + id;
  return GET<orderResponse, {}>(API_URL, {});
}

export function GET<T, Q = any>(url: string, params?: Q): Promise<T> {
  return sendRequest({ method: "GET", url, params });
}

const sendRequest = async <T, Q = any>({
  url,
  method,
  params,
}: {
  url: string;
  method: string;
  params?: Q;
}): Promise<T> => {
  return await fetch(url, {
    method: method,
  })
    .then((response) => response.json())
    .then((result) => result)
    .catch((err) => err);
};
