import React from "react";
import { TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

interface InputFieldProps {
  name: string;
  type: "text" | "number" | "email" | "password";
  label: string;
  multiline?: boolean;
  minRows?: number;
  placeholder?: string;
  step?: string;
  allowDecimals?: boolean; // New prop to control decimals
  onBlur?: () => void;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  type,
  label,
  multiline = false,
  minRows = 1,
  placeholder,
  allowDecimals = true, // Default to whole numbers
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
          type={type === "number" ? "text" : type} // Keep type="text" for manual control
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
            min: type === "number" ? 0 : undefined,
            step: allowDecimals ? "0.01" : "1", // Dynamic step
          }}
          onChange={(e) => {
            const value = e.target.value;

            if (type === "number") {
              const regex = allowDecimals ? /^\d*\.?\d*$/ : /^\d*$/; // Allow decimals if enabled
              if (!regex.test(value)) return;
            }

            field.onChange(value);
          }}
          onBlur={(e) => {
            if (type === "number") {
              const numericValue = allowDecimals
                ? parseFloat(e.target.value) || 0
                : parseInt(e.target.value, 10) || 0; // Convert to int or float
              field.onChange(numericValue);
            }
            field.onBlur();
            if (onBlur) onBlur();
          }}
        />
      )}
    />
  );
};

export default InputField;
