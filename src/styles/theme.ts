export const theme = {
  colors: {
    income: '#36b37e',
    expense: '#ff5630',
    savings: '#6554c0',
  },
} as const;

export type Theme = typeof theme;
