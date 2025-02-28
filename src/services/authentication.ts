import { IAuthLogIn, Profile } from "@/models/auth";
import { GET, POST } from ".";
import API_URL from "@/lib/api";
import { IAuthRegister } from "@/app/(private)/admin/settings/users/create/page";
import { ILayout } from "@/app/(private)/admin/settings/roles/create/page";
//GET
export function getAdminProfile(
  abortController: AbortController
): Promise<ILayout<Profile>> {
  const url = `${API_URL}/auth/profile`;
  return GET<ILayout<Profile>>(url, abortController);
}
//POST
export function SignIn(form: IAuthLogIn): Promise<ILayout<Profile>> {
  const url = `${API_URL}/auth/signin`;
  return POST<ILayout<Profile>, IAuthLogIn>(url, form);
}
export function SignUp(form: IAuthRegister): Promise<ILayout<Profile>> {
  const url = `${API_URL}/auth/sign-up`;
  return POST<ILayout<Profile>, IAuthRegister>(url, form);
}
export function SignOut(): Promise<void> {
  const url = `${API_URL}/auth/signout`;
  return POST<void>(url, {}); // POST with empty body, as it's a sign-out action
}
