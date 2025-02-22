const API_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:4003"
    : "http://192.168.1.101:4003";

export default API_URL;
