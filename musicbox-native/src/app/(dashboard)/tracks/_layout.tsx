import { Stack } from "expo-router";
export default function TracksLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#000" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Pistas" }} />
      <Stack.Screen
        name="new"
        options={{ title: "Nueva Pista", presentation: "modal" }}
      />
      <Stack.Screen name="[id]" options={{ title: "Pista" }} />
      <Stack.Screen
        name="[id]/edit"
        options={{ title: "Editar Pista", presentation: "modal" }}
      />
    </Stack>
  );
}
