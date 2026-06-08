'use client';

import { useEffect, useState } from 'react';
import { fetchBalances, type Balances } from '@/lib/balances';
import { HeartPulseIcon, WalletIcon } from '@/components/MedicalIcons';

export default function BalanceCard({
  publicKey,
  refreshKey,
}: {
  publicKey: string;
  refreshKey: number;
}) {
  const [balances, setBalances] = useState<Balances | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetchBalances(publicKey)
      .then((result) => active && setBalances(result))
      .catch(() => active && setBalances(null))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [publicKey, refreshKey]);

  if (loading) {
    return (
      <div className="grid gap-4 rounded-[24px] border border-[var(--border)] bg-white p-4 md:grid-cols-2 xl:col-span-1">
        <div className="h-24 animate-pulse rounded-2xl bg-slate-200" />
        <div className="h-24 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    );
  }

  if (balances && !balances.funded) {
    return (
      <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 xl:col-span-1">
        This account is not funded yet. Use Friendbot to mint testnet XLM first.
      </div>
    );
  }

  if (!balances) {
    return (
      <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 xl:col-span-1">
        Failed to load wallet balances.
      </div>
    );
  }

  return (
    <div className="grid gap-4 rounded-[24px] border border-[var(--border)] bg-white p-4 md:grid-cols-2 xl:col-span-1">
      <div className="rounded-2xl border border-[var(--border)] bg-sky-50 p-4">
        <div className="flex items-center gap-2">
          <HeartPulseIcon className="h-4 w-4 text-[var(--accent)]" />
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">XLM</p>
        </div>
        <p className="mt-2 font-mono text-2xl text-[var(--foreground)]">{balances.xlm}</p>
      </div>
      <div className="rounded-2xl border border-[var(--border)] bg-emerald-50 p-4">
        <div className="flex items-center gap-2">
          <WalletIcon className="h-4 w-4 text-[var(--accent)]" />
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">USDC</p>
        </div>
        <p className="mt-2 font-mono text-2xl text-[var(--foreground)]">{balances.usdc}</p>
      </div>
    </div>
  );
}
