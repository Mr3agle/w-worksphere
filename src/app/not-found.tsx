// app/not-found/page.tsx
"use client"
import { FC } from "react";
import { Box, Text, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const NotFoundPage: FC = () => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/"); // Redirige al home
  };

  return (
    <Box textAlign="center" mt="100px">
      <Text fontSize="4xl" fontWeight="bold" color="red.500">
        404 - Página no encontrada
      </Text>
      <Text fontSize="lg" mt="4" color="gray.500">
        Lo sentimos, pero la página que buscas no existe.
      </Text>
      <Button mt="6" colorScheme="blue" onClick={handleRedirect}>
        Volver al inicio
      </Button>
    </Box>
  );
};

export default NotFoundPage;
