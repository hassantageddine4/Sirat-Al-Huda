
        {/* ─── Post-Prayer Adhkar ───────────────────────────────────────── */}
        <section>
          <SectionLabel>Post-Prayer Adhkar</SectionLabel>
          {(() => {
            let resume = null;
            for (const p of PRAYER_ORDER) {
              const s = getSession(p);
              const c = s.subhanAllah + s.alhamdulillah + s.allahuAkbar;
              if (c > 0 && !isSessionComplete(p)) { resume = { prayer: p, count: c }; break; }
            }
            const progress = resume ? Math.min(100, Math.round((resume.count / 100) * 100)) : 0;
            return (
              <button
                onClick={() => navigate("/practice/adhkar", resume ? { state: { prayer: resume.prayer } } : undefined)}
                className="w-full rounded-2xl text-left transition-transform active:scale-[0.98]"
                style={{
                  background: "white",
                  border: "0.5px solid #E8E2D8",
                  boxShadow: "0 4px 14px rgba(10,8,6,0.05)",
                  padding: "16px 18px",
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex items-center justify-center rounded-full shrink-0"
                    style={{
                      width: 46,
                      height: 46,
                      background: "linear-gradient(135deg, #1B5E48 0%, #2D7D5F 100%)",
                      color: "white",
                      fontFamily: "Fraunces, serif",
                      fontSize: 18,
                      fontWeight: 500,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    ٣٣
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      style={{
                        fontFamily: "Fraunces, serif",
                        fontSize: 16,
                        fontWeight: 500,
                        color: "#1A1614",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {resume ? `Resume ${resume.prayer} Tasbīḥāt` : "Begin Post-Prayer Adhkar"}
                    </div>
                    <div
                      style={{
                        fontSize: 12.5,
                        color: "#7A7268",
                        marginTop: 2,
                      }}
                    >
                      {resume
                        ? `${resume.count} of 100 · Subḥān · Ḥamd · Akbar`
                        : "SubḥānAllāh · Alḥamdulillāh · Allāhu Akbar"}
                    </div>
                    {resume && (
                      <div
                        style={{
                          marginTop: 8,
                          height: 3,
                          borderRadius: 2,
                          background: "#F0EAE0",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${progress}%`,
                            height: "100%",
                            background: "linear-gradient(90deg, #1B5E48, #2D7D5F)",
                            transition: "width 240ms ease",
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#B8AFA3"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flexShrink: 0 }}
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </button>
            );
          })()}
        </section>

