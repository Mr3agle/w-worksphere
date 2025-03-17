import { Box, Text, Spinner, useBreakpointValue, VStack } from "@chakra-ui/react";

export default function FullScreenLoader() {
  // const size = useBreakpointValue({ base: "xl", md: "2xl" }); // Responsive size for spinner

  return (
    <Box
      position="fixed"
      top={0}
      right={0}
      w="full"
      height="100vh"
      bg="rgba(255, 255, 255, 0.8)" // Fondo semitransparente
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={9999} // Asegurarse de que quede por encima de otros elementos
    >
      <VStack>

      <Spinner size="xl" color="blue.500" borderWidth="7px" />
      <Text mt={4} color="gray" fontSize="lg">
          Cargando...
        </Text>
      </VStack>
    </Box>
  );
}
