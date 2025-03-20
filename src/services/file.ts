import API_URL from "@/lib/api";
import { POST } from ".";

export interface FileResponse {
  url: string;
  fileName: string;
}

export function uploadSingleImage(form: any): Promise<FileResponse> {
  const url = `${API_URL}/file/v1/upload`;
  return fetch(url, { method: "POST", body: form }).then((res) => res.json());
}
