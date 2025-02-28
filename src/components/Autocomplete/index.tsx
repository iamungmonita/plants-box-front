import { Autocomplete, TextField } from "@mui/material";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

export interface AutocompleteTypeProps {
  options: string[];
  name: string;
  label: string;
}

const AutocompleteForm = ({ options, name, label }: AutocompleteTypeProps) => {
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
          value={options.includes(field.value) ? field.value : null} // Ensure valid option
          onChange={(_, newValue) => field.onChange(newValue || "")} // Update React Hook Form value
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
