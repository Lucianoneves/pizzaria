import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

function RootNavigation() {
  const { loading, signed } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    }

    const inAuthGroup = segments[0] === "(authenticated)";
    const onLogin = segments[0] === "login";

    if (!signed) {
      if (!onLogin) {
        router.replace("/login");
      }
      return;
    }

    if (!inAuthGroup) {
      router.replace("/(authenticated)/dashboard");
    }
  }, [loading, signed, segments, router]);

  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="login">
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="(authenticated)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <RootNavigation />
    </AuthProvider>
  );
}
