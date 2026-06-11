import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { create } from '@/lib/db';
import { t } from '@/lib/i18n';
import { useAuth } from '@/store/auth';
export default function NewArtistScreen() {
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const isAdmin = useAuth((s) => s.user?.is_admin ?? false);
  if (!isAdmin) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{t('auth.admin_title')}</Text>
      </View>
    );
  }
  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert(t('artists.new.name_required'));
      return;
    }
    setSubmitting(true);
    try {
      await create('artists', { Name: name.trim() });
      router.back();
    } catch {
      Alert.alert(t('artists.new.error'));
    }
    setSubmitting(false);
  };
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.label}>{t('artists.new.name_label')}</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder={t('artists.new.name_placeholder')} placeholderTextColor="#666" />
        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={submitting}>
          {submitting ? (
            <ActivityIndicator color="#00d4ff" />
          ) : (
            <Text style={styles.buttonText}>{t('artists.new.submit')}</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  content: { padding: 16 },
  card: { borderRadius: 12, borderWidth: 1, borderColor: '#1a1a2e', padding: 16 },
  label: { fontSize: 8, color: '#888', marginBottom: 6, fontWeight: '600', textTransform: 'uppercase' },
  input: { backgroundColor: '#12121e', borderRadius: 8, padding: 12, color: '#fff', fontSize: 8, borderWidth: 1, borderColor: '#2a2a4a', marginBottom: 16 },
  button: { borderWidth: 1, borderColor: '#00d4ff', borderRadius: 10, padding: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 11 },
  errorText: { color: '#ff4444', fontSize: 9, textAlign: 'center', marginTop: 40 },
});
