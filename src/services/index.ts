import { getAccessToken } from "@/utils/localStroage";

export function GET<T, Q = any>(url: string, params?: Q): Promise<T> {
  return sendRequest({ method: "GET", url, params });
}

export function GETWithToken<T, Q = any>(url: string, params?: Q): Promise<T> {
  // Get token from localStorage
  const token = getAccessToken();

  return sendRequest({
    method: "GET",
    url,
    params,
    headers: {
      Authorization: token ? `Bearer ${token}` : "", // Attach token if available
    },
  });
}

export function POST<T, Q = any>(
  url: string,
  params?: Q,
  headers?: any
): Promise<T> {
  return sendRequest({ method: "POST", url, params, headers });
}

export function POSTWithToken<T, Q = any>(url: string, params?: Q): Promise<T> {
  // Get token from localStorage
  const token = getAccessToken();

  return sendRequest({
    method: "POST",
    url,
    params,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
}

export function PUT<T, Q = any>(url: string, params?: Q): Promise<T> {
  return sendRequest({ method: "PUT", url, params });
}

export function PUTWithToken<T, Q = any>(url: string, params?: Q): Promise<T> {
  const token = getAccessToken();

  return sendRequest({
    method: "PUT",
    url,
    params,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
}

const sendRequest = async <T, Q = any>({
  url,
  method,
  params,
  headers = {}, // ✅ Default to an empty object
  signal,
}: {
  url: string;
  method: string;
  params?: Q;
  signal?: AbortSignal;
  headers?: Record<string, string>; // ✅ Correctly type headers
}): Promise<T> => {
  return fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: method === "GET" ? undefined : JSON.stringify(params), // ✅ Exclude body for GET
    credentials: "include",
    signal,
  })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! Status: ${response.status}`
        );
      }
      return data;
    })
    .catch((err) => {
      console.error(`Error in ${method} request:`, err);
      throw err;
    });
};
