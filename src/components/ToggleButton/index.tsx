import React from "react";
import { Button, ButtonGroup } from "@mui/material";
import Image from "next/image";

// Define a type for the ToggleButton props
interface ToggleButtonProps {
  options: {
    value: string;
    label?: string;
    icon?: React.ReactNode;
    image?: string;
  }[]; // The options now include an icon
  selectedValue: string; // The currently selected value
  disabled?: boolean;
  onSelect: (value: string) => void; // Callback function to handle value selection
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  disabled,
  options,
  selectedValue,
  onSelect,
}) => {
  return (
    <ButtonGroup
      disabled={disabled}
      className="w-full"
      variant="outlined"
      aria-label="payment method"
      sx={{
        maxHeight: "100%",
        height: "100%",
      }}
    >
      {options.map((item) => (
        <Button
          className="w-full"
          key={item.value}
          onClick={() => onSelect(item.value)} // Pass selected value to the parent via the callback
          variant={selectedValue === item.value ? "contained" : "outlined"}
          sx={{
            display: "flex",

            alignItems: "center",
            gap: 1,
            borderRadius: "4px",
            padding: 1.5,
            borderColor: "#ccc",
            backgroundColor:
              selectedValue === item.value
                ? "var(--muted-accent)"
                : disabled
                ? "lightgray"
                : "white",
            color: selectedValue === item.value ? "white" : "black",
            "&:hover": {
              backgroundColor:
                selectedValue === item.value
                  ? "var(--medium-light)"
                  : "#f5f5f5",
            },
          }}
        >
          <span className="flex items-center justify-center">
            {item.icon && <span>{item.icon}</span>}
            {item.image && (
              <Image
                src={item.image}
                alt={item.image as string}
                width={60}
                height={60}
              />
            )}
            {item.label && (
              <span
                className="capitalize"
                style={{ fontFamily: "var(--text)" }}
              >
                {item.label}
              </span>
            )}
          </span>
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default ToggleButton;
