import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userPrompt } = await req.json();

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

  const generationConfig = { temperature: 0.8, maxOutputTokens: 3000 };
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: generationConfig, safetySettings: safetySettings });

  let systemPrompt = `You are an expert in simplifying complex Web3 and blockchain concepts for non-technical users. Your task is to extract the information from a given HTML code, process it, and generate the following output in **both English and Spanish**: 

1. **Title**: Write a simple, beginner-friendly title of the article's topic to help non-technical users understand what the article is about without reading it first.
2. **Tags List**: Generate a list of tags based on the content of the article, that could be used for indexing the content in a terms search.
3. **Explanation**: Write a simple, beginner-friendly explanation of the article's topic to help non-technical users understand the key points.
4. **Summary**: Provide a concise summary of the article's content in bullet points.
5. **FAQs List**: Generate a list of frequently asked questions based on the content of the article, along with clear and understandable answers.

**Instructions:**
- The HTML code of the article will be provided to you.
- Focus on explaining concepts like blockchain, smart contracts, decentralized finance, etc., in a way that avoids jargon and technical details that might confuse beginners.
- For each section (Title, Tags List, Explanation, Summary, FAQs List), provide the output in both **English and Spanish**.
- Return the response as a structured JSON file, formatted as follows:
{
  "title": {
    "english": "Title in English.",
    "spanish": "Title in Spanish."
  },
  "tags": {
    "english": [
      "Tag 1 in English",
      "Tag 2 in English",
      ...
    ],
    "spanish": [
      "Tag 1 in Spanish",
      "Tag 2 in Spanish",
      ...
    ]
  },
  "explanation": {
    "english": "Your explanation in English.",
    "spanish": "Your explanation in Spanish."
  },
  "summary": {
    "english": [
      "Bullet point 1 in English",
      "Bullet point 2 in English",
      ...
    ],
    "spanish": [
      "Bullet point 1 in Spanish",
      "Bullet point 2 in Spanish",
      ...
    ]
  },
  "faqs": {
    "english": [
      {
        "question": "Frequently asked question 1 in English?",
        "answer": "Answer 1 in English."
      },
      {
        "question": "Frequently asked question 2 in English?",
        "answer": "Answer 2 in English."
      },
      ...
    ],
    "spanish": [
      {
        "question": "Frequently asked question 1 in Spanish?",
        "answer": "Answer 1 in Spanish."
      },
      {
        "question": "Frequently asked question 2 in Spanish?",
        "answer": "Answer 2 in Spanish."
      },
      ...
    ]
  }
}

Make sure the explanations and FAQs are easy to understand for beginners who may not have any prior knowledge of Web3 or blockchain. The explanations should help them grasp the core ideas without being overwhelmed by technical terms.`;

  try {
    const result = await model.generateContent([systemPrompt, userPrompt]);
    const response = await result.response;
    const text = response.text();
    return NextResponse.json({
      text
    });
  } catch (error) {
    return NextResponse.json({
      text: "Unable to process the prompt. Please try again. Error:" + error
    });
  }
}