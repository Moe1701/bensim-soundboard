/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {}, // Die Farben (slate, red, indigo) aus deinem Konzept sind bei Tailwind schon im Standard enthalten!
  },
  plugins: [],
}