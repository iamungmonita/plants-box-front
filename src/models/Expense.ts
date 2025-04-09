import { FieldValues } from "react-hook-form";

export interface ExpenseForm extends FieldValues {
  category: string;
  amount: number;
  date: string | null;
  remarks?: string;
  supplier: string;
  invoice?: string;
  isActive: boolean;
  createdBy: string | null;
  updatedBy: string | null;
}

export interface ExpenseResponse extends Response, ExpenseForm {}
