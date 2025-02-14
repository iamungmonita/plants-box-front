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

  const formValue = watch(name); // Watch for changes in form state

  // Sync local state with form value on mount & when value changes externally
  const [inputValue, setInputValue] = useState<string>(formValue || "");

  useEffect(() => {
    setInputValue(formValue || ""); // Update state when external form changes
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
      value={options.includes(inputValue) ? inputValue : null} // Ensure valid option
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
