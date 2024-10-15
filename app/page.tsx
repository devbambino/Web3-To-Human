"use client";
import { useState, ChangeEvent, SVGProps, JSX } from "react";
import toast from "react-hot-toast";
import ClipboardPasteIcon from "./components/clipboardicon";
import LinkIcon from "./components/linkicon";
import Loading from "./components/loading";
import ResetButton from "./components/resetbtn";

export default function Chat() {
  // State variables with initial values
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState("link");
  const [article, setArticle] = useState("");
  const [post, setPost] = useState("");
  const [tweets, setTweets] = useState<string[]>([]);
  const [imageData, setImageData] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [explanation, setExplanation] = useState("");
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [summaries, setSummaries] = useState<string[]>([]);

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

  // Loading state UI
  if (isLoading) {
    return <Loading />;
  }

  // Main UI after input type selection
  //https://eips.ethereum.org/EIPS/eip-4844
  return (
    <div className="px-4 py-6 md:py-8 lg:py-10">
      <div className="flex flex-col gap-4 max-w-3xl mx-auto">
        {/* Steps for selecting social media and providing input */}
        <div className="flex flex-col gap-2">
          {!post && (
            <div className="w-full">
              <h2 className="w-full text-2xl text-green-500 font-bold">Hello, Human!!!</h2>

              <div className="justify-center items-center my-1 space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
                <h3 className="text-md leading-6 font-semibold">
                  Paste here the link of the Web3 article you want to translate into Human language...
                </h3>
                <textarea className="w-full min-h-[50px] border rounded text-black" name="article" disabled={isLoading} id="text" placeholder="Enter the link here..." value={article} onChange={handleArticle} />
              </div>

            </div>
          )}
          <form className="flex flex-row items-start gap-2 md:gap-4">
            {!post && (
              <button
                className="inline-flex text-center justify-center items-center w-full md:w-auto order-1 m-2 font-bold hover:bg-green-500 text-green-500 hover:text-white border border-green-500 py-2 px-4 rounded disabled:opacity-50"
                onClick={async () => {
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

                  setExplanation(cleanedJsonObj.explanation.spanish);

                  cleanedJsonObj.summary.spanish.map(function (item: string) {
                    summaries.push(item)
                  });
                  setSummaries(summaries);

                  cleanedJsonObj.faqs.spanish.map(function (item: { question: string; answer: string; }) {
                    faqs.push({
                      question: item.question,
                      answer: item.answer
                    })
                  });
                  setFaqs(faqs);

                  const responseFull = cleanedJsonObj.explanation.spanish;
                  setPost(responseFull);
                  setIsLoading(false);
                }}
              >
                <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path stroke="currentColor" d="M16.872 9.687 20 6.56 17.44 4 4 17.44 6.56 20 16.873 9.687Zm0 0-2.56-2.56M6 7v2m0 0v2m0-2H4m2 0h2m7 7v2m0 0v2m0-2h-2m2 0h2M8 4h.01v.01H8V4Zm2 2h.01v.01H10V6Zm2-2h.01v.01H12V4Zm8 8h.01v.01H20V12Zm-2 2h.01v.01H18V14Zm2 2h.01v.01H20V16Z" />
                </svg>
                <span>Explain Now</span>
              </button>
            )}
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
          </form>
        </div>

        {/* Post generation and display section */}
        {post && !isLoading && <div
          className="w-full p-3 space-y-4"
        >
          <h1 className="text-xl text-green-500 font-semibold tracking-tight">Article</h1>
          {explanation}
          <h2 className="text-lg text-green-500 font-semibold tracking-tight">Summary</h2>
          <ul className="list-disc m-4">
            {summaries.map((summary, index) => (
              <li key={index}>{summary}</li>
            ))}
          </ul>

          <h2 className="text-lg text-green-500 font-semibold tracking-tight">FAQs</h2>
          <ul className="space-y-2">
            {faqs.map((faq, index) => (
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
  );
}