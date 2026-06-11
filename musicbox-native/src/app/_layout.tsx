import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "@/store/auth";
export default function RootLayout() {
  const loadStoredAuth = useAuth((s) => s.loadStoredAuth);
  useEffect(() => {
    loadStoredAuth();
  }, [loadStoredAuth]);
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(dashboard)" />
      </Stack>
    </>
  );
}
