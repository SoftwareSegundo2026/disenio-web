import { Stack } from "expo-router";
export default function AlbumsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#000" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Álbumes" }} />
      <Stack.Screen
        name="new"
        options={{ title: "Nuevo Álbum", presentation: "modal" }}
      />
      <Stack.Screen name="[id]" options={{ title: "Álbum" }} />
      <Stack.Screen
        name="[id]/edit"
        options={{ title: "Editar Álbum", presentation: "modal" }}
      />
    </Stack>
  );
}
