'use client';
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from '@coinbase/onchainkit/transaction';
import type {
  TransactionError,
  TransactionResponse,
} from '@coinbase/onchainkit/transaction';
import { BASE_SEPOLIA_CHAIN_ID, micropaymentsContractAbi, micropaymentsContractAddress } from '../constants';
import { Address, ContractFunctionParameters, encodeFunctionData } from 'viem';

import toast from "react-hot-toast";

export default function TransactionWrapper({ address }: { address: Address }) {
  const contracts = [
    {
      address: micropaymentsContractAddress,
      abi: micropaymentsContractAbi,
      functionName: 'saveExplanation',
      args: [address],
    },
  ] as unknown as ContractFunctionParameters[];

  const handleError = (err: TransactionError) => {
    console.error('Transaction error:', err);
    toast.success("Transaction error: " + err);
  };

  const handleSuccess = (response: TransactionResponse) => {
    console.log('Transaction successful', response);
    toast.success("Transaction successful: " + response);
  };

  const encodedMicropaymentsData = encodeFunctionData({
    abi: micropaymentsContractAbi,
    functionName: 'makeDeposit',
  });
  const calls = [
    {
      to: micropaymentsContractAddress,
      data: encodedMicropaymentsData,
      value: BigInt(70000000000000) // close to $0.20
    },
  ];


  return (
    <div className="flex">
      <Transaction
        capabilities={{ 
          paymasterService: { 
            url: process.env.NEXT_PUBLIC_PAYMASTER_AND_BUNDLER_ENDPOINT!, 
          }, 
        }}
        calls={calls}
        className=""
        chainId={BASE_SEPOLIA_CHAIN_ID}
        onError={handleError}
        onSuccess={handleSuccess}
      >
        <TransactionButton className="m-2 max-w-full hover:bg-green-800 bg-green-500 hover:text-white border border-green-500 py-2 px-4 rounded disabled:opacity-50" text="Pay $0.20 & Get Explanation"/>
        <TransactionStatus>
          <TransactionStatusLabel />
          <TransactionStatusAction />
        </TransactionStatus>
      </Transaction>
    </div>
  );
}
