import os
p = os.path.expanduser('~/Downloads/sirat-capacitor-3/src/pages/AskSirat.jsx')
t = open(p).read()

old = '''            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask about prayer, hadith, duas..."
              rows={1}
              style={{
                flex: 1, padding: "10px 14px", borderRadius: 18,
                border: `0.5px solid ${C.hairline}`, background: "white",
                fontSize: 16, color: C.ink, resize: "none", maxHeight: 100, outline: "none",
                fontFamily: "inherit",
              }}
            />'''

new = '''            <textarea
              ref={el => {
                if (el) {
                  el.style.height = "auto";
                  el.style.height = Math.min(el.scrollHeight, 180) + "px";
                }
              }}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask about prayer, hadith, duas..."
              rows={1}
              style={{
                flex: 1, padding: "10px 14px", borderRadius: 18,
                border: `0.5px solid ${C.hairline}`, background: "white",
                fontSize: 16, color: C.ink, resize: "none", maxHeight: 180, outline: "none",
                fontFamily: "inherit", lineHeight: 1.4, overflowY: "auto",
              }}
            />'''

if old in t:
    t = t.replace(old, new)
    open(p, 'w').write(t)
    print("patched")
else:
    print("not found")
