import dayjs from 'dayjs';

export type TransactionsTableItem = {
  id: string;
  date: string | Date;
  description: string;
  amount: number;
  category: string;
};

type TransactionsTableProps = {
  transactions?: TransactionsTableItem[];
  loading?: boolean;
};

const formatDate = (value: string | Date) => {
  const parsed = dayjs(value);
  if (!parsed.isValid()) return 'Invalid date';
  return parsed.format('DD/MM/YYYY');
};

const formatAmount = (value: number) => {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(value);
  } catch {
    return `₹${value.toFixed(2)}`;
  }
};

export default function TransactionsTable({ transactions = [], loading = false }: TransactionsTableProps) {
  const showEmptyState = !loading && transactions.length === 0;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-zinc-700">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th scope="col" className="px-4 py-3 text-left font-medium">
                Date
              </th>
              <th scope="col" className="px-4 py-3 text-left font-medium">
                Description
              </th>
              <th scope="col" className="px-4 py-3 text-left font-medium">
                Category
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading && (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-sm text-zinc-500">
                  Loading transactions…
                </td>
              </tr>
            )}

            {showEmptyState && (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-sm text-zinc-500">
                  No transactions found.
                </td>
              </tr>
            )}

            {!loading &&
              transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-4 py-3 text-left text-zinc-500">{formatDate(transaction.date)}</td>
                  <td className="px-4 py-3 text-left font-medium text-zinc-900">{transaction.description}</td>
                  <td className="px-4 py-3 text-left text-zinc-600">{transaction.category}</td>
                  <td className="px-4 py-3 text-right font-semibold text-zinc-900">
                    {formatAmount(transaction.amount)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
