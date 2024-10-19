"use client";
import { useState, ChangeEvent, SVGProps, JSX } from "react";
import toast from "react-hot-toast";
import ClipboardPasteIcon from "./components/clipboardicon";
import LinkIcon from "./components/linkicon";
import Loading from "./components/loading";
import ResetButton from "./components/resetbtn";
import { useAccount } from 'wagmi';
import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownBasename, WalletDropdownDisconnect, WalletDropdownLink } from "@coinbase/onchainkit/wallet";
import { Address, Avatar, Badge, EthBalance, Identity, Name } from "@coinbase/onchainkit/identity";
import WalletWrapper from "./components/WalletWrapper";
import TransactionWrapper from "./components/TransactionWrapper";
import SignupButton from "./components/SignupButton";
import LoginButton from "./components/LoginButton";
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
import { BASE_SEPOLIA_CHAIN_ID, micropaymentsContractAbi, micropaymentsContractAddress } from './constants';
import { ContractFunctionParameters, encodeFunctionData } from 'viem';

export default function Chat() {
  const { address } = useAccount();
  // State variables with initial values
  const [isLoading, setIsLoading] = useState(false);
  const [article, setArticle] = useState("");
  const [post, setPost] = useState("");
  const [tweets, setTweets] = useState<string[]>([]);

  // State for selected media
  const [state, setState] = useState({
    language: "spanish",
  });

  const [title, setTitle] = useState("");
  const [explanation, setExplanation] = useState("");
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [summaries, setSummaries] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [faqsString, setFaqsString] = useState("");
  const [summariesString, setSummariesString] = useState("");
  const [tagsString, setTagsString] = useState("");

  const [titleEN, setTitleEN] = useState("");
  const [explanationEN, setExplanationEN] = useState("");
  const [faqsEN, setFaqsEN] = useState<Faq[]>([]);
  const [summariesEN, setSummariesEN] = useState<string[]>([]);
  const [tagsEN, setTagsEN] = useState<string[]>([]);

  const languages = [
    { value: "spanish", name: "Español" },
    { value: "english", name: "English" },
  ];

  const handleError = (err: TransactionError) => {
    console.error('Transaction error:', err);
    toast.success("Transaction error: " + err);
  };

  const handleSuccess = (response: TransactionResponse) => {
    console.log('Transaction successful', response);
    toast.success("Transaction successful: " + response);
    getExplanation();

  };
  const getExplanation = async () => {
    console.log('getExplanation');
    setIsLoading(true);
    const responseScraping = await fetch(article.trim());
    const dataScraping = await responseScraping.text();
    const response = await fetch("api/scraping", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userPrompt: dataScraping,
      }),
    });
    const data = await response.json();
    console.log("jsonResponse:", data);
    const cleanedJsonString = data.text.replace(/^```json\s*|```\s*$/g, "");
    const cleanedJsonObj = JSON.parse(cleanedJsonString);

    setTitle(cleanedJsonObj.title.spanish);
    setExplanation(cleanedJsonObj.explanation.spanish);
    setTitleEN(cleanedJsonObj.title.english);
    setExplanationEN(cleanedJsonObj.explanation.english);

    let tagsTemp = "";
    cleanedJsonObj.tags.spanish.map(function (item: string) {
      tags.push(item);
      tagsTemp += item + ",";
    });
    setTags(tags);
    cleanedJsonObj.tags.english.map(function (item: string) {
      tagsEN.push(item)
    });
    setTagsEN(tagsEN);

    let summariesTemp = "";
    cleanedJsonObj.summary.spanish.map(function (item: string) {
      summaries.push(item)
    });
    setSummaries(summaries);
    cleanedJsonObj.summary.english.map(function (item: string) {
      summariesEN.push(item)
    });
    setSummariesEN(summariesEN);

    cleanedJsonObj.faqs.spanish.map(function (item: { question: string; answer: string; }) {
      faqs.push({
        question: item.question,
        answer: item.answer
      })
    });
    setFaqs(faqs);
    cleanedJsonObj.faqs.english.map(function (item: { question: string; answer: string; }) {
      faqsEN.push({
        question: item.question,
        answer: item.answer
      })
    });
    setFaqsEN(faqsEN);

    const responseFull = cleanedJsonObj.explanation.spanish;
    setPost(responseFull);
    setIsLoading(false);
  }

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
  const contracts = [
    {
      address: micropaymentsContractAddress,
      abi: micropaymentsContractAbi,
      functionName: 'saveArticle',
      args: [0,article,title,explanation, tagsString,summariesString,faqsString],
    },
  ] as unknown as ContractFunctionParameters[];

  const contractsEN = [
    {
      address: micropaymentsContractAddress,
      abi: micropaymentsContractAbi,
      functionName: 'saveArticle',
      args: [address],
    },
  ] as unknown as ContractFunctionParameters[];

  interface Faq {
    question: string,
    answer: string,
  }

  // Function to copy text to clipboard and display success message
  function copyText(entryText: string) {
    navigator.clipboard.writeText(entryText);
    toast.success("Copied to clipboard!");
  }

  // Event handlers for article, state change, and file upload 
  const handleArticle = (event: { target: { value: any; }; }) => {
    const value = event.target.value;
    setArticle(value);
  };

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [name]: value,
    });
  };

  // Loading state UI
  if (isLoading) {
    return <Loading />;
  }

  // Main UI after input type selection
  //https://eips.ethereum.org/EIPS/eip-4844
  return (
    <div className="w-full flex-col">
      <div className="flex flex-row items-center h-[50px] sticky top-0 bg-green-500">
        <svg
          className="shrink h-0 w-0 md:h-6 md:w-6 text-gray-800"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
        </svg>
        <h1 className="grow ml-1 text-xl text-black font-bold tracking-tighter md:text-2xl">Web3-To-Human</h1>
        <div className="flex flex-none items-center gap-3">
          <SignupButton />
          {!address && <LoginButton />}
        </div>
      </div>
      <div className="px-4 py-6 md:py-8 lg:py-10">
        <div className="flex flex-col gap-4 max-w-3xl mx-auto">
          <div className="flex flex-col gap-2">
            {!post && (
              <div className="w-full">
                <h2 className="w-full text-2xl text-green-500 font-bold">Hello, Human!!!</h2>

                <div className="justify-center items-center my-1 space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
                  <h3 className="text-md leading-6 font-semibold">
                    <span className="w-full text-xl text-green-500 font-bold">Step 1 /</span> Paste here the link of the Web3 article you want to translate into Human language...
                  </h3>
                  <input className="w-full min-h-[30px] border rounded text-black" name="article" disabled={isLoading} id="text" placeholder="Enter the link here..." value={article} onChange={handleArticle} />
                </div>

              </div>
            )}
            <form className="flex flex-row justify-center gap-2 md:gap-4">
              {address ? article && !post &&
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
                    <TransactionButton className="m-2 max-w-full hover:bg-green-800 bg-green-500 hover:text-white border border-green-500 py-2 px-4 rounded disabled:opacity-50" text="Pay $0.20 & Get Explanation" />
                    <TransactionStatus>
                      <TransactionStatusLabel />
                      <TransactionStatusAction />
                    </TransactionStatus>
                  </Transaction>
                </div>

                : (
                  <WalletWrapper
                    className="m-2 max-w-full hover:bg-green-800 bg-green-500 hover:text-white border border-green-500 py-2 px-4 rounded disabled:opacity-50"
                    text="Sign in to Start"
                    withWalletAggregator={true}
                  />
                )}
              {post &&
                <>
                  <Transaction
                    capabilities={{
                      paymasterService: {
                        url: process.env.NEXT_PUBLIC_PAYMASTER_AND_BUNDLER_ENDPOINT!,
                      },
                    }}
                    contracts={contracts}
                    chainId={BASE_SEPOLIA_CHAIN_ID}
                    onError={handleError}
                    onSuccess={handleSuccess}
                  >
                    <TransactionButton className="m-2 max-w-full hover:bg-green-800 bg-green-500 hover:text-white border border-green-500 py-2 px-4 rounded disabled:opacity-50" text="Save Explanation" />
                    <TransactionStatus>
                      <TransactionStatusLabel />
                      <TransactionStatusAction />
                    </TransactionStatus>
                  </Transaction>
                  <ResetButton post={post} tweets={tweets} isLoading={isLoading} onButtonClicked={async () => {
                    window.location.reload();
                  }} />
                  <a
                    className="inline-flex items-center w-full md:w-auto order-3 m-2 font-bold hover:bg-green-500 text-green-500 hover:text-white border border-green-500 py-2 px-4 rounded disabled:opacity-50"
                    href={article.trim()} target="_blank"
                  >
                    <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path stroke="currentColor" d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4" />
                    </svg>
                    <span>Open Link</span>
                  </a>
                </>
              }

            </form>
          </div>

          {/* Post generation and display section */}
          {post && !isLoading && <div
            className="w-full flex-col p-3 space-y-4"
          >
            <div className="my-3 space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
              {/* ... social media selection content ... */}
              <h3 className="text-md font-semibold"><span className="w-full text-xl text-green-500 font-bold">Step 2 /</span> Select your language...</h3>
              <div className="flex flex-wrap justify-center">
                {languages.map(({ value, name }) => (
                  <div
                    key={value}
                    className="m-2 border border-green-500 font-bold text-green-500 px-4 py-2 rounded-lg"
                  >
                    <input
                      id={value}
                      type="radio"
                      value={value}
                      name="language"
                      className="accent-[#48bb78]"
                      checked={state.language === value}
                      onChange={handleChange}
                    />
                    <label className="ml-2" htmlFor={value}>
                      {`${name}`}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <h1 className="text-xl text-green-500 font-semibold tracking-tight">{state.language == "spanish" ? title : titleEN}</h1>
            <span className="text-sm text-white-300">
              {state.language == "spanish" ? tags.map((tag, index) => (
                tag + ","
              )) :
                tagsEN.map((tag, index) => (
                  tag + ","
                ))}
            </span>
            <div>{state.language == "spanish" ? explanation : explanationEN}</div>
            <h2 className="text-lg text-green-500 font-semibold tracking-tight">Summary</h2>
            <ul className="list-disc m-4">
              {state.language == "spanish" ? summaries.map((summary, index) => (
                <li key={index}>{summary}</li>
              )) : summariesEN.map((summary, index) => (
                <li key={index}>{summary}</li>
              ))}
            </ul>

            <h2 className="text-lg text-green-500 font-semibold tracking-tight">FAQs</h2>
            <ul className="space-y-2">
              {state.language == "spanish" ? faqs.map((faq, index) => (
                <div key={index}>
                  <h3 className="text-green-500 font-semibold tracking-tight">{faq.question}</h3>
                  {faq.answer}
                </div>
              )) : faqsEN.map((faq, index) => (
                <div key={index}>
                  <h3 className="text-green-500 font-semibold tracking-tight">{faq.question}</h3>
                  {faq.answer}
                </div>
              ))}
            </ul>
          </div>
          }
        </div>
      </div>
    </div>
  );
}