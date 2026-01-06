/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        km18: {
          orange: '#EB7955',
          palePink: '#FFCDEC',
          hotPink: '#FF53B2',
          purple: '#6B0098',
          blue: '#006096',
          cyan: '#00D4E5',
          dark: '#0A0A0A',
          darker: '#050505',
          card: '#111111',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Quintessential', 'cursive'],
        script: ['Pinyon Script', 'cursive'],
      }
    },
  },
  plugins: [],
}