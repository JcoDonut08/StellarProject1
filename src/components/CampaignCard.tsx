'use client';

import Link from 'next/link';
import CampaignProgress from '@/components/CampaignProgress';
import { formatStellarAmount } from '@/lib/amount';
import type { Campaign } from '@/lib/campaigns';
import type { CampaignOnChainSnapshot } from '@/lib/donations';
import { HeartPulseIcon, HospitalIcon } from '@/components/MedicalIcons';

function formatPercent(snapshot: CampaignOnChainSnapshot): number {
  if (snapshot.targetScaled === BigInt(0)) {
    return 0;
  }

  return Number((snapshot.raisedScaled * BigInt(10000)) / snapshot.targetScaled) / 100;
}

export default function CampaignCard({
  campaign,
  snapshot,
  loading,
  error,
}: {
  campaign: Campaign;
  snapshot?: CampaignOnChainSnapshot;
  loading?: boolean;
  error?: string;
}) {
  const raised = snapshot ? formatStellarAmount(snapshot.raisedScaled) : '...';
  const target = snapshot ? formatStellarAmount(snapshot.targetScaled) : '...';
  const percent = snapshot ? formatPercent(snapshot) : 0;
  const goalReached = Boolean(snapshot?.targetReached);

  return (
    <article className="group flex h-full flex-col rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_20px_70px_rgba(15,23,42,0.08)] transition-transform duration-300 hover:-translate-y-1 hover:border-[rgba(47,111,237,0.22)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <HeartPulseIcon className="h-4 w-4 text-[var(--accent)]" />
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
              {campaign.assetCode}
            </p>
          </div>
          <h3 className="mt-2 text-xl font-semibold text-[var(--foreground)]">
            {campaign.title}
          </h3>
          <p className="mt-1 text-sm text-[var(--muted)]">{campaign.patientName}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
            {campaign.hospital}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${
            goalReached
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-[var(--border)] bg-sky-50 text-[var(--accent)]'
          }`}
        >
          <HospitalIcon className="h-4 w-4" />
          {loading
            ? 'Loading...'
            : goalReached
              ? 'Goal reached'
              : snapshot?.recipientReady
                ? 'Ready to donate'
                : snapshot && !snapshot.recipientExists
                  ? 'Wallet missing'
                  : 'Needs setup'}
        </span>
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-[var(--muted)]">
        {campaign.story}
      </p>

      <div className="mt-5 space-y-4">
        {error ? (
          <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        ) : loading ? (
          <div className="space-y-3">
            <div className="h-3 animate-pulse rounded-full bg-slate-200" />
            <div className="h-12 animate-pulse rounded-2xl bg-slate-200/80" />
          </div>
        ) : (
          <>
            <CampaignProgress percent={percent} />
            <div className="flex items-end justify-between gap-3 text-sm">
              <div>
                <p className="text-[var(--muted)]">Raised</p>
                <p className="font-mono text-lg text-[var(--foreground)]">
                  {raised} {campaign.assetCode}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[var(--muted)]">Target</p>
                <p className="font-mono text-lg text-[var(--foreground)]">
                  {target} {campaign.assetCode}
                </p>
              </div>
            </div>
            {goalReached && (
              <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                This campaign has reached its target and is now marked as fully funded.
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-[var(--border)] pt-4">
        <div className="text-xs text-[var(--muted)]">
          {snapshot
            ? `${snapshot.donationCount} on-chain donations`
            : 'Syncing on-chain data'}
        </div>
        <Link
          href={`/campaigns/${campaign.id}`}
          className="rounded-full bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          {goalReached ? 'View case details' : 'View & donate'}
        </Link>
      </div>
    </article>
  );
}
