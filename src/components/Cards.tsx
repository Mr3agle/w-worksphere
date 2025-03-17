// components/Card.tsx
"use client";

import { Box, BoxProps } from "@chakra-ui/react";

interface CardProps extends BoxProps {
  children: React.ReactNode;
}

export default function CustomCard({ children, ...rest }: CardProps) {
  return (
    <Box
      // borderColor="gray.200"
      p={6}
      transition="all 0.2s"
      bg="white"
      borderRadius="xl"
      // _hover={{
      //   boxShadow: "lg", // Sombra más pronunciada al hacer hover
      //   transform: "translateY(-2px)", // Efecto de levantar la tarjeta
      // }}
      {...rest}
    >
      {children}
    </Box>
  );
}