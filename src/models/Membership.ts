import { FieldValues } from "react-hook-form";

export interface IMembership extends FieldValues {
  phoneNumber: string;
  type: string;
  isActive: boolean;
  invoices: string[];
  points: number;
  createdBy: string;
}
