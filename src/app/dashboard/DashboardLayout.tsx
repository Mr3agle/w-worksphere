"use client";

import { useState, useEffect } from "react";
import { Flex, Box } from "@chakra-ui/react";
import Sidebar from "@/components/Sidebar";
import SidebarMobile from "@/components/SidebarMobile";
import FullScreenLoader from "@/components/FullScreenLoader";
// import { AuthProvider, useAuth } from "@/context/AuthContext";
import ProtectedLayout from "../ProtectedLayout";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Use null as initial state so we know when localStorage has been read
  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  const [vh, setVh] = useState<number>(0); // Estado para guardar la altura en vh
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem("sidebarState");
    setIsOpen(saved !== null ? saved === "true" : true);
  }, []);


  // When isOpen changes (and is not null), persist it to localStorage
  useEffect(() => {
    if (isOpen !== null) {
      localStorage.setItem("sidebarState", isOpen.toString());
    }

    const updateVhAndWidth = () => {
      setVh(window.innerHeight); // Calculamos la altura de la ventana
      setWindowWidth(window.innerWidth); // Calculamos el ancho de la ventana
    };

    // Actualizamos vh y windowWidth al cargar el componente
    updateVhAndWidth();

    // Listener para cambio de tamaño de la ventana
    window.addEventListener("resize", updateVhAndWidth);

    return () => {
      window.removeEventListener("resize", updateVhAndWidth);
    };
  }, [isOpen]);

  // Lógica para calcular el marginBottom basado en el tamaño de la ventana
  let marginBottom;

  if (windowWidth < 380) { // Para dispositivos móviles más pequeños (ej: iPhone SE)
    if (vh < 700) {
      marginBottom = Math.min(Math.max(vh * 0.2, 50), 200); // Margen entre 50px y 250px
    } else {
      marginBottom = Math.min(Math.max(vh * 0.2, 50), 100); // Ajustamos para pantallas más grandes pero pequeñas
    }
  } else if (windowWidth < 768) { // Para dispositivos medianos
    marginBottom = Math.min(Math.max(vh * 0.2, 50), 100); // Margen más pequeño para pantallas medianas
  } else { // Para pantallas grandes
    marginBottom = Math.min(Math.max(vh * 0.1, 50), 100); // Ajuste para pantallas grandes
  }

  // console.log("vh: ", vh, "windowWidth: ", windowWidth, "margin bottom: ", marginBottom);

  // While we haven't determined the state, you can render a loader (or null)
  if (isOpen === null) {
    return <FullScreenLoader />
  }

  return (
    // <AuthProvider>
    <ProtectedLayout>
      <Flex>
        <Box display={{ base: "none", md: "block", lg: "block" }}>
          <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(prev => !prev)} />
        </Box>
        <Box display={{ base: "block", md: "none", lg: "none" }}>
          <SidebarMobile />
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          alignItems={{md:"center", base:"start"}}
          flex={1}
          // bg="green"
          minHeight="100vh"
          ml={{ base: "0", lg: isOpen ? "280px" : "120px" }}
          height="calc(100vh-marginBottom)"
          p={{ base: "0", lg: "6" }}
          transition="margin-left 0.3s cubic-bezier(0.4,0,0.2,1)"
          mb={{base: marginBottom, lg: 0}} // aqui quiero calcular segun el vh del dispositivo
        // display="flex"
        >
          {children}
        </Box>
      </Flex>
      <span className="versionControl">beta v0.1.2.1</span>
    </ProtectedLayout>
    // </AuthProvider>
  );
}
