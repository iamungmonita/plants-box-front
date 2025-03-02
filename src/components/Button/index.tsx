import React from "react";
import { Button, Link, SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import NextLink from "next/link";

export interface IButton {
  text?: string;
  path?: string;
  theme?: string;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset"; // Ensure proper typing for HTML button types
  onHandleButton?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
}

export const CustomButton = (props: IButton) => {
  const {
    disabled,
    className,
    onHandleButton,
    icon: Icon,
    text,
    path,
    theme,
    type = "button",
  } = props;

  return (
    <Button
      disabled={disabled}
      variant="outlined"
      className={className}
      onClick={onHandleButton}
      sx={{
        width: "100%",
        backgroundColor:
          theme === "general"
            ? "white"
            : theme === "dark"
            ? "gray"
            : "var(--medium-light)",
        borderColor: theme === "general" ? "gray" : "transparent",
        fontFamily: "var(--text)",
        paddingBottom: 1.5,
        paddingTop: 1.5,
        paddingLeft: 4,
        paddingRight: 4,
        outline: "none",
        "&:hover": {
          boxShadow: 1, // Hover color (light gray)
        },
      }}
      type={type} // No need for `?? 'button'` since we already default it
    >
      {path ? (
        <Link
          component={NextLink}
          href={path}
          style={{ textDecoration: "none" }}
          className="w-full "
        >
          <span className="flex justify-center items-center gap-4">
            <span
              style={{
                color: `${
                  theme === "dark"
                    ? "lightgray"
                    : theme === "general"
                    ? "black"
                    : "white"
                }`,
              }}
            >
              {text}
            </span>
            {Icon && <Icon className="text-3xl w-full" />}
          </span>
        </Link>
      ) : (
        <span
          className="flex justify-center items-center gap-4"
          style={{
            color: `${
              theme === "dark"
                ? "lightgray"
                : theme === "general"
                ? "black"
                : "white"
            }`,
          }}
        >
          {text}
          {Icon && <Icon className="text-3xl w-full" />}
        </span>
      )}
    </Button>
  );
};

export default CustomButton;
