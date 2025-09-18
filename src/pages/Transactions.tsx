import { Card } from '@/components/Card';

export default function Transactions() {
  return (
    <section className="space-y-6">
      <Card padding="lg" className="space-y-2">
        <h1 className="text-2xl font-semibold text-zinc-900">Transactions</h1>
        <p className="text-sm text-zinc-600">
          Review and manage your transaction history. Detailed tooling arrives soon.
        </p>
      </Card>

      <Card
        padding="lg"
        className="flex min-h-[220px] items-center justify-center text-sm text-zinc-500"
      >
        Transaction imports, filters, and bulk actions will appear here.
      </Card>
    </section>
  );
}
