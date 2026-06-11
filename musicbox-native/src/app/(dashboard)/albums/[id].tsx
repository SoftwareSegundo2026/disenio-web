import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { getAll, getById, getImageUrl } from '@/lib/db';
import { t } from '@/lib/i18n';
import { useAuth } from '@/store/auth';
import type { ApiAlbum, ApiTrack } from '@/lib/db';
export default function AlbumDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [album, setAlbum] = useState<ApiAlbum | null>(null);
  const [tracks, setTracks] = useState<ApiTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    try {
      const a = await getById<ApiAlbum>('albums', parseInt(id));
      setAlbum(a);
      const all = await getAll<ApiTrack>('tracks');
      setTracks(all.filter((t) => t.AlbumId === a.AlbumId));
    } catch {}
    setLoading(false);
  };
  useEffect(() => { load(); }, [id]);
  const formatDuration = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00d4ff" />
      </View>
    );
  }
  if (!album) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{t('loading')}</Text>
      </View>
    );
  }
  const imageUrl = getImageUrl(album.ImageUrl);
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        {imageUrl && <View style={styles.imageContainer}><Text style={styles.imagePlaceholder}>💿</Text></View>}
        <Text style={styles.title}>{album.Title}</Text>
        <Text style={styles.artistText}>{t('album.artist')}{album.ArtistName}</Text>
        <Text style={styles.idText}>{t('track.id', { id: album.AlbumId })}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t('album.tracks', { count: tracks.length })}</Text>
        {tracks.length === 0 ? (
          <Text style={styles.emptyText}>{t('album.no_tracks')}</Text>
        ) : (
          tracks.map((t, i) => (
            <TouchableOpacity key={t.TrackId} style={styles.row} onPress={() => router.push(`/(dashboard)/tracks/${t.TrackId}`)}>
              <Text style={styles.trackNum}>{i + 1}</Text>
              <View style={styles.trackInfo}>
                <Text style={styles.trackName}>{t.Name}</Text>
                <Text style={styles.trackDuration}>{formatDuration(t.Milliseconds)}</Text>
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
  imageContainer: { alignItems: 'center', marginBottom: 12 },
  imagePlaceholder: { fontSize: 48 },
  title: { fontSize: 12, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  artistText: { fontSize: 8, color: '#888', textAlign: 'center', marginTop: 4 },
  idText: { fontSize: 9, color: '#00d4ff', textAlign: 'center', marginTop: 4, opacity: 0.7 },
  sectionTitle: { fontSize: 9, fontWeight: 'bold', color: '#fff', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#2a2a4a' },
  trackNum: { width: 28, fontSize: 9, color: '#888', fontWeight: '600' },
  trackInfo: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  trackName: { fontSize: 8, color: '#fff' },
  trackDuration: { fontSize: 9, color: '#888' },
  chevron: { fontSize: 11, color: '#888', marginLeft: 8 },
  emptyText: { color: '#888', textAlign: 'center', paddingVertical: 20 },
  errorText: { color: '#888', fontSize: 12 },
});
