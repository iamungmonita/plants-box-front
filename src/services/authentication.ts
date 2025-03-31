import { GETWithToken, POST, POSTWithToken } from ".";
import API_URL from "@/lib/api";
import { ILayout } from "@/models/Layout";

import {
  IAuthLogIn,
  IAuthRegister,
  Profile,
  ProfileWithCount,
} from "@/models/Auth";

//GET
export function getAdminProfile(
  abortController: AbortController
): Promise<ILayout<Profile>> {
  const url = `${API_URL}/auth/profile`;
  return GETWithToken<ILayout<Profile>>(url, abortController);
}

//POST
export function SignIn(form: IAuthLogIn): Promise<ILayout<ProfileWithCount>> {
  const url = `${API_URL}/auth/sign-in`;
  return POST<ILayout<ProfileWithCount>, IAuthLogIn>(url, form);
}
export function SignUp(form: IAuthRegister): Promise<ILayout<Profile>> {
  const url = `${API_URL}/auth/sign-up`;
  return POSTWithToken<ILayout<Profile>, IAuthRegister>(url, form);
}
