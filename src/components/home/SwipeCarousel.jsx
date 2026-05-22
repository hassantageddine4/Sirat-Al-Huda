import React, { useEffect, useRef, useState, Children } from "react";

export default function SwipeCarousel({ children }) {
  const scrollerRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const slides = Children.toArray(children).filter(Boolean);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let raf = null;
    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = el.clientWidth;
        if (!w) return;
        const idx = Math.round(el.scrollLeft / w);
        setActiveIdx(idx);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (slides.length === 0) return null;
  if (slides.length === 1) return <div className="mb-4">{slides[0]}</div>;

  return (
    <div className="mb-4">
      <div
        ref={scrollerRef}
        className="flex overflow-x-auto"
        style={{
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}>
        <style>{`
          .swipe-carousel-track::-webkit-scrollbar { display: none; }
        `}</style>
        {slides.map((slide, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-full"
            style={{ scrollSnapAlign: "start" }}>
            {slide}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {slides.map((_, i) => (
          <span
            key={i}
            style={{
              width: i === activeIdx ? 18 : 6,
              height: 6,
              borderRadius: 3,
              background: i === activeIdx ? "#C8A951" : "rgba(200,169,81,0.28)",
              transition: "all 0.25s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}
