import { FieldValues } from "react-hook-form";
import { Response } from "./Layout";

export interface VoucherForm extends FieldValues {
  barcode: string;
  discount: number;
  validFrom: string | null;
  validTo: string | null;
  isActive?: boolean;
  createdBy: string | undefined;
}
export interface VoucherResponse extends Response, VoucherForm {}
