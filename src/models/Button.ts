import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

export interface IButton {
  text?: string;
  path?: string;
  theme?: string;
  className?: string;
  disabled?: boolean;
  roleCodes?: string[];
  type?: "button" | "submit" | "reset"; // Ensure proper typing for HTML button types
  onHandleButton?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onHandleDoubleClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
}
