import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { getAll, getTotalCount, remove } from '@/lib/db';
import { t } from '@/lib/i18n';
import { useAuth } from '@/store/auth';
import Pagination from '@/components/ui/Pagination';
import type { ApiTrack } from '@/lib/db';
function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
export default function TracksListScreen() {
  const { height } = useWindowDimensions();
  const [tracks, setTracks] = useState<ApiTrack[]>([]);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const rowsPerPage = Math.max(3, Math.floor((height - 112) / 32));
  const isAdmin = useAuth((s) => s.user?.is_admin ?? false);
  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const list = await getAll<ApiTrack>('tracks', p * rowsPerPage, rowsPerPage);
      setTracks(list);
    } catch {}
    setLoading(false);
  }, []);
  const fetchTotal = useCallback(async () => {
    try {
      const total = await getTotalCount('tracks');
      setTotalCount(total);
    } catch {}
  }, []);
  useEffect(() => { load(page); }, [page]);
  useEffect(() => { fetchTotal(); }, []);
  const handleDelete = (track: ApiTrack) => {
    Alert.alert(
      t('confirm.delete_title', { item: 'Track' }),
      t('confirm.delete_text', { name: track.Name }),
      [
        { text: t('confirm.cancel'), style: 'cancel' },
        {
          text: t('confirm.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await remove('tracks', track.TrackId);
              if (tracks.length === 1 && page > 0) setPage(page - 1);
              else await load(page);
              setTotalCount((c) => c - 1);
            } catch {
              Alert.alert(t('confirm.error_title'), t('confirm.error_text', { item: 'track' }));
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
          <Text style={styles.subtitle}>{t('page.tracks_sub')}</Text>
        </View>
        {isAdmin && (
          <TouchableOpacity style={styles.addButton} onPress={() => router.push('/(dashboard)/tracks/new')}>
            <Text style={styles.addButtonText}>➕</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.card}>
        {loading ? (
          <ActivityIndicator size="large" color="#00d4ff" style={{ padding: 40 }} />
        ) : (
          <FlatList
            data={tracks}
            keyExtractor={(item) => String(item.TrackId)}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>{t('page.empty_tracks')}</Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.row}>
                <View style={styles.rowContent}>
                  <View style={styles.rowTop}>
                    <Text style={styles.trackId}>#{item.TrackId}</Text>
                    <Text style={styles.trackName} numberOfLines={1}>{item.Name}</Text>
                  </View>
                  <Text style={styles.trackMeta} numberOfLines={1}>
                    {item.AlbumTitle} · {item.GenreName} · {formatDuration(item.Milliseconds)} · ${item.UnitPrice.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.actionsCell}>
                  <TouchableOpacity onPress={() => router.push(`/(dashboard)/tracks/${item.TrackId}`)}>
                    <Text style={styles.actionIcon}>👁</Text>
                  </TouchableOpacity>
                  {isAdmin && (
                    <>
                      <TouchableOpacity onPress={() => router.push(`/(dashboard)/tracks/${item.TrackId}/edit`)}>
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
  rowContent: { flex: 1, marginRight: 8 },
  rowTop: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  trackId: { fontSize: 8, color: '#00d4ff', opacity: 0.7, width: 28 },
  trackName: { flex: 1, fontSize: 9, color: '#fff', fontWeight: '500' },
  trackMeta: { fontSize: 8, color: '#666', marginTop: 2 },
  actionsCell: { flexDirection: 'row', gap: 6 },
  actionIcon: { fontSize: 12 },
  emptyState: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#888', textAlign: 'center' },
});
