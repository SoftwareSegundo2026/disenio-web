import { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { getAll, getAllProtected, getActivities, getImageUrl } from '@/lib/db';
import { t, formatDate } from '@/lib/i18n';
import { useAuth } from '@/store/auth';
import type { ApiArtist, ApiAlbum, ApiTrack, ApiUser, ApiActivity } from '@/lib/db';
interface Stats {
  artists: number;
  albums: number;
  tracks: number;
  users: number;
}
export default function DashboardScreen() {
  const { token, user } = useAuth();
  const isLoggedIn = !!token;
  const isAdmin = user?.is_admin ?? false;
  const [stats, setStats] = useState<Stats>({ artists: 0, albums: 0, tracks: 0, users: 0 });
  const [activities, setActivities] = useState<ApiActivity[]>([]);
  const [storageBytes, setStorageBytes] = useState(0);
  const [loading, setLoading] = useState(true);
  const loadData = useCallback(async () => {
    try {
      const [artists, albums, tracks] = await Promise.all([
        getAll<ApiArtist>('artists'),
        getAll<ApiAlbum>('albums'),
        getAll<ApiTrack>('tracks'),
      ]);
      let usersCount = 0;
      if (isAdmin) {
        try {
          const users = await getAllProtected<ApiUser>('users');
          usersCount = users.filter((u) => !u.disabled).length;
        } catch {}
      }
      const totalBytes = tracks.reduce((sum, t) => sum + (t.Bytes || 0), 0);
      setStorageBytes(totalBytes);
      setStats({
        artists: artists.length,
        albums: albums.length,
        tracks: tracks.length,
        users: usersCount,
      });
    } catch {}
  }, [isAdmin]);
  const loadActivities = useCallback(async () => {
    try {
      const data = await getActivities(0, 10);
      setActivities(data);
    } catch {
      setActivities([]);
    }
  }, []);
  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([loadData(), loadActivities()]);
      setLoading(false);
    })();
  }, [loadData, loadActivities]);
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00d4ff" />
      </View>
    );
  }
  const storageGB = storageBytes / (1024 ** 3);
  const storagePercent = Math.min((storageBytes / (500 * 1024 ** 3)) * 100, 100);
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>
          {isLoggedIn
            ? t('welcome.user', { name: user?.full_name || 'User' })
            : t('welcome.guest')}
        </Text>
        <Text style={styles.welcomeSummary}>{t('welcome.summary')}</Text>
      </View>
      <View style={styles.statsGrid}>
        <StatCard title={t('dashboard.total_artists')} value={stats.artists} subtitle={t('dashboard.total_artists_sub')} icon="🎤" />
        <StatCard title={t('dashboard.total_albums')} value={stats.albums} subtitle={t('dashboard.total_albums_sub')} icon="💿" />
        <StatCard title={t('dashboard.total_tracks')} value={stats.tracks} subtitle={t('dashboard.total_tracks_sub')} icon="🎶" />
        {isAdmin && (
          <StatCard title={t('dashboard.active_users')} value={stats.users} subtitle={t('dashboard.active_users_sub')} icon="👥" accent />
        )}
      </View>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>{t('dashboard.recent_activity')}</Text>
        {activities.map((a) => (
          <View key={a.activity_id} style={styles.activityRow}>
            <View style={styles.activityInfo}>
              <Text style={styles.activityName} numberOfLines={1}>{a.detail || a.username}</Text>
              <Text style={styles.activityMeta}>{a.action_type} · {formatDate(a.timestamp)}</Text>
            </View>
          </View>
        ))}
        {activities.length === 0 && (
          <Text style={styles.emptyText}>{t('loading')}</Text>
        )}
      </View>
      {isAdmin && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{t('dashboard.quick_actions')}</Text>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(dashboard)/artists/new')}>
            <Text style={styles.actionButtonText}>➕ {t('dashboard.add_artist')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButtonOutline} onPress={() => router.push('/(dashboard)/tracks/new')}>
            <Text style={styles.actionButtonOutlineText}>📤 {t('dashboard.upload_tracks')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButtonSecondary} onPress={() => router.push('/(dashboard)/albums/new')}>
            <Text style={styles.actionButtonSecondaryText}>📚 {t('dashboard.create_album')}</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.sectionCard}>
        <View style={styles.storageHeader}>
          <Text style={styles.sectionTitle}>{t('dashboard.storage_used')}</Text>
          <Text style={styles.storageValue}>{storageGB > 0 ? `${storageGB.toFixed(1)} GB` : '—'}</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${storagePercent}%` as any }]} />
        </View>
        <Text style={styles.storageText}>{t('dashboard.storage_text', { size: storageGB.toFixed(1) })}</Text>
      </View>
      <View style={styles.insightCard}>
        <Text style={styles.insightIcon}>⚡</Text>
        <View>
          <Text style={styles.insightTitle}>{t('dashboard.pro_insight')}</Text>
          <Text style={styles.insightText}>{t('dashboard.pro_insight_text')}</Text>
        </View>
      </View>
    </ScrollView>
  );
}
function StatCard({ title, value, subtitle, icon, accent }: {
  title: string; value: number; subtitle: string; icon: string; accent?: boolean;
}) {
  return (
    <View style={[styles.statCard, accent ? styles.statCardAccent : null]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statSubtitle}>{subtitle}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  loadingContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  welcomeSection: { marginBottom: 4 },
  welcomeTitle: { fontSize: 12, fontWeight: 'bold', color: '#fff' },
  welcomeSummary: { fontSize: 8, color: '#888', marginTop: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2a2a4a',
    padding: 16,
    width: '47%',
    minWidth: 140,
    flexGrow: 1,
  },
  statCardAccent: { borderLeftWidth: 2, borderLeftColor: '#00d4ff' },
  statIcon: { fontSize: 14, marginBottom: 8 },
  statTitle: { fontSize: 8, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#00d4ff', marginVertical: 4 },
  statSubtitle: { fontSize: 8, color: '#4caf50' },
  sectionCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2a2a4a',
    padding: 16,
  },
  sectionTitle: { fontSize: 9, fontWeight: 'bold', color: '#fff', marginBottom: 12 },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a4a',
  },
  activityInfo: { flex: 1 },
  activityName: { fontSize: 8, color: '#fff', fontWeight: '500' },
  activityMeta: { fontSize: 8, color: '#888', marginTop: 2 },
  emptyText: { color: '#666', textAlign: 'center', paddingVertical: 20 },
  actionButton: {
    backgroundColor: '#00d4ff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
  },
  actionButtonText: { color: '#000', fontWeight: 'bold', fontSize: 10 },
  actionButtonOutline: {
    borderWidth: 1,
    borderColor: '#00d4ff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
  },
  actionButtonOutlineText: { color: '#00d4ff', fontWeight: 'bold', fontSize: 10 },
  actionButtonSecondary: {
    backgroundColor: '#2a2a4a',
    borderRadius: 10,
    padding: 14,
  },
  actionButtonSecondaryText: { color: '#888', fontWeight: '600', fontSize: 10 },
  storageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  storageValue: { fontSize: 8, color: '#888', fontWeight: '600' },
  progressBar: {
    height: 8,
    backgroundColor: '#12121e',
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00d4ff',
    borderRadius: 4,
  },
  storageText: { fontSize: 8, color: '#888' },
  insightCard: {
    backgroundColor: '#0a2a1e',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00d4ff',
    borderLeftWidth: 4,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
  },
  insightIcon: { fontSize: 11, marginTop: 2 },
  insightTitle: { fontSize: 8, color: '#00d4ff', fontWeight: '600', textTransform: 'uppercase' },
  insightText: { fontSize: 8, color: '#ccc', marginTop: 4 },
});
