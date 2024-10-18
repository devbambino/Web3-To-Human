'use client';
import WalletWrapper from './WalletWrapper';

export default function LoginButton() {
  return (
    <WalletWrapper
      className="mx-2 min-w-[90px] hover:bg-green-800 bg-green-500 hover:text-white border border-black py-2 px-4 rounded disabled:opacity-50"
      text="Log in"
      withWalletAggregator={true}
    />
  );
}
