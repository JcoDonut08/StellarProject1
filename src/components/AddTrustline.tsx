'use client';

import { useState } from 'react';
import { buildAddUsdcTrustlineXDR } from '@/lib/trustline';
import { signAndSubmit } from '@/lib/sign';
import { ShieldCheckIcon } from '@/components/MedicalIcons';

type Status = 'idle' | 'working' | 'done' | 'error';

export default function AddTrustline({
  publicKey,
  onDone,
}: {
  publicKey: string;
  onDone: () => void;
}) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const add = async () => {
    setStatus('working');
    setError('');

    try {
      const xdr = await buildAddUsdcTrustlineXDR(publicKey);
      await signAndSubmit(xdr, publicKey);
      setStatus('done');
      onDone();
    } catch (exception: unknown) {
      setError(
        exception instanceof Error ? exception.message : 'Failed to add trustline',
      );
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
        USDC trustline added. This wallet can now send and receive USDC on testnet.
      </div>
    );
  }

  return (
    <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
      <div className="flex items-center gap-3">
        <ShieldCheckIcon className="h-5 w-5 text-[var(--accent)]" />
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">USDC</p>
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
        Add a trustline before donating USDC. This does not move funds, it only
        enables the asset in your wallet.
      </p>
      <button
        onClick={add}
        disabled={status === 'working'}
        className="mt-4 w-full rounded-full border border-[var(--border)] bg-sky-50 px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[rgba(47,111,237,0.2)] hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === 'working' ? 'Adding trustline...' : 'Add USDC trustline'}
      </button>
      {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
    </div>
  );
}
