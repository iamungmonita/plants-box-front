import React from "react";
import { Button, Link, SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import NextLink from "next/link";
import { useAuthContext } from "@/context/AuthContext";

export interface IButton {
  text?: string;
  path?: string;
  theme?: string;
  className?: string;
  disabled?: boolean;
  profileCodes?: string[];
  roleCodes?: string[];
  type?: "button" | "submit" | "reset"; // Ensure proper typing for HTML button types
  onHandleButton?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
}

export const CustomButton = (props: IButton) => {
  const { isAuthorized } = useAuthContext();
  const {
    disabled,
    className,
    onHandleButton,
    icon: Icon,
    text,
    path,
    theme,
    type = "button",
    profileCodes,
    roleCodes,
  } = props;

  const authorized = isAuthorized(roleCodes, profileCodes);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!authorized) {
      alert("You are not authorized to perform this action.");
      return;
    }
    onHandleButton?.(event); // Only call if authorized
  };

  return (
    <div>
      {authorized && (
        <Button
          disabled={disabled}
          variant="outlined"
          className={className}
          onClick={handleClick}
          sx={{
            width: "100%",
            backgroundColor:
              theme === "general"
                ? "white"
                : theme === "dark"
                ? "lightgray"
                : theme === "alarm"
                ? "#D50000"
                : "var(--medium-light)",
            borderColor: theme === "general" ? "lightgray" : "transparent",
            fontFamily: "var(--text)",
            paddingBottom: 1.5,
            paddingTop: 1.5,
            paddingLeft: 4,
            paddingRight: 4,
            outline: "none",
            "&:hover": {
              boxShadow: 1, // Hover color (light lightgray)
            },
          }}
          type={type}
        >
          {path ? (
            <Link
              component={NextLink}
              href={path}
              style={{ textDecoration: "none" }}
              className="w-full"
            >
              <span className="flex justify-center items-center gap-4">
                <span
                  style={{
                    color: `${
                      theme === "dark"
                        ? "gray"
                        : theme === "general"
                        ? "black"
                        : theme === "alarm"
                        ? "#D50000"
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
                    ? "gray"
                    : theme === "general"
                    ? "black"
                    : theme === "alarm "
                    ? "#D50000"
                    : "white"
                }`,
              }}
            >
              {text}
              {Icon && <Icon className="text-3xl w-full" />}
            </span>
          )}
        </Button>
      )}
    </div>
  );
};

export default CustomButton;
