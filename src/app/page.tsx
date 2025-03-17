"use client"
import { Box, Button, Image, VStack, Flex, Text, Separator, HStack, For } from "@chakra-ui/react";
import { CgMicrosoft } from "react-icons/cg";
import { keyframes } from "@emotion/react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import FullScreenLoader from "@/components/FullScreenLoader";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export default function Login() {

  const [isValidating, setIsValidating] = useState(true)
  const { login, user, loading } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard"); // O la ruta que desees
    } else {
      setIsValidating(false)
    }
  }, [user, router]);

  if (loading || isValidating) {
    return (
      <FullScreenLoader />
    )
  }

  if (user) {
    return (
      <FullScreenLoader />
    )
  }

  return (

    // <Flex
    //   justify="center"
    //   align="center"
    //   h="100vh"
    //   w="100vw"
    //   bg="green"
    // >
    <Flex
      p={{ md: "3rem", base: "1rem" }}
      w="full"
      h="100vh"
      direction={{ base: "column", md: "row" }}
      // gap={6}
      css={{ animation: `${fadeInUp} 0.6s ease-out` }}
      bg={{ md: "white" }}
    >
      {/* Left Image Section */}
      <Box
        display={{ base: "none", md: "block" }}
        flex={1}
        css={{ animation: `${fadeInUp} 0.8s ease-out` }}
      >
        <DotLottieReact
          src="https://lottie.host/e53e5e73-0fc2-457c-b84b-a3e6059fa465/881ebl5zGg.lottie"
          autoplay
          loop
        />

      </Box>
      {/* Right Form Section */}
      <Box
        flex={2}
        css={{ animation: `${fadeInUp} 1s ease-out` }}
        h="full"
        display="flex"
        justifyContent="center"
        alignItems="center"
        rounded="lg"
        bg={{ base: "white", md: "transparent" }}
        // bgGradient="linear-gradient(45 deg, white, #dbeafe,rgb(0, 106, 255))"
        // backgroundSize="cover"
      // p={{base: 0}}
      >
        <VStack bg={{ base: "transparent", md: "white" }} shadow={{ md: "xl" }} w={{ base: "100%", lg: "70%" }} p={{ lg: "3rem", base: "2rem" }} borderRadius={20} >

          <VStack justifyContent="center">
            <Image src="/logo-full.svg" w="40%" />
            <Box display={{ base: "block", md: "none" }} my={5}>

              <DotLottieReact
                src="https://lottie.host/e53e5e73-0fc2-457c-b84b-a3e6059fa465/881ebl5zGg.lottie"
                autoplay
                loop
              />

            </Box>
            <Text
              // bg="red"
              fontSize={{ base: "1.5rem", md: "2rem" }}
              // textAlign="left"
              color="gray.800"
              fontWeight="bolder"
              // mb={{ md: "20px"}}
              fontFamily="'Funnel Display', sans-serif"
            // className={funnelDisplay.className}
            // lineHeight="1"
            // marginBottom="50px"
            >
              WorkSphere Platform
            </Text>
            <Text color="gray.800">
              Trabajo eficiente, gestión inteligente
            </Text>
          </VStack>

          <Button
            w="full"
            bg="black"
            color="white"
            borderRadius="xl"
            mt="50px"
            py={7}
            size="xl"
            _hover={{ transform: "scale(1.05)" }}
            css={{ transition: "transform 0.2s ease-in-out" }}
            onClick={() => login()}
          >
            <CgMicrosoft /> Iniciar con Microsoft
          </Button>
        </VStack>
      </Box>
    </Flex>
    // </Flex>
  );
}
