import { Stack } from "expo-router";
export default function ArtistsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#000" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Artistas" }} />
      <Stack.Screen
        name="new"
        options={{ title: "Nuevo Artista", presentation: "modal" }}
      />
      <Stack.Screen name="[id]" options={{ title: "Artista" }} />
      <Stack.Screen
        name="[id]/edit"
        options={{ title: "Editar Artista", presentation: "modal" }}
      />
    </Stack>
  );
}
