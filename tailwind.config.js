/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#DEDBC8',
      },
      fontFamily: {
        display: ['"Space Grotesk"', '"Inter Variable"', '"Inter"', 'system-ui', 'sans-serif'],
        gelasio: ['"Gelasio"', '"Inter Variable"', '"Inter"', 'serif'],
      },
    },
  },
  plugins: [],
}
