import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { resetUserPassword } from '@/lib/db';
import { t } from '@/lib/i18n';
interface ResetPasswordModalProps {
  userId: number;
  userName: string;
  onClose: () => void;
}
export default function ResetPasswordModal({ userId, userName, onClose }: ResetPasswordModalProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', t('password.all_required_simple'));
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', t('password.min_length'));
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', t('password.mismatch'));
      return;
    }
    setSaving(true);
    try {
      await resetUserPassword(userId, newPassword);
      Alert.alert('Success', 'Password reset successfully.');
      onClose();
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : t('password.error'));
    } finally {
      setSaving(false);
    }
  };
  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{t('password.reset_title')}</Text>
          <Text style={styles.subtitle}>{t('password.reset_subtitle', { name: userName })}</Text>
          <Text style={styles.label}>{t('password.new')}</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder={t('password.new_placeholder')}
              placeholderTextColor="#666"
              secureTextEntry={!showNew}
            />
            <TouchableOpacity onPress={() => setShowNew(!showNew)} style={styles.toggle}>
              <Text style={styles.toggleText}>{showNew ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.label}>{t('password.confirm')}</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder={t('password.confirm_placeholder')}
              placeholderTextColor="#666"
              secureTextEntry={!showConfirm}
            />
            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.toggle}>
              <Text style={styles.toggleText}>{showConfirm ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>{t('confirm.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleReset} disabled={saving}>
              {saving ? (
                <ActivityIndicator color="#00d4ff" size="small" />
              ) : (
                <Text style={styles.saveText}>{t('password.reset_btn')}</Text>
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  toggle: {
    marginLeft: 8,
    padding: 8,
  },
  toggleText: {
    color: '#00d4ff',
    fontSize: 8,
    fontWeight: '600',
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
