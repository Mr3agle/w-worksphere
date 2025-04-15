// app/dashboard/page.tsx
"use client"
import DashboardLayout from "../dashboard/DashboardLayout";
import { Flex, Image, Text, Box, Card, Avatar, Button, VStack, Field, Fieldset, Textarea, Stack, Dialog, Portal, CloseButton, Spinner, HStack, Separator, Collapsible, Heading, Stat, Icon } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { FiCoffee, FiLogOut, FiPause, FiPlay, FiFileText, FiClock, FiCheck, FiMusic } from "react-icons/fi";
import ClockCard from "@/components/ClockCard";
import { useEffect, useState } from "react";
import { databases, getServerTimestamp } from "@/lib/appwrite"
import { useAuth } from "@/context/AuthContext"
import { ID, Query } from "appwrite"
import CustomCard from "@/components/Cards"
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function ValidateEndShift({ open, setOpen, onConfirm }
  : {
    open: boolean;
    setOpen: (value: boolean) => void,
    onConfirm: () => void
  }) {
  return (
    <Dialog.Root role="alertdialog" lazyMount open={open} onOpenChange={(e) => setOpen(e.open)} placement="center" >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Finalizar Jornada</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <p>
                Estás a punto de finalizar la jornada, esto cerrará tu sesión de trabajo activa y no podrás continuar con una nueva sesión hasta mañana.
              </p>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              </Dialog.ActionTrigger>
              <Button colorPalette="red" onClick={onConfirm}>Confirmar</Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
function SummaryWorkDayPopup({ open, setOpen, clockInTime, workedTime, breakTime, breaksTaken }
  : {
    open: boolean;
    setOpen: (value: boolean) => void,
    clockInTime: string,
    workedTime: string,
    breakTime: string,
    breaksTaken: number
  }) {
  return (
    <Dialog.Root lazyMount open={open} onOpenChange={(e) => setOpen(e.open)} motionPreset="slide-in-bottom" placement="center">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>
                Resumen de la jornada
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <VStack>
                <DotLottieReact
                  src="https://lottie.host/bc01c093-6cb1-4ccd-85ff-fe518fe03b9a/8xQhlkzsqB.lottie"
                  autoplay
                />
                <HStack w="full">
                  <Stat.Root maxW="240px" borderWidth="1px" p="4" rounded="md">
                    <HStack justify="space-between">
                      <Stat.Label>Check In</Stat.Label>
                      <Icon color="fg.muted">
                        <FiCheck></FiCheck>
                      </Icon>
                    </HStack>
                    <Stat.ValueText>{clockInTime}</Stat.ValueText>
                  </Stat.Root>
                  <Stat.Root maxW="240px" borderWidth="1px" p="4" rounded="md">
                    <HStack justify="space-between">
                      <Stat.Label>Trabajo total</Stat.Label>
                      <Icon color="fg.muted">
                        <FiClock></FiClock>
                      </Icon>
                    </HStack>
                    <Stat.ValueText>{workedTime}</Stat.ValueText>
                  </Stat.Root>
                </HStack>
                <HStack w="full">
                  <Stat.Root maxW="240px" borderWidth="1px" p="4" rounded="md">
                    <HStack justify="space-between">
                      <Stat.Label>Descanso total</Stat.Label>
                      <Icon color="fg.muted">
                        <FiCoffee />
                      </Icon>
                    </HStack>
                    <Stat.ValueText>{breakTime}</Stat.ValueText>
                  </Stat.Root>
                  <Stat.Root maxW="240px" borderWidth="1px" p="4" rounded="md">
                    <HStack justify="space-between">
                      <Stat.Label>Breaks</Stat.Label>
                      <Icon color="fg.muted">
                        <FiMusic />
                      </Icon>
                    </HStack>
                    <Stat.ValueText>{breaksTaken}</Stat.ValueText>
                  </Stat.Root>
                </HStack>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" onClick={() => setOpen(false)}>Aceptar</Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

export default function AsistenciaPage() {

  const database = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
  const work_sessions_collection = process.env.NEXT_PUBLIC_APPWRITE_WORK_SESSIONS_COLLECTION!
  const breaks_collection = process.env.NEXT_PUBLIC_APPWRITE_BREAKS_COLLECTION!
  const notes_collection = process.env.NEXT_PUBLIC_APPWRITE_NOTES_COLLECTION!

  const [open, setOpen] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false);

  const [sessionStatus, setSessionStatus] = useState("inactivo")

  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [isBreakLimitReached, setIsBreakLimitReached] = useState(false);

  const [note, setNote] = useState("");

  const timestamp = new Date().toISOString();

  const [checkIn, setCheckIn] = useState("")
  const [breaksTaken, setBreaksTaken] = useState(0)
  const [totalWorkedTime, setTotalWorkedTime] = useState("")
  const [totalBreakTime, setTotalBreakTime] = useState("")

  const colorPalette = ["red", "blue", "green", "yellow", "purple", "orange"]

  const pickPalette = (name: string) => {
    const index = name.charCodeAt(0) % colorPalette.length
    return colorPalette[index]
  }

  const fetchTimestamp = async () => {
    try {
      const response = await getServerTimestamp();
      // Aquí se espera que la respuesta tenga la forma { iso, timestamp }
      const srvParsedTime = JSON.parse(response.responseBody)
      console.log(srvParsedTime.time)
      // const ecTime = new Date(srvParsedTime.time).toLocaleString('es-EC', {
      //   timeZone: 'America/Guayaquil',
      //   hour12: false
      // });
      // console.log(ecTime)
      // setServerTime(ecTime);
      return srvParsedTime.time

    } catch (err) {
      console.error('Error fetching server timestamp:', err);
      // setError('Error al obtener la hora del servidor.');
    }
  };

  const getCurrentPositionAsync = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error)
      );
    });
  };  


  const checkUserStatus = async () => {
    setLoading(true);
    if (!user?.$id) {
      console.warn("El usuario no está autenticado, evitando la consulta.");
      setSessionStatus("inactivo");
      setLoading(false);
      return;
    }

    try {
      const response = await databases.listDocuments(
        database,
        work_sessions_collection,
        [Query.equal("userId", user.$id), Query.contains("status", ["activo", "en break"])]
      );

      if (response.documents.length > 0) {

        const currentWorkSession = response.documents[0];
        console.log("id de sesion activa: ", currentWorkSession.$id)
        setSessionStatus(currentWorkSession.status);

        const breakLimitReached = !!currentWorkSession.breakLimitReached;
        setIsBreakLimitReached(breakLimitReached);
        console.log('Break limit reached:', breakLimitReached);

      } else {
        setSessionStatus("inactivo");
        setIsBreakLimitReached(false);

      }
    } catch (error) {
      console.error("Parece no existir una sesión activa:", error);
      console.log("Status de la sesión:", sessionStatus)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkUserStatus()
  }, [user]); // Se ejecuta cuando cambia el usuario autenticado

  const handleClockIn = async () => {
    if (!user) {
      // alert("Debes estar autenticado para registrar la asistencia.");
      toaster.create({
        type: "error",
        title: "Error de registro",
        description: "Debes estar autenticado para registrar la asistencia.",
        duration: 5000
      })
      return;
    }

    setLoading(true);
    setIsBreakLimitReached(false);
    // Obtener la ubicación del usuario
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Guardar en Appwrite

          const serverTimeIsoString = await fetchTimestamp();
          if (!serverTimeIsoString) throw new Error("No se pudo obtener el timestamp del servidor");

          await databases.createDocument(
            database,  // Reemplaza con tu ID de base de datos
            work_sessions_collection, // Reemplaza con tu ID de colección
            ID.unique(),      // Genera un ID único automáticamente
            {
              userId: user.$id,
              clockIn: serverTimeIsoString,
              clockInLocation: [latitude.toString(), longitude.toString()],
              status: "activo",
              createdAt: serverTimeIsoString,
              breakLimitReached: false
            }
          );
          // alert("Clock In registrado correctamente.");
          toaster.create({
            type: "success",
            title: "Todo Listo",
            description: "Se registró tu asistencia ¡Que tengas un gran día!",
            duration: 5000
          })
          checkUserStatus()
          setSessionStatus("activo");

        } catch (error) {
          console.error("Error al registrar Clock In:", error);
          // alert("Hubo un error al registrar tu asistencia.");
          toaster.create({
            type: "error",
            title: "Error de registro",
            description: "Hubo un error al registrar tu asistencia.",
            duration: 5000
          })

        } finally {
          setLoading(false);
        }
      },
      (error) => {
        // alert("No se pudo obtener tu ubicación. Activa el GPS y otorga permisos.");
        toaster.create({
          type: "warning",
          title: "Permite la ubicación",
          description: "No se pudo obtener tu ubicación. Activa el GPS y otorga permisos.",
          duration: 5000
        })
        setLoading(false);
      }
    );
  };

  const handleStartBreak = async () => {
    setLoading(true);
    try {
      // 1. Obtener el `workSessionId` de la colección de sesiones de trabajo
      const workSession = await databases.listDocuments(
        database,
        work_sessions_collection, // Asegúrate de usar el nombre correcto de la colección
        [Query.equal("userId", user.$id), Query.equal("status", "activo")]
      );

      if (workSession.documents.length === 0) {
        throw new Error("No hay una sesión de trabajo activa.");
      }

      const currentWorkSessionId = workSession.documents[0].$id;

       // 2. Obtener la ubicación precisa del usuario con la función asíncrona
      let position: GeolocationPosition;
      try {
        position = await getCurrentPositionAsync();
      } catch (locError) {
        toaster.create({
          type: "warning",
          title: "Ubicación necesaria",
          description:
            "No se pudo obtener la ubicación. Por favor, activa el GPS y otorga permisos.",
          duration: 5000,
        });
        // Retornamos sin continuar si no se puede obtener la ubicación.
        return;
      }

      const { latitude, longitude } = position.coords;

      const serverTimeIsoString = await fetchTimestamp();
      if (!serverTimeIsoString) throw new Error("No se pudo obtener el timestamp del servidor");
      // 3. Crear el documento de break en la colección de breaks
      await databases.createDocument(
        database,
        breaks_collection, // Asegúrate de usar el nombre correcto de la colección
        ID.unique(),
        {
          userId: user?.$id,
          workSessionId: currentWorkSessionId,  // Asociamos el `workSessionId` de la sesión de trabajo
          startTime: serverTimeIsoString,
          isActive: true,
          location: [latitude.toString(), longitude.toString()]
        }
      );
      // 4. Actualizar el estado de la sesión de trabajo a "en break" en la otra colección
      await databases.updateDocument(
        database,
        work_sessions_collection, // Asegúrate de usar el nombre correcto de la colección
        currentWorkSessionId,
        {
          status: "en break",
          updatedAt: serverTimeIsoString
        }
      );

      toaster.create({
        type: "success",
        title: "Break Iniciado",
        description: "Disfruta de tu descanso ✨",
        duration: 5000
      })

      // 5. Actualizar el estado del break
      setSessionStatus("en break");
    } catch (error) {
    console.error("Error al iniciar el break:", error);
    toaster.create({
      type: "error",
      title: "Algo no salió bien",
      description: "No pudimos iniciar tu break 🥺",
      duration: 5000
    })
  } finally {
    setLoading(false);
  }
};

const handlePauseBreak = async () => {
  setLoading(true);
  try {
    // 1. Buscar el break activo del usuario
    const activeBreaks = await databases.listDocuments(
      database,
      breaks_collection,
      [Query.equal("userId", user.$id), Query.equal("isActive", true)]
    );

    if (activeBreaks.documents.length === 0) {
      throw new Error("No hay un break activo para pausar.");
    }

    const activeBreak = activeBreaks.documents[0];
    const activeBreakId = activeBreak.$id;
    const workSessionId = activeBreak.workSessionId;

    // 2. Obtener la sesión de trabajo actual
    const currentWorkSession = await databases.getDocument(
      database,
      work_sessions_collection,
      workSessionId
    )
    const serverTimeIsoString = await fetchTimestamp();
    if (!serverTimeIsoString) throw new Error("No se pudo obtener el timestamp del servidor");
    // 3. Calcular el tiempo transcurrido en minutos (como double)
    const startBreakTime = new Date(activeBreak.startTime)
    const pauseBreakTime = new Date(serverTimeIsoString)
    const elapsedTimeMs = pauseBreakTime.getTime() - startBreakTime.getTime();
    const elapsedTimeMin = Math.round((elapsedTimeMs / 60000) * 100) / 100; // Convertir a double

    // 4. Sumar el tiempo transcurrido al totalBreakTime existente
    const previousBreakTime = currentWorkSession.totalBreakTime || 0;
    const updatedBreakTime = previousBreakTime + elapsedTimeMin;

    // Validar si se superó el límite de break (60 minutos)
    const breakLimitReached = updatedBreakTime >= 60;

    setIsBreakLimitReached(breakLimitReached)

    // 5. Actualizar el estado del break a "pausado"
    await databases.updateDocument(
      database,
      breaks_collection,
      activeBreakId,
      {
        isActive: false,
        endTime: pauseBreakTime.toISOString(),
        breakDuration: elapsedTimeMin
      }
    );

    // 6. Actualizar el estado de la sesión de trabajo y el totalBreakTime
    await databases.updateDocument(
      database,
      work_sessions_collection,
      workSessionId,
      {
        status: "activo",
        totalBreakTime: updatedBreakTime,
        breakLimitReached: breakLimitReached
      }
    );

    toaster.create({
      type: "success",
      title: "¡De vuelta al trabajo!",
      description: "¿En qué nos quedamos? 🤔",
      duration: 5000
    })

    // 7. Actualizar estado local
    setSessionStatus("activo");

  } catch (error) {
    console.error("Error al pausar el break:", error);
    toaster.create({
      type: "error",
      title: "Oh no...",
      description: "No pudimos pausar el break",
      duration: 5000
    })
  } finally {
    setLoading(false);
  }
};

const formatTimeToAMPM = (date: Date) => {
  const formatter = new Intl.DateTimeFormat('es-EC', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // Esto asegura que el formato es AM/PM
  });

  return formatter.format(date);
};

const handleClockOut = async () => {
  setLoading(true);
  // Obtener la ubicación del usuario

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      // const timestamp = new Date().toISOString();
      try {

        const serverTimeIsoString = await fetchTimestamp();
        if (!serverTimeIsoString) throw new Error("No se pudo obtener el timestamp del servidor");

        const workSession = await databases.listDocuments(
          database,
          work_sessions_collection, // Asegúrate de usar el nombre correcto de la colección
          [Query.equal("userId", user.$id), Query.contains("status", ["activo", "en break"])]
        );

        if (workSession.documents.length === 0) {
          throw new Error("No hay una sesión de trabajo activa.");
        }

        const currentWorkSession = workSession.documents[0];
        const currentWorkSessionId = currentWorkSession.$id;

        const startTime = new Date(currentWorkSession.clockIn);
        const clockOutTime = new Date(serverTimeIsoString);


        // 🔹 Cálculo exacto del tiempo trabajado en milisegundos
        const elapsedTimeMs = clockOutTime.getTime() - startTime.getTime();

        const totalBreakTimeMs = (currentWorkSession.totalBreakTime || 0) * 60000;
        const totalBreakTimeMinutes = currentWorkSession.totalBreakTime || 0

        const workedHours = Math.max(0, (elapsedTimeMs - totalBreakTimeMs) / 3600000);
        const totalWorkedHours = Number(workedHours.toFixed(2));

        const wHours = Math.floor(totalWorkedHours);  // Parte entera, horas
        const wMinutes = Math.round((totalWorkedHours - wHours) * 60);  // Los minutos restantes

        // const formattedWorkedTime = `${wHours} hora${wHours !== 1 ? "s" : ""} y ${wMinutes} minuto${wMinutes !== 1 ? "s" : ""}`;
        const formattedWorkedTime = `${wHours} H ${wMinutes} m`;

        // Convertir minutos en horas y minutos
        const bHours = Math.floor(totalBreakTimeMinutes / 60);  // Parte entera, horas
        const bMinutes = Math.round(totalBreakTimeMinutes % 60);  // Los minutos restantes redondeados

        // Formato amigable
        let formattedBreakTime

        if (totalBreakTimeMinutes > 0) {
          formattedBreakTime = bHours > 0
            ? `${bHours} H ${bMinutes} m`
            : `${bMinutes} minuto${bMinutes !== 1 ? "s" : ""}`;
        } else {
          formattedBreakTime = "Ninguno"
        }


        if (sessionStatus === "en break") {
          try {
            await handlePauseBreak();  // Pausar el break
          } catch (error) {
            console.error("Error al pausar el break", error);
          }
        }
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0); // Establece la hora a las 00:00:00 del día de hoy

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const getBreaksFromToday = await databases.listDocuments(
          database,
          breaks_collection, // Asegúrate de usar el nombre correcto de la colección
          [
            Query.equal("userId", user.$id),
            Query.equal("workSessionId", currentWorkSessionId),  // Filtra por el ID de la sesión actual
            Query.greaterThanEqual("startTime", todayStart.toISOString()),  // Filtra los breaks desde el inicio del día de hoy
            Query.lessThanEqual("endTime", todayEnd.toISOString()),  // Filtra los breaks hasta el final del día de hoy
          ]
        );

        const totalBreaksTakenToday = getBreaksFromToday.documents.length

        setCheckIn(formatTimeToAMPM(startTime))
        setTotalWorkedTime(formattedWorkedTime)
        setTotalBreakTime(formattedBreakTime)
        setBreaksTaken(totalBreaksTakenToday)

        setSummaryOpen(true)

        setSessionStatus("inactivo")
        setIsBreakLimitReached(false);
        setOpen(false)

        // Guardar en Appwrite
        await databases.updateDocument(
          database,  // Reemplaza con tu ID de base de datos
          work_sessions_collection, // Reemplaza con tu ID de colección
          currentWorkSessionId,      // Genera un ID único automáticamente
          {
            clockOut: serverTimeIsoString,
            clockOutLocation: [latitude.toString(), longitude.toString()],
            status: "finalizado",
            totalWorkTime: totalWorkedHours,
            breaksTaken: totalBreaksTakenToday,
            updatedAt: serverTimeIsoString,
          }
        );
        // alert("Clock Out registrado correctamente.");
        checkUserStatus()

      } catch (error) {
        console.error("Error al registrar Clock Out:", error);
        toaster.create({
          type: "error",
          title: "¡O-oh!",
          description: "Hubo un error al registrar tu salida.",
          duration: 3000
        })
        // alert("Hubo un error al registrar tu salida.");
      } finally {
        setLoading(false);
      }
    },
    (error) => {
      // alert("No se pudo obtener tu ubicación. Activa el GPS y otorga permisos.");
      toaster.create({
        type: "error",
        title: "¡O-oh!",
        description: "No se pudo obtener tu ubicación. Activa el GPS y otorga permisos.",
        duration: 3000
      })
      setLoading(false);
    }
  );
};


const handleNoteSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!note) {
    toaster.create({
      title: "Error",
      description: "Por favor, escribe una nota.",
      type: "warning",
      duration: 3000
    });
    return;
  }

  const promise = new Promise<void>(async (resolve, reject) => {

    const workSession = await databases.listDocuments(
      database,
      work_sessions_collection,
      [Query.equal("userId", user.$id), Query.contains("status", ["activo", "en break"])]
    )

    const workSessionId = workSession.documents[0].$id
    // Intentar crear el documento en la base de datos
    await databases.createDocument(
      database,
      notes_collection,
      ID.unique(),
      {
        userId: user.$id,
        sessionId: workSessionId,
        createdAt: timestamp,
        noteContent: note
      }
    )
      .then(() => resolve())  // Si la operación fue exitosa
      .catch((error) => reject(error)); // Si hubo un error
  });

  // Usar toaster.promise para mostrar los mensajes según el resultado
  toaster.promise(promise, {
    loading: { title: "Enviando nota...", description: "Por favor, espera" },
    success: {
      title: "Nota enviada",
      description: "Tu nota ha sido enviada correctamente.",
    },
    error: {
      title: "Error",
      description: "Hubo un problema al enviar la nota.",
    },
  });

  // Limpiar el contenido de la nota solo si se envió correctamente
  promise.then(() => setNote("")).catch((error) => console.error(error));
};


return (
  <DashboardLayout>
    <Flex direction="column" h="100%" justifyContent={{ md: "center" }} alignItems={{ md: "center" }}>
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

      <Box
        gap={6}
        direction={{ base: "column", md: "row" }}
        // flex={{base: 1}}
        // bg="blue"
        w={{ base: "100%", lg: "95%" }}
        borderRadius="lg"
        // p="1rem"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Card.Root rounded="3xl" shadow="xl" p={{ base: ".5rem", md: "1rem" }} width={{ base: "95%", md: "500px" }} display="flex" alignItems="center">

          <Card.Body gap="2" alignItems="center" w={{ base: "95%", md: "90%" }}>
            <Card.Title spaceY={5}> Control de Asistencia </Card.Title>
            <VStack>
              <Text fontSize="md" fontWeight="bold" color="gray.500" mt='1rem'>
                Hora actual
              </Text>
              <Text fontSize="xl" alignSelf="center">
                <ClockCard />
              </Text>
            </VStack>
            <Card.Description>
            </Card.Description>
          </Card.Body>
          <Card.Footer justifyContent="center" w={{ base: "95%", md: "90%" }}>
            <VStack w="100%">
              {loading ? (
                <Spinner size="xl" color="blue.500" />
              ) : (
                <>
                  {(sessionStatus === "inactivo" || sessionStatus === "finalizado") && (
                    <Button rounded="xl" size="2xl" w="full" onClick={handleClockIn} bg="blue.600"
                      _hover={{
                        bg: "blue.500}"
                      }}>
                      <FiPlay /> Iniciar Jornada
                    </Button>
                  )}

                  {!isBreakLimitReached && sessionStatus === "activo" && (
                    <Button rounded="xl" size="2xl" w="full" bg="green.500"
                      _hover={{
                        bg: "green.200}"
                      }}
                      onClick={handleStartBreak}>
                      <FiCoffee /> Iniciar Break
                    </Button>
                  )}

                  {!isBreakLimitReached && sessionStatus === "en break" && (
                    <Button rounded="xl" size="2xl" w="full" bg="orange.500"
                      _hover={{
                        bg: "orange.400}"
                      }}
                      onClick={handlePauseBreak}>
                      <FiPause /> Pausar Break
                    </Button>
                  )}

                  {(sessionStatus === "activo" || sessionStatus === "en break") && (
                    <Button rounded="xl" size="2xl" w="full" onClick={() => setOpen(true)} bg="red.600"
                      _hover={{
                        bg: "red.500"
                      }}>
                      <FiLogOut /> Finalizar Jornada
                    </Button>
                  )}
                </>)}

              <Separator size="lg" />

              {
                (sessionStatus === "activo" || sessionStatus === "en break") && (

                  <Collapsible.Root unmountOnExit w="full">
                    <Collapsible.Trigger paddingY="3" w="full">
                      <Button as="span" colorPalette="teal" variant="outline" rounded="lg">
                        Notas <FiFileText />
                      </Button>
                    </Collapsible.Trigger>
                    <Collapsible.Content>
                      <Fieldset.Root size="lg">
                        <Separator></Separator>
                        <Stack mt={4}>
                          <Fieldset.Legend fontWeight="bold">Notas de la sesión</Fieldset.Legend>
                          <Fieldset.HelperText>
                            Proporciona detalles adicionales
                          </Fieldset.HelperText>
                        </Stack>
                        <Fieldset.Content>
                          <Field.Root>
                            <Textarea placeholder="Escribe una nota..." value={note} name="notes" onChange={(e) => setNote(e.target.value)} />
                            <Field.HelperText>Max 500 caracteres.</Field.HelperText>
                          </Field.Root>
                        </Fieldset.Content>
                        <Button type="submit" alignSelf="flex-start" borderRadius={10} onClick={handleNoteSubmit}>
                          Enviar
                        </Button>
                      </Fieldset.Root>
                    </Collapsible.Content>
                  </Collapsible.Root>
                )
              }

            </VStack>
          </Card.Footer>
        </Card.Root>
      </Box>
    </Flex>
    <ValidateEndShift open={open} setOpen={setOpen} onConfirm={handleClockOut} />
    <SummaryWorkDayPopup open={summaryOpen} setOpen={setSummaryOpen} clockInTime={checkIn} workedTime={totalWorkedTime} breakTime={totalBreakTime} breaksTaken={breaksTaken} />
  </DashboardLayout>
);
}