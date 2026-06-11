import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { getById, update } from '@/lib/db';
import { t } from '@/lib/i18n';
import { useAuth } from '@/store/auth';
import type { ApiArtist } from '@/lib/db';
import ImagePickerButton from '@/components/ImagePickerButton';
export default function EditArtistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const a = await getById<ApiArtist>('artists', parseInt(id));
        setName(a.Name);
      } catch {}
      setLoading(false);
    })();
  }, [id]);
  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert(t('artists.edit.name_required'));
      return;
    }
    setSubmitting(true);
    try {
      await update('artists', parseInt(id), { Name: name.trim() });
      router.back();
    } catch {
      Alert.alert(t('artists.edit.error'));
    }
    setSubmitting(false);
  };
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00d4ff" />
      </View>
    );
  }
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t('artists.edit.image_label')}</Text>
        <ImagePickerButton collection="artists" id={parseInt(id)} />
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>{t('artists.edit.name_label')}</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder={t('artists.edit.name_placeholder')} placeholderTextColor="#666" />
        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={submitting}>
          {submitting ? (
            <ActivityIndicator color="#00d4ff" />
          ) : (
            <Text style={styles.buttonText}>{t('artists.edit.submit')}</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  center: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  card: { borderRadius: 12, borderWidth: 1, borderColor: '#1a1a2e', padding: 16 },
  sectionTitle: { fontSize: 9, fontWeight: 'bold', color: '#fff', marginBottom: 12 },
  label: { fontSize: 8, color: '#888', marginBottom: 6, fontWeight: '600', textTransform: 'uppercase' },
  input: { backgroundColor: '#12121e', borderRadius: 8, padding: 12, color: '#fff', fontSize: 8, borderWidth: 1, borderColor: '#2a2a4a', marginBottom: 16 },
  button: { borderWidth: 1, borderColor: '#00d4ff', borderRadius: 10, padding: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 11 },
  imageButton: { backgroundColor: '#2a2a4a', borderRadius: 10, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#2a2a4a', borderStyle: 'dashed' },
  imageButtonText: { color: '#888', fontSize: 10 },
});
