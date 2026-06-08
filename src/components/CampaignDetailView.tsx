'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import CampaignProgress from '@/components/CampaignProgress';
import DonationForm from '@/components/DonationForm';
import DonationHistory from '@/components/DonationHistory';
import { DocumentIcon, WalletIcon } from '@/components/MedicalIcons';
import { formatStellarAmount } from '@/lib/amount';
import { fetchCampaignSnapshot, type CampaignOnChainSnapshot } from '@/lib/donations';
import type { Campaign } from '@/lib/campaigns';
import { useWalletContext } from '@/components/wallet-provider';

function percent(snapshot: CampaignOnChainSnapshot): number {
  if (snapshot.targetScaled === BigInt(0)) {
    return 0;
  }

  return Number((snapshot.raisedScaled * BigInt(10000)) / snapshot.targetScaled) / 100;
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={copy}
      className="rounded-full border border-[var(--border)] bg-sky-50 px-3 py-1 text-xs text-[var(--foreground)] transition hover:border-[rgba(47,111,237,0.2)] hover:bg-sky-100"
    >
      {copied ? 'Copied' : 'Copy address'}
    </button>
  );
}

export default function CampaignDetailView({
  campaign,
}: {
  campaign: Campaign;
}) {
  const { publicKey } = useWalletContext();
  const [snapshot, setSnapshot] = useState<CampaignOnChainSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSnapshot = useCallback(async () => {
    try {
      setSnapshot(await fetchCampaignSnapshot(campaign));
      setError('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load campaign');
    } finally {
      setLoading(false);
    }
  }, [campaign]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadSnapshot();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadSnapshot]);

  const raised = snapshot ? formatStellarAmount(snapshot.raisedScaled) : '...';
  const target = snapshot ? formatStellarAmount(snapshot.targetScaled) : '...';
  const fundingPercent = snapshot ? percent(snapshot) : 0;
  const goalReached = Boolean(snapshot?.targetReached);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--foreground)] transition hover:border-[rgba(47,111,237,0.2)] hover:bg-sky-50"
        >
          Back to campaigns
        </Link>

        <div className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
          {publicKey ? 'Freighter connected' : 'Freighter disconnected'}
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <section className="rounded-[36px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">
            {campaign.assetCode} medical campaign
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold text-[var(--foreground)] sm:text-5xl">
            {campaign.title}
          </h1>
          <p className="mt-3 text-base text-[var(--muted)] sm:text-lg">
            {campaign.patientName} - {campaign.hospital} - {campaign.location}
          </p>

          <p className="mt-6 max-w-4xl text-sm leading-7 text-[var(--muted)] sm:text-base">
            {campaign.story}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Raised</p>
              <p className="mt-2 font-mono text-2xl text-[var(--foreground)]">
                {raised} {campaign.assetCode}
              </p>
            </div>
            <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Target</p>
              <p className="mt-2 font-mono text-2xl text-[var(--foreground)]">
                {target} {campaign.assetCode}
              </p>
            </div>
            <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Donations</p>
              <p className="mt-2 font-mono text-2xl text-[var(--foreground)]">
                {snapshot ? snapshot.donationCount : '...'}
              </p>
            </div>
            <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">On-chain</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                {goalReached
                  ? 'Goal reached'
                  : snapshot?.recipientReady
                    ? 'Ready to donate'
                    : 'Needs setup'}
              </p>
            </div>
          </div>

          {goalReached && (
            <div className="mt-6 rounded-[24px] border border-emerald-200 bg-emerald-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-700">
                Target reached
              </p>
              <p className="mt-2 text-sm leading-6 text-emerald-800">
                This campaign has reached its funding goal. Donations are still visible on-chain and can continue if the patient wants to keep the campaign open for recovery costs.
              </p>
            </div>
          )}

          {loading ? (
            <div className="mt-6 space-y-3">
              <div className="h-3 animate-pulse rounded-full bg-slate-200" />
              <div className="h-28 animate-pulse rounded-2xl bg-slate-200/80" />
            </div>
          ) : snapshot ? (
            <div className="mt-6">
              <CampaignProgress percent={fundingPercent} />
              <p className="mt-2 text-right text-xs text-[var(--muted)]">
                Synced {new Date(snapshot.lastSyncedAt).toLocaleTimeString()}
              </p>
            </div>
          ) : null}

          {error && (
            <div className="mt-6 rounded-[24px] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {error}
            </div>
          )}

          <div className="mt-8 rounded-[28px] border border-[var(--border)] bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <WalletIcon className="h-4 w-4 text-[var(--accent)]" />
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">
                    Recipient wallet
                  </p>
                </div>
                <p className="mt-2 break-all font-mono text-sm text-[var(--foreground)]">
                  {campaign.walletAddress}
                </p>
              </div>
              <CopyButton value={campaign.walletAddress} />
            </div>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              Donations are sent directly to this Stellar address. The platform
              only reads the blockchain for transparency.
            </p>
          </div>

          <div className="mt-8 rounded-[28px] border border-sky-200 bg-sky-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">
              Donation readiness
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              If the donate button is disabled, the campaign wallet is missing
              or the recipient has not prepared the required trustline yet. For
              XLM campaigns we funded the demo wallets on testnet. USDC still
              needs the patient to add a trustline from their own wallet.
            </p>
          </div>

          <div className="mt-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <DocumentIcon className="h-4 w-4 text-[var(--accent)]" />
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">
                    Medical proof
                  </p>
                </div>
                <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
                  Off-chain metadata for trust
                </h2>
              </div>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {campaign.proofAttachments.map((attachment) => (
                <div
                  key={attachment.label}
                  className="rounded-[24px] border border-[var(--border)] bg-white p-4"
                >
                  <p className="font-semibold text-[var(--foreground)]">{attachment.label}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    {attachment.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-[24px] border border-dashed border-[var(--border)] bg-sky-50/70 p-4 text-sm text-[var(--muted)]">
              Metadata stays off-chain in the campaign database. Donation totals
              and receipts are always derived from Stellar payment records.
            </div>
          </div>
        </section>

        <div className="space-y-6">
          <DonationForm
            destination={campaign.walletAddress}
            assetCode={campaign.assetCode}
            recipientReady={Boolean(snapshot?.recipientReady)}
            recipientExists={Boolean(snapshot?.recipientExists)}
            campaignFunded={goalReached}
            onSuccess={loadSnapshot}
          />

          <DonationHistory
            history={snapshot?.history ?? []}
            assetCode={campaign.assetCode}
          />
        </div>
      </div>
    </main>
  );
}
