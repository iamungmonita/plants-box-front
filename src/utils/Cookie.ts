export const getAccessToken = (): string | null => {
  const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN || "auth-token"; // Default to "authToken"
  return localStorage.getItem(tokenKey);
};
