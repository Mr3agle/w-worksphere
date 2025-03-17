// app/dashboard/page.tsx
"use client"
import DashboardLayout from "../dashboard/DashboardLayout";
import { Flex, Heading, Text } from "@chakra-ui/react";
import CustomCard from "@/components/Cards";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <Flex direction="column" gap={6} w="100%">
        {/* Tarjeta de Bienvenida */}
        <CustomCard >
          <Heading size="lg" mb={4}>
            Solicitudes
          </Heading>
          <Text>
            Apartado en Desarrollo
          </Text>
        </CustomCard>
      </Flex>
    </DashboardLayout>
  );
}