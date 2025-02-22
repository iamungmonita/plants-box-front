import React from "react";
import { Button, Link, SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

export interface IButton {
  text?: string;
  path?: string;
  theme?: string;
  onHandleButton?: () => void;
  icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
}

export const CustomButton = (props: IButton) => {
  const { onHandleButton, icon: Icon, text, path, theme } = props;
  return (
    <Button
      variant="outlined"
      onClick={onHandleButton}
      sx={{
        backgroundColor: `${
          theme === "general"
            ? "white"
            : theme === "disabled"
            ? "gray"
            : "var(--secondary)"
        }`,
        borderColor: `${theme === "general" ? "var(--secondary)" : "none"} `,
        fontFamily: "var(--text)",
        padding: 1,
      }}
      type="button"
    >
      <Link href={path && path} className="w-full">
        <p
          className="flex items-center gap-4"
          style={{
            color: `${theme === "general" ? "var(--secondary)" : "white"} `,
          }}
        >
          {text && text}
          <span> {Icon && <Icon className={`text-3xl w-full`} />}</span>
        </p>
      </Link>
    </Button>
  );
};

export default Button;
