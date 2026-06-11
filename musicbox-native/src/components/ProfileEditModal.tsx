import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { updateMyProfile } from '@/lib/db';
import { useAuth } from '@/store/auth';
import { t } from '@/lib/i18n';
interface ProfileEditModalProps {
  userId: number;
  fullName: string | null;
  email: string | null;
  onClose: () => void;
  onSave?: () => void;
}
export default function ProfileEditModal({ userId, fullName, email, onClose, onSave }: ProfileEditModalProps) {
  const [editName, setEditName] = useState(fullName || '');
  const [editEmail, setEditEmail] = useState(email || '');
  const [saving, setSaving] = useState(false);
  const setUser = useAuth((s) => s.setUser);
  const handleSave = async () => {
    if (!editName.trim() || !editEmail.trim()) {
      Alert.alert('Error', t('register.all_required'));
      return;
    }
    setSaving(true);
    try {
      await updateMyProfile(editName.trim(), editEmail.trim());
      setUser({ ...useAuth.getState().user!, full_name: editName.trim(), email: editEmail.trim() });
      Alert.alert('Success', 'Profile updated successfully.');
      onSave?.();
      onClose();
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };
  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{t('menu.profile')}</Text>
          <Text style={styles.subtitle}>{t('header.edit_profile')}</Text>
          <Text style={styles.label}>{t('register.full_name_label')}</Text>
          <TextInput
            style={styles.input}
            value={editName}
            onChangeText={setEditName}
            placeholder={t('register.full_name_placeholder')}
            placeholderTextColor="#666"
          />
          <Text style={styles.label}>{t('register.email_label')}</Text>
          <TextInput
            style={styles.input}
            value={editEmail}
            onChangeText={setEditEmail}
            placeholder={t('register.email_placeholder')}
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>{t('confirm.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
              {saving ? (
                <ActivityIndicator color="#00d4ff" size="small" />
              ) : (
                <Text style={styles.saveText}>{t('users.edit.submit')}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1a1a2e',
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: '#888',
    fontSize: 8,
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  cancelText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '600',
  },
  saveButton: {
    borderWidth: 1, borderColor: '#00d4ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '600',
  },
});
