import React, { useRef, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { TRANSACTIONS } from '@/graphql/queries';
import { RECLASSIFY } from '@/graphql/mutations';
import { useTenant } from '@/state/tenant';
import { useVirtualizer } from '@tanstack/react-virtual';
import dayjs from 'dayjs';


function amountFmt(a: number, code = 'INR') {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: code, maximumFractionDigits: 0 }).format(a || 0);
}


export default function Transactions() {
    const { tenantId } = useTenant();
    const [filters, setFilters] = useState<any>({ text: '', category: '', from: '', to: '' });
    const { data, loading, fetchMore, refetch } = useQuery(TRANSACTIONS, {
        skip: !tenantId,
        variables: { tenantId, filters, cursor: null },
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
        await refetch({ tenantId, filters, cursor: null });
    };


    const onLoadMore = async () => {
        if (!tenantId || !cursor) return;
        await fetchMore({ variables: { tenantId, filters, cursor } });
    };


    const onReclassify = async (id: string, category: string) => {
        if (!tenantId) return;
        await reclassify({
            variables: { id, category, tenantId },
            optimisticResponse: {
                reclassifyTransaction: { __typename: 'Transaction', id, category, taggedBy: 'USER' },
            },
            update: (cache) => {
                const cacheId = cache.identify({ __typename: 'Transaction', id });
                cache.modify({
                    id: cacheId,
                    fields: {
                        category: () => category,
                        taggedBy: () => 'USER',
                    },
                });
            },
        });
    };


    if (!tenantId) return <div>Select a tenant to continue.</div>;


    return (
        <div className="grid gap-4">
            {/* Filters */}
            <div className="rounded-2xl border bg-white dark:bg-zinc-900 p-4 grid gap-3">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
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
        </div>
    );
}