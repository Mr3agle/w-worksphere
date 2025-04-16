// app/dashboard/page.tsx
"use client"
import DashboardLayout from "../dashboard/DashboardLayout";
import { Flex, Box, Button, Avatar, Image, Heading, Text, HStack, DataList, VStack } from "@chakra-ui/react";
import { FiLogOut } from "react-icons/fi";
// import ClockCard from "@/components/ClockCard";
import { useAuth } from "@/context/AuthContext"
import CustomCard from "@/components/Cards";
import { databases } from "@/lib/appwrite";
import { useEffect, useState } from "react";
import { Query } from "appwrite";

export default function ProfilePage() {

  const { user, logout } = useAuth();
  const [stats, setStats] = useState<{ label: string; value: string; diff: number; helpText: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(true);
  // const [serverTime, setServerTime] = useState<string | null>(null)
  // const [error, setError] = useState<string | null>(null);
  const database = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
  const worker_profile = process.env.NEXT_PUBLIC_APPWRITE_WORKER_PROFILE_COLLECTION!

  const colorPalette = ["red", "blue", "green", "yellow", "purple", "orange"]

  const pickPalette = (name: string) => {
    const index = name.charCodeAt(0) % colorPalette.length
    return colorPalette[index]
  }

  useEffect(() => {
    const getUserProfileData = async () => {
      if (!user?.$id) {
        // console.warn("El usuario no está autenticado, evitando la consulta.");
        return;
      }
      try {
        const response = await databases.listDocuments(database, worker_profile, [Query.equal("userId", user.$id)])

        if (response.total === 0 || response.documents.length === 0) {
          setHasProfile(false);
          setLoading(false);
          return;
        }

        const currentWorkerProfile = response.documents[0];
        console.log("user birthday:", currentWorkerProfile.birthday);

        const formattedStats = [
          { label: "Cumpleaños", value: new Date(currentWorkerProfile.birthday).toLocaleDateString("es-EC"), diff: -12, helpText: "birthday" },
          { label: "Grupo Sanguíneo", value: currentWorkerProfile.bloodType, diff: 12, helpText: "Bloodtype" },
          { label: "Funciones Clave", value: currentWorkerProfile.keyFunctions, diff: 4.5, helpText: "Key Functions" },
        ]

        setStats(formattedStats)

        setHasProfile(true);
      } catch (error) {
        console.error("Error al obtener el perfil del usuario:", error);
        setHasProfile(false);
      } finally {
        setLoading(false);
      }
    }
    getUserProfileData()

  }, [user])

  // Estado para guardar la respuesta del servidor

  // Usamos useEffect para obtener la hora del servidor al montar el componente
  // useEffect(() => {
  //   const fetchTimestamp = async () => {
  //     try {
  //       const response = await getServerTimestamp();
  //       // Aquí se espera que la respuesta tenga la forma { iso, timestamp }
  //       const srvParsedTime = JSON.parse(response.responseBody)

  //       console.log(srvParsedTime.time)

  //       const ecTime = new Date(srvParsedTime.time).toLocaleString('es-EC', {
  //         timeZone: 'America/Guayaquil',
  //         hour12: false
  //       });
  //       console.log(ecTime)
  //       setServerTime(ecTime);

  //     } catch (err) {
  //       console.error('Error fetching server timestamp:', err);
  //       setError('Error al obtener la hora del servidor.');
  //     }
  //   };

  //   fetchTimestamp();
  // }, []);


  // if (!hasProfile) {
  //   return (
  //     <div>
  //       <p>Todavía no se han cargado tus datos.</p>
  //     </div>
  //   );
  // }

  return (
    <DashboardLayout>
      {/* <Flex direction="column" gap={6}>

        <Box 
        gap={6} 
        alignItems="center" 
        direction={{ base: "column", md: "row" }} 
        borderRadius="lg"
        p="1rem"
        alignSelf="center"
        >
          <Card.Root width="100%"  rounded="xl">
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
      </Flex> */}
      <Flex direction="column" gap={6} w="100%">

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
                <VStack position="relative" w="50%" alignItems="start">

                  <Image
                    src="/logo-full.svg"
                    alt="Company Name"
                    w="60%"
                    mt={2}
                  />
                  <span className="versionControl">βeta v0.1.2.2</span>
                </VStack>
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
        <CustomCard m=".5rem">


          {stats.length === 0 ? (
            <Box p={4} textAlign="center">
              <Text fontSize="lg" color="gray.500">Todavía no se han cargado tus datos.</Text>
            </Box>
          ) : (
            <DataList.Root orientation="horizontal" divideY="1px">
              {stats.map((item) => (
                <DataList.Item key={item.label} pt="4">
                  <DataList.ItemLabel fontWeight="bold">{item.label}</DataList.ItemLabel>
                  <DataList.ItemValue>{item.value}</DataList.ItemValue>
                </DataList.Item>
              ))}
            </DataList.Root>
          )}

          {/* <DataList.Root orientation="horizontal" divideY="1px">
            {stats.map((item) => (
              <DataList.Item key={item.label} pt="4">
                <DataList.ItemLabel fontWeight="bold">{item.label}</DataList.ItemLabel>
                <DataList.ItemValue>{item.value}</DataList.ItemValue>
              </DataList.Item>
            ))}
          </DataList.Root> */}
        </CustomCard>

        <CustomCard bg="#fcf4f4" borderColor="red" borderWidth="1px" m=".5rem">
          <Heading size="lg" mb={4}>
            Cerrar Sesión
          </Heading>
          <Button rounded="xl" width="full" mt="1rem" size="lg" bg="red.500" onClick={() => logout()}> <FiLogOut /> Cerrar sesión</Button>
        </CustomCard>
      </Flex>
    </DashboardLayout>
  );
}