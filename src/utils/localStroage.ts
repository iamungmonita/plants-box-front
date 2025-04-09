export const getAccessToken = (): string => {
  const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN || "auth_token"; // Default key
  const token = localStorage.getItem(tokenKey);

  if (!token) {
    throw new Error("No Access Token");
  }

  return token;
};
