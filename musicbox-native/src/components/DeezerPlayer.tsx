import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Linking } from "react-native";

interface DeezerPlayerProps {
  trackName: string;
}

export default function DeezerPlayer({ trackName }: DeezerPlayerProps) {
  const [loading, setLoading] = useState(false);
  const [trackId, setTrackId] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const searchTrack = async () => {
    setLoading(true);
    setError(null);
    setTrackId(null);
    setPreviewUrl(null);
    try {
      const res = await fetch(
        `https://api.deezer.com/search/track?q=${encodeURIComponent(trackName)}`,
      );
      const data = await res.json();
      if (data.data && data.data.length > 0) {
        const track = data.data[0];
        setTrackId(track.id);
        if (track.preview) {
          setPreviewUrl(track.preview);
        } else {
          setError("No preview available for this track.");
        }
      } else {
        setError("Track not found on Deezer.");
      }
    } catch {
      Alert.alert("Error", "Failed to search Deezer.");
    } finally {
      setLoading(false);
    }
  };

  const playPreview = () => {
    if (previewUrl) Linking.openURL(previewUrl);
  };

  const openDeezer = () => {
    if (trackId) Linking.openURL(`https://www.deezer.com/track/${trackId}`);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.searchButton}
        onPress={searchTrack}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.searchButtonText}>Search on Deezer</Text>
        )}
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {previewUrl && (
        <View style={styles.playerRow}>
          <TouchableOpacity style={styles.playButton} onPress={playPreview}>
            <Text style={styles.playButtonText}>▶️</Text>
          </TouchableOpacity>
          <Text style={styles.previewLabel} numberOfLines={1}>30s Preview</Text>
          <TouchableOpacity style={styles.openButton} onPress={openDeezer}>
            <Text style={styles.openButtonText}>Deezer</Text>
          </TouchableOpacity>
        </View>
      )}
      {trackId && !previewUrl && (
        <TouchableOpacity style={styles.openButton} onPress={openDeezer}>
          <Text style={styles.openButtonText}>Open on Deezer</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    alignItems: "center",
  },
  searchButton: {
    backgroundColor: "#00d4ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 180,
    alignItems: "center",
  },
  searchButtonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 8,
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  playButton: {
    backgroundColor: "#1a1a2e",
    borderWidth: 1,
    borderColor: "#00d4ff",
    borderRadius: 8,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  playButtonText: {
    fontSize: 14,
  },
  previewLabel: {
    color: "#888",
    fontSize: 8,
    flex: 1,
  },
  openButton: {
    borderWidth: 1,
    borderColor: "#00d4ff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  openButtonText: {
    color: "#00d4ff",
    fontWeight: "600",
    fontSize: 8,
  },
  errorText: {
    color: "#ff4444",
    marginTop: 8,
    fontSize: 8,
  },
});
