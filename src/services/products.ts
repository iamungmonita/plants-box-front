import { GETWithToken, POSTWithToken, PUTWithToken } from ".";
import query from "query-string";
import { ILayout } from "@/models/Layout";
import { Product, ProductResponse } from "@/models/Product";
import API_URL from "@/lib/api";
import { ApiOptions } from "./system";

// GET
export function getAllProducts({
  queryParam,
}: ApiOptions): Promise<ILayout<ProductResponse>> {
  const queryString = query.stringify(queryParam ?? {});
  const url = `${API_URL}/product/retrieve?${queryString}`;
  return GETWithToken<ILayout<ProductResponse>>(url);
}
export function getBestSellingProducts(): Promise<ILayout<ProductResponse[]>> {
  const url = `${API_URL}/product/best-sellers`;
  return GETWithToken<ILayout<ProductResponse[]>>(url);
}

export function getProductById({
  params,
}: ApiOptions): Promise<ILayout<ProductResponse>> {
  const url = `${API_URL}/product/${params?.id}`;
  return GETWithToken<ILayout<ProductResponse>>(url);
}
export function getProductByBarcode({
  params,
}: ApiOptions): Promise<ILayout<ProductResponse>> {
  const url = `${API_URL}/product/product-barcode/${params?.barcode}`;
  return GETWithToken<ILayout<ProductResponse>>(url);
}

//POST
export function AddNewProduct(
  data: Product
): Promise<ILayout<ProductResponse>> {
  const url = `${API_URL}/product/create`;
  return POSTWithToken<ILayout<ProductResponse>, Product>(url, data);
}

//PUT

export function updateProductStockById(
  id: string,
  params: any
): Promise<ProductResponse> {
  const url = `${API_URL}/product/update/` + id;
  return POSTWithToken<ProductResponse, typeof params>(url, params);
}
export function UpdateCancelledProductById(
  id: string,
  params: any
): Promise<ProductResponse> {
  const url = `${API_URL}/product/update-cancel/` + id;
  return POSTWithToken<ProductResponse, typeof params>(url, params);
}

export function updateProductDetailsById(
  id: string,
  params: Product
): Promise<ILayout<ProductResponse>> {
  const url = `${API_URL}/product/update-details/` + id;
  return PUTWithToken<ILayout<ProductResponse>, Product>(url, params);
}
