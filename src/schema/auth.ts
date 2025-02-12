import * as yup from "yup";

export const RegisterSchema = yup.object().shape({
  username: yup.string().required("username is required"),
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
