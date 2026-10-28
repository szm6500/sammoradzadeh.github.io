/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,json}"],
  theme: {
    extend: {
      colors: {
        alabaster: "#F8FAFC",
        ink: "#0F172A",
        ai: "#4F46E5",
        evaluation: "#D97706",
        behavioral: "#0D9488",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
