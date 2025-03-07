import { IAuthRegister } from "@/app/(private)/admin/settings/users/create/page";
import { GET, POST } from ".";
import { FieldValues } from "react-hook-form";
import { ILayout } from "@/app/(private)/admin/settings/roles/create/page";
import { PurchasedOrderList, Response } from "@/schema/order";
import API_URL from "@/lib/api";
import query from "query-string";
import { queryParam } from "./products";

export interface IMembership extends FieldValues {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  type: string;
  isActive: boolean;
  invoices: { purchasedId: string; totalAmount: number }[];
  points: number;
  createdBy: string;
}
export interface IMemberResponse extends IMembership, Response {}
export interface IMembershipResponseList {
  member: IMemberResponse[];
  count: number;
}
export function CreateMembership(
  form: IMembership
): Promise<ILayout<IMemberResponse>> {
  const url = `${API_URL}/membership/create`;
  return POST<ILayout<IMemberResponse>, IMembership>(url, form);
}
export function retrieveMembership(
  params: queryParam = {}
): Promise<ILayout<IMembershipResponseList>> {
  const queryString = query.stringify(params);

  const url = `${API_URL}/membership/retrieve?${queryString}`;
  return GET<ILayout<IMembershipResponseList>>(url);
}
