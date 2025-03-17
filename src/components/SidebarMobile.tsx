"use client";

import { Box, Icon } from "@chakra-ui/react";
// import { Button, CloseButton, Drawer, Portal } from "@chakra-ui/react"
import {
  FiActivity,
  FiFileText,
  FiClock,
  FiUser,
  FiLayout,
  FiSend
} from "react-icons/fi";
import { usePathname } from "next/navigation";
import Link from "next/link";
// import { useState } from "react";
// import { useBreakpointValue } from "@chakra-ui/react";
// import { useAuth } from "@/context/AuthContext";



interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function SidebarMobile() {

  // const { logout, user } = useAuth()
  const pathname = usePathname();

  // const isMobile = useBreakpointValue({ base: true, md: false });

  const NavItem = ({ href, icon, label }: { href: string; icon: any; label?: string }) => {
    const isActive = pathname === href;


    return (
      <Link href={href} passHref legacyBehavior>
        <Box
          as="a"
          w="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={3}
          borderRadius="xl"
          bg={isActive ? "blue.50" : "transparent"}
          color={isActive ? "blue.600" : "gray.500"}
        >
          <Icon as={icon} boxSize={6}  />
        </Box>
      </Link>
    );
  };

  return (
    <Box
      position="fixed"
      bottom={1}
      left="50%" // Mueve el Box al 50% de la pantalla
      transform="translateX(-50%)" // Ajusta el Box para que esté centrado
      width="95%"
      bg="white"
      boxShadow="xl"
      borderRadius={10}
      p={2}
      zIndex={100}
      display="flex"
      flexDirection="row"
      justifyContent="space-around"
      height="70px"
    >
      <NavItem href="/dashboard" icon={FiLayout} />
      <NavItem href="/asistencia" icon={FiClock} />
      <NavItem href="/solicitudes" icon={FiFileText} />
      <NavItem href="/viajes" icon={FiSend} />
      <NavItem href="/actividad" icon={FiActivity} />
      <NavItem href="/profile" icon={FiUser} />
    </Box>
  )

}
