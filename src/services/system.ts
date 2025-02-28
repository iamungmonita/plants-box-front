import API_URL from "@/lib/api";
import { GET, POST } from ".";

import {
  ILayout,
  IRole,
  IRoleResponse,
} from "@/app/(private)/admin/settings/roles/create/page";
import {
  IAuthRegister,
  IAuthRegisterResponse,
} from "@/app/(private)/admin/settings/users/create/page";

export function CreateRole(form: IRole): Promise<ILayout<IRoleResponse>> {
  const url = `${API_URL}/system/create`;
  return POST<ILayout<IRoleResponse>, IRole>(url, form);
}
export function RetrieveRoles(): Promise<ILayout<IRoleResponse[]>> {
  const url = `${API_URL}/system/retrieve`;
  return GET<ILayout<IRoleResponse[]>>(url);
}
export function getUsers(): Promise<ILayout<IAuthRegisterResponse[]>> {
  const url = `${API_URL}/system/users`;
  return GET<ILayout<IAuthRegisterResponse[]>>(url);
}
