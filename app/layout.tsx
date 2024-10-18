import type { Metadata } from "next";
import Navbar from "./components/navegation/navbar";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

import dynamic from 'next/dynamic';
import '@coinbase/onchainkit/styles.css';
import '@rainbow-me/rainbowkit/styles.css';

import { base, baseSepolia } from 'viem/chains';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

const inter = Inter({ subsets: ["latin"] });

import '@coinbase/onchainkit/styles.css';
import '@rainbow-me/rainbowkit/styles.css';

const OnchainProviders = dynamic(
  () => import('./components/OnchainProviders'),
  {
    ssr: false,
  },
);

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export const metadata: Metadata = {
  title: "Web3 To Human App v1",
  description: "Simplifying the complex Web3 concepts for actual humans",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster position="bottom-center" />
        <OnchainProviders>{children}</OnchainProviders>
      </body>
    </html>
  );
}
