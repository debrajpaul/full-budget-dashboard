import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Preferences = {
  showBudgetVsActual: boolean;
  showCategoryBreakdown: boolean;
  showSavingsGoals: boolean;
  selectedMonth: number;
  selectedYear: number;
};

type BooleanPreferenceKey = {
  [K in keyof Preferences]: Preferences[K] extends boolean ? K : never;
}[keyof Preferences];

interface PreferencesContextValue {
  preferences: Preferences;
  setPreference: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
  togglePreference: (key: BooleanPreferenceKey) => void;
  resetPreferences: () => void;
}

const PREFERENCES_KEY = 'app.preferences';

const today = new Date();

const defaultPreferences: Preferences = {
  showBudgetVsActual: true,
  showCategoryBreakdown: true,
  showSavingsGoals: true,
  selectedMonth: today.getMonth() + 1,
  selectedYear: today.getFullYear(),
};

const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined);

function readInitialPreferences(): Preferences {
  if (typeof window === 'undefined') return defaultPreferences;
  const stored = window.localStorage.getItem(PREFERENCES_KEY);
  if (!stored) return defaultPreferences;
  try {
    const parsed = JSON.parse(stored) as Partial<Preferences>;
    const merged: Preferences = { ...defaultPreferences, ...parsed };

    const parsedMonth = Number(parsed?.selectedMonth ?? merged.selectedMonth);
    merged.selectedMonth =
      Number.isFinite(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12
        ? parsedMonth
        : defaultPreferences.selectedMonth;

    const parsedYear = Number(parsed?.selectedYear ?? merged.selectedYear);
    merged.selectedYear = Number.isFinite(parsedYear) ? parsedYear : defaultPreferences.selectedYear;

    return merged;
  } catch (error) {
    console.warn('Failed to parse stored preferences', error);
    window.localStorage.removeItem(PREFERENCES_KEY);
    return defaultPreferences;
  }
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>(() => readInitialPreferences());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const setPreference = useCallback(<K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  }, []);

  const togglePreference = useCallback((key: BooleanPreferenceKey) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const resetPreferences = useCallback(() => {
    setPreferences(defaultPreferences);
  }, []);

  const value = useMemo(
    () => ({
      preferences,
      setPreference,
      togglePreference,
      resetPreferences,
    }),
    [preferences, setPreference, togglePreference, resetPreferences]
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences must be used within a PreferencesProvider');
  return context;
}

export { defaultPreferences };
