import { Stack } from "expo-router";
export default function UsersLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#000" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Usuarios" }} />
      <Stack.Screen
        name="new"
        options={{ title: "Nuevo Usuario", presentation: "modal" }}
      />
      <Stack.Screen
        name="[id]/edit"
        options={{ title: "Editar Usuario", presentation: "modal" }}
      />
    </Stack>
  );
}
