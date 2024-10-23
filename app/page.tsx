"use client";
import { useState, ChangeEvent, SVGProps, JSX } from "react";
import toast from "react-hot-toast";
import Loading from "./components/loading";
import { useAccount, useReadContract } from 'wagmi';
import WalletWrapper from "./components/WalletWrapper";
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
import { BASE_SEPOLIA_CHAIN_ID, web3humanContractAbi, web3humanContractAddress } from './constants';
import { ContractFunctionParameters, encodeFunctionData } from 'viem';

export default function Chat() {
  const { address } = useAccount();
  const [isRandomArticle, setIsRandomArticle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [article, setArticle] = useState("");
  //const [post, setPost] = useState("");
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

  // State for selected media
  const [state, setState] = useState({
    language: "spanish",
  });

  const { data: randomArticle } = useReadContract({
    address: web3humanContractAddress,
    abi: web3humanContractAbi,
    functionName: 'getRandomArticle',
    args: [0],
  });

  interface Faq {
    question: string,
    answer: string,
  }

  const languages = [
    { value: "spanish", name: "Español" },
    { value: "english", name: "English" },
  ];

  const encodedWeb3humansData = encodeFunctionData({
    abi: web3humanContractAbi,
    functionName: 'makeDeposit',
  });
  const calls = [
    {
      to: web3humanContractAddress,
      data: encodedWeb3humansData,
      value: BigInt(70000000000000) // close to $0.20
    },
  ];
  const contractsSaveArticle = [
    {
      address: web3humanContractAddress,
      abi: web3humanContractAbi,
      functionName: 'saveArticle',
      args: [0, article, title, explanation, tagsString, summariesString, faqsString],
    },
  ] as unknown as ContractFunctionParameters[];

  const contractsEN = [
    {
      address: web3humanContractAddress,
      abi: web3humanContractAbi,
      functionName: 'saveArticle',
      args: [1],
    },
  ] as unknown as ContractFunctionParameters[];

  const handleError = (err: TransactionError) => {
    //console.error('Transaction error:', err);
    toast.success("Transaction error: " + err.message);
  };
  const handlePaymentSuccess = (response: TransactionResponse) => {
    //console.log('handlePaymentSuccess Transaction successful', response);
    getExplanation();
  };
  const handleSaveSuccess = (response: TransactionResponse) => {
    //console.log('handleSuccess Transaction successful', response);
    if (response) {
      //toast.success("Article saved successfully!!!");
    }
  };
  function getRandomArticle() {
    if (randomArticle) {
      setIsRandomArticle(true);
      setArticle(randomArticle?.url!);
      setTitle(randomArticle?.title!);
      setExplanation(randomArticle?.explanation!);
      setTagsString(randomArticle?.tags!);
      setSummariesString(randomArticle?.summaries!);
      setFaqsString(randomArticle?.faqs!);

      randomArticle?.summaries!.split("@@").map(function (item: string) {
        if (item.length > 0) {
          summaries.push(item);
        }
      });
      setSummaries(summaries);

      randomArticle?.faqs!.split("@@").map(function (item: string) {
        faqs.push({
          question: item.split("@%")[0],
          answer: item.split("@%")[1]
        });
      });
      setFaqs(faqs);
    }
  }
  const getExplanation = async () => {
    setIsRandomArticle(false);
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
    setTagsString(tagsTemp);
    cleanedJsonObj.tags.english.map(function (item: string) {
      tagsEN.push(item)
    });
    setTagsEN(tagsEN);

    let summariesTemp = "";
    cleanedJsonObj.summary.spanish.map(function (item: string) {
      summaries.push(item);
      summariesTemp += item + "@@";
    });
    setSummaries(summaries);
    setSummariesString(summariesTemp);
    cleanedJsonObj.summary.english.map(function (item: string) {
      summariesEN.push(item)
    });
    setSummariesEN(summariesEN);

    let faqsTemp = "";
    cleanedJsonObj.faqs.spanish.map(function (item: { question: string; answer: string; }) {
      faqs.push({
        question: item.question,
        answer: item.answer
      });
      faqsTemp += item.question + "@%" + item.answer + "@@";
    });
    setFaqs(faqs);
    setFaqsString(faqsTemp);
    cleanedJsonObj.faqs.english.map(function (item: { question: string; answer: string; }) {
      faqsEN.push({
        question: item.question,
        answer: item.answer
      })
    });
    setFaqsEN(faqsEN);
    setIsLoading(false);
  }

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
  return (
    <div className="w-full flex-col">
      <div className="flex flex-row items-center h-[50px] sticky top-0 bg-green-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="shrink h-0 w-0 md:h-6 md:w-6 text-gray-800" viewBox="0 0 16 16">
          <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
          <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4" />
        </svg>
        <h1 className="grow ml-1 text-xl text-black font-bold tracking-tighter md:text-xl">{"Web3 > Human" }</h1>
        <div className="flex flex-none items-center gap-3">
          <SignupButton />
          {!address && <LoginButton />}
        </div>
      </div>
      <div className="px-4 py-6 md:py-8 lg:py-10">
        <div className="flex flex-col gap-4 max-w-3xl mx-auto">
          <div className="flex flex-col gap-2">
            {!explanation && (
              <div className="w-full">
                <h2 className="w-full text-2xl text-green-500 font-bold">Hello, Human*!!!</h2>
                <p className="text-sm mb-4">*This app is human-friendly so feel free to use it at rest to translate any Web3 article to an easy to understand language...</p>
                <div className="justify-center items-center my-1 space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
                  <h3 className="text-md leading-6 font-semibold">
                    <span className="w-full text-xl text-green-500 font-bold">Step 1 /</span> Paste here the link of the Web3 article you want to translate into Human language:
                  </h3>
                  <input className="w-full min-h-[30px] border rounded text-black" name="article" disabled={isLoading || !address} id="text" placeholder="Enter the link here..." value={article} onChange={handleArticle} />
                </div>

              </div>
            )}
            <form className="flex flex-row justify-center gap-2 md:gap-4">
              {address ? article ? !explanation && (
                <Transaction
                  capabilities={{
                    paymasterService: {
                      url: process.env.PAYMASTER_AND_BUNDLER_ENDPOINT!,
                    },
                  }}
                  calls={calls}
                  className=""
                  chainId={BASE_SEPOLIA_CHAIN_ID}
                  onError={handleError}
                  onSuccess={handlePaymentSuccess}
                >
                  <TransactionButton className="m-auto w-auto hover:bg-green-800 bg-green-500 hover:text-white border border-green-500 py-2 px-4 rounded disabled:opacity-50" text="Pay 0.00007 ETH to Get Explanation" />
                  <TransactionStatus>
                    <TransactionStatusLabel/>
                    <TransactionStatusAction/>
                  </TransactionStatus>
                </Transaction>
              ) : (
                <div className="flex flex-col text-center">
                  <p>or</p>
                  <button
                    className="inline-flex text-center justify-center items-center w-full md:w-auto order-1 m-2 font-bold hover:bg-green-500 text-green-500 hover:text-white border border-green-500 py-2 px-4 rounded disabled:opacity-50"
                    onClick={getRandomArticle}
                  >
                    <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path stroke="currentColor" d="M16.872 9.687 20 6.56 17.44 4 4 17.44 6.56 20 16.873 9.687Zm0 0-2.56-2.56M6 7v2m0 0v2m0-2H4m2 0h2m7 7v2m0 0v2m0-2h-2m2 0h2M8 4h.01v.01H8V4Zm2 2h.01v.01H10V6Zm2-2h.01v.01H12V4Zm8 8h.01v.01H20V12Zm-2 2h.01v.01H18V14Zm2 2h.01v.01H20V16Z" />
                    </svg>
                    <span>Get Random Explanation</span>
                  </button>
                </div>

              )
                : (
                  <WalletWrapper
                    className="m-2 max-w-full hover:bg-green-800 bg-green-500 hover:text-white border border-green-500 py-2 px-4 rounded disabled:opacity-50"
                    text="Sign in to Start"
                    withWalletAggregator={true}
                  />
                )}
              {explanation &&
                <>
                  {!isRandomArticle &&
                    <Transaction
                      capabilities={{
                        paymasterService: {
                          url: process.env.PAYMASTER_AND_BUNDLER_ENDPOINT!,
                        },
                      }}
                      contracts={contractsSaveArticle}
                      chainId={BASE_SEPOLIA_CHAIN_ID}
                      onError={handleError}
                      onSuccess={handleSaveSuccess}
                      className="w-auto"
                    >
                      <TransactionButton className="w-auto m-2 hover:bg-green-800 bg-green-500 hover:text-white border border-green-500 py-2 px-4 rounded disabled:opacity-50" text="Save Explanation" />
                    </Transaction>
                  }
                  <button
                    className="inline-flex items-center w-full md:w-auto order-3 m-2 font-bold hover:bg-green-500 text-green-500 hover:text-white border border-green-500 px-4 py-2 rounded disabled:opacity-50"
                    hidden={explanation.length == 0}
                    disabled={isLoading}
                    onClick={async () => {
                      window.location.reload();
                    }}
                  >
                    <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path stroke="currentColor" d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4" />
                    </svg>
                    <span>Reset</span>
                  </button>
                  <a
                    className="inline-flex items-center w-full md:w-auto order-3 m-2 font-bold hover:bg-green-500 text-green-500 hover:text-white border border-green-500 px-4 py-2 rounded disabled:opacity-50"
                    href={article.trim()} target="_blank"
                  >
                    <svg
                      className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                    <span>Open Link</span>
                  </a>
                </>
              }

            </form>
          </div>

          {explanation && !isLoading && <div
            className="w-full flex-col p-3 space-y-2"
          >
            {!isRandomArticle &&
              <div className="my-3 space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
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
            }
            <h1 className="text-center pt-3 text-2xl text-green-500 font-semibold tracking-tight">{state.language == "spanish" ? title : titleEN}</h1>
            <div className="pb-3 text-white-100 text-center" hidden={!isRandomArticle}>
              <span className="font-bold">Sponsored by:</span> {randomArticle?.sponsor!.slice(0, 5)}...{randomArticle?.sponsor!.slice(-5, -1)}
            </div>
            <span className="text-sm text-white-300">
              {state.language == "spanish" ? tagsString :
                tagsEN.map((tag, index) => (
                  tag + ","
                ))}
            </span>
            <div>{state.language == "spanish" ? explanation : explanationEN}</div>
            <h2 className="text-lg text-green-500 font-semibold tracking-tight">Keypoints</h2>
            <ul className="list-disc m-6">
              {state.language == "spanish" ?
                summaries.map((summary, index) => (
                  <li key={index}>{summary}</li>
                ))
                : summariesEN.map((summary, index) => (
                  <li key={index}>{summary}</li>
                ))}
            </ul>

            <h2 className="text-lg text-green-500 font-semibold tracking-tight">FAQs</h2>
            <ul className="space-y-2 m-4">
              {state.language == "spanish" ?
                faqs.map((faq, index) => (
                  <div key={index}>
                    <h3 className="text-green-500 font-semibold tracking-tight">{faq.question}</h3>
                    {faq.answer}
                  </div>
                ))
                : faqsEN.map((faq, index) => (
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