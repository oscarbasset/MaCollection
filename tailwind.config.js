/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['system-ui', 'SF Pro Text', 'ui-sans-serif', 'sans-serif'],
      },
      colors: {
        'mc-bg': '#020617',
      },
      boxShadow: {
        'soft-xl': '0 24px 80px rgba(0,0,0,0.65)',
      },
    },
  },
  plugins: [],
};

