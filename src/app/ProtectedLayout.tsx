"use client";

import FullScreenLoader from "@/components/FullScreenLoader";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toaster } from "@/components/ui/toaster";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const publicRoutes = ["/", "/login", "/not-found"];

  useEffect(() => {
    // Only check and redirect when not loading
    if (!loading) {
      if (!user && !publicRoutes.includes(pathname)) {
        toaster.create({
          title: "Acceso denegado",
          description: "Inicia sesión para acceder a esta sección.",
          type: "error",
          duration: 5000,
        });
        router.push("/"); // Redirect to homepage if not logged in
      }
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return <FullScreenLoader />; // Show loading until authentication state is resolved
  }

  if (!user) {
    return null; // Don't render content if user isn't logged in
  }

  return <>{children}</>; // Render the protected content if user is authenticated
}
