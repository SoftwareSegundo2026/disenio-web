import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { getById } from '@/lib/db';
import { t } from '@/lib/i18n';
import type { ApiTrack } from '@/lib/db';
import DeezerPlayer from '@/components/DeezerPlayer';
function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
function formatBytes(bytes: number | null): string {
  if (!bytes) return '—';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}
export default function TrackDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [track, setTrack] = useState<ApiTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    try {
      const t = await getById<ApiTrack>('tracks', parseInt(id));
      setTrack(t);
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
  if (!track) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{t('loading')}</Text>
      </View>
    );
  }
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.name}>{track.Name}</Text>
        <Text style={styles.idText}>{t('track.id', { id: track.TrackId })}</Text>
        {track.Composer && (
          <Text style={styles.composer}>{t('track.composer')}{track.Composer}</Text>
        )}
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t('track.album_context')}</Text>
        {track.AlbumTitle ? (
          <TouchableOpacity onPress={() => router.push('/(dashboard)/albums/' + track.AlbumId)}>
            <Text style={styles.linkText}>{track.AlbumTitle}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.mutedText}>{t('track.no_album')}</Text>
        )}
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t('track.genre_classification')}</Text>
        {track.GenreName ? (
          <TouchableOpacity onPress={() => router.push(`/(dashboard)/genres/${track.GenreId}`)}>
            <Text style={styles.linkText}>{track.GenreName}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.mutedText}>{t('track.no_genre')}</Text>
        )}
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t('track.technical_specs')}</Text>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>{t('track.duration')}</Text>
          <Text style={styles.specValue}>{formatDuration(track.Milliseconds)}</Text>
        </View>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>{t('track.file_size')}</Text>
          <Text style={styles.specValue}>{formatBytes(track.Bytes)}</Text>
        </View>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>{t('track.price')}</Text>
          <Text style={styles.specValue}>${track.UnitPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>{t('track.format')}</Text>
          <Text style={styles.specValue}>{track.MediaTypeName || t('track.mpeg')}</Text>
        </View>
      </View>
      <DeezerPlayer trackName={track.Name} />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  center: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  card: { borderRadius: 12, borderWidth: 1, borderColor: '#1a1a2e', padding: 16 },
  name: { fontSize: 12, fontWeight: 'bold', color: '#fff' },
  idText: { fontSize: 9, color: '#00d4ff', marginTop: 4, opacity: 0.7 },
  composer: { fontSize: 8, color: '#888', marginTop: 8 },
  sectionTitle: { fontSize: 9, fontWeight: 'bold', color: '#fff', marginBottom: 12 },
  linkText: { fontSize: 8, color: '#00d4ff' },
  mutedText: { fontSize: 8, color: '#888' },
  specRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#2a2a4a' },
  specLabel: { fontSize: 8, color: '#888' },
  specValue: { fontSize: 8, color: '#fff', fontWeight: '500' },
  deezerButton: { borderRadius: 12, borderWidth: 1, borderColor: '#1a1a2e', padding: 16, alignItems: 'center' },
  deezerButtonText: { color: '#00d4ff', fontSize: 8, fontWeight: 'bold' },
  errorText: { color: '#888', fontSize: 12 },
});
