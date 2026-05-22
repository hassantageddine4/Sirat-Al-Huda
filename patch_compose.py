import os, sys, re
p = os.path.expanduser('~/Downloads/sirat-capacitor-3/src/pages/Community.jsx')
t = open(p).read()

# Replace the compose modal block — make it full-screen with safe area
old = '''      {composing && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background:"rgba(0,0,0,0.6)" }}>
          <div className="w-full rounded-t-3xl overflow-hidden animate-fade-in"
            style={{ background:"#0F1B14", maxHeight:"90vh", display:"flex", flexDirection:"column" }}>
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-9 h-1 rounded-full bg-white/20" />
            </div>

            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">'''

new = '''      {composing && (
        <div className="fixed inset-0 z-50 flex flex-col animate-fade-in"
          style={{ background:"#0F1B14" }}>
          <div className="pt-safe flex-shrink-0" style={{ background:"#0F1B14" }} />
          <div className="flex flex-1 flex-col overflow-hidden">

            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 flex-shrink-0">'''

if old in t:
    t = t.replace(old, new)
    print("✓ Compose modal: header rewritten")
else:
    print("✗ Couldn't find compose modal opening; not patched")
    sys.exit(1)

# Replace the closing of the modal — need to close one fewer div now
# Old structure ended:
#   ... tag buttons ...
#   </div>  <-- closes overflow-y-auto
#   </div>  <-- closes rounded-t-3xl modal child
#   </div>  <-- closes fixed inset-0
# }
#
# New structure ends:
#   ... tag buttons ...
#   </div>  <-- closes overflow-y-auto
#   </div>  <-- closes flex-1 flex-col
#   </div>  <-- closes fixed inset-0 outer
# }

# The closing portion to find is right after the tag picker
old_close = '''                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {openPost && ('''

new_close = '''                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {openPost && ('''

# That's the same string actually - the indent stayed same since structure depth is similar
# Let me check carefully and not change closing if not needed
# Actually we removed the handle div and replaced 'items-end' wrapper child with a different child structure
# Original: <div inset-0 items-end>  <div modal rounded-t-3xl>  <div handle/>  <div header/>  <div content/>  </div></div>
# New:      <div inset-0 flex-col>   <div safe/>  <div flex-1 flex-col>  <div header/>  <div content/>  </div></div>

# Both have: outer div + inner wrapper + (header) + (content overflow-y-auto)
# Original inner wrapper = "rounded-t-3xl..."
# New inner wrapper = "flex flex-1 flex-col"
# Both close the same way: </div for content> </div for inner wrapper> </div for outer>
# So closing matches.

# Verify final result builds OK
open(p, 'w').write(t)
print("✓ Patched Community.jsx")
