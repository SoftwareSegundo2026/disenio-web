import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { getAll, getTotalCount, remove } from '@/lib/db';
import { t } from '@/lib/i18n';
import { useAuth } from '@/store/auth';
import Pagination from '@/components/ui/Pagination';
import type { ApiGenre } from '@/lib/db';
export default function GenresListScreen() {
  const { height } = useWindowDimensions();
  const [genres, setGenres] = useState<ApiGenre[]>([]);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const rowsPerPage = Math.max(3, Math.floor((height - 112) / 32));
  const isAdmin = useAuth((s) => s.user?.is_admin ?? false);
  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const list = await getAll<ApiGenre>('genres', p * rowsPerPage, rowsPerPage);
      setGenres(list);
    } catch {}
    setLoading(false);
  }, []);
  const fetchTotal = useCallback(async () => {
    try {
      const total = await getTotalCount('genres');
      setTotalCount(total);
    } catch {}
  }, []);
  useEffect(() => { load(page); }, [page]);
  useEffect(() => { fetchTotal(); }, []);
  const handleDelete = (genre: ApiGenre) => {
    Alert.alert(
      t('confirm.delete_title', { item: 'Genre' }),
      t('confirm.delete_text', { name: genre.Name }),
      [
        { text: t('confirm.cancel'), style: 'cancel' },
        {
          text: t('confirm.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await remove('genres', genre.GenreId);
              if (genres.length === 1 && page > 0) setPage(page - 1);
              else await load(page);
              setTotalCount((c) => c - 1);
            } catch {
              Alert.alert(t('confirm.error_title'), t('confirm.error_text', { item: 'genre' }));
            }
          },
        },
      ],
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.subtitle}>{t('page.genres_sub')}</Text>
        </View>
        {isAdmin && (
          <TouchableOpacity style={styles.addButton} onPress={() => router.push('/(dashboard)/genres/new')}>
            <Text style={styles.addButtonText}>➕</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.card}>
        {loading ? (
          <ActivityIndicator size="large" color="#00d4ff" style={{ padding: 40 }} />
        ) : (
          <FlatList
            data={genres}
            keyExtractor={(item) => String(item.GenreId)}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>{t('page.empty_genres')}</Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text style={styles.idCell}>#{item.GenreId}</Text>
                <Text style={styles.nameCell} numberOfLines={1}>{item.Name}</Text>
                <View style={styles.actionsCell}>
                  <TouchableOpacity onPress={() => router.push(`/(dashboard)/genres/${item.GenreId}`)}>
                    <Text style={styles.actionIcon}>👁</Text>
                  </TouchableOpacity>
                  {isAdmin && (
                    <>
                      <TouchableOpacity onPress={() => router.push(`/(dashboard)/genres/${item.GenreId}/edit`)}>
                        <Text style={styles.actionIcon}>✏️</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDelete(item)}>
                        <Text style={styles.actionIcon}>🗑</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            )}
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
  addButton: { borderRadius: 8, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  addButtonText: { color: '#000', fontWeight: 'bold', fontSize: 18 },
  card: { flex: 1, borderRadius: 12, borderWidth: 1, borderColor: '#1a1a2e', overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a4a',
  },
  idCell: { width: 28, fontSize: 8, color: '#00d4ff', opacity: 0.7 },
  nameCell: { flex: 1, fontSize: 9, color: '#fff', fontWeight: '500' },
  actionsCell: { flexDirection: 'row', gap: 6 },
  actionIcon: { fontSize: 12 },
  emptyState: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#888', textAlign: 'center' },
});
