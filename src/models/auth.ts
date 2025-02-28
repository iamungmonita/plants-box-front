import { Response } from "@/schema/order";

export interface Profile extends Response {
  email: string;
  password: string;
  phonenumber: string;
  lastname: string;
  firstname: string;
  role: string;
}

export interface IAuthLogIn {
  email: string;
  password: string;
}

// export interface IAuthLogInSuccessResponse {
//   message: string;
//   data: Profile;
// }
// export interface IAuthLogInErrorResponse {
//   message: string;
//   name?: string;
// }
//
// export type SignInResponse =
//   | IAuthLogInSuccessResponse
//   | IAuthLogInErrorResponse;
