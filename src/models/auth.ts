export interface Profile {
  createdAt: string;
  email: string;
  password: string;
  updatedAt: string;
  lastname: string;
  firstname: string;
  role: string;
  __v: number;
  _id: string;
}

export interface IAuthLogIn {
  email: string;
  password: string;
}

export interface IAuthLogInSuccessResponse {
  message: string;
  admin: Profile;
}
export interface IAuthLogInErrorResponse {
  message: string;
  name?: string;
}

export type SignInResponse =
  | IAuthLogInSuccessResponse
  | IAuthLogInErrorResponse;
