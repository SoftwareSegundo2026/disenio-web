import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { create } from '@/lib/db';
import { t } from '@/lib/i18n';
import { useAuth } from '@/store/auth';
export default function NewUserScreen() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const isAdmin = useAuth((s) => s.user?.is_admin ?? false);
  if (!isAdmin) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{t('auth.admin_title')}</Text>
      </View>
    );
  }
  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const handleSubmit = async () => {
    if (!fullName.trim() || !username.trim() || !email.trim() || !password.trim()) {
      Alert.alert(t('users.new.all_required'));
      return;
    }
    if (!validateEmail(email.trim())) {
      Alert.alert(t('users.new.invalid_email'));
      return;
    }
    setSubmitting(true);
    try {
      await create('users', {
        full_name: fullName.trim(),
        username: username.trim(),
        email: email.trim(),
        password: password,
      });
      router.back();
    } catch {
      Alert.alert(t('users.new.error'));
    }
    setSubmitting(false);
  };
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.label}>{t('users.new.full_name_label')}</Text>
        <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder={t('users.new.full_name_placeholder')} placeholderTextColor="#666" autoCapitalize="words" />
        <Text style={styles.label}>{t('users.new.username_label')}</Text>
        <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder={t('users.new.username_placeholder')} placeholderTextColor="#666" autoCapitalize="none" />
        <Text style={styles.label}>{t('users.new.email_label')}</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder={t('users.new.email_placeholder')} placeholderTextColor="#666" keyboardType="email-address" autoCapitalize="none" />
        <Text style={styles.label}>{t('users.new.password_label')}</Text>
        <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="••••••••" placeholderTextColor="#666" secureTextEntry />
        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={submitting}>
          {submitting ? (
            <ActivityIndicator color="#00d4ff" />
          ) : (
            <Text style={styles.buttonText}>{t('users.new.submit')}</Text>
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
