import os, sys
p = os.path.expanduser('~/Downloads/sirat-capacitor-3/src/pages/Community.jsx')
t = open(p).read()

# 1. Add ReactDOM import next to the existing React import
old_imp = 'import React, { useState } from "react";'
new_imp = 'import React, { useState } from "react";\nimport ReactDOM from "react-dom";'
if 'import ReactDOM' not in t:
    if old_imp in t:
        t = t.replace(old_imp, new_imp)
        print("✓ ReactDOM import added")
    else:
        print("✗ Couldn't find React import")
        sys.exit(1)
else:
    print("• ReactDOM already imported")

# 2. Wrap the compose modal in ReactDOM.createPortal
old_compose_open = '''      {composing && (
        <div className="fixed inset-0 z-50 flex flex-col animate-fade-in"
          style={{ background:"#0F1B14" }}>'''
new_compose_open = '''      {composing && ReactDOM.createPortal(
        <div className="fixed inset-0 flex flex-col animate-fade-in"
          style={{ background:"#0F1B14", zIndex: 9999 }}>'''
if old_compose_open in t:
    t = t.replace(old_compose_open, new_compose_open)
    print("✓ Compose modal opening portaled")
else:
    print("✗ Couldn't find compose modal opening — already patched?")

# Close it: find the matching `</div>\n      )}` after the compose modal and append `, document.body)`
# The compose modal closes with: ` </div>\n      )}\n\n      {openPost && (`
old_compose_close = '''            </div>
          </div>
        </div>
      )}

      {openPost && ('''
new_compose_close = '''            </div>
          </div>
        </div>,
        document.body
      )}

      {openPost && ('''
if old_compose_close in t:
    t = t.replace(old_compose_close, new_compose_close)
    print("✓ Compose modal closing portaled")
else:
    print("✗ Couldn't find compose modal closing")

# 3. Wrap the post detail drawer in portal too
old_drawer_open = '''      {openPost && (
        <PostDetailDrawer'''
new_drawer_open = '''      {openPost && ReactDOM.createPortal(
        <PostDetailDrawer'''
if old_drawer_open in t:
    t = t.replace(old_drawer_open, new_drawer_open)
    print("✓ Post detail drawer portal opening")

# And its closing
old_drawer_close = '''        <PostDetailDrawer
          post={openPost}
          liked={likedIds.has(openPost.id)}
          onLike={() => like(openPost.id)}
          onClose={() => setOpenPost(null)}
          askConfirm={askConfirm}
        />
      )}'''
new_drawer_close = '''        <PostDetailDrawer
          post={openPost}
          liked={likedIds.has(openPost.id)}
          onLike={() => like(openPost.id)}
          onClose={() => setOpenPost(null)}
          askConfirm={askConfirm}
        />,
        document.body
      )}'''
if old_drawer_close in t:
    t = t.replace(old_drawer_close, new_drawer_close)
    print("✓ Post detail drawer portal closing")

# 4. Also portal the ConfirmDialog
old_confirm_open = '''      {confirm && (
        <ConfirmDialog'''
new_confirm_open = '''      {confirm && ReactDOM.createPortal(
        <ConfirmDialog'''
if old_confirm_open in t:
    t = t.replace(old_confirm_open, new_confirm_open)
    print("✓ ConfirmDialog portal opening")

old_confirm_close = '''          onConfirm={() => { confirm.onConfirm?.(); setConfirm(null); }}
        />
      )}'''
new_confirm_close = '''          onConfirm={() => { confirm.onConfirm?.(); setConfirm(null); }}
        />,
        document.body
      )}'''
if old_confirm_close in t:
    t = t.replace(old_confirm_close, new_confirm_close)
    print("✓ ConfirmDialog portal closing")

# Also bump ConfirmDialog z-index
t = t.replace('className="fixed inset-0 z-[60]', 'className="fixed inset-0"', 1)
t = t.replace(
    '      style={{ background:"rgba(0,0,0,0.55)" }}\n      onClick={e => { if (e.target === e.currentTarget) onCancel(); }}',
    '      style={{ background:"rgba(0,0,0,0.55)", zIndex: 9999 }}\n      onClick={e => { if (e.target === e.currentTarget) onCancel(); }}',
    1
)
print("✓ ConfirmDialog z-index bumped")

# Bump drawer z-index too (was z-50)
t = t.replace(
    'className="fixed inset-0 z-50 flex items-end" style={{ background:"rgba(0,0,0,0.65)" }}',
    'className="fixed inset-0 flex items-end" style={{ background:"rgba(0,0,0,0.65)", zIndex: 9999 }}',
    1
)
print("✓ Drawer z-index bumped")

open(p, 'w').write(t)
print("\nDone.")
