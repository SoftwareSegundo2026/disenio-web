import { useEffect, useState } from 'react';
import { Tabs, router } from 'expo-router';
import { Text, View, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '@/store/auth';
import ChangePasswordModal from '@/components/ChangePasswordModal';
import ProfileEditModal from '@/components/ProfileEditModal';
import { logout } from '@/lib/db';
function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    index: '📊',
    artists: '🎤',
    albums: '💿',
    genres: '🎵',
    tracks: '🎶',
    users: '👥',
  };
  return (
    <View style={[styles.tabIcon, focused && styles.tabIconFocused]}>
      <Text style={[styles.tabIconText, focused && styles.tabIconTextFocused]}>
        {icons[name] || '📋'}
      </Text>
    </View>
  );
}
function HeaderRight() {
  const { user } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir',
        style: 'destructive',
        onPress: async () => {
          logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };
  return (
    <View style={styles.headerRight}>
      {menuOpen && (
        <View style={styles.menuDropdown}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => { setShowProfile(true); setMenuOpen(false); }}
          >
            <Text style={styles.menuItemText}>👤 Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => { setShowPassword(true); setMenuOpen(false); }}
          >
            <Text style={styles.menuItemText}>🔑 Cambiar Contraseña</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Text style={[styles.menuItemText, { color: '#ff4444' }]}>🚪 Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)} style={styles.userButton}>
        <Text style={styles.userButtonText}>{user?.full_name?.[0] || '👤'}</Text>
      </TouchableOpacity>
      {showProfile && user && (
        <ProfileEditModal
          userId={user.user_id as number}
          fullName={user.full_name || ''}
          email={user.email || ''}
          onClose={() => setShowProfile(false)}
          onSave={() => setShowProfile(false)}
        />
      )}
      {showPassword && (
        <ChangePasswordModal onClose={() => setShowPassword(false)} />
      )}
    </View>
  );
}
export default function DashboardLayout() {
  const { token, isLoading, user } = useAuth();
  useEffect(() => {
    if (!isLoading && !token) {
      router.replace('/(auth)/login');
    }
  }, [isLoading, token]);
  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#00d4ff" />
      </View>
    );
  }
  if (!token) return null;
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#12121e' },
        headerTintColor: '#fff',
        headerRight: () => <HeaderRight />,
        tabBarStyle: { backgroundColor: '#0d0d1a', borderTopColor: '#2a2a4a', borderTopWidth: 1 },
        tabBarActiveTintColor: '#00d4ff',
        tabBarInactiveTintColor: '#666',
        tabBarLabelStyle: { fontSize: 8, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused }) => <TabIcon name="index" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="artists"
        options={{
          title: 'Artistas',
          tabBarIcon: ({ focused }) => <TabIcon name="artists" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="albums"
        options={{
          title: 'Álbumes',
          tabBarIcon: ({ focused }) => <TabIcon name="albums" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="genres"
        options={{
          title: 'Géneros',
          tabBarIcon: ({ focused }) => <TabIcon name="genres" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="tracks"
        options={{
          title: 'Pistas',
          tabBarIcon: ({ focused }) => <TabIcon name="tracks" focused={focused} />,
        }}
      />
      {user?.is_admin && (
        <Tabs.Screen
          name="users"
          options={{
            title: 'Usuarios',
            tabBarIcon: ({ focused }) => <TabIcon name="users" focused={focused} />,
          }}
        />
      )}
    </Tabs>
  );
}
const styles = StyleSheet.create({
  tabIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIconFocused: {
    backgroundColor: 'rgba(0, 212, 255, 0.15)',
  },
  tabIconText: {
    fontSize: 12
  },
  tabIconTextFocused: {
    fontSize: 14
  },
  loading: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRight: {
    position: 'relative',
    marginRight: 16,
  },
  userButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00d4ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 10
  },
  menuDropdown: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2a2a4a',
    padding: 4,
    zIndex: 100,
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  menuItemText: {
    color: '#fff',
    fontSize: 10
  },
});
