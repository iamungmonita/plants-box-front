import { IAuthLogIn, Profile, SignInResponse } from "@/models/auth";
import { GET, POST } from ".";
import API_URL from "@/lib/api";
import { IAuthRegister } from "@/app/auth/sign-up/page";

//GET
export function getAdminProfile(
  abortController: AbortController
): Promise<SignInResponse> {
  const url = `${API_URL}/auth/profile`;
  return GET<SignInResponse>(url, abortController);
}
//POST
export function SignIn(form: IAuthLogIn): Promise<SignInResponse> {
  const url = `${API_URL}/auth/signin`;
  return POST<SignInResponse, IAuthLogIn>(url, form);
}
export function SignUp(form: IAuthRegister): Promise<SignInResponse> {
  const url = `${API_URL}/auth/register`;
  return POST<SignInResponse, IAuthRegister>(url, form);
}
export function SignOut(): Promise<void> {
  const url = `${API_URL}/auth/signout`;
  return POST<void>(url, {}); // POST with empty body, as it's a sign-out action
}
