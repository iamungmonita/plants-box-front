const API_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:4002"
    : "http://192.168.1.101:4002";

export default API_URL;
