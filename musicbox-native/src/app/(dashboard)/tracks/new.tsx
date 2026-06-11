import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator, Modal, FlatList } from 'react-native';
import { router } from 'expo-router';
import { getAll, create } from '@/lib/db';
import { t } from '@/lib/i18n';
import { useAuth } from '@/store/auth';
import type { ApiAlbum, ApiGenre } from '@/lib/db';
export default function NewTrackScreen() {
  const [name, setName] = useState('');
  const [composer, setComposer] = useState('');
  const [albumId, setAlbumId] = useState<number | null>(null);
  const [genreId, setGenreId] = useState<number | null>(null);
  const [duration, setDuration] = useState('');
  const [size, setSize] = useState('');
  const [price, setPrice] = useState('0.99');
  const [albums, setAlbums] = useState<ApiAlbum[]>([]);
  const [genres, setGenres] = useState<ApiGenre[]>([]);
  const [albumPickerOpen, setAlbumPickerOpen] = useState(false);
  const [genrePickerOpen, setGenrePickerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const [a, g] = await Promise.all([
          getAll<ApiAlbum>('albums'),
          getAll<ApiGenre>('genres'),
        ]);
        setAlbums(a);
        setGenres(g);
      } catch {}
    })();
  }, []);
  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert(t('tracks.new.name_required'));
      return;
    }
    let milliseconds = 0;
    if (duration.trim()) {
      const parts = duration.trim().split(':');
      if (parts.length === 2) {
        const mins = parseInt(parts[0], 10);
        const secs = parseInt(parts[1], 10);
        if (isNaN(mins) || isNaN(secs) || secs < 0 || secs > 59) {
          Alert.alert(t('tracks.new.invalid_duration'));
          return;
        }
        milliseconds = (mins * 60 + secs) * 1000;
      } else {
        Alert.alert(t('tracks.new.invalid_duration'));
        return;
      }
    }
    let bytes = 0;
    if (size.trim()) {
      const mb = parseFloat(size.trim());
      if (isNaN(mb) || mb < 0) {
        Alert.alert(t('tracks.new.invalid_size'));
        return;
      }
      bytes = Math.round(mb * 1024 * 1024);
    }
    const unitPrice = parseFloat(price.trim());
    if (isNaN(unitPrice) || unitPrice < 0) {
      Alert.alert(t('tracks.new.invalid_price'));
      return;
    }
    setSubmitting(true);
    try {
      await create('tracks', {
        Name: name.trim(),
        Composer: composer.trim() || null,
        AlbumId: albumId,
        GenreId: genreId,
        Milliseconds: milliseconds,
        Bytes: bytes,
        UnitPrice: unitPrice,
      });
      router.back();
    } catch {
      Alert.alert(t('tracks.new.error'));
    }
    setSubmitting(false);
  };
  const selectedAlbum = albums.find((a) => a.AlbumId === albumId);
  const selectedGenre = genres.find((g) => g.GenreId === genreId);
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.label}>{t('tracks.new.name_label')}</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder={t('tracks.new.name_placeholder')} placeholderTextColor="#666" />
        <Text style={styles.label}>{t('tracks.new.composer_label')}</Text>
        <TextInput style={styles.input} value={composer} onChangeText={setComposer} placeholder={t('tracks.new.composer_placeholder')} placeholderTextColor="#666" />
        <Text style={styles.label}>{t('list.album')}</Text>
        <TouchableOpacity style={styles.pickerButton} onPress={() => setAlbumPickerOpen(true)}>
          <Text style={[styles.pickerText, !selectedAlbum && styles.pickerPlaceholder]}>
            {selectedAlbum ? selectedAlbum.Title : t('tracks.new.no_album_option')}
          </Text>
          <Text style={styles.chevron}>▼</Text>
        </TouchableOpacity>
        <Text style={styles.label}>{t('list.genre')}</Text>
        <TouchableOpacity style={styles.pickerButton} onPress={() => setGenrePickerOpen(true)}>
          <Text style={[styles.pickerText, !selectedGenre && styles.pickerPlaceholder]}>
            {selectedGenre ? selectedGenre.Name : t('tracks.new.no_genre_option')}
          </Text>
          <Text style={styles.chevron}>▼</Text>
        </TouchableOpacity>
        <Text style={styles.label}>{t('tracks.new.duration_label')}</Text>
        <TextInput style={styles.input} value={duration} onChangeText={setDuration} placeholder="MM:SS" placeholderTextColor="#666" keyboardType="numbers-and-punctuation" />
        <Text style={styles.label}>{t('tracks.new.size_label')}</Text>
        <TextInput style={styles.input} value={size} onChangeText={setSize} placeholder="ej. 8.5" placeholderTextColor="#666" keyboardType="decimal-pad" />
        <Text style={styles.label}>{t('tracks.new.price_label')}</Text>
        <TextInput style={styles.input} value={price} onChangeText={setPrice} placeholder="0.99" placeholderTextColor="#666" keyboardType="decimal-pad" />
        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={submitting}>
          {submitting ? (
            <ActivityIndicator color="#00d4ff" />
          ) : (
            <Text style={styles.buttonText}>{t('tracks.new.submit')}</Text>
          )}
        </TouchableOpacity>
      </View>
      <Modal visible={albumPickerOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('list.album')}</Text>
            <FlatList
              data={albums}
              keyExtractor={(a) => String(a.AlbumId)}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalRow} onPress={() => { setAlbumId(item.AlbumId); setAlbumPickerOpen(false); }}>
                  <Text style={styles.modalRowText}>{item.Title}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.modalClose} onPress={() => setAlbumPickerOpen(false)}>
              <Text style={styles.modalCloseText}>{t('confirm.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={genrePickerOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('list.genre')}</Text>
            <FlatList
              data={genres}
              keyExtractor={(g) => String(g.GenreId)}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalRow} onPress={() => { setGenreId(item.GenreId); setGenrePickerOpen(false); }}>
                  <Text style={styles.modalRowText}>{item.Name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.modalClose} onPress={() => setGenrePickerOpen(false)}>
              <Text style={styles.modalCloseText}>{t('confirm.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  content: { padding: 16 },
  card: { borderRadius: 12, borderWidth: 1, borderColor: '#1a1a2e', padding: 16 },
  label: { fontSize: 8, color: '#888', marginBottom: 6, fontWeight: '600', textTransform: 'uppercase' },
  input: { backgroundColor: '#12121e', borderRadius: 8, padding: 12, color: '#fff', fontSize: 8, borderWidth: 1, borderColor: '#2a2a4a', marginBottom: 16 },
  pickerButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#12121e', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#2a2a4a', marginBottom: 16 },
  pickerText: { color: '#fff', fontSize: 11 },
  pickerPlaceholder: { color: '#666' },
  chevron: { color: '#888', fontSize: 9 },
  button: { borderWidth: 1, borderColor: '#00d4ff', borderRadius: 10, padding: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 11 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 32 },
  modalContent: { borderRadius: 12, borderWidth: 1, borderColor: '#1a1a2e', padding: 16, maxHeight: 400 },
  modalTitle: { fontSize: 9, fontWeight: 'bold', color: '#fff', marginBottom: 12 },
  modalRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#2a2a4a' },
  modalRowText: { color: '#fff', fontSize: 11 },
  modalClose: { marginTop: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#ff4444', borderRadius: 8 },
  modalCloseText: { color: '#fff', fontSize: 11 },
});
