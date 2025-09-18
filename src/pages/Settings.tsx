import { Card } from '@/components/Card';
import { usePreferences } from '@/hooks/usePreferences';

export default function Settings() {
  const { preferences, togglePreference } = usePreferences();

  return (
    <section className="mx-auto w-full max-w-3xl space-y-6">
      <Card padding="lg" className="space-y-3">
        <h1 className="text-2xl font-semibold text-zinc-900">Settings</h1>
        <p className="text-sm text-zinc-600">
          Choose which insights appear on your dashboard. Changes save automatically.
        </p>
      </Card>

      <Card padding="lg" className="space-y-5">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-zinc-900">Dashboard preferences</h2>
          <p className="text-sm text-zinc-600">
            Toggle these options to customise the dashboard experience for your team.
          </p>
        </div>
        <div className="space-y-4">
          <PreferenceToggle
            id="showBudgetVsActual"
            label="Show budget vs. actual"
            description="Display the monthly line chart comparing planned versus actual spending."
            checked={preferences.showBudgetVsActual}
            onChange={() => togglePreference('showBudgetVsActual')}
          />
          <PreferenceToggle
            id="showCategoryBreakdown"
            label="Show category breakdown"
            description="Include the pie chart summarising spending by category."
            checked={preferences.showCategoryBreakdown}
            onChange={() => togglePreference('showCategoryBreakdown')}
          />
          <PreferenceToggle
            id="showSavingsGoals"
            label="Show savings goals"
            description="Keep the savings goals table visible on the dashboard."
            checked={preferences.showSavingsGoals}
            onChange={() => togglePreference('showSavingsGoals')}
          />
        </div>
      </Card>
    </section>
  );
}

function PreferenceToggle({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-start gap-5 rounded-lg bg-zinc-50 p-5"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-1 h-5 w-5 rounded border-zinc-300"
      />
      <span>
        <span className="block text-sm font-medium text-zinc-900">{label}</span>
        <span className="block text-xs text-zinc-600">{description}</span>
      </span>
    </label>
  );
}
