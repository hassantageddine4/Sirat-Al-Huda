// src/screens/NotificationsScreen.jsx
// Real-time notification feed — likes and comment alerts.

import React, { useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  ActivityIndicator, RefreshControl, StyleSheet,
} from 'react-native';
import { useNotifications } from '../hooks/useNotifications';

const C = {
  bg: '#0F1B14', surface: '#1A2B1F', border: '#2A3F2E',
  primary: '#0F3D2E', accent: '#C8A951', accentText: '#D9BF7A',
  text: '#F0EDE8', textMuted: '#7A8A7E',
  unreadDot: '#22C55E', likeColor: '#EF4444', commentColor: '#C8A951',
};

const TYPE_ICON = { like: '♥', comment: '💬' };
const TYPE_COLOR = { like: C.likeColor, comment: C.commentColor };

export default function NotificationsScreen({ navigation }) {
  const {
    notifications, unreadCount, loading, loadingMore,
    error, hasMore, refresh, loadMore, markRead, markAllRead,
  } = useNotifications();

  const handleTap = useCallback(async (notif) => {
    if (!notif.read) await markRead(notif.id);
    // Navigate to the post
    if (notif.post_id) {
      navigation?.navigate?.('PostDetail', { postId: notif.post_id });
    }
  }, [markRead, navigation]);

  const renderItem = useCallback(({ item: notif }) => (
    <TouchableOpacity
      style={[s.row, !notif.read && s.rowUnread]}
      onPress={() => handleTap(notif)}
      activeOpacity={0.7}
    >
      {/* Unread dot */}
      <View style={s.dotCol}>
        {!notif.read && <View style={s.dot} />}
      </View>

      {/* Type icon */}
      <View style={[s.iconCircle, { backgroundColor: TYPE_COLOR[notif.type] + '22' }]}>
        <Text style={[s.typeIcon, { color: TYPE_COLOR[notif.type] }]}>
          {TYPE_ICON[notif.type]}
        </Text>
      </View>

      {/* Content */}
      <View style={s.content}>
        <Text style={s.displayText} numberOfLines={2}>
          {notif.displayText}
        </Text>
        {notif.post_title && (
          <Text style={s.postTitle} numberOfLines={1}>"{notif.post_title}"</Text>
        )}
        <Text style={s.timeAgo}>{notif.timeAgo}</Text>
      </View>
    </TouchableOpacity>
  ), [handleTap]);

  const renderFooter = () =>
    loadingMore ? <ActivityIndicator color={C.accent} style={{ marginVertical: 16 }} /> : null;

  return (
    <View style={s.screen}>
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <Text style={s.unreadLabel}>{unreadCount} unread</Text>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity style={s.markAllBtn} onPress={markAllRead}>
            <Text style={s.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Error */}
      {error && (
        <View style={s.errorBanner}>
          <Text style={s.errorText}>{error}</Text>
          <TouchableOpacity onPress={refresh}>
            <Text style={s.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* List */}
      {loading && !notifications.length ? (
        <View style={s.center}>
          <ActivityIndicator color={C.accent} size="large" />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={n => n.id}
          renderItem={renderItem}
          contentContainerStyle={s.list}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={<EmptyState />}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={C.accent} />
          }
        />
      )}
    </View>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <View style={s.empty}>
      <Text style={s.emptyIcon}>🔔</Text>
      <Text style={s.emptyTitle}>No notifications yet</Text>
      <Text style={s.emptySub}>
        When someone likes or comments on your posts, you'll see it here.
      </Text>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  screen:      { flex: 1, backgroundColor: C.bg },
  center:      { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header:      { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
                 paddingHorizontal: 20, paddingTop: 16, paddingBottom: 14 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: C.text },
  unreadLabel: { fontSize: 12, color: C.unreadDot, fontWeight: '600', marginTop: 2 },
  markAllBtn:  { marginTop: 4 },
  markAllText: { fontSize: 13, color: C.accent, fontWeight: '600' },
  errorBanner: { flexDirection: 'row', backgroundColor: '#3B0000', padding: 12,
                 alignItems: 'center', justifyContent: 'space-between',
                 marginHorizontal: 16, borderRadius: 10, marginBottom: 8 },
  errorText:   { color: '#EF4444', fontSize: 13, flex: 1 },
  retryText:   { color: C.accent, fontWeight: '700', fontSize: 13 },
  list:        { paddingBottom: 40 },
  row:         { flexDirection: 'row', alignItems: 'center', paddingVertical: 14,
                 paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: C.border },
  rowUnread:   { backgroundColor: C.surface },
  dotCol:      { width: 12, alignItems: 'center' },
  dot:         { width: 8, height: 8, borderRadius: 4, backgroundColor: C.unreadDot },
  iconCircle:  { width: 42, height: 42, borderRadius: 21, alignItems: 'center',
                 justifyContent: 'center', marginHorizontal: 10 },
  typeIcon:    { fontSize: 18 },
  content:     { flex: 1 },
  displayText: { fontSize: 14, fontWeight: '600', color: C.text, lineHeight: 20 },
  postTitle:   { fontSize: 12, color: C.accent, marginTop: 3, fontStyle: 'italic' },
  timeAgo:     { fontSize: 11, color: C.textMuted, marginTop: 4 },
  empty:       { alignItems: 'center', paddingTop: 80, paddingHorizontal: 40 },
  emptyIcon:   { fontSize: 48, marginBottom: 16 },
  emptyTitle:  { fontSize: 18, fontWeight: '700', color: C.text, marginBottom: 8 },
  emptySub:    { fontSize: 14, color: C.textMuted, textAlign: 'center', lineHeight: 22 },
});
