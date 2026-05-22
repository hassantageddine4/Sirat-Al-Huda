// src/screens/CommunityScreen.jsx
// React Native community feed with realtime updates, tag filter, and post composer.

import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput,
  ActivityIndicator, RefreshControl, Modal, KeyboardAvoidingView,
  Platform, StyleSheet, Alert, Pressable,
} from 'react-native';
import { usePosts } from '../hooks/usePosts';

const TAGS = ['general', 'quran', 'hadith', 'fiqh', 'spirituality'];

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bg:          '#0F1B14',
  surface:     '#1A2B1F',
  border:      '#2A3F2E',
  primary:     '#0F3D2E',
  accent:      '#C8A951',
  accentText:  '#D9BF7A',
  text:        '#F0EDE8',
  textMuted:   '#7A8A7E',
  green:       '#22C55E',
  red:         '#EF4444',
};

// ─────────────────────────────────────────────────────────────────────────────
export default function CommunityScreen({ navigation }) {
  const [activeTag, setActiveTag]     = useState(null);
  const [composing, setComposing]     = useState(false);
  const [postTitle, setPostTitle]     = useState('');
  const [postBody,  setPostBody]      = useState('');
  const [postTag,   setPostTag]       = useState('general');
  const [submitting,setSubmitting]    = useState(false);

  const {
    posts, likedIds, loading, loadingMore, error,
    hasMore, refresh, loadMore, create, remove, like,
  } = usePosts({ tag: activeTag });

  // ── Submit new post ───────────────────────────────────────────────────────
  const handleCreate = useCallback(async () => {
    if (!postTitle.trim() || !postBody.trim()) {
      Alert.alert('Required', 'Please fill in both title and body.');
      return;
    }
    setSubmitting(true);
    const { error: err } = await create({ title: postTitle, content: postBody, tag: postTag });
    setSubmitting(false);
    if (err) { Alert.alert('Error', err); return; }
    setComposing(false);
    setPostTitle('');
    setPostBody('');
    setPostTag('general');
  }, [postTitle, postBody, postTag, create]);

  // ── Delete with confirmation ──────────────────────────────────────────────
  const confirmDelete = useCallback((postId) => {
    Alert.alert('Delete post', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => remove(postId) },
    ]);
  }, [remove]);

  // ── Render post row ───────────────────────────────────────────────────────
  const renderPost = useCallback(({ item: post }) => (
    <PostCard
      post={post}
      liked={likedIds.has(post.id)}
      onLike={() => like(post.id)}
      onComment={() => navigation?.navigate?.('PostDetail', { postId: post.id })}
      onDelete={() => confirmDelete(post.id)}
    />
  ), [likedIds, like, confirmDelete, navigation]);

  // ── Footer spinner ────────────────────────────────────────────────────────
  const renderFooter = () =>
    loadingMore ? <ActivityIndicator color={C.accent} style={{ marginVertical: 16 }} /> : null;

  return (
    <View style={s.screen}>

      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Community</Text>
        <TouchableOpacity style={s.composeBtn} onPress={() => setComposing(true)}>
          <Text style={s.composeBtnText}>+ Post</Text>
        </TouchableOpacity>
      </View>

      {/* Tag filter */}
      <FlatList
        data={[null, ...TAGS]}
        keyExtractor={t => t ?? 'all'}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.tagRow}
        renderItem={({ item: tag }) => (
          <Pressable
            style={[s.tagChip, activeTag === tag && s.tagChipActive]}
            onPress={() => setActiveTag(tag)}
          >
            <Text style={[s.tagChipText, activeTag === tag && s.tagChipTextActive]}>
              {tag ? tag.charAt(0).toUpperCase() + tag.slice(1) : 'All'}
            </Text>
          </Pressable>
        )}
      />

      {/* Error banner */}
      {error && (
        <View style={s.errorBanner}>
          <Text style={s.errorText}>{error}</Text>
          <TouchableOpacity onPress={refresh}><Text style={s.retryText}>Retry</Text></TouchableOpacity>
        </View>
      )}

      {/* Post feed */}
      {loading && !posts.length ? (
        <View style={s.center}>
          <ActivityIndicator color={C.accent} size="large" />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={p => p.id}
          renderItem={renderPost}
          contentContainerStyle={s.feed}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={<Text style={s.emptyText}>No posts yet. Be the first!</Text>}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refresh}
              tintColor={C.accent}
            />
          }
        />
      )}

      {/* Compose modal */}
      <ComposeModal
        visible={composing}
        title={postTitle}
        body={postBody}
        tag={postTag}
        submitting={submitting}
        onTitleChange={setPostTitle}
        onBodyChange={setPostBody}
        onTagChange={setPostTag}
        onSubmit={handleCreate}
        onClose={() => setComposing(false)}
      />
    </View>
  );
}

// ── PostCard component ────────────────────────────────────────────────────────
function PostCard({ post, liked, onLike, onComment, onDelete }) {
  return (
    <View style={s.card}>
      {/* Author + meta */}
      <View style={s.cardHeader}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>{(post.users?.name ?? 'U')[0].toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.authorName}>{post.users?.name ?? 'Anonymous'}</Text>
          <Text style={s.postTime}>{formatTime(post.created_at)}</Text>
        </View>
        <View style={s.tagBadge}>
          <Text style={s.tagBadgeText}>{post.tag}</Text>
        </View>
      </View>

      {/* Content */}
      <Text style={s.postTitle}>{post.title}</Text>
      <Text style={s.postBody} numberOfLines={4}>{post.content}</Text>

      {/* Actions */}
      <View style={s.cardActions}>
        <TouchableOpacity style={s.actionBtn} onPress={onLike}>
          <Text style={[s.actionIcon, liked && { color: C.accent }]}>
            {liked ? '♥' : '♡'}
          </Text>
          <Text style={[s.actionText, liked && { color: C.accent }]}>
            {post.likes ?? 0}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.actionBtn} onPress={onComment}>
          <Text style={s.actionIcon}>💬</Text>
          <Text style={s.actionText}>{post.commentCount ?? 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.actionBtn} onPress={onDelete}>
          <Text style={[s.actionIcon, { color: C.textMuted }]}>🗑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── ComposeModal component ────────────────────────────────────────────────────
function ComposeModal({ visible, title, body, tag, submitting, onTitleChange, onBodyChange, onTagChange, onSubmit, onClose }) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={s.modal}>
          <View style={s.modalHeader}>
            <TouchableOpacity onPress={onClose}>
              <Text style={s.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={s.modalTitle}>New Post</Text>
            <TouchableOpacity
              onPress={onSubmit}
              disabled={submitting}
              style={[s.modalPost, submitting && { opacity: 0.5 }]}
            >
              {submitting
                ? <ActivityIndicator color={C.primary} />
                : <Text style={s.modalPostText}>Post</Text>}
            </TouchableOpacity>
          </View>

          <TextInput
            style={s.titleInput}
            placeholder="Title (max 300 chars)"
            placeholderTextColor={C.textMuted}
            value={title}
            onChangeText={onTitleChange}
            maxLength={300}
          />

          <TextInput
            style={s.bodyInput}
            placeholder="Share your thoughts…"
            placeholderTextColor={C.textMuted}
            value={body}
            onChangeText={onBodyChange}
            multiline
            maxLength={5000}
            textAlignVertical="top"
          />

          {/* Tag selector */}
          <Text style={s.tagLabel}>Tag</Text>
          <FlatList
            data={TAGS}
            keyExtractor={t => t}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingBottom: 16 }}
            renderItem={({ item: t }) => (
              <Pressable
                style={[s.tagChip, tag === t && s.tagChipActive]}
                onPress={() => onTagChange(t)}
              >
                <Text style={[s.tagChipText, tag === t && s.tagChipTextActive]}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Text>
              </Pressable>
            )}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatTime(iso) {
  const d = new Date(iso);
  const now = Date.now();
  const diff = Math.floor((now - d.getTime()) / 1000);
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  screen:          { flex: 1, backgroundColor: C.bg },
  center:          { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                     paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 },
  headerTitle:     { fontSize: 24, fontWeight: '800', color: C.text },
  composeBtn:      { backgroundColor: C.accent, paddingHorizontal: 14, paddingVertical: 8,
                     borderRadius: 20 },
  composeBtnText:  { color: '#0F1B14', fontWeight: '700', fontSize: 13 },
  tagRow:          { paddingHorizontal: 16, paddingBottom: 10, gap: 8, flexDirection: 'row' },
  tagChip:         { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 99,
                     backgroundColor: C.surface, borderWidth: 1, borderColor: C.border },
  tagChipActive:   { backgroundColor: C.accent, borderColor: C.accent },
  tagChipText:     { fontSize: 12, fontWeight: '600', color: C.textMuted },
  tagChipTextActive:{ color: '#0F1B14' },
  errorBanner:     { flexDirection: 'row', backgroundColor: '#3B0000', padding: 12,
                     alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 16,
                     borderRadius: 10, marginBottom: 8 },
  errorText:       { color: C.red, fontSize: 13, flex: 1 },
  retryText:       { color: C.accent, fontWeight: '700', fontSize: 13 },
  feed:            { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 40 },
  emptyText:       { textAlign: 'center', color: C.textMuted, marginTop: 60, fontSize: 15 },
  card:            { backgroundColor: C.surface, borderRadius: 16, padding: 16,
                     marginBottom: 12, borderWidth: 1, borderColor: C.border },
  cardHeader:      { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  avatar:          { width: 38, height: 38, borderRadius: 19, backgroundColor: C.primary,
                     alignItems: 'center', justifyContent: 'center' },
  avatarText:      { color: C.accent, fontWeight: '800', fontSize: 15 },
  authorName:      { fontSize: 14, fontWeight: '700', color: C.text },
  postTime:        { fontSize: 11, color: C.textMuted, marginTop: 1 },
  tagBadge:        { backgroundColor: C.primary, paddingHorizontal: 10, paddingVertical: 4,
                     borderRadius: 99 },
  tagBadgeText:    { fontSize: 10, fontWeight: '700', color: C.accentText, textTransform: 'uppercase' },
  postTitle:       { fontSize: 16, fontWeight: '700', color: C.text, marginBottom: 6 },
  postBody:        { fontSize: 14, color: C.textMuted, lineHeight: 20 },
  cardActions:     { flexDirection: 'row', marginTop: 14, gap: 16 },
  actionBtn:       { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionIcon:      { fontSize: 18, color: C.textMuted },
  actionText:      { fontSize: 13, color: C.textMuted, fontWeight: '600' },
  // Modal
  modal:           { flex: 1, backgroundColor: C.bg },
  modalHeader:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                     padding: 16, borderBottomWidth: 1, borderBottomColor: C.border },
  modalCancel:     { color: C.textMuted, fontSize: 15 },
  modalTitle:      { fontSize: 16, fontWeight: '700', color: C.text },
  modalPost:       { backgroundColor: C.accent, paddingHorizontal: 16, paddingVertical: 8,
                     borderRadius: 99, minWidth: 56, alignItems: 'center' },
  modalPostText:   { color: '#0F1B14', fontWeight: '800', fontSize: 14 },
  titleInput:      { borderBottomWidth: 1, borderBottomColor: C.border, color: C.text,
                     fontSize: 17, fontWeight: '600', padding: 16 },
  bodyInput:       { flex: 1, color: C.text, fontSize: 15, padding: 16, lineHeight: 22 },
  tagLabel:        { color: C.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1.2,
                     textTransform: 'uppercase', paddingHorizontal: 16, marginBottom: 8 },
});
