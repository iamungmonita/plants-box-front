import { FieldValues } from "react-hook-form";
import * as yup from "yup";
import { Response } from "./order";
import { IRoleResponse } from "@/app/(private)/admin/settings/roles/create/page";

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
// export interface IAuthRegisterResponse extends IAuthRegister, Response {}

export const RegisterSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  role: yup
    .string() // Ensures all elements are strings
    .required("Role is required"),

  phoneNumber: yup.string().required("Phone Number is required"),
  email: yup.string().required("Email is required").email("invalid email"),
  isActive: yup.boolean().default(true),
  pictures: yup.string().optional(), // Validate as string (base64)
  password: yup
    .string()
    .required("password is required")
    .min(6, "password must be at least 6 characters"),
});

export interface IAuthLogIn {
  email: string;
  password: string;
}

export const LogInSchema = yup.object().shape({
  email: yup.string().required("email is required").email("invalid email"),
  password: yup
    .string()
    .required("password is required")
    .min(6, "password must be at least 6 characters"),
});

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
