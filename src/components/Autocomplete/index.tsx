import { Autocomplete, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

export interface AutocompleteTypeProps {
  options: string[];
  name: string;
  label: string;
}

const AutocompleteForm = ({ options, name, label }: AutocompleteTypeProps) => {
  const {
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const [inputValue, setInputValue] = useState(getValues(name) || "");

  // Watch for external changes in the form
  const formValue = watch(name);

  useEffect(() => {
    if (formValue === "") {
      setInputValue("");
    }
  }, [formValue]);

  return (
    <Autocomplete
      sx={{
        "& .MuiInputBase-input": { fontFamily: "var(--text)" },
        "& .MuiInputLabel-root": { fontFamily: "var(--text)" },
        "& .MuiFormHelperText-root": { fontFamily: "var(--text)" },
        "& .MuiAutocomplete-option": { fontFamily: "var(--text)" },
      }}
      options={options}
      value={inputValue}
      onChange={(_, newValue) => {
        setInputValue(newValue || "");
        setValue(name, newValue || ""); // Update React Hook Form
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={!!errors[name]}
          helperText={errors[name]?.message?.toString()}
        />
      )}
    />
  );
};

export default AutocompleteForm;
