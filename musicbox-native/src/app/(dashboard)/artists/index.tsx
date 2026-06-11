import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { getAll, getTotalCount, remove } from '@/lib/db';
import { t } from '@/lib/i18n';
import { useAuth } from '@/store/auth';
import Pagination from '@/components/ui/Pagination';
import type { ApiArtist } from '@/lib/db';
export default function ArtistsListScreen() {
  const { height } = useWindowDimensions();
  const [artists, setArtists] = useState<ApiArtist[]>([]);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const rowsPerPage = Math.max(3, Math.floor((height - 112) / 32));
  const isAdmin = useAuth((s) => s.user?.is_admin ?? false);
  const loadArtists = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const list = await getAll<ApiArtist>('artists', p * rowsPerPage, rowsPerPage);
      setArtists(list);
    } catch {}
    setLoading(false);
  }, []);
  const fetchTotal = useCallback(async () => {
    try {
      const total = await getTotalCount('artists');
      setTotalCount(total);
    } catch {}
  }, []);
  useEffect(() => { loadArtists(page); }, [page]);
  useEffect(() => { fetchTotal(); }, []);
  const handleDelete = (artist: ApiArtist) => {
    Alert.alert(
      t('confirm.delete_title', { item: 'Artist' }),
      t('confirm.delete_text', { name: artist.Name }),
      [
        { text: t('confirm.cancel'), style: 'cancel' },
        {
          text: t('confirm.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await remove('artists', artist.ArtistId);
              if (artists.length === 1 && page > 0) setPage(page - 1);
              else await loadArtists(page);
              setTotalCount((c) => c - 1);
            } catch {
              Alert.alert(t('confirm.error_title'), t('confirm.error_text', { item: 'artist' }));
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
          <Text style={styles.subtitle}>{t('page.artists_sub')}</Text>
        </View>
        {isAdmin && (
          <TouchableOpacity style={styles.addButton} onPress={() => router.push('/(dashboard)/artists/new')}>
            <Text style={styles.addButtonText}>➕</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.card}>
        {loading ? (
          <ActivityIndicator size="large" color="#00d4ff" style={{ padding: 40 }} />
        ) : (
          <FlatList
            data={artists}
            keyExtractor={(item) => String(item.ArtistId)}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>{t('page.empty_artists')}</Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text style={styles.idCell}>#{item.ArtistId}</Text>
                <Text style={styles.nameCell} numberOfLines={1}>{item.Name}</Text>
                <View style={styles.actionsCell}>
                  <TouchableOpacity onPress={() => router.push(`/(dashboard)/artists/${item.ArtistId}`)}>
                    <Text style={styles.actionIcon}>👁</Text>
                  </TouchableOpacity>
                  {isAdmin && (
                    <>
                      <TouchableOpacity onPress={() => router.push(`/(dashboard)/artists/${item.ArtistId}/edit`)}>
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
