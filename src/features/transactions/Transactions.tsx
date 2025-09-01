import React, { useRef, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { TRANSACTIONS } from '@/graphql/queries';
import { RECLASSIFY } from '@/graphql/mutations';
import { useTenant } from '@/state/tenant';
import { useVirtualizer } from '@tanstack/react-virtual';

function amountFmt(a: number, code = 'INR') {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: code,
      maximumFractionDigits: 0,
    }).format(a || 0);
  } catch (_) {
    return `${a}`;
  }
}

export default function Transactions() {
    const { tenantId } = useTenant();
    const now = new Date();
    const [filters, setFilters] = useState<any>({ text: '', category: '', from: '', to: '' });
    const { data, loading, fetchMore, refetch } = useQuery(TRANSACTIONS, {
        skip: !tenantId,
        variables: { year: now.getFullYear(), month: now.getMonth() + 1 },
        notifyOnNetworkStatusChange: true,
    });


    const [reclassify] = useMutation(RECLASSIFY);


    const items = data?.transactions?.items ?? [];
    const cursor = data?.transactions?.cursor ?? null;


    const parentRef = useRef<HTMLDivElement>(null);
    const rowVirtualizer = useVirtualizer({
        count: items.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 56,
        overscan: 10,
    });

    const onApplyFilters = async () => {
        if (!tenantId) return;
        const base = filters.from || filters.to;
        const d = base ? new Date(base) : new Date();
        const nextMonth = d.getMonth() + 1;
        const nextYear = d.getFullYear();
        await refetch({ year: nextYear, month: nextMonth });
    };

    if (!tenantId) return <div>Select a tenant to continue.</div>;


    return (
        <div className="grid gap-4">
            {/* Filters */}
            <div className="rounded-2xl border bg-white dark:bg-zinc-900 p-4 grid gap-3">
                <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                    <input
                        className="rounded-xl border px-3 py-2 bg-white dark:bg-zinc-950"
                        placeholder="Search text (merchant, memo)"
                        value={filters.text}
                        onChange={(e) => setFilters((f: any) => ({ ...f, text: e.target.value }))}
                    />
                    <input
                        type="date"
                        className="rounded-xl border px-3 py-2 bg-white dark:bg-zinc-950"
                        value={filters.from}
                        onChange={(e) => setFilters((f: any) => ({ ...f, from: e.target.value }))}
                    />
                    <input
                        type="date"
                        className="rounded-xl border px-3 py-2 bg-white dark:bg-zinc-950"
                        value={filters.to}
                        onChange={(e) => setFilters((f: any) => ({ ...f, to: e.target.value }))}
                    />
                    <input
                        className="rounded-xl border px-3 py-2 bg-white dark:bg-zinc-950"
                        placeholder="Category (e.g. Groceries)"
                        value={filters.category}
                        onChange={(e) => setFilters((f: any) => ({ ...f, category: e.target.value }))}
                    />
                    <button
                        className="rounded-xl border px-3 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
                        onClick={onApplyFilters}
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
            {/* List */}
            <div
              ref={parentRef}
              className="rounded-2xl border bg-white dark:bg-zinc-900"
              style={{ height: '70vh', overflow: 'auto' }}
            >
              <div className="sticky top-0 z-10 grid grid-cols-6 gap-2 px-4 py-2 text-xs text-zinc-500 bg-white/90 dark:bg-zinc-900/90 backdrop-blur">
                <div>Date</div>
                <div className="col-span-2">Description</div>
                <div className="text-right">Amount</div>
                <div>Category</div>
                <div>Tagged By</div>
              </div>
              {loading ? (
                <div className="p-4 text-sm text-zinc-500">Loading transactions…</div>
              ) : items.length === 0 ? (
                <div className="p-4 text-sm text-zinc-500">No transactions found.</div>
              ) : (
                <div style={{ height: rowVirtualizer.getTotalSize(), position: 'relative' }}>
                  {rowVirtualizer.getVirtualItems().map((vi) => {
                    const t = items[vi.index];
                    return (
                      <div
                        key={t.id}
                        className="grid grid-cols-6 gap-2 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800"
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          transform: `translateY(${vi.start}px)`,
                        }}
                      >
                        <div className="truncate">{t.date}</div>
                        <div className="col-span-2 truncate" title={t.description}>{t.description}</div>
                        <div className={`text-right font-medium ${t.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {amountFmt(t.amount, t.currency)}
                        </div>
                        <div className="truncate">{t.category}</div>
                        <div className="truncate">{t.taggedBy}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
        </div>
    );
}
