import { FieldValues } from "react-hook-form";
import { GET, POST } from ".";
import { Response } from "@/schema/order";
import API_URL from "@/lib/api";
import { ILayout } from "@/app/(private)/admin/settings/roles/create/page";

interface CurrencyFields {
  [key: string]: number | undefined; // An object where each key is a string and value is a number
}

export interface ILog extends FieldValues {
  createdBy: string;
  riels: CurrencyFields;
  dollars: CurrencyFields;
}

export interface ILogResponse extends ILog, Response {}

export interface IUserLog {
  userId: string;
}

export function countLog(user: IUserLog): Promise<boolean> {
  const url = `${API_URL}/log/count-log`;
  return POST<boolean, IUserLog>(url, user);
}
// export function getAllLogs(): Promise<IUserLogResponse[]> {
//   const url = `${API_URL}/log/retrieve-logs`;
//   return GET<IUserLogResponse[]>(url);
// }
export function createLog(form: ILog): Promise<ILayout<ILogResponse>> {
  const url = `${API_URL}/log`;
  return POST<ILayout<ILogResponse>, ILog>(url, form);
}
export function RetrieveCount(): Promise<ILayout<ILogResponse[]>> {
  const url = `${API_URL}/log/retrieve`;
  return GET<ILayout<ILogResponse[]>>(url);
}
