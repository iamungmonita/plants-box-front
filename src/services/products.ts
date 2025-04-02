import { GET, GETWithToken, POST, POSTWithToken, PUT, PUTWithToken } from ".";
import query from "query-string";
import { ILayout, queryParam } from "@/models/Layout";
import { Product, ProductResponse } from "@/models/Product";
import API_URL from "@/lib/api";

// GET
export function getAllProducts(
  params: queryParam = {}
): Promise<ILayout<ProductResponse[]>> {
  const queryString = query.stringify(params);
  const url = `${API_URL}/product/retrieve?${queryString}`;
  return GETWithToken<ILayout<ProductResponse[]>>(url);
}
export function getBestSellingProducts(): Promise<ILayout<ProductResponse[]>> {
  const url = `${API_URL}/product/best-sellers`;
  return GETWithToken<ILayout<ProductResponse[]>>(url);
}

export function getProductById(id: string): Promise<ILayout<ProductResponse>> {
  const url = `${API_URL}/product/` + id;
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
