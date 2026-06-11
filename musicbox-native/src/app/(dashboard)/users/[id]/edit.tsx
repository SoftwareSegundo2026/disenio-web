import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator, Switch } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { getByIdProtected, update } from '@/lib/db';
import { t } from '@/lib/i18n';
import { useAuth } from '@/store/auth';
import type { ApiUser } from '@/lib/db';
export default function EditUserScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const isAdmin = useAuth((s) => s.user?.is_admin ?? false);
  useEffect(() => {
    (async () => {
      try {
        const u = await getByIdProtected<ApiUser>('users', parseInt(id));
        setFullName(u.full_name || '');
        setUsername(u.username);
        setEmail(u.email || '');
        setActive(!u.disabled);
      } catch {}
      setLoading(false);
    })();
  }, [id]);
  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const handleSubmit = async () => {
    if (!fullName.trim() || !username.trim() || !email.trim()) {
      Alert.alert(t('users.edit.all_required'));
      return;
    }
    if (!validateEmail(email.trim())) {
      Alert.alert(t('users.edit.invalid_email'));
      return;
    }
    setSubmitting(true);
    try {
      await update('users', parseInt(id), {
        full_name: fullName.trim(),
        username: username.trim(),
        email: email.trim(),
        disabled: !active,
      });
      router.back();
    } catch {
      Alert.alert(t('users.edit.error'));
    }
    setSubmitting(false);
  };
  if (!isAdmin) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{t('auth.admin_title')}</Text>
      </View>
    );
  }
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
        <Text style={styles.label}>{t('users.edit.full_name_label')}</Text>
        <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder={t('users.edit.full_name_placeholder')} placeholderTextColor="#666" autoCapitalize="words" />
        <Text style={styles.label}>{t('users.edit.username_label')}</Text>
        <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder={t('users.edit.username_placeholder')} placeholderTextColor="#666" autoCapitalize="none" />
        <Text style={styles.label}>{t('users.edit.email_label')}</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder={t('users.edit.email_placeholder')} placeholderTextColor="#666" keyboardType="email-address" autoCapitalize="none" />
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>{t('users.edit.active_label')}</Text>
          <Switch value={active} onValueChange={setActive} trackColor={{ false: '#2a2a4a', true: '#00d4ff' }} thumbColor={active ? '#fff' : '#666'} />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={submitting}>
          {submitting ? (
            <ActivityIndicator color="#00d4ff" />
          ) : (
            <Text style={styles.buttonText}>{t('users.edit.submit')}</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  content: { padding: 16 },
  center: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  card: { borderRadius: 12, borderWidth: 1, borderColor: '#1a1a2e', padding: 16 },
  label: { fontSize: 8, color: '#888', marginBottom: 6, fontWeight: '600', textTransform: 'uppercase' },
  input: { backgroundColor: '#12121e', borderRadius: 8, padding: 12, color: '#fff', fontSize: 8, borderWidth: 1, borderColor: '#2a2a4a', marginBottom: 16 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingVertical: 8 },
  switchLabel: { fontSize: 8, color: '#888', fontWeight: '600', textTransform: 'uppercase' },
  button: { borderWidth: 1, borderColor: '#00d4ff', borderRadius: 10, padding: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 11 },
  errorText: { color: '#ff4444', fontSize: 9, textAlign: 'center', marginTop: 40 },
});
