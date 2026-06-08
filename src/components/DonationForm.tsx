'use client';

import { useEffect, useState } from 'react';
import {
  formatStellarAmount,
  isPositiveStellarAmount,
  parseStellarAmount,
  sanitizeStellarAmountInput,
} from '@/lib/amount';
import { buildDonationXDR, type AssetCode } from '@/lib/donations';
import { submitSignedXDR, pollTransaction } from '@/lib/payment';
import { NETWORK_PASSPHRASE } from '@/lib/stellar';
import { useWalletContext } from '@/components/wallet-provider';
import { fetchBalances } from '@/lib/balances';

type DonationStatus =
  | 'idle'
  | 'building'
  | 'signing'
  | 'submitting'
  | 'polling'
  | 'success'
  | 'error';

export default function DonationForm({
  destination,
  assetCode,
  onSuccess,
  recipientReady,
  recipientExists,
  campaignFunded = false,
}: {
  destination: string;
  assetCode: AssetCode;
  onSuccess?: () => void;
  recipientReady: boolean;
  recipientExists: boolean;
  campaignFunded?: boolean;
}) {
  const { publicKey } = useWalletContext();
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<DonationStatus>('idle');
  const [txHash, setTxHash] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [donorState, setDonorState] = useState<{
    address: string;
    funded: boolean;
    usdcTrustline: boolean;
    xlm: string;
    usdc: string;
  } | null>(null);

  useEffect(() => {
    let active = true;

    if (!publicKey) {
      return;
    }

    fetchBalances(publicKey)
      .then((balances) => {
        if (active) {
          setDonorState({
            address: publicKey,
            funded: balances.funded,
            usdcTrustline: balances.usdcTrustline,
            xlm: balances.xlm,
            usdc: balances.usdc,
          });
        }
      })
      .catch(() => {
        if (active) {
          setDonorState({
            address: publicKey,
            funded: false,
            usdcTrustline: false,
            xlm: '0',
            usdc: '0',
          });
        }
      })

    return () => {
      active = false;
    };
  }, [publicKey]);

  const busy = ['building', 'signing', 'submitting', 'polling'].includes(status);

  const handleDonate = async () => {
    if (!publicKey) {
      setErrorMessage('Connect Freighter before donating.');
      setStatus('error');
      return;
    }

    if (!isPositiveStellarAmount(amount)) {
      setErrorMessage('Enter a donation amount greater than zero.');
      setStatus('error');
      return;
    }

    setStatus('building');
    setErrorMessage('');
    setTxHash('');

    try {
      const xdr = await buildDonationXDR(publicKey, destination, amount, assetCode);

      setStatus('signing');
      const freighter = await import('@stellar/freighter-api');
      const signed = await freighter.signTransaction(xdr, {
        networkPassphrase: NETWORK_PASSPHRASE,
        address: publicKey,
      });

      if (signed.error) {
        throw new Error(
          typeof signed.error === 'string' ? signed.error : 'Signing was rejected',
        );
      }

      setStatus('submitting');
      const hash = await submitSignedXDR(signed.signedTxXdr);
      setTxHash(hash);

      setStatus('polling');
      await pollTransaction(hash);
      setStatus('success');
      setAmount('');
      onSuccess?.();
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : 'Donation failed');
      setStatus('error');
    }
  };

  let donationPreview = '0';
  if (isPositiveStellarAmount(amount)) {
    donationPreview = formatStellarAmount(parseStellarAmount(amount));
  }

  const donorSnapshot = donorState?.address === publicKey ? donorState : null;
  const donorChecking = Boolean(publicKey) && !donorSnapshot;
  const donorFunded = donorSnapshot?.funded ?? null;
  const donorUsdcTrustline = donorSnapshot?.usdcTrustline ?? null;
  const donorReady =
    Boolean(publicKey) &&
    donorFunded === true &&
    (assetCode === 'XLM' || donorUsdcTrustline === true);
  const donateDisabled =
    busy ||
    !publicKey ||
    !recipientReady ||
    !isPositiveStellarAmount(amount) ||
    donorFunded === false ||
    (assetCode === 'USDC' && donorUsdcTrustline === false);

  const readinessMessage = (() => {
    if (!publicKey) {
      return 'Connect Freighter to prepare your donor wallet.';
    }

    if (donorChecking) {
      return 'Checking donor wallet status...';
    }

    if (donorFunded === false) {
      return 'Your Freighter wallet is not funded on testnet yet. Click Fund with Friendbot before donating XLM or USDC.';
    }

    if (assetCode === 'USDC' && donorUsdcTrustline === false) {
      return 'Your Freighter wallet needs a USDC trustline before it can donate USDC.';
    }

    if (campaignFunded) {
      return 'This campaign has reached its target. Donations can still be recorded on-chain if the patient keeps the campaign open.';
    }

    if (recipientReady) {
      return `This campaign wallet is ready to receive ${assetCode} donations.`;
    }

    if (assetCode === 'USDC') {
      return recipientExists
        ? 'This USDC campaign is blocked on testnet because the recipient wallet does not yet have a USDC trustline.'
        : 'This USDC campaign is blocked because the recipient wallet does not exist yet and has no USDC trustline.';
    }

    return 'The recipient wallet must exist on testnet before XLM donations can land.';
  })();

  return (
    <section className="rounded-[30px] border border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">
        Donation desk
      </p>
      <h3 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
        Send directly to the patient wallet
      </h3>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
        Your payment is signed only in Freighter and submitted straight to the
        recipient address. No platform wallet ever touches the funds.
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <label className="mb-2 block text-sm text-[var(--muted)]">
            Amount {assetCode}
          </label>
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(event) =>
              setAmount(sanitizeStellarAmountInput(event.target.value))
            }
            placeholder={`0.00 ${assetCode}`}
            className="w-full rounded-[22px] border border-[var(--border)] bg-white px-4 py-3 font-mono text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
          />
        </div>

        <div className="rounded-[22px] border border-[var(--border)] bg-sky-50/70 px-4 py-3 text-sm text-[var(--muted)]">
          <p>{readinessMessage}</p>
          {publicKey && (
            <p className="mt-2 text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
              Donor wallet:{' '}
              {donorChecking
                ? 'Checking...'
                : donorFunded
                  ? assetCode === 'USDC'
                    ? donorUsdcTrustline
                      ? 'Funded and USDC ready'
                      : 'Funded, but USDC trustline missing'
                    : 'Funded on testnet'
                  : 'Not funded'}
            </p>
          )}
        </div>

        <button
          onClick={handleDonate}
          disabled={donateDisabled}
          className="w-full rounded-full bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === 'idle' &&
            (donorReady && recipientReady
              ? `Donate ${assetCode}`
              : assetCode === 'USDC'
                ? donorUsdcTrustline === false
                  ? 'Add USDC trustline first'
                  : 'Recipient setup required'
                : donorFunded === false
                  ? 'Fund testnet wallet first'
                  : 'Recipient setup required')}
          {status === 'building' && 'Building transaction...'}
          {status === 'signing' && 'Waiting for Freighter...'}
          {status === 'submitting' && 'Submitting to Stellar...'}
          {status === 'polling' && 'Confirming on-chain...'}
          {status === 'success' && `Donate ${assetCode}`}
          {status === 'error' &&
            (donorReady && recipientReady
              ? `Donate ${assetCode}`
              : assetCode === 'USDC'
                ? donorUsdcTrustline === false
                  ? 'Add USDC trustline first'
                  : 'Recipient setup required'
                : donorFunded === false
                  ? 'Fund testnet wallet first'
                  : 'Recipient setup required')}
        </button>

        <div className="flex items-center justify-between rounded-[22px] border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--muted)]">
          <span>Preview amount</span>
          <span className="font-mono text-[var(--foreground)]">
            {donationPreview} {assetCode}
          </span>
        </div>
      </div>

      {status === 'success' && txHash && (
        <div className="mt-5 rounded-[22px] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <p className="font-semibold text-emerald-800">Donation confirmed on-chain.</p>
          <a
            href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block break-all font-mono text-xs text-emerald-800 underline decoration-emerald-300/70 underline-offset-4"
          >
            {txHash}
          </a>
        </div>
      )}

      {status === 'error' && errorMessage && (
        <div className="mt-5 rounded-[22px] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {errorMessage}
        </div>
      )}
    </section>
  );
}
