/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // This is important for class-based dark mode
  theme: {
    extend: {
      spacing: {
        '250': '250px',
      },
    },
  },
  plugins: [],
}


