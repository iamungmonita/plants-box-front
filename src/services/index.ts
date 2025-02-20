export function GET<T, Q = any>(url: string, params?: Q): Promise<T> {
  return sendRequest({ method: "GET", url, params });
}
export function POST<T, Q = any>(url: string, params?: Q): Promise<T> {
  return sendRequest({ method: "POST", url, params });
}
export function PUT<T, Q = any>(url: string, params?: Q): Promise<T> {
  return sendRequest({ method: "PUT", url, params });
}

const sendRequest = async <T, Q = any>({
  url,
  method,
  params,
  signal,
}: {
  url: string;
  method: string;
  params?: Q;
  signal?: AbortSignal;
}): Promise<T> => {
  return fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: method === "GET" ? undefined : JSON.stringify(params), // ✅ Exclude body for GET
    credentials: "include",
    signal,
  })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        return data;
      }
      return data;
    })
    .catch((err) => {
      console.error(`Error in ${method} request:`, err);
      throw err;
    });
};
