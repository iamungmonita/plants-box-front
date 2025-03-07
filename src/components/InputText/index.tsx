import React from "react";
import { TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

interface InputFieldProps {
  name: string;
  type: string;
  label: string;
  multiline?: boolean;
  minRows?: number;
  placeholder?: string;
  step?: string; // Step for numeric inputs
  onBlur?: () => void;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  type,
  label,
  multiline = false,
  minRows = 1,
  placeholder,
  step = "0.01",
  onBlur,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          sx={{
            "& .MuiInputBase-input": { fontFamily: "var(--text)" },
            "& .MuiInputLabel-root": { fontFamily: "var(--text)" },
            "& .MuiFormHelperText-root": { fontFamily: "var(--text)" },
          }}
          {...field}
          type={type}
          label={label}
          fullWidth
          placeholder={placeholder}
          multiline={multiline}
          minRows={minRows}
          variant="outlined"
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          InputLabelProps={{ shrink: true }}
          inputProps={{
            min: type === "number" ? 0 : undefined, // Apply min only for numeric fields
            step: type === "number" ? step : undefined, // Apply step only for numeric fields
          }}
          onBlur={(e) => {
            if (type === "number") {
              const value = parseFloat(e.target.value) || 0; // Normalize numeric value
              field.onChange(value); // Update form state
            }
            field.onBlur(); // Trigger React Hook Form's onBlur
            if (onBlur) onBlur(); // Call additional onBlur logic
          }}
        />
      )}
    />
  );
};

export default InputField;
