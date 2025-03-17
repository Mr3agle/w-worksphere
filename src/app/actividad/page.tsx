// app/dashboard/page.tsx
"use client"
import DashboardLayout from "../dashboard/DashboardLayout";
import { Flex, Heading, Text } from "@chakra-ui/react";
import Card from "@/components/Cards";

export default function ActividadPage() {
  return (
    <DashboardLayout>
      <Flex direction="column" gap={6} w="100%">
        <Card>
          <Heading size="lg" mb={4}>
            Actividad
          </Heading>
          <Text>
            Apartado en Desarrollo
          </Text>
        </Card>
      </Flex>
    </DashboardLayout>
  );
}