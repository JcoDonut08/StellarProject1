'use client';

import { useState } from 'react';
import type { WalletState } from '@/hooks/useWallet';
import { WalletIcon } from '@/components/MedicalIcons';

export default function ConnectWallet({
  publicKey,
  connecting,
  error,
  connect,
  disconnect,
}: WalletState) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!publicKey) return;
    await navigator.clipboard.writeText(publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (publicKey) {
    return (
      <div className="flex flex-wrap items-center justify-end gap-2">
        <button
          onClick={copy}
          title="Copy full address"
          className="rounded-full border border-[var(--border)] bg-white px-3 py-2 font-mono text-xs text-[var(--foreground)] transition hover:border-[rgba(47,111,237,0.2)] hover:bg-sky-50"
        >
          {copied ? 'Copied' : `${publicKey.slice(0, 6)}...${publicKey.slice(-6)}`}
        </button>
        <button
          onClick={disconnect}
          className="rounded-full border border-[var(--border)] bg-white px-3 py-2 text-xs text-[var(--muted)] transition hover:border-[rgba(47,111,237,0.2)] hover:bg-sky-50 hover:text-[var(--foreground)]"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="text-right">
      <button
        onClick={connect}
        disabled={connecting}
        className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <WalletIcon className="h-4 w-4" />
        {connecting ? 'Connecting...' : 'Connect Freighter'}
      </button>
      {error && <p className="mt-2 max-w-xs text-sm text-rose-600">{error}</p>}
    </div>
  );
}
