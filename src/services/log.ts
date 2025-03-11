import { FieldValues } from "react-hook-form";
import { GET, POST } from ".";
import API_URL from "@/lib/api";
import { ILayout } from "@/models/Layout";

interface CurrencyFields {
  [key: string]: number | undefined;
}
export interface ILogResponse extends ILog, Response {}
export interface IUserLog {
  userId: string;
}
export interface ILog extends FieldValues {
  createdBy: string;
  riels: CurrencyFields;
  dollars: CurrencyFields;
}

export function countLog(user: IUserLog): Promise<boolean> {
  const url = `${API_URL}/log/count-log`;
  return POST<boolean, IUserLog>(url, user);
}

export function createLog(form: ILog): Promise<ILayout<ILogResponse>> {
  const url = `${API_URL}/log`;
  return POST<ILayout<ILogResponse>, ILog>(url, form);
}
export function getLogs(): Promise<ILayout<ILogResponse[]>> {
  const url = `${API_URL}/log/retrieve`;
  return GET<ILayout<ILogResponse[]>>(url);
}
