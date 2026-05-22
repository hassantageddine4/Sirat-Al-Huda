/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary     : "#0F3D2E",
        "primary-light": "#1A5C44",
        "primary-dark" : "#082819",
        accent      : "#C8A951",
        "accent-light" : "#D9BF7A",
        "accent-dark"  : "#A88730",
        ivory       : "#FAF7F2",
        offwhite    : "#F4F0E8",
        parchment   : "#EDE7D9",
        ink         : "#1C1814",
        body        : "#3A3530",
        muted       : "#7A7268",
        subtle      : "#A09890",
        "border-color": "#E8E2D8",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "SF Pro Display", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        "gold" : "0 6px 18px rgba(200,169,81,0.30)",
        "green": "0 8px 24px rgba(15,61,46,0.25)",
        "card" : "0 4px 16px rgba(10,8,6,0.10)",
      },
    },
  },
  plugins: [],
};
