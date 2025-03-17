// 'use client'
import type { Metadata } from "next";
import { Provider } from "@/components/ui/provider";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster"

// import FullScreenLoader from "@/components/FullScreenLoader"

export const metadata: Metadata = {
  title: "Wist WorkSphere",
  description: "Trabajo eficiente, gestión inteligente",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="WorkSphere" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Funnel+Display:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          <Provider>
            {/* <FullScreenLoader/> */}
            {children}
            <Toaster/>
          </Provider>
        </AuthProvider>
      </body>
    </html>
  );
}
