import API_URL from "@/lib/api";

import { GET, GETWithToken, POST, POSTWithToken, PUT, PUTWithToken } from ".";
import query from "query-string";

import { IRole, IRoleResponse } from "@/models/Roles";
import { ILayout } from "@/models/Layout";
import { IAuthRegister, Profile } from "@/models/Auth";
import { queryParam } from "@/models/Layout";
import { VoucherForm, VoucherResponse } from "@/models/Voucher";
import { ExpenseForm, ExpenseResponse } from "@/models/Expensese";

export function CreateRole(form: IRole): Promise<ILayout<IRoleResponse>> {
  const url = `${API_URL}/system/create`;
  return POSTWithToken<ILayout<IRoleResponse>, IRole>(url, form);
}

export function RetrieveRoles(): Promise<ILayout<IRoleResponse[]>> {
  const url = `${API_URL}/system/retrieve`;
  return GETWithToken<ILayout<IRoleResponse[]>>(url);
}
export function CreateExpense(
  form: ExpenseForm
): Promise<ILayout<ExpenseResponse>> {
  const url = `${API_URL}/system/create-expense`;
  return POSTWithToken<ILayout<ExpenseResponse>, ExpenseForm>(url, form);
}

export function CreateVoucher(
  form: VoucherForm
): Promise<ILayout<VoucherResponse>> {
  const url = `${API_URL}/system/create-voucher`;
  return POSTWithToken<ILayout<VoucherResponse>, VoucherForm>(url, form);
}
export function getRoles(): Promise<ILayout<IRoleResponse[]>> {
  const url = `${API_URL}/system/retrieve`;
  return GETWithToken<ILayout<IRoleResponse[]>>(url);
}
export function getAllExpenses(): Promise<ILayout<ExpenseResponse[]>> {
  const url = `${API_URL}/system/retrieve-expenses`;
  return GETWithToken<ILayout<ExpenseResponse[]>>(url);
}

export function getAllVouchers(
  params: queryParam
): Promise<ILayout<VoucherResponse[]>> {
  const queryString = query.stringify(params);
  const url = `${API_URL}/system/retrieve-vouchers?${queryString}`;
  return GETWithToken<ILayout<VoucherResponse[]>>(url);
}

export function getUsers(): Promise<ILayout<Profile[]>> {
  const url = `${API_URL}/auth/users`;
  return GETWithToken<ILayout<Profile[]>>(url);
}
export function getUserById(id: string): Promise<ILayout<Profile>> {
  const url = `${API_URL}/auth/users/` + id;
  return GETWithToken<ILayout<Profile>>(url);
}
export function updateUserById(
  id: string,
  params: IAuthRegister
): Promise<ILayout<Profile>> {
  const url = `${API_URL}/auth/users/update/` + id;
  return PUTWithToken<ILayout<Profile>, IAuthRegister>(url, params);
}
export function updateVoucherByBarcode(
  barcode: string
): Promise<ILayout<VoucherResponse>> {
  const url = `${API_URL}/system/update-voucher/` + barcode;
  return PUTWithToken<ILayout<VoucherResponse>>(url);
}
