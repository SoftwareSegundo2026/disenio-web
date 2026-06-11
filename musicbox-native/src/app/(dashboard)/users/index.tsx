import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { getAllProtected, getTotalCountProtected, remove, update } from '@/lib/db';
import { t } from '@/lib/i18n';
import { useAuth } from '@/store/auth';
import Pagination from '@/components/ui/Pagination';
import type { ApiUser } from '@/lib/db';
export default function UsersListScreen() {
  const { height } = useWindowDimensions();
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const rowsPerPage = Math.max(3, Math.floor((height - 112) / 52));
  const currentUser = useAuth((s) => s.user);
  const isAdmin = currentUser?.is_admin ?? false;
  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const list = await getAllProtected<ApiUser>('users', p * rowsPerPage, rowsPerPage);
      setUsers(list);
    } catch {}
    setLoading(false);
  }, []);
  const fetchTotal = useCallback(async () => {
    try {
      const total = await getTotalCountProtected('users');
      setTotalCount(total);
    } catch {}
  }, []);
  useEffect(() => { load(page); }, [page]);
  useEffect(() => { fetchTotal(); }, []);
  const handleToggleActive = async (user: ApiUser) => {
    try {
      await update('users', user.user_id!, { disabled: !user.disabled });
      setUsers((prev) =>
        prev.map((u) => (u.user_id === user.user_id ? { ...u, disabled: !u.disabled } : u)),
      );
    } catch {
      Alert.alert(t('confirm.error_title'), t('confirm.error_text', { item: 'user' }));
    }
  };
  const handleDelete = (user: ApiUser) => {
    Alert.alert(
      t('confirm.delete_title', { item: 'User' }),
      t('confirm.delete_text', { name: user.username }),
      [
        { text: t('confirm.cancel'), style: 'cancel' },
        {
          text: t('confirm.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await remove('users', user.user_id!);
              if (users.length === 1 && page > 0) setPage(page - 1);
              else await load(page);
              setTotalCount((c) => c - 1);
            } catch {
              Alert.alert(t('confirm.error_title'), t('confirm.error_text', { item: 'user' }));
            }
          },
        },
      ],
    );
  };
  if (!isAdmin) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{t('auth.admin_title')}</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.subtitle}>{t('page.users_sub')}</Text>
          <Text style={styles.references}>
            ⭐ Admin  👤 Editor  🟢 Active  🔴 Inactive
          </Text>
        </View>
        {isAdmin && (
          <TouchableOpacity style={styles.addButton} onPress={() => router.push('/(dashboard)/users/new')}>
            <Text style={styles.addButtonText}>➕</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.card}>
        {loading ? (
          <ActivityIndicator size="large" color="#00d4ff" style={{ padding: 40 }} />
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => String(item.user_id)}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>{t('page.empty_users')}</Text>
              </View>
            }
            renderItem={({ item }) => {
              const isSelf = item.user_id === currentUser?.user_id;
              return (
                <View style={styles.row}>
                  <View style={styles.userInfo}>
                    <Text style={styles.username}>{item.username}</Text>
                    <Text style={styles.email}>{item.email || '—'}</Text>
                    <Text style={styles.name}>{item.full_name || '—'}</Text>
                  </View>
                  <View style={styles.badges}>
                    {item.is_admin ? <Text style={styles.adminIcon}>⭐</Text> : <Text style={styles.editorIcon}>👤</Text>}
                    <Text style={!item.disabled ? styles.activeIcon : styles.inactiveIcon}>
                      {!item.disabled ? '🟢' : '🔴'}
                    </Text>
                  </View>
                  <View style={styles.actionsCell}>
                    <TouchableOpacity onPress={() => router.push(`/(dashboard)/users/${item.user_id}/edit`)}>
                      <Text style={styles.actionIcon}>✏️</Text>
                    </TouchableOpacity>
                    {!isSelf && (
                      <>
                        <TouchableOpacity onPress={() => handleToggleActive(item)}>
                          <Text style={styles.actionIcon}>{item.disabled ? '✅' : '⛔'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDelete(item)}>
                          <Text style={styles.actionIcon}>🗑</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              );
            }}
          />
        )}
        <Pagination page={page} totalCount={totalCount} rowsPerPage={rowsPerPage} onPageChange={setPage} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 12, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 9, color: '#888', marginTop: 2 },
  references: { fontSize: 8, color: '#555', marginTop: 4 },
  addButton: { borderRadius: 8, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  addButtonText: { color: '#000', fontWeight: 'bold', fontSize: 18 },
  card: { flex: 1, borderRadius: 12, borderWidth: 1, borderColor: '#1a1a2e', overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a4a',
  },
  userInfo: { flex: 1 },
  username: { fontSize: 8, color: '#fff', fontWeight: '500' },
  email: { fontSize: 9, color: '#888', marginTop: 2 },
  name: { fontSize: 9, color: '#666', marginTop: 1 },
  badges: { marginHorizontal: 8, gap: 4, alignItems: 'center', flexDirection: 'row' },
  adminIcon: { fontSize: 14 },
  editorIcon: { fontSize: 14, opacity: 0.5 },
  activeIcon: { fontSize: 10 },
  inactiveIcon: { fontSize: 10 },
  actionsCell: { flexDirection: 'row', gap: 8 },
  actionIcon: { fontSize: 14 },
  emptyState: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#888', textAlign: 'center' },
  errorText: { color: '#ff4444', fontSize: 9, textAlign: 'center', marginTop: 40 },
});
