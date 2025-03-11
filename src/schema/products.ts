import * as yup from "yup";

export const ProductSchema = yup.object().shape({
  name: yup.string().required("Plant name is required"),
  isActive: yup.boolean().default(true),
  isDiscountable: yup.boolean().default(true),
  barcode: yup.string().required("Barcode is required"),
  category: yup.string().required("Category is required"),
  price: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .required("Price is required")
    .typeError("Price must be a valid number"),
  importedPrice: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .required("Price is required")
    .typeError("Imported price must be a valid number"),
  pictures: yup.string().optional(), // Validate as string (base64)
  stock: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .required("Stock is required")
    .typeError("Stock must be a valid number"),
});
