import React from "react";
import { Button, Link } from "@mui/material";
import NextLink from "next/link";
import { useAuthContext } from "@/context/AuthContext";
import { IButton } from "@/models/Button";

export const CustomButton = (props: IButton) => {
  const { isAuthorized, profile } = useAuthContext();
  const {
    disabled,
    className,
    onHandleButton,
    onHandleDoubleClick,
    icon: Icon,
    text,
    path,
    theme,
    type = "button",
    roleCodes,
  } = props;

  const authorized = isAuthorized(roleCodes, profile?.codes);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!authorized) {
      alert("You are not authorized to perform this action.");
      return;
    }
    onHandleButton?.(event);
  };
  const handleDoubleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onHandleDoubleClick?.(event);
  };

  return (
    <div>
      {authorized && (
        <Button
          disabled={disabled}
          variant="outlined"
          className={className}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          sx={{
            width: "100%",
            height: "100%",
            maxHeight: "100%",
            backgroundColor:
              theme === "general"
                ? "white"
                : theme === "dark"
                ? "lightgray"
                : theme === "alarm"
                ? "#D50000"
                : theme === "notice"
                ? "#eab308"
                : "var(--medium-light)",
            borderColor: theme === "general" ? "lightgray" : "transparent",
            fontFamily: "var(--text)",
            paddingBottom: 1.5,
            paddingTop: 1.5,
            paddingLeft: 4,
            paddingRight: 4,
            outline: "none",
            "&:hover": {
              boxShadow: 1,
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
              <span className="flex justify-center items-center  gap-4">
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
                {Icon && <Icon className=" text-2xl w-full" />}
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
                    : theme === "notice"
                    ? "black"
                    : "white"
                }`,
              }}
            >
              {text}
              {Icon && <Icon className="text-2xl w-full" />}
            </span>
          )}
        </Button>
      )}
    </div>
  );
};

export default CustomButton;
