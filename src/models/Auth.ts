import { FieldValues } from "react-hook-form";
import { Response } from "./Layout";

export interface IAuthRegister extends FieldValues {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  role: string;
  isActive: boolean;
  password: string;
  pictures?: string; // Array of image URLs
}

export interface Profile extends Response {
  email: string;
  password: string;
  role: string;
  codes: string[];
  phoneNumber: string;
  lastName: string;
  firstName: string;
  isActive: boolean;
  createdBy: string;
  pictures?: string; // Array of image URLs
}
export interface ProfileWithCount {
  admin: Profile;
  count: boolean;
}

export interface IAuthLogIn {
  email: string;
  password: string;
}
