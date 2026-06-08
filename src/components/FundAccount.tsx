'use client';

import { useState } from 'react';
import { fundTestnetAccount } from '@/lib/stellar';
import { WalletIcon } from '@/components/MedicalIcons';

export default function FundAccount({
  publicKey,
  onFunded,
}: {
  publicKey: string;
  onFunded: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fund = async () => {
    setLoading(true);
    setError('');

    try {
      await fundTestnetAccount(publicKey);
      onFunded();
    } catch (exception: unknown) {
      setError(exception instanceof Error ? exception.message : 'Funding failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
      <div className="flex items-center gap-3">
        <WalletIcon className="h-5 w-5 text-[var(--accent)]" />
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
          Testnet XLM
        </p>
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
        Fund this donor wallet with Friendbot so you can sign XLM donations on
        testnet.
      </p>
      <button
        onClick={fund}
        disabled={loading}
        className="mt-4 w-full rounded-full border border-[var(--border)] bg-sky-50 px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[rgba(47,111,237,0.2)] hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Funding...' : 'Fund with Friendbot'}
      </button>
      {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
    </div>
  );
}
