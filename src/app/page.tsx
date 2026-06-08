import CampaignList from '@/components/CampaignList';
import DonorWalletPanel from '@/components/DonorWalletPanel';
import MedicalHeroArt from '@/components/MedicalHeroArt';
import {
  IconBadge,
  HospitalIcon,
  HeartPulseIcon,
  ShieldCheckIcon,
  WalletIcon,
} from '@/components/MedicalIcons';
import { campaigns } from '@/lib/campaigns';

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 rounded-[32px] border border-[var(--border)] bg-white/80 px-5 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] text-lg font-semibold text-white shadow-lg shadow-sky-900/10">
            SC
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">
              Stellar Care Center
            </p>
            <h1 className="text-lg font-semibold text-[var(--foreground)]">
              Medical crowdfunding with hospital-grade transparency
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
          <span className="rounded-full border border-[var(--border)] bg-sky-50 px-3 py-2">
            Emergency Relief
          </span>
          <span className="rounded-full border border-[var(--border)] bg-emerald-50 px-3 py-2">
            On-chain receipts
          </span>
          <span className="rounded-full border border-[var(--border)] bg-white px-3 py-2">
            Zero platform fees
          </span>
        </div>
      </header>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
        <div className="relative overflow-hidden rounded-[36px] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(245,250,255,0.98))] p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(18,122,138,0.08),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(47,111,237,0.06),transparent_30%)]" />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-3">
              <IconBadge icon={<HospitalIcon />} label="Emergency care" />
              <span className="rounded-full border border-[var(--border)] bg-sky-50 px-3 py-2 text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                Zero-fee on Stellar
              </span>
              <span className="rounded-full border border-[var(--border)] bg-emerald-50 px-3 py-2 text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                Direct to patient wallets
              </span>
            </div>

            <h2 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.04] text-[var(--foreground)] sm:text-6xl">
              A professional donation site for a medical institution and its patients.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              Donors send XLM or USDC directly to patient wallets on Stellar.
              The platform never holds funds, never takes a fee, and shows the
              exact receipts behind every campaign.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                <div className="flex items-center gap-3">
                  <HeartPulseIcon className="h-5 w-5 text-[var(--accent)]" />
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                    Transfer model
                  </p>
                </div>
                <p className="mt-3 text-lg font-semibold text-[var(--foreground)]">
                  Direct P2P
                </p>
              </div>
              <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                <div className="flex items-center gap-3">
                  <WalletIcon className="h-5 w-5 text-[var(--accent)]" />
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                    Donation rails
                  </p>
                </div>
                <p className="mt-3 text-lg font-semibold text-[var(--foreground)]">
                  XLM + USDC
                </p>
              </div>
              <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                <div className="flex items-center gap-3">
                  <ShieldCheckIcon className="h-5 w-5 text-[var(--accent)]" />
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                    Audit source
                  </p>
                </div>
                <p className="mt-3 text-lg font-semibold text-[var(--foreground)]">
                  Stellar ledger
                </p>
              </div>
              <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                <div className="flex items-center gap-3">
                  <HospitalIcon className="h-5 w-5 text-[var(--accent)]" />
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                    Care model
                  </p>
                </div>
                <p className="mt-3 text-lg font-semibold text-[var(--foreground)]">
                  Patient-owned wallets
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-[26px] border border-[var(--border)] bg-sky-50/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                  Donation readiness
                </p>
                <p className="mt-3 text-sm leading-6 text-[var(--foreground)]">
                  XLM campaigns are ready once the patient wallet exists on
                  testnet. USDC campaigns also need a trustline from the
                  patient&apos;s own wallet before donations can land.
                </p>
              </div>
              <div className="rounded-[26px] border border-[var(--border)] bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                  Care pathway
                </p>
                <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
                  <li>1. Connect Freighter</li>
                  <li>2. Fund the testnet wallet if needed</li>
                  <li>3. Add a USDC trustline for USDC campaigns</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <MedicalHeroArt />
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border border-[var(--border)] bg-white/85 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-3">
            <HeartPulseIcon className="h-5 w-5 text-[var(--accent)]" />
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
              Verified care
            </p>
          </div>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Campaign details stay off-chain while donations and balances stay
            publicly auditable on Stellar.
          </p>
        </div>
        <div className="rounded-[28px] border border-[var(--border)] bg-white/85 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-3">
            <WalletIcon className="h-5 w-5 text-[var(--accent)]" />
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
              Recipient wallets
            </p>
          </div>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Donations always go straight to the patient&apos;s wallet. No
            platform wallet ever receives or reroutes funds.
          </p>
        </div>
        <div className="rounded-[28px] border border-[var(--border)] bg-white/85 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-3">
            <ShieldCheckIcon className="h-5 w-5 text-[var(--accent)]" />
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
              Support desk
            </p>
          </div>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Freighter handles signing locally, so donors stay in control of
            every transfer.
          </p>
        </div>
      </section>

      <div className="mt-8">
        <DonorWalletPanel />
      </div>

      <CampaignList campaigns={campaigns} />
    </main>
  );
}
