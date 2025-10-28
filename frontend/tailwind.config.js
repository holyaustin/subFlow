/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          500: "#2563eb", // blue
        },
        accent: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecaca",
          500: "#ef4444", // red
        },
        dark: {
          50: "#f8fafc",
          100: "#f1f5f9",
          900: "#0f172a" // blackish
        }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      }
    }
  },
  plugins: []
};
