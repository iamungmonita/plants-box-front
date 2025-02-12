import React from "react";
import { useFormContext } from "react-hook-form";
import TextField, { TextFieldVariants } from "@mui/material/TextField";

export interface InputFieldProps {
  name: string;
  placeholder?: string;
  type: string;
  className?: string;
  label?: string;
  multiline?: boolean;
  maxRows?: number;
  minRows?: number;
  variant?: TextFieldVariants | undefined;
}
const InputField = (props: InputFieldProps) => {
  const {
    name,
    placeholder,
    type,
    multiline,
    label,
    maxRows,
    minRows,
    variant = "outlined",
  } = props;
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div className="grid grid-cols-1">
      <TextField
        sx={{
          "& .MuiInputBase-input": { fontFamily: "var(--text)" }, // Input text
          "& .MuiInputLabel-root": { fontFamily: "var(--text)" }, // Label text
          "& .MuiFormHelperText-root": { fontFamily: "var(--text)" },
        }}
        variant={variant}
        label={label}
        {...register(name)}
        type={type}
        placeholder={placeholder}
        helperText={errors[name]?.message?.toString()}
        error={!!errors[name]}
        multiline={multiline}
        maxRows={maxRows}
        minRows={minRows}
      />
    </div>
  );
};

export default InputField;
