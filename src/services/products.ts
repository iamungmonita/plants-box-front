import { orderResponse, OrderReturn } from "@/schema/order";
import {
  Product,
  ProductAddPicture,
  ProductReturn,
  ProductReturnList,
} from "@/schema/products";
import { error } from "console";

export function getProductById(id: string): Promise<ProductReturnList> {
  const API_URL = "http://localhost:4002/product/" + id;
  return GET<ProductReturnList, {}>(API_URL, {});
}
export function getAllProducts(): Promise<ProductReturnList[]> {
  const API_URL = "http://localhost:4002/product/retrieve";
  return GET<ProductReturnList[], {}>(API_URL, {});
}
export function getOrder(): Promise<orderResponse> {
  const API_URL = "http://localhost:4002/order/retrieve";
  return GET<orderResponse, {}>(API_URL, {});
}
export function getOrderById(id: string): Promise<orderResponse> {
  const API_URL = "http://localhost:4002/order/" + id;
  return GET<orderResponse, {}>(API_URL, {});
}
export function AddNewProduct(
  data: ProductAddPicture
): Promise<ProductReturnList> {
  const API_URL = "http://localhost:4002/upload";
  return POST<ProductReturnList, ProductAddPicture>(API_URL, data);
}

export function updateProductStockById(
  id: string,
  params: any
): Promise<ProductReturnList> {
  const API_URL = "http://localhost:4002/product/update/" + id;
  return PUT<ProductReturnList, typeof params>(API_URL, params);
}
export function updateProductDetailsById(
  id: string,
  params: ProductAddPicture
): Promise<ProductReturnList> {
  const API_URL = "http://localhost:4002/product/update-details/" + id;
  return PUT<ProductReturnList, ProductAddPicture>(API_URL, params);
}

export function GET<T, Q = any>(url: string, params?: Q): Promise<T> {
  return sendRequest({ method: "GET", url, params });
}
export function POST<T, Q = any>(url: string, params?: Q): Promise<T> {
  return sendRequest({ method: "POST", url, params });
}
export function PUT<T, Q = any>(url: string, params?: Q): Promise<T> {
  return sendRequest({ method: "PUT", url, params });
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
  return fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: method === "GET" ? undefined : JSON.stringify(params), // ✅ Exclude body for GET
    credentials: "include",
  })
    .then((response) => response.json())
    .catch((err) => {
      console.error(`Error in ${method} request:`, err);
      throw err;
    });
};
