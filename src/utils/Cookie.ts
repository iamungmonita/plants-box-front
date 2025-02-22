import { EmptyObject } from "react-hook-form";

const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) return decodeURIComponent(value);
  }
  return null;
};

export const getAccessToken = (): string | null => {
  return getCookie("f1ee97b19e11145c6fba1be1f8204e00");
};
