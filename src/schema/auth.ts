import * as yup from "yup";

export const RegisterSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  role: yup
    .string() // Ensures all elements are strings
    .required("Role is required"),

  phoneNumber: yup.string().required("Phone Number is required"),
  email: yup.string().required("Email is required").email("invalid email"),
  isActive: yup.boolean().required(),
  pictures: yup.string().optional(), // Validate as string (base64)
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
