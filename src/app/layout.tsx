// 'use client'
import type { Metadata } from "next";
import { Provider } from "@/components/ui/provider";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster"
// import PWA from "@/app/pwa";

// import FullScreenLoader from "@/components/FullScreenLoader"

export const metadata: Metadata = {
  title: "Wist WorkSphere",
  description: "Trabajo eficiente, gestión inteligente",
  // manifest: "/manifest.json"
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html suppressHydrationWarning lang="es" translate="no" className="notranslate">
      <head>
        <meta name="apple-mobile-web-app-title" content="WorkSphere" />
        <meta name="google" content="notranslate" />
        <meta httpEquiv="Content-Language" content="es" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Funnel+Display:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {/* <PWA /> */}
        <AuthProvider>
          <Provider>
            {/* <FullScreenLoader/> */}
            {children}
            <Toaster />
          </Provider>
        </AuthProvider>
      </body>
    </html>
  );
}
