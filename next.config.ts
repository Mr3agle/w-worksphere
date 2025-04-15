import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // AZURE_CLIENT_ID: process.env.AZURE_CLIENT_ID,
    // AZURE_TENANT_ID: process.env.AZURE_TENANT_ID,
    NEXT_PUBLIC_APPWRITE_DATABASE_ID: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
    NEXT_PUBLIC_APPWRITE_WORK_SESSIONS_COLLECTION: process.env.NEXT_PUBLIC_APPWRITE_WORK_SESSIONS_COLLECTION || "",
    NEXT_PUBLIC_APPWRITE_BREAKS_COLLECTION: process.env.NEXT_PUBLIC_APPWRITE_BREAKS_COLLECTION || "",
    NEXT_PUBLIC_APPWRITE_NOTES_COLLECTION: process.env.NEXT_PUBLIC_APPWRITE_NOTES_COLLECTION || "",
    NEXT_PUBLIC_APPWRITE_FUNCTION_SERVERTIME: process.env.NEXT_PUBLIC_APPWRITE_FUNCTION_SERVERTIME || "",
    NEXT_PUBLIC_APPWRITE_WORKER_PROFILE_COLLECTION: process.env.NEXT_PUBLIC_APPWRITE_WORKER_PROFILE_COLLECTION || "",
    APPWRITE_ENDPOINT: process.env.APPWRITE_ENDPOINT || "",
    APPWRITE_PROJECT_ID: process.env.APPWRITE_PROJECT_ID || "",
    APPWRITE_OAUTH_SUCCESS_REDIRECT: process.env.APPWRITE_OAUTH_SUCCESS_REDIRECT || "",
    APPWRITE_OAUTH_FALLBACK: process.env.APPWRITE_OAUTH_FALLBACK || "",
  },
  reactStrictMode: true,
  webpack(config, { dev }) {
    if (dev) {
      // Desactivar la caché en desarrollo
      config.cache = false;
    }
    return config;
  },
  
};

export default nextConfig;
