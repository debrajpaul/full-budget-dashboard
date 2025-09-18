// Simple emoji mapper for common categories with a safe fallback
export function categoryEmoji(name?: string) {
  const key = (name || '').toLowerCase();
  const map: Record<string, string> = {
    groceries: '🛒',
    food: '🍔',
    dining: '🍽️',
    transport: '🚌',
    travel: '✈️',
    fuel: '⛽',
    rent: '🏠',
    housing: '🏠',
    utilities: '💡',
    internet: '🌐',
    phone: '📱',
    shopping: '🛍️',
    health: '🩺',
    medical: '💊',
    fitness: '💪',
    subscriptions: '🔁',
    entertainment: '🎬',
    education: '🎓',
    salary: '💼',
    income: '💰',
    savings: '🏦',
    insurance: '🛡️',
    gifts: '🎁',
    pets: '🐾',
    kids: '🧸',
    charity: '🤝',
    emi: '🏦',
    tuition: '📚',
    upi: '📲',
  };
  for (const k of Object.keys(map)) {
    if (key.includes(k)) return map[k];
  }
  return '🏷️';
}

// Deterministic soft color from string
export function categoryColor(name?: string) {
  const palette = ['#e0f2fe', '#ecfccb', '#fee2e2', '#fae8ff', '#e5e7eb', '#dcfce7', '#ffedd5'];
  const s = (name || '');
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  return palette[hash % palette.length];
}
