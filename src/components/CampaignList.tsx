'use client';

import { useEffect, useState } from 'react';
import CampaignCard from '@/components/CampaignCard';
import { formatStellarAmount } from '@/lib/amount';
import type { Campaign } from '@/lib/campaigns';
import {
  fetchCampaignSnapshot,
  type CampaignOnChainSnapshot,
} from '@/lib/donations';
import {
  HeartPulseIcon,
  HospitalIcon,
  WalletIcon,
} from '@/components/MedicalIcons';

type CampaignStatus = {
  snapshot?: CampaignOnChainSnapshot;
  error?: string;
};

export default function CampaignList({
  campaigns,
}: {
  campaigns: Campaign[];
}) {
  const [items, setItems] = useState<Record<string, CampaignStatus>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all(
      campaigns.map(async (campaign) => {
        try {
          const snapshot = await fetchCampaignSnapshot(campaign);
          return {
            id: campaign.id,
            status: { snapshot },
          } as const;
        } catch (error: unknown) {
          return {
            id: campaign.id,
            status: {
              error:
                error instanceof Error
                  ? error.message
                  : 'Unable to sync campaign data',
            },
          } as const;
        }
      }),
    )
      .then((results) => {
        if (!active) return;

        const nextItems: Record<string, CampaignStatus> = {};
        for (const result of results) {
          nextItems[result.id] = result.status;
        }
        setItems(nextItems);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [campaigns]);

  const totals = campaigns.reduce(
    (accumulator, campaign) => {
      const snapshot = items[campaign.id]?.snapshot;
      if (!snapshot) {
        return accumulator;
      }

      accumulator.raised += snapshot.raisedScaled;
      accumulator.target += snapshot.targetScaled;
      accumulator.count += snapshot.donationCount;
      return accumulator;
    },
    { raised: BigInt(0), target: BigInt(0), count: 0 },
  );

  return (
    <section className="mt-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">
            Active patient cases
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">
            Transparent medical crowdfunding built for public trust
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)] sm:text-base">
            Every raised amount below is calculated directly from on-chain
            payment records. No platform wallet, no deductions, and no hidden
            intermediary.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 rounded-[24px] border border-[var(--border)] bg-white/85 p-4 text-sm shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          <div>
            <div className="flex items-center gap-2">
              <HospitalIcon className="h-4 w-4 text-[var(--accent)]" />
              <p className="text-[var(--muted)]">Campaigns</p>
            </div>
            <p className="mt-1 font-mono text-lg text-[var(--foreground)]">{campaigns.length}</p>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <HeartPulseIcon className="h-4 w-4 text-[var(--accent)]" />
              <p className="text-[var(--muted)]">Raised</p>
            </div>
            <p className="mt-1 font-mono text-lg text-[var(--foreground)]">
              {loading ? '...' : formatStellarAmount(totals.raised)}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <WalletIcon className="h-4 w-4 text-[var(--accent)]" />
              <p className="text-[var(--muted)]">Donations</p>
            </div>
            <p className="mt-1 font-mono text-lg text-[var(--foreground)]">
              {loading ? '...' : totals.count}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {campaigns.map((campaign) => (
          <div key={campaign.id}>
            <CampaignCard
              campaign={campaign}
              snapshot={items[campaign.id]?.snapshot}
              loading={loading && !items[campaign.id]}
              error={items[campaign.id]?.error}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
