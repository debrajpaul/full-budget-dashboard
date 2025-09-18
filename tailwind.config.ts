import defaultTheme from 'tailwindcss/defaultTheme';
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#111936',
        secondary: '#f5f7fa',
        cardBg: '#F9FAFB',
        accentBlue: '#3B82F6',
        accentGreen: '#22C55E',
        accentOrange: '#F59E0B',
        accentRed: '#EF4444',
        income: '#36b37e',
        expense: '#ff5630',
        savings: '#6554c0',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};

export default config;
