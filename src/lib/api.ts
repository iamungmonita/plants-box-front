const API_URL =
  typeof window !== "undefined"
    ? window.location.hostname === "localhost"
      ? "http://localhost:4003"
      : window.location.hostname === "192.168.1.101"
      ? "http://192.168.1.101:4003"
      : "https://your-production-url.com"
    : "https://your-server-url.com"; // Fallback for SSR

export default API_URL;
