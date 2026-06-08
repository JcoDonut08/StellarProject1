# Stellar Care Fund

A zero-fee medical crowdfunding platform on Stellar that lets donors send XLM or USDC directly to patient wallets with full on-chain transparency.

## Problem
Medical emergencies can hit families with no warning, and the financial burden can be immediate and overwhelming. In the Philippines, where many households are vulnerable to sudden out-of-pocket hospital costs, delays in fundraising can make treatment harder to access. Traditional crowdfunding platforms also introduce fees, custody risk, and payout delays, which means less money reaches the patient when it matters most.

## How It Works
A campaign is created for a patient with a title, story, target amount, and recipient Stellar wallet address. Donors connect Freighter, choose a campaign, enter an amount, and sign the payment from their own wallet. The funds go directly to the patient’s Stellar address, and the app shows the transaction hash, timestamp, and payment history from the blockchain.

## How It Uses Stellar
This app uses Stellar classic payments for direct peer-to-peer donations in XLM or USDC. It uses Freighter for client-side signing, Horizon to read account data and on-chain payment history, and testnet Friendbot to fund demo donor wallets. USDC campaigns use Stellar trustlines, so both donor and recipient readiness are validated before a payment is allowed. The blockchain is the source of truth for raised totals, receipts, and donation history.

## Track
Track 5 Social Impact

## Tech Stack
- Framework: Next.js 16 + React 19 + TypeScript
- Styling: Tailwind CSS v4
- Stellar SDK: @stellar/stellar-sdk v15.1.0
- Wallet integration: @stellar/freighter-api v6.0.1
- Network: testnet
- Other key dependencies: ESLint, Next.js App Router

## Setup & Run
```bash
git clone https://github.com/ALGOREX-PH/StellarX-Workshop-PUP-May-2026.git
cd StellarX-Workshop-PUP-May-2026/web
npm install

# optional environment variables:
# NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
# NEXT_PUBLIC_SOROBAN_RPC=https://soroban-testnet.stellar.org
# NEXT_PUBLIC_USDC_ISSUER=GBBD47IF6LWK7P7MDEVSCWR7DPUWV3DTQEVFL4NAT4AQH3ZLLFLA5

npm run dev
