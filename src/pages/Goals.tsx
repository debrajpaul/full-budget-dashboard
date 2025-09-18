import { Card } from '@/components/Card';

export default function Goals() {
  return (
    <section className="space-y-6">
      <Card padding="lg" className="space-y-2">
        <h1 className="text-2xl font-semibold text-zinc-900">Goals</h1>
        <p className="text-sm text-zinc-600">
          Track long-term savings and financial milestones as the experience evolves.
        </p>
      </Card>

      <Card
        padding="lg"
        className="flex min-h-[220px] items-center justify-center text-center text-sm text-zinc-500"
      >
        Visual goal planning, recommendations, and projections will live in this space soon.
      </Card>
    </section>
  );
}
