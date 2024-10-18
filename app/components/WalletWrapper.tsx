'use client';
import {
  Address,
  Avatar,
  EthBalance,
  Identity,
  Name,
} from '@coinbase/onchainkit/identity';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownBasename,
  WalletDropdownDisconnect,
  WalletDropdownFundLink,
  WalletDropdownLink,
} from '@coinbase/onchainkit/wallet';

type WalletWrapperParams = {
  text?: string;
  className?: string;
  withWalletAggregator?: boolean;
};
export default function WalletWrapper({
  className,
  text,
  withWalletAggregator = false,
}: WalletWrapperParams) {
  return (
    <>
      <Wallet>
        <ConnectWallet
          withWalletAggregator={withWalletAggregator}
          text={text}
          className={className}
        >
          <Avatar className="h-6 w-6 text-black" />
          <Name className="text-black"/>
        </ConnectWallet>
        <WalletDropdown className="bg-green-500">
          <Identity className="px-4 pt-3 pb-2 text-black bg-green-500 text-black" hasCopyAddressOnClick={true}>
            <Avatar/>
            <Name />
            <Address className="text-black"/>
            <EthBalance className="text-green-900"/>
          </Identity>
          <WalletDropdownBasename  className="bg-green-500 text-black"/>
          <WalletDropdownLink className="bg-green-500 text-black" icon="wallet" href="https://wallet.coinbase.com">
            Go to Wallet Dashboard
          </WalletDropdownLink>
          <WalletDropdownFundLink className="bg-green-500 text-black"/>
          <WalletDropdownDisconnect className="bg-green-500 text-black"/>
        </WalletDropdown>
      </Wallet>
    </>
  );
}
