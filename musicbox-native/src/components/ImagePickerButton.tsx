import { TouchableOpacity, Text, StyleSheet, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from '@/lib/db';
interface ImagePickerButtonProps {
  collection: 'artists' | 'albums';
  id: number;
  onSuccess?: (imageUrl: string) => void;
}
export default function ImagePickerButton({ collection, id, onSuccess }: ImagePickerButtonProps) {
  const handlePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need camera roll access to upload images.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    const file = {
      uri: asset.uri,
      type: asset.mimeType || 'image/jpeg',
      name: asset.fileName || `upload.${asset.mimeType?.split('/')[1] || 'jpg'}`,
    } as any;
    try {
      const response = await uploadImage(collection, id, file);
      onSuccess?.(response.ImageUrl);
      Alert.alert('Success', 'Image uploaded successfully');
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Upload failed');
    }
  };
  return (
    <TouchableOpacity style={styles.button} onPress={handlePick}>
      <Text style={styles.buttonText}>📷 Upload Image</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2a2a4a',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#00d4ff',
    fontWeight: '600',
    fontSize: 10
  },
});
