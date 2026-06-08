export default function MedicalHeroArt() {
  return (
    <section className="relative overflow-hidden rounded-[36px] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(241,248,255,0.96))] p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(47,111,237,0.12),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(18,122,138,0.11),transparent_26%)]" />
      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">
              Clinical support
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
              A compassionate, professional donation experience
            </h3>
          </div>
          <div className="rounded-full border border-[var(--border)] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
            Open 24/7
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-[30px] border border-[var(--border)] bg-[linear-gradient(180deg,#f8fbff,#edf5ff)]">
          <svg viewBox="0 0 800 560" className="h-auto w-full" role="img" aria-label="Modern hospital illustration">
            <defs>
              <linearGradient id="hospitalBuilding" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#dcecff" />
              </linearGradient>
              <linearGradient id="accentBeam" x1="0" x2="1">
                <stop offset="0%" stopColor="#127a8a" />
                <stop offset="100%" stopColor="#2f6fed" />
              </linearGradient>
            </defs>

            <rect width="800" height="560" fill="url(#hospitalBuilding)" />
            <circle cx="670" cy="70" r="34" fill="#dff3f7" />
            <circle cx="670" cy="70" r="18" fill="#127a8a" opacity="0.16" />

            <rect x="92" y="118" width="340" height="310" rx="28" fill="#ffffff" stroke="#d4e4f4" />
            <rect x="120" y="146" width="284" height="54" rx="18" fill="#eff7ff" />
            <rect x="140" y="170" width="45" height="10" rx="5" fill="#127a8a" />
            <rect x="195" y="170" width="96" height="10" rx="5" fill="#5b7ca8" opacity="0.55" />
            <rect x="120" y="226" width="112" height="106" rx="18" fill="#f4f9ff" stroke="#d8e6f3" />
            <rect x="246" y="226" width="158" height="106" rx="18" fill="#f4f9ff" stroke="#d8e6f3" />
            <rect x="120" y="350" width="284" height="52" rx="18" fill="#f7fbff" stroke="#d8e6f3" />

            <rect x="460" y="88" width="246" height="368" rx="30" fill="#ffffff" stroke="#d4e4f4" />
            <rect x="488" y="118" width="190" height="60" rx="20" fill="#f0f8ff" />
            <circle cx="530" cy="238" r="54" fill="#eef7ff" />
            <path
              d="M530 204c0 0 21 20 21 37 0 14-9 25-21 25s-21-11-21-25c0-17 21-37 21-37Z"
              fill="#127a8a"
              opacity="0.18"
            />
            <path
              d="M530 226h39l-16 17-10-14-13 22-9-10h-9"
              fill="none"
              stroke="url(#accentBeam)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <rect x="582" y="212" width="96" height="116" rx="24" fill="#f7fbff" stroke="#d8e6f3" />
            <rect x="604" y="236" width="52" height="10" rx="5" fill="#5b7ca8" opacity="0.58" />
            <rect x="604" y="256" width="68" height="10" rx="5" fill="#127a8a" opacity="0.72" />
            <rect x="604" y="276" width="43" height="10" rx="5" fill="#5b7ca8" opacity="0.48" />

            <path
              d="M120 468c55-30 114-40 178-26 36 8 66 20 103 20 63 0 125-28 193-28 49 0 95 14 125 31"
              stroke="url(#accentBeam)"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />

            <g transform="translate(126 448)">
              <rect width="170" height="56" rx="18" fill="#ffffff" stroke="#d8e6f3" />
              <circle cx="30" cy="28" r="12" fill="#127a8a" opacity="0.16" />
              <path d="M24 28h12m-6-6v12" stroke="#127a8a" strokeWidth="2.5" strokeLinecap="round" />
              <rect x="54" y="18" width="88" height="8" rx="4" fill="#5b7ca8" opacity="0.6" />
              <rect x="54" y="32" width="62" height="8" rx="4" fill="#127a8a" opacity="0.5" />
            </g>

            <g transform="translate(560 402)">
              <rect width="150" height="58" rx="18" fill="#ffffff" stroke="#d8e6f3" />
              <path d="M28 18h32m-16-10v20" stroke="#2f6fed" strokeWidth="2.8" strokeLinecap="round" />
              <rect x="72" y="18" width="54" height="8" rx="4" fill="#5b7ca8" opacity="0.6" />
              <rect x="72" y="32" width="34" height="8" rx="4" fill="#127a8a" opacity="0.55" />
            </g>
          </svg>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[22px] border border-[var(--border)] bg-white p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Care desk</p>
            <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">
              Clear donor guidance, patient-friendly language, and direct wallet transfers.
            </p>
          </div>
          <div className="rounded-[22px] border border-[var(--border)] bg-white p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Evidence</p>
            <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">
              Proof attachments remain off-chain for privacy while donations stay public.
            </p>
          </div>
          <div className="rounded-[22px] border border-[var(--border)] bg-white p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Ledger trail</p>
            <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">
              Every donation includes a visible transaction hash and timestamp.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
