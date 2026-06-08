'use client';

import { useState } from 'react';
import ConnectWallet from '@/components/ConnectWallet';
import FundAccount from '@/components/FundAccount';
import AddTrustline from '@/components/AddTrustline';
import BalanceCard from '@/components/BalanceCard';
import {
  HeartPulseIcon,
  HospitalIcon,
  ShieldCheckIcon,
} from '@/components/MedicalIcons';
import { useWalletContext } from '@/components/wallet-provider';

export default function DonorWalletPanel() {
  const wallet = useWalletContext();
  const { publicKey, connecting } = wallet;
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = () => setRefreshKey((current) => current + 1);

  return (
    <section className="rounded-[36px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">
            Donor services desk
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
            Prepare Freighter for direct patient donations
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)] sm:text-base">
            Connect your wallet, mint testnet XLM with Friendbot if needed, and
            add a USDC trustline before donating to a USDC campaign. The app
            never touches your private keys or a platform wallet.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-3 py-2 text-xs font-medium text-[var(--muted)]">
              <HospitalIcon className="h-4 w-4 text-[var(--accent)]" />
              Patient-owned wallets
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-3 py-2 text-xs font-medium text-[var(--muted)]">
              <HeartPulseIcon className="h-4 w-4 text-[var(--accent)]" />
              Direct emergency relief
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-3 py-2 text-xs font-medium text-[var(--muted)]">
              <ShieldCheckIcon className="h-4 w-4 text-[var(--accent)]" />
              No custody or fees
            </span>
          </div>
        </div>

        <ConnectWallet {...wallet} />
      </div>

      {publicKey ? (
        <div className="mt-6 grid gap-4 xl:grid-cols-[repeat(3,minmax(0,1fr))]">
          <FundAccount publicKey={publicKey} onFunded={refresh} />
          <AddTrustline publicKey={publicKey} onDone={refresh} />
          <BalanceCard
            key={publicKey}
            publicKey={publicKey}
            refreshKey={refreshKey}
          />
        </div>
      ) : (
        <div className="mt-6 rounded-[24px] border border-dashed border-[var(--border)] bg-sky-50/70 px-4 py-6 text-sm text-[var(--muted)]">
          {connecting
            ? 'Waiting for Freighter to respond...'
            : 'Connect Freighter to view your balance, fund the testnet wallet, and sign donations.'}
        </div>
      )}
    </section>
  );
}
