import API_URL from "@/lib/api";
import { GET, POST } from ".";

import { IRole, IRoleResponse } from "@/models/Roles";
import { ILayout } from "@/models/Layout";
import { Profile } from "@/models/Auth";

export function CreateRole(form: IRole): Promise<ILayout<IRoleResponse>> {
  const url = `${API_URL}/system/create`;
  return POST<ILayout<IRoleResponse>, IRole>(url, form);
}
export function getRoles(): Promise<ILayout<IRoleResponse[]>> {
  const url = `${API_URL}/system/retrieve`;
  return GET<ILayout<IRoleResponse[]>>(url);
}
export function getUsers(): Promise<ILayout<Profile[]>> {
  const url = `${API_URL}/auth/users`;
  return GET<ILayout<Profile[]>>(url);
}
