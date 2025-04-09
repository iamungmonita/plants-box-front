import * as yup from "yup";

export const ExpenseSchema = yup.object().shape({
  category: yup.string().required("Category is required"),
  amount: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .required("Amount is required")
    .typeError("Amount must be a valid number"),
  supplier: yup.string().required("Supplier is required"),
  date: yup.date().required("Date is required"),
  remarks: yup.string(),
  invoice: yup.string(),
});
