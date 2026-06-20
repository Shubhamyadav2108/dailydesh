import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        head: ["var(--font-head)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      colors: {
        ink: "#1a1614",
        paper: "#fbf9f5",
        masthead: "#c1272d",
        ribbon: "#1a1614",
      },
    },
  },
  plugins: [],
} satisfies Config;
