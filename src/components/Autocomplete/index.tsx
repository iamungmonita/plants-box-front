import { AutocompleteTypeProps } from "@/models/AutoComplete";
import { Autocomplete, TextField } from "@mui/material";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

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
          value={options.find((option) => option.value === field.value) || null}
          getOptionLabel={(option) => option.label}
          onChange={(_, newValue) => {
            field.onChange(newValue ? newValue.value : "");
            if (onChange) onChange(newValue ? newValue.value : "");
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
