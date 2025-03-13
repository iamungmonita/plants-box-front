const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) return decodeURIComponent(value);
  }
  return null;
};

export const getAccessToken = (): string | null => {
  return getCookie(process.env.NEXT_PUBLIC_AUTH_TOKEN as string);
};
