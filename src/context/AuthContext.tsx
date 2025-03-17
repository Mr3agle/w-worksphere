'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { account } from '@/lib/appwrite';
import { redirect } from 'next/navigation';
import { OAuthProvider } from 'appwrite';
// import { profile } from 'console';

interface AuthContextType {
  user: any;
  loading: boolean;
  login: () => void;
  logout: () => void;
}


const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchMicrosoftProfilePic = async (accessToken: string) => {

    if (!accessToken) {
      console.warn("No hay token de acceso disponible.");
      return null;
    }
  
    try {
      const response = await fetch("https://graph.microsoft.com/v1.0/me/photo/$value", {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
      });
  
      if (!response.ok) {
        if (response.status === 404) {
          console.warn("No se encontró una imagen de perfil en Azure AD.");
          return null; // No lanzar error, solo indicar que no hay imagen
        }
        throw new Error(`Error al obtener la imagen: ${response.statusText}`);
      }
  
      return URL.createObjectURL(await response.blob());

    } catch (error) {
      console.error("Error obteniendo imagen de perfil:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await account.getSession("current");

        if (!session?.providerAccessToken) {
          console.warn("No hay token de acceso en la sesión.");
          setUser(null);
          return;
        }

        const userData = await account.get();
        const profilePic = await fetchMicrosoftProfilePic(session.providerAccessToken);
        setUser({...userData, profilePic});
        // console.log("User Data:", userData);
      } catch (error: any) {
        setUser(null)
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogin = async () => {
    try {
      await account.createOAuth2Session(
        OAuthProvider.Microsoft,
        process.env.APPWRITE_OAUTH_SUCCESS_REDIRECT,
        process.env.APPWRITE_OAUTH_FALLBACK
      );
      console.log('Login successful, fetching user session...');
      const userData = await account.getSession("current");
      console.log('User session fetched after login:', userData);
      setUser(userData);
      redirect('/dashboard');
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      console.log('User logged out');
      setUser(null);
      redirect('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
