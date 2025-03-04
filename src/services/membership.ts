import { IAuthRegister } from "@/app/(private)/admin/settings/users/create/page";
import { GET, POST } from ".";
import { FieldValues } from "react-hook-form";
import { ILayout } from "@/app/(private)/admin/settings/roles/create/page";
import { Response } from "@/schema/order";
import API_URL from "@/lib/api";
import query from "query-string";
import { queryParam } from "./products";

export interface IMembership extends FieldValues {
  firstname: string;
  lastname: string;
  phonenumber: string;
  email: string;
  type: string;
  isActive: boolean;
  invoice: string[];
  purchasedId: string;
  points: number;
}
export interface IMember extends Response {
  firstname: string;
  lastname: string;
  phonenumber: string;
  email: string;
  type: string;
  isActive: boolean;
  invoice: string[];
  points: number;
}
export interface IMembershipResponse {
  member: IMember[];
  count: number;
}
export function CreateMembership(
  form: IMembership
): Promise<ILayout<IMembershipResponse>> {
  const url = `${API_URL}/membership/create`;
  return POST<ILayout<IMembershipResponse>, IMembership>(url, form);
}
export function retrieveMembership(
  params: queryParam = {}
): Promise<ILayout<IMembershipResponse>> {
  const queryString = query.stringify(params);

  const url = `${API_URL}/membership/retrieve?${queryString}`;
  return GET<ILayout<IMembershipResponse>>(url);
}
