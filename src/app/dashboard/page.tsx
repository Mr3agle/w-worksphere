// app/dashboard/page.tsx
"use client"
import DashboardLayout from "./DashboardLayout";
import { Flex, Heading, Text, Image, Avatar, HStack } from "@chakra-ui/react";
import CustomCard from "@/components/Cards";
import ClockCard from "@/components/ClockCard";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth()

  const colorPalette = ["red", "blue", "green", "yellow", "purple", "orange"]

  const pickPalette = (name: string) => {
    const index = name.charCodeAt(0) % colorPalette.length
    return colorPalette[index]
  }

  return (
    <DashboardLayout>
      <Flex direction="column" gap={6}>
        {/* Tarjeta de Bienvenida */}

        <CustomCard
          display={{ base: "block", md: "none" }}
          m=".5rem"
          borderRadius="20px"
          border="none"
          shadow="lg"
          mb={50}
        >
          {
            user &&
            (
              <Flex w="100%" justifyContent="space-between" alignItems="center">
                <Image
                  src="/logo-full.svg"
                  alt="Company Name"
                  w="25%"
                  mt={2}
                />
                <HStack justifyContent="end">
                  <Text as="span" fontWeight="bold">{user.name} </Text>
                  <Avatar.Root colorPalette={pickPalette(user.name)}>
                    <Avatar.Fallback name={user.name} />
                    <Avatar.Image src={user.profilePic} />
                  </Avatar.Root>
                </HStack>
              </Flex>

            )
          }
        </CustomCard>

        <CustomCard>
          {user &&
            <Text fontSize="1.5rem" mb={4}>
              Bienvenido de vuelta, <Text as="span" fontWeight="bold">{user.name}</Text>
            </Text>
          }

          <Text>
            Aquí podrás ver estadísticas.
          </Text>
        </CustomCard>

        {/* Tarjetas de Estadísticas */}
        <CustomCard flex={1}>
            <Heading size="md" mb={2}>
              Hora actual
            </Heading>
            <Text fontSize="2xl" fontWeight="bold">
              <ClockCard />
            </Text>
          </CustomCard>

        {/* Tarjeta de Actividad Reciente */}
      </Flex>
    </DashboardLayout>
  );
}