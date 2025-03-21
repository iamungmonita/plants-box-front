import { FieldValues } from "react-hook-form";
import { Response } from "./Layout";

export interface IRole extends FieldValues {
  name: string;
  codes: string[];
  remark: string;
  isActive: boolean;
}
export interface IRoleResponse extends IRole, Response {
  createdBy: string;
  updatedBy?: string;
}
