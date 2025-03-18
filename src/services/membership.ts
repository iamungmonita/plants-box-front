import { GET, POST, PUT } from ".";
import { ILayout, Response } from "@/models/Layout";
import API_URL from "@/lib/api";
import query from "query-string";
import { queryParam } from "@/models/Layout";
import { IMembership } from "@/models/Membership";

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
export function getAllMembership(
  params: queryParam = {}
): Promise<ILayout<IMembershipResponseList>> {
  const queryString = query.stringify(params);
  const url = `${API_URL}/membership/retrieve?${queryString}`;
  return GET<ILayout<IMembershipResponseList>>(url);
}
export function getMembershipById(
  id: string
): Promise<ILayout<IMemberResponse>> {
  const url = `${API_URL}/membership/retrieve/` + id;
  return GET<ILayout<IMemberResponse>>(url);
}

export function updateMembershipPointById(
  id: string,
  params?: { points: number; invoice: string[] }
): Promise<ILayout<IMemberResponse>> {
  const url = `${API_URL}/membership/update-points/` + id;
  return PUT<ILayout<IMemberResponse>, { points: number; invoice: string[] }>(
    url,
    params
  );
}
