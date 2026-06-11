import { Stack } from "expo-router";
export default function GenresLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#000" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Géneros" }} />
      <Stack.Screen
        name="new"
        options={{ title: "Nuevo Género", presentation: "modal" }}
      />
      <Stack.Screen name="[id]" options={{ title: "Género" }} />
      <Stack.Screen
        name="[id]/edit"
        options={{ title: "Editar Género", presentation: "modal" }}
      />
    </Stack>
  );
}
