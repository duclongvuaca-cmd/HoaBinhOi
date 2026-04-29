/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#f0f9f5",
          100: "#dcf2e5",
          200: "#bbe4ce",
          300: "#8dcfae",
          400: "#5ab489",
          500: "#37996b",
          600: "#287a55",
          700: "#216145",
          800: "#1d4d39",
          900: "#193f30"
        },
        sun: {
          50:  "#fff8eb",
          100: "#ffeac6",
          200: "#ffd388",
          300: "#ffb84a",
          400: "#ff9f1f",
          500: "#f97e07",
          600: "#dc5b03",
          700: "#b73e07",
          800: "#933110",
          900: "#792a11"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-be-vietnam)", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
