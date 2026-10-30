/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B0909',
        burgundy: '#35171D',
        amber: '#B66A36',
        gold: '#C9A477',
        ivory: '#F1E8DC',
        smoke: '#77716D',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
      },
      letterSpacing: {
        label: '0.36em',
      },
    },
  },
  plugins: [],
};
