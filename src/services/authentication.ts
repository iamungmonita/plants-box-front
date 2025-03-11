import { Profile, ProfileWithCount } from "@/schema/auth";
import { GET, POST } from ".";
import API_URL from "@/lib/api";
import { IAuthLogIn, IAuthRegister } from "@/schema/auth";
import { ILayout } from "@/models/Layout";

//GET
export function getAdminProfile(
  abortController: AbortController
): Promise<ILayout<Profile>> {
  const url = `${API_URL}/auth/profile`;
  return GET<ILayout<Profile>>(url, abortController);
}

//POST
export function SignIn(form: IAuthLogIn): Promise<ILayout<ProfileWithCount>> {
  const url = `${API_URL}/auth/sign-in`;
  return POST<ILayout<ProfileWithCount>, IAuthLogIn>(url, form);
}
export function SignUp(form: IAuthRegister): Promise<ILayout<Profile>> {
  const url = `${API_URL}/auth/sign-up`;
  return POST<ILayout<Profile>, IAuthRegister>(url, form);
}
export function SignOut(): Promise<void> {
  const url = `${API_URL}/auth/sign-out`;
  return POST<void>(url, {}); // POST with empty body, as it's a sign-out action
}
