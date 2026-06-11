import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { getAll, getById } from '@/lib/db';
import { t } from '@/lib/i18n';
import { useAuth } from '@/store/auth';
import type { ApiGenre, ApiTrack } from '@/lib/db';
function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
export default function GenreDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [genre, setGenre] = useState<ApiGenre | null>(null);
  const [tracks, setTracks] = useState<ApiTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    try {
      const g = await getById<ApiGenre>('genres', parseInt(id));
      setGenre(g);
      const all = await getAll<ApiTrack>('tracks');
      setTracks(all.filter((t) => t.GenreId === g.GenreId));
    } catch {}
    setLoading(false);
  };
  useEffect(() => { load(); }, [id]);
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00d4ff" />
      </View>
    );
  }
  if (!genre) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{t('loading')}</Text>
      </View>
    );
  }
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.name}>{genre.Name}</Text>
        <Text style={styles.idText}>{t('track.id', { id: genre.GenreId })}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t('genre.tracks', { name: genre.Name, count: tracks.length })}</Text>
        {tracks.length === 0 ? (
          <Text style={styles.emptyText}>{t('genre.no_tracks')}</Text>
        ) : (
          tracks.map((track) => (
            <TouchableOpacity key={track.TrackId} style={styles.row} onPress={() => router.push(`/(dashboard)/tracks/${track.TrackId}`)}>
              <View style={styles.trackInfo}>
                <Text style={styles.trackName}>{track.Name}</Text>
                <Text style={styles.trackMeta}>
                  {track.AlbumTitle || t('track.no_album')} · {formatDuration(track.Milliseconds)}
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  center: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  card: { borderRadius: 12, borderWidth: 1, borderColor: '#1a1a2e', padding: 16 },
  name: { fontSize: 12, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  idText: { fontSize: 9, color: '#00d4ff', textAlign: 'center', marginTop: 4, opacity: 0.7 },
  sectionTitle: { fontSize: 9, fontWeight: 'bold', color: '#fff', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#2a2a4a' },
  trackInfo: { flex: 1 },
  trackName: { fontSize: 8, color: '#fff' },
  trackMeta: { fontSize: 9, color: '#888', marginTop: 2 },
  chevron: { fontSize: 11, color: '#888' },
  emptyText: { color: '#888', textAlign: 'center', paddingVertical: 20 },
  errorText: { color: '#888', fontSize: 12 },
});
