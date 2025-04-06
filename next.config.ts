// next.config.js
module.exports = {
  reactStrictMode: true,

  images: {
    domains: [
      "localhost",
      "192.168.1.101",
      "172.21.7.41",
      "127.0.0.1",
      "167.172.65.215",
    ],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  publicRuntimeConfig: {
    API_URL: process.env.API_URL,
  },

  experimental: {
    authInterrupts: true, // ✅ Add this line to enable unauthorized()
  },

  async rewrites() {
    const API_URL = process.env.API_URL || "http://localhost:4000";

    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },
};
