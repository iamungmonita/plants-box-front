import React from "react";
import { TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { register } from "module";

interface InputFieldProps {
  name: string;
  type: string;
  label: string;
  multiline?: boolean;
  minRows?: number;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  type,
  label,
  multiline = false,
  minRows = 1,
  placeholder,
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
        />
      )}
    />
  );
};

export default InputField;
