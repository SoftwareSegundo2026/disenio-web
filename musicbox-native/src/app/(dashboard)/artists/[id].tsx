import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { getAll, getById, remove, getImageUrl } from '@/lib/db';
import { t } from '@/lib/i18n';
import { useAuth } from '@/store/auth';
import type { ApiArtist, ApiAlbum } from '@/lib/db';
export default function ArtistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [artist, setArtist] = useState<ApiArtist | null>(null);
  const [albums, setAlbums] = useState<ApiAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = useAuth((s) => s.user?.is_admin ?? false);
  const load = async () => {
    setLoading(true);
    try {
      const a = await getById<ApiArtist>('artists', parseInt(id));
      setArtist(a);
      const all = await getAll<ApiAlbum>('albums');
      setAlbums(all.filter((al) => al.ArtistId === a.ArtistId));
    } catch {}
    setLoading(false);
  };
  useEffect(() => { load(); }, [id]);
  const handleDelete = () => {
    Alert.alert(
      t('confirm.delete_title', { item: 'Artist' }),
      t('confirm.delete_text', { name: artist?.Name || '' }),
      [
        { text: t('confirm.cancel'), style: 'cancel' },
        {
          text: t('confirm.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await remove('artists', parseInt(id));
              router.back();
            } catch {
              Alert.alert(t('confirm.error_title'), t('confirm.error_text', { item: 'artist' }));
            }
          },
        },
      ],
    );
  };
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00d4ff" />
      </View>
    );
  }
  if (!artist) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{t('loading')}</Text>
      </View>
    );
  }
  const imageUrl = getImageUrl(artist.ImageUrl);
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        {imageUrl && (
          <View style={styles.imageContainer}>
            <Text style={styles.imagePlaceholder}>🎤</Text>
          </View>
        )}
        <Text style={styles.name}>{artist.Name}</Text>
        <Text style={styles.idText}>{t('track.id', { id: artist.ArtistId })}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t('artist.albums', { count: albums.length })}</Text>
        {albums.length === 0 ? (
          <Text style={styles.emptyText}>{t('artist.no_albums')}</Text>
        ) : (
          albums.map((al) => (
            <TouchableOpacity key={al.AlbumId} style={styles.row} onPress={() => router.push(`/(dashboard)/albums/${al.AlbumId}`)}>
              <Text style={styles.rowTitle}>{al.Title}</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))
        )}
        {isAdmin && (
          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push(`/(dashboard)/albums/new`)}>
            <Text style={styles.secondaryButtonText}>{t('artist.create_album')}</Text>
          </TouchableOpacity>
        )}
      </View>
      {isAdmin && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.editButton} onPress={() => router.push(`/(dashboard)/artists/${id}/edit`)}>
            <Text style={styles.editButtonText}>{t('list.edit')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>{t('list.delete')}</Text>
          </TouchableOpacity>
        </View>
      )}
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
  name: { fontSize: 12, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  idText: { fontSize: 9, color: '#00d4ff', textAlign: 'center', marginTop: 4, opacity: 0.7 },
  sectionTitle: { fontSize: 9, fontWeight: 'bold', color: '#fff', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#2a2a4a' },
  rowTitle: { fontSize: 8, color: '#fff' },
  chevron: { fontSize: 11, color: '#888' },
  emptyText: { color: '#888', textAlign: 'center', paddingVertical: 20 },
  secondaryButton: { marginTop: 12, backgroundColor: '#2a2a4a', borderRadius: 10, padding: 14, alignItems: 'center' },
  secondaryButtonText: { color: '#00d4ff', fontWeight: '600', fontSize: 10 },
  actions: { flexDirection: 'row', gap: 12 },
  editButton: { flex: 1, borderWidth: 1, borderColor: '#00d4ff', borderRadius: 10, padding: 14, alignItems: 'center' },
  editButtonText: { color: '#000', fontWeight: 'bold', fontSize: 11 },
  deleteButton: { flex: 1, backgroundColor: '#ff4444', borderRadius: 10, padding: 14, alignItems: 'center' },
  deleteButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 11 },
  errorText: { color: '#888', fontSize: 12 },
});
