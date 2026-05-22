/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0b1020",
        panel: "#111a30",
        ok: "#10b981",
        nok: "#ef4444",
        duplicate: "#f59e0b",
      },
    },
  },
  plugins: [],
};
