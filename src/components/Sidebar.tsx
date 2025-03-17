"use client";

import { Box, Flex, Icon, VStack, Text, Avatar, Image, Center } from "@chakra-ui/react";
import { Button, CloseButton, Drawer, Portal } from "@chakra-ui/react"
import {
  FiSettings,
  FiActivity,
  FiFileText,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiUser,
  FiLayout,
  FiSend
} from "react-icons/fi";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useBreakpointValue } from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";



interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {

  const { logout, user } = useAuth()
  const pathname = usePathname();

  const [open, setOpen] = useState(false)

  const isMobile = useBreakpointValue({ base: true, md: false });

  const colorPalette = ["red", "blue", "green", "yellow", "purple", "orange"];

  const pickPalette = (name: string) => {
    const index = name.charCodeAt(0) % colorPalette.length;
    return colorPalette[index];
  };

  const NavItem = ({ href, icon, label }: { href: string; icon: any; label?: string }) => {
    const isActive = pathname === href;

    const justifyContent = useBreakpointValue({
      base: "center", // Centrado en móviles
      md: "flex-start", // Mantener el estilo para pantallas grandes
    });

    return (
      <Link href={href} passHref legacyBehavior>
        <Box
          as="a"
          w="full"
          display="flex"
          alignItems="center"
          justifyContent={justifyContent}
          p={3}
          borderRadius="xl"
          bg={isActive ? "blue.50" : "transparent"}
          color={isActive ? "blue.600" : "gray.500"}
          _hover={{
            bg: isActive ? "blue.100" : "gray.100",
            transform: "translateX(4px)",
            textDecoration: "none"
          }}
          transition="all 0.2s"
        >
          <Icon as={icon} boxSize={6} mr={{md: (isOpen ? 2 : 0), base: 1}} ml={{base:2, md: 0}}/>
          {isOpen && <Text flex={1}>{label}</Text>}
        </Box>
      </Link>
    );
  };

  if (isMobile) {
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
        p={4}
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

  return (
    <Box
      position="fixed"
      top={4}
      left={4}
      width={isOpen ? "260px" : "90px"}
      bg="white"
      borderRadius="15px"
      boxShadow="xl"
      height="calc(100vh - 32px)"
      p={4}
      transition="all 0.3s cubic-bezier(0.4,0,0.2,1)"
      zIndex={10}
      display="flex"
      flexDirection="column"
      alignItems={isOpen ? "left" : "center"}
    >
      {/* Header with Logo and Toggle Button */}
      <Flex justify="space-between" align="center" mb={6} position="relative">
        <Flex align="center" gap={2} mt="10px">
          <Image
            src="/logo-icon.svg"
            alt="Company Logo"
            display={!isOpen ? "block" : "none"}
            w="40px"
          />
          <Image
            src="/logo-full.svg"
            alt="Company Name"
            width="50%"
            display={isOpen ? "block" : "none"}
          />
        </Flex>
        <Icon
          as={isOpen ? FiChevronLeft : FiChevronRight}
          boxSize={8}
          cursor="pointer"
          color="gray.600"
          onClick={onToggle}
          position="absolute"
          right={isOpen ? 0 : "-5px"}
          bg="gray.100"
          borderRadius="md"
          borderColor="gray.200"
          borderWidth="1px"
          zIndex={1}
          transform={isOpen ? "none" : "translateX(100%)"}
          _hover={{
            transform: isOpen ? "none" : "translateX(100%) scale(1.1)"
          }}
          transition="all 0.2s"
        />
      </Flex>

      <Flex align="center"
        gap={3}
        borderRadius="15px"
        mb={6}>
        <Avatar.Root colorPalette={pickPalette(user.name)}>
          <Avatar.Fallback name={user && user.name} />
          <Avatar.Image src={user && user.profilePic} alt={user && user.name} w="100%" />
        </Avatar.Root>
        {isOpen && (
          <Box>
            <Text fontWeight="bold" color="gray.800">{user && user.name}</Text>
            <Text fontSize="sm" color="gray.500">Administrador</Text>
          </Box>
        )}
      </Flex>

      {/* Main Navigation */}
      <VStack spaceY={2} flex={1}>
        <NavItem href="/dashboard" icon={FiLayout} label="Dashboard" />
        <NavItem href="/asistencia" icon={FiClock} label="Asistencia" />
        <NavItem href="/solicitudes" icon={FiFileText} label="Solicitudes" />
        <NavItem href="/viajes" icon={FiSend} label="Viajes" />
        <NavItem href="/actividad" icon={FiActivity} label="Actividad" />
      </VStack>

      {/* Lower Menu */}
      <VStack spaceY={2} mt="auto">
        {/* Botón para abrir el Drawer */}
        <Drawer.Root size="md" open={open} onOpenChange={(e) => setOpen(e.open)}>
          <Drawer.Trigger asChild>
            <Box
              as="a"
              w="full"
              display="flex"
              alignItems="center"
              p={3}
              borderRadius="xl"
              bg="transparent"
              color="gray.500"
              _hover={{
                bg: "gray.100",
                transform: "translateX(4px)",
                textDecoration: "none",
                cursor: "pointer"
              }}
              transition="all 0.2s"
            >
              <Icon as={FiSettings} boxSize={6} mr={isOpen ? 2 : 0} />
              {isOpen && <Text flex={1}>Ajustes</Text>}
            </Box>
          </Drawer.Trigger>
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content pl={3}>
                <Drawer.Header>
                  <Drawer.Title>Consola de Ajustes</Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                  <p>
                    Los ajustes se encuentran en desarrollo.
                  </p>
                </Drawer.Body>
                <Drawer.Footer display="flex" justifyContent="flex-start" gap={3}>
                  <Drawer.ActionTrigger asChild>
                    <Button rounded="xl" colorPalette="gray" size="xl">Aceptar</Button>
                  </Drawer.ActionTrigger>
                  <Button rounded="xl" colorPalette="red" size="xl" onClick={() => logout()}>
                    Cerrar Sesión
                  </Button>
                </Drawer.Footer>
                <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Drawer.CloseTrigger>
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
        <NavItem href="/profile" icon={FiUser} label="Mi Perfil" />
      </VStack>
    </Box>
  );
}
