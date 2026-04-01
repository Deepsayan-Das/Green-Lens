// tailwind.config.mjs
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './pages/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        eco: {
          green: '#34D399',
          dark: '#065f46',
          light: '#D1E8E2',
          mint: '#A3E4A6',
        },
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
