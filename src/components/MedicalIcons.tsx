import type { ReactNode } from 'react';

type IconProps = {
  className?: string;
};

function IconShell({
  children,
  className = '',
}: Readonly<{
  children: ReactNode;
  className?: string;
}>) {
  return (
    <span
      className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border)] bg-white text-[var(--accent)] shadow-[0_8px_24px_rgba(15,23,42,0.06)] ${className}`}
    >
      {children}
    </span>
  );
}

export function HospitalIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 20V8.5A2.5 2.5 0 0 1 6.5 6H9V4.5A2.5 2.5 0 0 1 11.5 2h1A2.5 2.5 0 0 1 15 4.5V6h2.5A2.5 2.5 0 0 1 20 8.5V20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 20v-4a1 1 0 0 1 1-1h2v5m4-5h2a1 1 0 0 1 1 1v4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 7v6m-3-3h6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HeartPulseIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 20s-7-4.5-9.2-8.1C.9 8.8 2.2 5.7 5.5 5.1c2-.4 3.8.5 4.9 2 1.1-1.5 2.9-2.4 4.9-2 3.3.6 4.6 3.7 2.7 6.8C19 15.5 12 20 12 20Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 12h3l1.3-2.7 2.1 5.4 1.5-2.9h4.1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ShieldCheckIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 2.8 19 6v5.3c0 4.8-3 8.5-7 10.7-4-2.2-7-5.9-7-10.7V6l7-3.2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m8.8 12 2 2 4.4-4.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WalletIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M15 12h5v3h-5a1.5 1.5 0 0 1 0-3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="15.9" cy="13.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

export function DocumentIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M7 3.5h7L18.5 8V20a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M14 3.5V8h4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 12h7m-7 3h7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PulseIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 12h4l1.2-3 2.3 7 2-4h6.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 6h13a2.5 2.5 0 0 1 2.5 2.5v7A2.5 2.5 0 0 1 18.5 18h-13A2.5 2.5 0 0 1 3 15.5v-7A2.5 2.5 0 0 1 5.5 6Z"
        stroke="currentColor"
        strokeWidth="1.3"
        opacity="0.35"
      />
    </svg>
  );
}

export function IconBadge({
  icon,
  label,
  className = '',
}: Readonly<{
  icon: ReactNode;
  label: string;
  className?: string;
}>) {
  return (
    <div
      className={`inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground)] shadow-[0_10px_30px_rgba(15,23,42,0.05)] ${className}`}
    >
      <IconShell>{icon}</IconShell>
      <span>{label}</span>
    </div>
  );
}
