import { GET, GETWithToken, POST, POSTWithToken, PUT, PUTWithToken } from ".";
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
export function createMembership(
  form: IMembership
): Promise<ILayout<IMemberResponse>> {
  const url = `${API_URL}/membership/create`;
  return POSTWithToken<ILayout<IMemberResponse>, IMembership>(url, form);
}
export function updateMembership(
  id: string,
  params: { phoneNumber: string; isActive: boolean }
): Promise<ILayout<IMemberResponse>> {
  const url = `${API_URL}/membership/update/` + id;
  return PUTWithToken<
    ILayout<IMemberResponse>,
    { phoneNumber: string; isActive: boolean }
  >(url, params);
}

export function getAllMembership(
  params: queryParam = {}
): Promise<ILayout<IMembershipResponseList>> {
  const queryString = query.stringify(params);
  const url = `${API_URL}/membership/retrieve?${queryString}`;
  return GETWithToken<ILayout<IMembershipResponseList>>(url);
}
export function getMembershipById(
  id: string
): Promise<ILayout<IMemberResponse>> {
  const url = `${API_URL}/membership/retrieve/` + id;
  return GETWithToken<ILayout<IMemberResponse>>(url);
}

export function updateMembershipPointById(
  id: string,
  params?: { points: number; invoice: string[] }
): Promise<ILayout<IMemberResponse>> {
  const url = `${API_URL}/membership/update-points/` + id;
  return PUTWithToken<
    ILayout<IMemberResponse>,
    { points: number; invoice: string[] }
  >(url, params);
}
