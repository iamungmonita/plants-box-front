import * as yup from "yup";

export const RegisterSchema = yup.object().shape({
  firstname: yup.string().required("firstname is required"),
  lastname: yup.string().required("lastname is required"),
  role: yup.string().required("role is required"),
  phonenumber: yup.string().required("phone number is required"),
  email: yup.string().required("email is required").email("invalid email"),
  password: yup
    .string()
    .required("password is required")
    .min(6, "password must be at least 6 characters"),
});

export const LogInSchema = yup.object().shape({
  email: yup.string().required("email is required").email("invalid email"),
  password: yup
    .string()
    .required("password is required")
    .min(6, "password must be at least 6 characters"),
});
