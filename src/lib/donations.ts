import {
  Asset,
  BASE_FEE,
  Operation,
  StrKey,
  TransactionBuilder,
} from '@stellar/stellar-sdk';
import { horizon, server, NETWORK_PASSPHRASE, USDC_ISSUER } from './stellar';
import { formatStellarAmount, parseStellarAmount } from './amount';
import type { Campaign } from './campaigns';

export type AssetCode = 'XLM' | 'USDC';

export interface DonationHistoryItem {
  transactionHash: string;
  createdAt: string;
  amount: string;
  from: string;
  to: string;
  assetCode: AssetCode;
  assetIssuer?: string;
}

export interface CampaignOnChainSnapshot {
  recipientExists: boolean;
  recipientReady: boolean;
  targetReached: boolean;
  raisedScaled: bigint;
  targetScaled: bigint;
  donationCount: number;
  history: DonationHistoryItem[];
  lastSyncedAt: string;
}

interface HorizonPaymentRecord {
  type: string;
  transaction_successful: boolean;
  to: string;
  from: string;
  amount: string;
  asset_type: string;
  asset_code?: string;
  asset_issuer?: string;
  transaction_hash: string;
  created_at: string;
}

const PAGE_LIMIT = 100;
const MAX_PAGES = 5;

export function isValidStellarAddress(address: string): boolean {
  return StrKey.isValidEd25519PublicKey(address.trim());
}

function resolveAsset(assetCode: AssetCode): Asset {
  if (assetCode === 'XLM') {
    return Asset.native();
  }

  return new Asset('USDC', USDC_ISSUER);
}

function normalizeCampaignAmount(value: string): string {
  return formatStellarAmount(parseStellarAmount(value));
}

async function loadRecipientWalletState(destination: string): Promise<{
  exists: boolean;
  hasUsdcTrustline: boolean;
}> {
  try {
    const account = await horizon.loadAccount(destination);
    const trustlineReady = account.balances.some((balance) => {
      if (
        balance.asset_type !== 'credit_alphanum4' &&
        balance.asset_type !== 'credit_alphanum12'
      ) {
        return false;
      }

      return (
        balance.asset_code === 'USDC' &&
        balance.asset_issuer === USDC_ISSUER &&
        Number(balance.balance) >= 0
      );
    });

    return {
      exists: true,
      hasUsdcTrustline: trustlineReady,
    };
  } catch (error: unknown) {
    const status = (error as { response?: { status?: number } })?.response?.status;
    if (status === 404 || (error as { name?: string })?.name === 'NotFoundError') {
      return { exists: false, hasUsdcTrustline: false };
    }

    throw error;
  }
}

async function fetchIncomingPayments(
  walletAddress: string,
  assetCode: AssetCode,
): Promise<DonationHistoryItem[]> {
  const records: DonationHistoryItem[] = [];
  let page = await horizon
    .payments()
    .forAccount(walletAddress)
    .order('desc')
    .limit(PAGE_LIMIT)
    .call();

  for (let pageIndex = 0; pageIndex < MAX_PAGES; pageIndex += 1) {
    const payments = page.records as HorizonPaymentRecord[];

    for (const record of payments) {
      if (
        record.type !== 'payment' ||
        !record.transaction_successful ||
        record.to !== walletAddress
      ) {
        continue;
      }

      if (assetCode === 'XLM') {
        if (record.asset_type !== 'native') continue;
      } else if (
        record.asset_code !== 'USDC' ||
        record.asset_issuer !== USDC_ISSUER
      ) {
        continue;
      }

      records.push({
        transactionHash: record.transaction_hash,
        createdAt: record.created_at,
        amount: normalizeCampaignAmount(record.amount),
        from: record.from,
        to: record.to,
        assetCode,
        assetIssuer: record.asset_issuer,
      });
    }

    if (payments.length < PAGE_LIMIT) {
      break;
    }

    page = await page.next();
  }

  return records;
}

export async function fetchCampaignSnapshot(
  campaign: Campaign,
): Promise<CampaignOnChainSnapshot> {
  if (!isValidStellarAddress(campaign.walletAddress)) {
    throw new Error(`Invalid wallet address for ${campaign.title}`);
  }

  const targetScaled = parseStellarAmount(campaign.targetAmount);
  const recipientState = await loadRecipientWalletState(campaign.walletAddress);
  const donations = recipientState.exists
    ? await fetchIncomingPayments(campaign.walletAddress, campaign.assetCode)
    : [];

  const raisedScaled = donations.reduce(
    (sum, donation) => sum + parseStellarAmount(donation.amount),
    BigInt(0),
  );

  return {
    recipientExists: recipientState.exists,
    recipientReady:
      campaign.assetCode === 'XLM'
        ? recipientState.exists
        : recipientState.hasUsdcTrustline,
    targetReached: raisedScaled >= targetScaled && targetScaled > BigInt(0),
    raisedScaled,
    targetScaled,
    donationCount: donations.length,
    history: donations,
    lastSyncedAt: new Date().toISOString(),
  };
}

export async function buildDonationXDR(
  sender: string,
  destination: string,
  amount: string,
  assetCode: AssetCode,
): Promise<string> {
  const cleanSender = sender.trim();
  const cleanDestination = destination.trim();
  const normalizedAmount = normalizeCampaignAmount(amount);

  if (!isValidStellarAddress(cleanSender)) {
    throw new Error('Your Freighter address is not a valid Stellar account.');
  }

  if (!isValidStellarAddress(cleanDestination)) {
    throw new Error('The campaign wallet address is not a valid Stellar account.');
  }

  if (parseStellarAmount(normalizedAmount) <= BigInt(0)) {
    throw new Error('Donation amount must be greater than zero.');
  }

  const [senderAccount, recipientState] = await Promise.all([
    server.getAccount(cleanSender),
    loadRecipientWalletState(cleanDestination),
  ]);

  const senderBalances = (senderAccount as unknown as {
    balances: Array<{
      asset_type: string;
      asset_code?: string;
      asset_issuer?: string;
    }>;
  }).balances;

  const senderHasUsdcTrustline = senderBalances.some((balance) => {
    if (
      balance.asset_type !== 'credit_alphanum4' &&
      balance.asset_type !== 'credit_alphanum12'
    ) {
      return false;
    }

    return (
      balance.asset_code === 'USDC' &&
      balance.asset_issuer === USDC_ISSUER
    );
  });

  if (assetCode === 'USDC' && !senderHasUsdcTrustline) {
    throw new Error(
      'Your Freighter wallet does not yet have a USDC trustline. Add it before donating USDC.',
    );
  }

  if (!recipientState.exists) {
    throw new Error('This campaign wallet is not live on Stellar testnet yet.');
  }

  if (assetCode === 'USDC' && !recipientState.hasUsdcTrustline) {
    throw new Error(
      'The recipient wallet does not yet have a USDC trustline. It cannot receive USDC donations yet.',
    );
  }

  const tx = new TransactionBuilder(senderAccount, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      Operation.payment({
        destination: cleanDestination,
        asset: resolveAsset(assetCode),
        amount: normalizedAmount,
      }),
    )
    .setTimeout(60)
    .build();

  return tx.toXDR();
}
