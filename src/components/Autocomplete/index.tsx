import { Autocomplete, TextField } from "@mui/material";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

export interface AutocompleteTypeProps {
  options: { label: string; value: string }[]; // Change options type to objects with label and value
  name: string;
  label: string;
  onChange?: (value: string) => void; // Optional onChange prop
}

const AutocompleteForm = ({
  options,
  name,
  label,
  onChange,
}: AutocompleteTypeProps) => {
  const {
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      name={name}
      render={({ field }) => (
        <Autocomplete
          {...field}
          sx={{
            "& .MuiInputBase-input": { fontFamily: "var(--text)" },
            "& .MuiInputLabel-root": { fontFamily: "var(--text)" },
            "& .MuiFormHelperText-root": { fontFamily: "var(--text)" },
            "& .MuiAutocomplete-option": { fontFamily: "var(--text)" },
          }}
          options={options}
          value={options.find((option) => option.value === field.value) || null} // Match value with selected option
          getOptionLabel={(option) => option.label} // Display label in the dropdown
          onChange={(_, newValue) => {
            field.onChange(newValue ? newValue.value : ""); // Update the form field with the actual value (e.g., id)
            if (onChange) onChange(newValue ? newValue.value : ""); // Call onChange if provided with the actual value
          }}
          renderInput={(params) => (
            <TextField
              sx={{
                "& .MuiInputBase-input": { fontFamily: "var(--text)" },
                "& .MuiInputLabel-root": { fontFamily: "var(--text)" },
                "& .MuiFormHelperText-root": { fontFamily: "var(--text)" },
              }}
              {...params}
              label={label}
              error={!!errors[name]}
              helperText={errors[name]?.message?.toString()}
            />
          )}
        />
      )}
    />
  );
};

export default AutocompleteForm;
