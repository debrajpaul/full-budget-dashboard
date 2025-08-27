export const currency = (v: number, code = 'INR') =>
new Intl.NumberFormat(undefined, { style: 'currency', currency: code, maximumFractionDigits: 0 }).format(v || 0);