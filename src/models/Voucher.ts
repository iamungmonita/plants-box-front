import { FieldValues } from "react-hook-form";
import { Response } from "./Layout";

export interface VoucherForm extends FieldValues {
  name: string;
  barcode: string;
  discount: number;
  validFrom: string | null;
  validTo: string | null;
  isActive?: boolean;
  isExpired?: boolean;
  createdBy: string | undefined;
  updatedBy?: string;
}
export interface VoucherResponse extends Response, VoucherForm {}
