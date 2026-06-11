import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator, Modal, FlatList } from 'react-native';
import { router } from 'expo-router';
import { getAll, create } from '@/lib/db';
import { t } from '@/lib/i18n';
import { useAuth } from '@/store/auth';
import type { ApiAlbum, ApiArtist } from '@/lib/db';
export default function NewAlbumScreen() {
  const [title, setTitle] = useState('');
  const [artistId, setArtistId] = useState<number | null>(null);
  const [artists, setArtists] = useState<ApiArtist[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const list = await getAll<ApiArtist>('artists');
        setArtists(list);
      } catch {}
    })();
  }, []);
  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert(t('albums.new.title_required'));
      return;
    }
    if (!artistId) {
      Alert.alert(t('albums.new.artist_required'));
      return;
    }
    setSubmitting(true);
    try {
      await create('albums', { Title: title.trim(), ArtistId: artistId });
      router.back();
    } catch {
      Alert.alert(t('albums.new.error'));
    }
    setSubmitting(false);
  };
  const selectedArtist = artists.find((a) => a.ArtistId === artistId);
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.label}>{t('albums.new.title_label')}</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder={t('albums.new.title_placeholder')} placeholderTextColor="#666" />
        <Text style={styles.label}>{t('albums.new.artist_label')}</Text>
        <TouchableOpacity style={styles.pickerButton} onPress={() => setPickerOpen(true)}>
          <Text style={[styles.pickerText, !selectedArtist && styles.pickerPlaceholder]}>
            {selectedArtist ? selectedArtist.Name : t('albums.new.select_artist')}
          </Text>
          <Text style={styles.chevron}>▼</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={submitting}>
          {submitting ? (
            <ActivityIndicator color="#00d4ff" />
          ) : (
            <Text style={styles.buttonText}>{t('albums.new.submit')}</Text>
          )}
        </TouchableOpacity>
      </View>
      <Modal visible={pickerOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('albums.new.artist_label')}</Text>
            <FlatList
              data={artists}
              keyExtractor={(a) => String(a.ArtistId)}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalRow} onPress={() => { setArtistId(item.ArtistId); setPickerOpen(false); }}>
                  <Text style={styles.modalRowText}>{item.Name}</Text>
                  {item.ArtistId === artistId && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.modalClose} onPress={() => setPickerOpen(false)}>
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
  modalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#2a2a4a' },
  modalRowText: { color: '#fff', fontSize: 11 },
  checkmark: { color: '#00d4ff', fontSize: 9, fontWeight: 'bold' },
  modalClose: { marginTop: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#ff4444', borderRadius: 8 },
  modalCloseText: { color: '#fff', fontSize: 11 },
});
