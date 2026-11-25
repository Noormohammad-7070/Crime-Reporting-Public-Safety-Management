/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#06122a',
          900: '#0b1f44',
          800: '#102a56',
          700: '#163a75',
        },
        alert: '#dc2626',
        resolved: '#16a34a',
      },
      boxShadow: {
        card: '0 10px 30px rgba(11,31,68,0.12)',
      },
    },
  },
  plugins: [],
};
