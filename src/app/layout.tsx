import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { WalletProvider } from '@/components/wallet-provider';

export const metadata: Metadata = {
  title: 'Stellar Care Fund',
  description:
    'Zero-fee medical crowdfunding on Stellar with direct USDC or XLM donations to patient wallets.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
