'use client';

import { formatStellarAmount, parseStellarAmount } from '@/lib/amount';
import type { AssetCode, DonationHistoryItem } from '@/lib/donations';

function shorten(value: string, visible = 7): string {
  if (value.length <= visible * 2 + 3) {
    return value;
  }

  return `${value.slice(0, visible)}...${value.slice(-visible)}`;
}

export default function DonationHistory({
  history,
  assetCode,
}: {
  history: DonationHistoryItem[];
  assetCode: AssetCode;
}) {
  if (!history.length) {
    return (
      <div className="rounded-[28px] border border-dashed border-[var(--border)] bg-white/75 p-6 text-sm text-[var(--muted)]">
        No on-chain donations have reached this campaign yet.
      </div>
    );
  }

  return (
    <section className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">
            On-chain history
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
            Donation receipts from Stellar
          </h3>
        </div>
        <p className="text-sm text-[var(--muted)]">{history.length} records</p>
      </div>

      <div className="mt-5 overflow-hidden rounded-[24px] border border-[var(--border)]">
        <table className="min-w-full divide-y divide-[var(--border)] text-left text-sm">
          <thead className="bg-sky-50 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Transaction</th>
              <th className="px-4 py-3">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] bg-white">
            {history.map((item) => (
              <tr key={item.transactionHash} className="align-top">
                <td className="px-4 py-4 font-mono text-[var(--foreground)]">
                  {formatStellarAmount(parseStellarAmount(item.amount))} {assetCode}
                  <div className="mt-1 text-xs text-[var(--muted)]">
                    From {shorten(item.from)}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <a
                    href={`https://stellar.expert/explorer/testnet/tx/${item.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all font-mono text-xs text-[var(--accent)] hover:underline"
                  >
                    {shorten(item.transactionHash, 10)}
                  </a>
                </td>
                <td className="px-4 py-4 text-[var(--muted)]">
                  {new Date(item.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
