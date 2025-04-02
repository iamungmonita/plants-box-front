import { responseCookiesToRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { FieldValues } from "react-hook-form";

export interface ExpenseForm extends FieldValues {
  category: string;
  amount: number;
  date: string | null;
  remarks?: string;
  supplier: string;
  invoice?: string;
  createdBy: string | null;
  updatedBy: string | null;
}

export interface ExpenseResponse extends Response, ExpenseForm {}
