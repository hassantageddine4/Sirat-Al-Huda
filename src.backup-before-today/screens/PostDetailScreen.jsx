// src/screens/PostDetailScreen.jsx
// Full post view with real-time comment thread.
// Navigated to from CommunityScreen (tap comment icon) and
// NotificationsScreen (tap a like/comment notification).

import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput,
  ActivityIndicator, KeyboardAvoidingView, Platform,
  StyleSheet, Alert, Pressable, ScrollView,
} from 'react-native';
import { useComments } from '../hooks/usePosts';
import { usePosts }    from '../hooks/usePosts';

const C = {
  bg: '#0F1B14', surface: '#1A2B1F', border: '#2A3F2E',
  primary: '#0F3D2E', accent: '#C8A951', accentText: '#D9BF7A',
  text: '#F0EDE8', textMuted: '#7A8A7E',
  likeRed: '#EF4444', green: '#22C55E',
};

// ─────────────────────────────────────────────────────────────────────────────
export default function PostDetailScreen({ route, navigation }) {
  const { postId } = route.params ?? {};
  const inputRef   = useRef(null);

  // We need the post data — grab it from route.params if passed,
  // otherwise we fetch via usePosts and find the one we need.
  const { posts, likedIds, like, loading: postsLoading } = usePosts();
  const post = route.params?.post ?? posts.find(p => p.id === postId);

  const {
    comments, loading, submitting, error,
    submit, remove: removeComment,
  } = useComments(postId);

  const [draft, setDraft] = useState('');

  // ── Submit comment ────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    inputRef.current?.blur();
    const { error: err } = await submit(text);
    if (err) {
      Alert.alert('Error', err);
      setDraft(text); // restore draft on failure
    }
  }, [draft, submit]);

  // ── Delete comment ────────────────────────────────────────────────────────
  const confirmDeleteComment = useCallback((commentId) => {
    Alert.alert('Delete comment', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeComment(commentId) },
    ]);
  }, [removeComment]);

  // ── Render comment ────────────────────────────────────────────────────────
  const renderComment = useCallback(({ item: comment }) => (
    <View style={s.commentRow}>
      <View style={s.commentAvatar}>
        <Text style={s.commentAvatarText}>
          {(comment.users?.name ?? 'U')[0].toUpperCase()}
        </Text>
      </View>
      <View style={s.commentBody}>
        <View style={s.commentMeta}>
          <Text style={s.commentAuthor}>{comment.users?.name ?? 'Anonymous'}</Text>
          <Text style={s.commentTime}>{formatTime(comment.created_at)}</Text>
        </View>
        <Text style={s.commentContent}>{comment.content}</Text>
      </View>
      <TouchableOpacity
        style={s.commentDelete}
        onPress={() => confirmDeleteComment(comment.id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={s.commentDeleteIcon}>⋯</Text>
      </TouchableOpacity>
    </View>
  ), [confirmDeleteComment]);

  // ── Loading / not-found states ────────────────────────────────────────────
  if (postsLoading && !post) {
    return (
      <View style={[s.screen, s.center]}>
        <ActivityIndicator color={C.accent} size="large" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={[s.screen, s.center]}>
        <Text style={s.emptyText}>Post not found.</Text>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text style={[s.emptyText, { color: C.accent, marginTop: 8 }]}>← Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isLiked = likedIds.has(post.id);

  return (
    <KeyboardAvoidingView
      style={s.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Back bar */}
      <View style={s.topBar}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={s.backBtn}>
          <Text style={s.backText}>‹ Back</Text>
        </TouchableOpacity>
        <View style={s.tagBadge}>
          <Text style={s.tagBadgeText}>{post.tag}</Text>
        </View>
      </View>

      <FlatList
        data={comments}
        keyExtractor={c => c.id}
        renderItem={renderComment}
        contentContainerStyle={s.list}
        ListEmptyComponent={
          loading
            ? <ActivityIndicator color={C.accent} style={{ marginTop: 24 }} />
            : <Text style={s.noComments}>Be the first to comment.</Text>
        }
        ListHeaderComponent={
          <>
            {/* Post body */}
            <View style={s.postCard}>
              {/* Author */}
              <View style={s.authorRow}>
                <View style={s.avatar}>
                  <Text style={s.avatarText}>
                    {(post.users?.name ?? 'U')[0].toUpperCase()}
                  </Text>
                </View>
                <View>
                  <Text style={s.authorName}>{post.users?.name ?? 'Anonymous'}</Text>
                  <Text style={s.postTime}>{formatTime(post.created_at)}</Text>
                </View>
              </View>

              {/* Content */}
              <Text style={s.postTitle}>{post.title}</Text>
              <Text style={s.postBody}>{post.content}</Text>

              {/* Like action */}
              <View style={s.postActions}>
                <TouchableOpacity style={s.likeBtn} onPress={() => like(post.id)}>
                  <Text style={[s.likeIcon, isLiked && { color: C.likeRed }]}>
                    {isLiked ? '♥' : '♡'}
                  </Text>
                  <Text style={[s.likeCount, isLiked && { color: C.likeRed }]}>
                    {post.likes ?? 0} {post.likes === 1 ? 'like' : 'likes'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Comments label */}
            <View style={s.commentsHeader}>
              <Text style={s.commentsLabel}>
                {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
              </Text>
            </View>

            {/* Error */}
            {error && (
              <View style={s.errorBanner}>
                <Text style={s.errorText}>{error}</Text>
              </View>
            )}
          </>
        }
      />

      {/* Comment composer — pinned at bottom */}
      <View style={s.composer}>
        <TextInput
          ref={inputRef}
          style={s.composerInput}
          placeholder="Write a comment…"
          placeholderTextColor={C.textMuted}
          value={draft}
          onChangeText={setDraft}
          multiline
          maxLength={2000}
          returnKeyType="send"
          blurOnSubmit={false}
          onSubmitEditing={handleSubmit}
        />
        <TouchableOpacity
          style={[s.sendBtn, (!draft.trim() || submitting) && s.sendBtnDisabled]}
          onPress={handleSubmit}
          disabled={!draft.trim() || submitting}
        >
          {submitting
            ? <ActivityIndicator color={C.primary} size="small" />
            : <Text style={s.sendIcon}>↑</Text>
          }
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatTime(iso) {
  const d    = new Date(iso);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  screen:            { flex: 1, backgroundColor: C.bg },
  center:            { justifyContent: 'center', alignItems: 'center' },
  // Top bar
  topBar:            { flexDirection: 'row', alignItems: 'center',
                       justifyContent: 'space-between',
                       paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8,
                       borderBottomWidth: 1, borderBottomColor: C.border },
  backBtn:           { paddingVertical: 4 },
  backText:          { color: C.accent, fontSize: 16, fontWeight: '600' },
  tagBadge:          { backgroundColor: C.primary, paddingHorizontal: 10,
                       paddingVertical: 4, borderRadius: 99 },
  tagBadgeText:      { color: C.accentText, fontSize: 10, fontWeight: '700',
                       textTransform: 'uppercase' },
  // Post card
  list:              { paddingBottom: 24 },
  postCard:          { backgroundColor: C.surface, margin: 16, borderRadius: 16,
                       padding: 18, borderWidth: 1, borderColor: C.border },
  authorRow:         { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  avatar:            { width: 40, height: 40, borderRadius: 20, backgroundColor: C.primary,
                       alignItems: 'center', justifyContent: 'center' },
  avatarText:        { color: C.accent, fontWeight: '800', fontSize: 16 },
  authorName:        { fontSize: 14, fontWeight: '700', color: C.text },
  postTime:          { fontSize: 11, color: C.textMuted, marginTop: 1 },
  postTitle:         { fontSize: 19, fontWeight: '800', color: C.text, marginBottom: 10 },
  postBody:          { fontSize: 15, color: C.textMuted, lineHeight: 22 },
  postActions:       { flexDirection: 'row', marginTop: 16, paddingTop: 14,
                       borderTopWidth: 1, borderTopColor: C.border },
  likeBtn:           { flexDirection: 'row', alignItems: 'center', gap: 6 },
  likeIcon:          { fontSize: 22, color: C.textMuted },
  likeCount:         { fontSize: 14, fontWeight: '600', color: C.textMuted },
  // Comments header
  commentsHeader:    { paddingHorizontal: 16, paddingBottom: 8 },
  commentsLabel:     { fontSize: 13, fontWeight: '700', color: C.textMuted,
                       textTransform: 'uppercase', letterSpacing: 0.8 },
  noComments:        { textAlign: 'center', color: C.textMuted, marginTop: 24,
                       fontSize: 14 },
  errorBanner:       { backgroundColor: '#3B0000', padding: 12, marginHorizontal: 16,
                       borderRadius: 10, marginBottom: 8 },
  errorText:         { color: '#EF4444', fontSize: 13 },
  // Comment row
  commentRow:        { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12,
                       borderBottomWidth: 1, borderBottomColor: C.border, alignItems: 'flex-start' },
  commentAvatar:     { width: 32, height: 32, borderRadius: 16, backgroundColor: C.surface,
                       borderWidth: 1, borderColor: C.border,
                       alignItems: 'center', justifyContent: 'center', marginRight: 10,
                       flexShrink: 0 },
  commentAvatarText: { color: C.accent, fontWeight: '700', fontSize: 12 },
  commentBody:       { flex: 1 },
  commentMeta:       { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  commentAuthor:     { fontSize: 13, fontWeight: '700', color: C.text },
  commentTime:       { fontSize: 11, color: C.textMuted },
  commentContent:    { fontSize: 14, color: C.textMuted, lineHeight: 20 },
  commentDelete:     { paddingLeft: 10 },
  commentDeleteIcon: { color: C.textMuted, fontSize: 18 },
  // Composer
  composer:          { flexDirection: 'row', alignItems: 'flex-end', gap: 10,
                       padding: 12, paddingBottom: 16,
                       borderTopWidth: 1, borderTopColor: C.border,
                       backgroundColor: C.bg },
  composerInput:     { flex: 1, backgroundColor: C.surface, borderRadius: 22,
                       paddingHorizontal: 16, paddingVertical: 10,
                       color: C.text, fontSize: 14, lineHeight: 20,
                       borderWidth: 1, borderColor: C.border, maxHeight: 100 },
  sendBtn:           { width: 42, height: 42, borderRadius: 21,
                       backgroundColor: C.accent,
                       alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  sendBtnDisabled:   { opacity: 0.4 },
  sendIcon:          { color: C.primary, fontSize: 18, fontWeight: '800' },
  emptyText:         { color: C.textMuted, fontSize: 15, textAlign: 'center' },
});
