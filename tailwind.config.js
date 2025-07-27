/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'apple': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#E8FFD7',
          100: '#D4F7C0',
          200: '#B8F0A0',
          300: '#93DA97',
          400: '#7ACB7A',
          500: '#5E936C',
          600: '#4A7A56',
          700: '#3E5F44',
          800: '#2F4A35',
          900: '#1F3327',
        }
      }
    },
  },
  plugins: [],
} 