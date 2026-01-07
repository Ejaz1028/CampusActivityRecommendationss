/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#f8fafc", // Light Grey/White
        secondary: "#3b82f6", // Blue 500
        "darker-secondary": "#2563eb", // Blue 600
        "brand-dark": "#0f172a", // Slate 900
        "brand-muted": "#64748b", // Slate 500
      },
      fontFamily: {
        sans: ["Outfit", "sans-serif"],
      },
    },
  },
  plugins: [],
};
