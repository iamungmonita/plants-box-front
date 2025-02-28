import { FieldValues } from "react-hook-form";
import { GET, POST } from ".";
import { Response } from "@/schema/order";
import API_URL from "@/lib/api";

interface CurrencyFields {
  [key: string]: number | undefined; // An object where each key is a string and value is a number
}

export interface ILog extends FieldValues {
  usd: Number;
  khr: Number;
  counter: string;
  riels: CurrencyFields;
  dollars: CurrencyFields;
}

export interface LogData extends Response {
  usd: Number;
  khr: Number;
  counter: string;
  riels: CurrencyFields;
  dollars: CurrencyFields;
}

export interface ILogResponse<T> extends Response {
  success: boolean;
  message?: string;
  data?: T;
  name?: string;
  errors?: any;
}
export interface IUserLog {
  userId: string;
  username: string;
  role: string;
}
export interface IUserLogResponse extends Response {
  userId: string;
  username: string;
  role: string;
}

export function Log(user: IUserLog): Promise<boolean> {
  const url = `${API_URL}/log`;
  return POST<boolean, IUserLog>(url, user);
}
export function getAllLogs(): Promise<IUserLogResponse[]> {
  const url = `${API_URL}/log/retrieve-logs`;
  return GET<IUserLogResponse[]>(url);
}
export function InitialLog(form: ILog): Promise<ILogResponse<LogData>> {
  const url = `${API_URL}/log/initial-log`;
  return POST<ILogResponse<LogData>, ILog>(url, form);
}
export function RetrieveCount(): Promise<LogData[]> {
  const url = `${API_URL}/log/retrieve`;
  return GET<LogData[]>(url);
}
