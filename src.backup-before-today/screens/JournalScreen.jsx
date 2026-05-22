// src/screens/JournalScreen.jsx
// Private journal — only the authenticated user can see their own entries.

import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput,
  ActivityIndicator, RefreshControl, Modal, KeyboardAvoidingView,
  Platform, StyleSheet, Alert, Pressable,
} from 'react-native';
import { useJournal } from '../hooks/useJournal';

const MOODS = ['grateful', 'reflective', 'hopeful', 'struggling', 'peaceful'];
const MOOD_EMOJI = {
  grateful: '🤲', reflective: '💭', hopeful: '🌱', struggling: '💪', peaceful: '🕊',
};

const C = {
  bg: '#0F1B14', surface: '#1A2B1F', border: '#2A3F2E',
  primary: '#0F3D2E', accent: '#C8A951', accentText: '#D9BF7A',
  text: '#F0EDE8', textMuted: '#7A8A7E', red: '#EF4444',
};

export default function JournalScreen() {
  const [activeMood, setActiveMood] = useState(null);
  const [editing,    setEditing]    = useState(null); // null | { id?, content, mood }
  const [draftBody,  setDraftBody]  = useState('');
  const [draftMood,  setDraftMood]  = useState('reflective');

  const { entries, loading, loadingMore, saving, error, hasMore, refresh, loadMore, create, update, remove } =
    useJournal({ mood: activeMood });

  // ── Open editor ───────────────────────────────────────────────────────────
  const openNew = () => {
    setEditing({ isNew: true });
    setDraftBody('');
    setDraftMood('reflective');
  };

  const openEdit = (entry) => {
    setEditing({ id: entry.id, isNew: false });
    setDraftBody(entry.content);
    setDraftMood(entry.mood);
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (!draftBody.trim()) {
      Alert.alert('Empty', 'Please write something before saving.');
      return;
    }

    let result;
    if (editing?.isNew) {
      result = await create({ content: draftBody, mood: draftMood });
    } else {
      result = await update(editing.id, { content: draftBody, mood: draftMood });
    }

    if (result.error) { Alert.alert('Error', result.error); return; }
    setEditing(null);
  }, [draftBody, draftMood, editing, create, update]);

  // ── Delete with confirm ───────────────────────────────────────────────────
  const confirmDelete = (entryId) => {
    Alert.alert('Delete entry', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => remove(entryId) },
    ]);
  };

  // ── Render entry ──────────────────────────────────────────────────────────
  const renderEntry = useCallback(({ item: entry }) => (
    <TouchableOpacity style={s.card} onPress={() => openEdit(entry)}>
      <View style={s.cardTop}>
        <View style={s.moodBadge}>
          <Text style={s.moodEmoji}>{MOOD_EMOJI[entry.mood] ?? '📓'}</Text>
          <Text style={s.moodText}>{entry.mood}</Text>
        </View>
        <Text style={s.entryDate}>{formatDate(entry.created_at)}</Text>
      </View>
      <Text style={s.entryPreview} numberOfLines={3}>{entry.content}</Text>
      <TouchableOpacity style={s.deleteBtn} onPress={() => confirmDelete(entry.id)}>
        <Text style={s.deleteBtnText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  ), [remove]);

  const renderFooter = () =>
    loadingMore ? <ActivityIndicator color={C.accent} style={{ marginVertical: 16 }} /> : null;

  return (
    <View style={s.screen}>
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.headerTitle}>My Journal</Text>
          <Text style={s.headerSub}>Private • Synced</Text>
        </View>
        <TouchableOpacity style={s.newBtn} onPress={openNew}>
          <Text style={s.newBtnText}>+ Entry</Text>
        </TouchableOpacity>
      </View>

      {/* Mood filter */}
      <FlatList
        data={[null, ...MOODS]}
        keyExtractor={m => m ?? 'all'}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.moodRow}
        renderItem={({ item: mood }) => (
          <Pressable
            style={[s.moodChip, activeMood === mood && s.moodChipActive]}
            onPress={() => setActiveMood(mood)}
          >
            <Text style={s.moodChipText}>
              {mood ? `${MOOD_EMOJI[mood]} ${mood.charAt(0).toUpperCase() + mood.slice(1)}` : '📓 All'}
            </Text>
          </Pressable>
        )}
      />

      {/* Error */}
      {error && (
        <View style={s.errorBanner}>
          <Text style={s.errorText}>{error}</Text>
          <TouchableOpacity onPress={refresh}><Text style={s.retryText}>Retry</Text></TouchableOpacity>
        </View>
      )}

      {/* List */}
      {loading && !entries.length ? (
        <View style={s.center}><ActivityIndicator color={C.accent} size="large" /></View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={e => e.id}
          renderItem={renderEntry}
          contentContainerStyle={s.list}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <Text style={s.emptyText}>Your journal is empty.{'\n'}Write your first entry ✍️</Text>
          }
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={C.accent} />
          }
        />
      )}

      {/* Editor modal */}
      <Modal visible={!!editing} animationType="slide" presentationStyle="pageSheet">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <View style={s.modal}>
            {/* Modal header */}
            <View style={s.modalHeader}>
              <TouchableOpacity onPress={() => setEditing(null)}>
                <Text style={s.modalCancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={s.modalTitle}>{editing?.isNew ? 'New Entry' : 'Edit Entry'}</Text>
              <TouchableOpacity
                onPress={handleSave}
                disabled={saving}
                style={[s.saveBtn, saving && { opacity: 0.5 }]}
              >
                {saving
                  ? <ActivityIndicator color={C.primary} size="small" />
                  : <Text style={s.saveBtnText}>Save</Text>
                }
              </TouchableOpacity>
            </View>

            {/* Mood selector */}
            <FlatList
              data={MOODS}
              keyExtractor={m => m}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingVertical: 12 }}
              renderItem={({ item: mood }) => (
                <Pressable
                  style={[s.moodChip, draftMood === mood && s.moodChipActive]}
                  onPress={() => setDraftMood(mood)}
                >
                  <Text style={s.moodChipText}>
                    {MOOD_EMOJI[mood]} {mood.charAt(0).toUpperCase() + mood.slice(1)}
                  </Text>
                </Pressable>
              )}
            />

            {/* Text area */}
            <TextInput
              style={s.textArea}
              placeholder="Write your reflection…"
              placeholderTextColor={C.textMuted}
              value={draftBody}
              onChangeText={setDraftBody}
              multiline
              maxLength={10000}
              textAlignVertical="top"
              autoFocus
            />

            <Text style={s.charCount}>{draftBody.length} / 10,000</Text>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: C.bg },
  center:       { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header:       { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
                  paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 },
  headerTitle:  { fontSize: 24, fontWeight: '800', color: C.text },
  headerSub:    { fontSize: 11, color: C.textMuted, marginTop: 2 },
  newBtn:       { backgroundColor: C.accent, paddingHorizontal: 14, paddingVertical: 8,
                  borderRadius: 20, marginTop: 4 },
  newBtnText:   { color: '#0F1B14', fontWeight: '700', fontSize: 13 },
  moodRow:      { paddingHorizontal: 16, paddingBottom: 10, gap: 8 },
  moodChip:     { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 99,
                  backgroundColor: C.surface, borderWidth: 1, borderColor: C.border },
  moodChipActive:{ backgroundColor: C.accent, borderColor: C.accent },
  moodChipText: { fontSize: 12, fontWeight: '600', color: C.textMuted },
  errorBanner:  { flexDirection: 'row', backgroundColor: '#3B0000', padding: 12,
                  alignItems: 'center', justifyContent: 'space-between',
                  marginHorizontal: 16, borderRadius: 10, marginBottom: 8 },
  errorText:    { color: C.red, fontSize: 13, flex: 1 },
  retryText:    { color: C.accent, fontWeight: '700', fontSize: 13 },
  list:         { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 40 },
  emptyText:    { textAlign: 'center', color: C.textMuted, marginTop: 60, fontSize: 15, lineHeight: 24 },
  card:         { backgroundColor: C.surface, borderRadius: 16, padding: 16,
                  marginBottom: 12, borderWidth: 1, borderColor: C.border },
  cardTop:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: 10 },
  moodBadge:    { flexDirection: 'row', alignItems: 'center', gap: 5,
                  backgroundColor: C.primary, paddingHorizontal: 10, paddingVertical: 4,
                  borderRadius: 99 },
  moodEmoji:    { fontSize: 13 },
  moodText:     { fontSize: 11, fontWeight: '700', color: C.accentText, textTransform: 'capitalize' },
  entryDate:    { fontSize: 11, color: C.textMuted },
  entryPreview: { fontSize: 14, color: C.textMuted, lineHeight: 20 },
  deleteBtn:    { alignSelf: 'flex-end', marginTop: 10, paddingHorizontal: 12, paddingVertical: 5,
                  borderRadius: 8, borderWidth: 1, borderColor: '#3B0000' },
  deleteBtnText:{ fontSize: 12, color: C.red },
  // Modal
  modal:        { flex: 1, backgroundColor: C.bg },
  modalHeader:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                  padding: 16, borderBottomWidth: 1, borderBottomColor: C.border },
  modalCancel:  { color: C.textMuted, fontSize: 15 },
  modalTitle:   { fontSize: 16, fontWeight: '700', color: C.text },
  saveBtn:      { backgroundColor: C.accent, paddingHorizontal: 16, paddingVertical: 8,
                  borderRadius: 99, minWidth: 60, alignItems: 'center' },
  saveBtnText:  { color: '#0F1B14', fontWeight: '800', fontSize: 14 },
  textArea:     { flex: 1, color: C.text, fontSize: 16, padding: 16,
                  lineHeight: 24, textAlignVertical: 'top' },
  charCount:    { textAlign: 'right', color: C.textMuted, fontSize: 11,
                  paddingHorizontal: 16, paddingBottom: 12 },
});
