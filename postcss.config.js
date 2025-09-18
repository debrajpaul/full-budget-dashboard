export default {
  plugins: {
    '@tailwindcss/postcss': { config: './tailwind.config.ts' },  // ensure TS config is loaded
    autoprefixer: {},            // (optional but fine to keep)
  },
};
