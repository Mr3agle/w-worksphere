// app/dashboard/page.tsx
"use client"
import DashboardLayout from "../dashboard/DashboardLayout";
import { Flex, Heading, Text, Box, Card, Avatar, Button} from "@chakra-ui/react";
import { FiLogOut, FiPlay } from "react-icons/fi";
import ClockCard from "@/components/ClockCard";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {

  const {logout, user} = useAuth()

  return (
    <DashboardLayout>
      <Flex direction="column" gap={6}>
        {/* Tarjeta de Bienvenida */}
        {/* <Heading fontWeight="normal" color="gray.500" size="lg" mb={4}>
          Revisa tu perfil, <Text as="span" fontWeight="bold" color="black">Josue Valencia</Text>
        </Heading> */}
        {/* Tarjetas de Estadísticas */}
        <Box 
        gap={6} 
        alignItems="center" 
        direction={{ base: "column", md: "row" }} 
        borderRadius="lg"
        p="1rem"
        alignSelf="center"
        >
          <Card.Root width="320px"  rounded="xl">
            <Card.Body gap="2">
              <Avatar.Root size="lg" >
                <Avatar.Image src={user?.profilePic} />
                <Avatar.Fallback name={user?.name} />
              </Avatar.Root>
              <Card.Title mt="2">Perfil de {user?.name}</Card.Title>
              <Card.Description>
                Este apartado está en desarrollo, pero aquí podrás manejar tu perfil.
              </Card.Description>
            </Card.Body>
            <hr />
            <Card.Footer justifyContent="center" mt={10}>
              <Button rounded="xl" size="lg" bg="red.500" onClick={ ()=> logout()}> <FiLogOut/> Cerrar sesión</Button>
            </Card.Footer>
          </Card.Root>
        </Box>
      </Flex>
    </DashboardLayout>
  );
}