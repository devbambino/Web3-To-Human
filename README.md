# Web3-To-Human v1
Simplifying Web3 and blockchain for Spanish-speaking users in Latin America with AI-powered articles, explained in easy-to-understand language and stored on the blockchain for free access by all.

With Web3 To Human, our goal is to bridge the knowledge gap around Web3 and blockchain for Spanish-speaking users, making complex technologies accessible in their native language. This project is not just about education—it’s about empowering Latin Americans with the tools and knowledge to actively participate in the growing Web3 space. I believe Web3 can open doors for financial inclusion, innovation, and economic empowerment in LATAM, and I want to be part of that transformation.

## Features
Here's what it offers:

- 🪄 **Web3 to easy to understand language translation** The app transforms technical Web3 content into simplified articles in Spanish and english using AI. 

- **Gas less transactions** Using Coinbase's paymaster capabilities the app allows gas less transactions for Coinbase wallet users. 

- **Blockchain Storage** Articles are stored on the blockchain, making them accessible for free to future users. 

- **Educational Features** Each article contains a title, tags, explanations, key points, and FAQs designed to break down complex topics, and help new users to break into the wonderful web3 world.

- 🧠 **Powered by Gemini Pro:** Leverages advanced AI capabilities for top-notch content quality.

- 🛡️ **Committed to Responsible AI:** We've implemented safety measures to prevent our AI from generating harmful content. This includes filtering for categories like harassment, hate speech, sexually explicit material, and dangerous suggestions.

- 💻 **Responsive Design:** Enjoy a user-friendly experience across all devices. 

## Smart Contract
The smart contract was deployed to Base Sepolia and this is its address:
`0x37eDbe2D3f968E57C93aE41c2856CdDf711739CE`

[Click here to see smart contract...](https://sepolia.basescan.org/address/0x37eDbe2D3f968E57C93aE41c2856CdDf711739CE)

## How to use it

### Install all the dependencies
`npm install`

### Create .env in root
Include your Google Gemini API key and all CDP related keys there with the variable name: 
`GOOGLE_API_KEY="your_key_here"`
`NEXT_PUBLIC_CDP_API_KEY="your_key_here"`
`NEXT_PUBLIC_WC_PROJECT_ID="your_key_here"`
`NEXT_PUBLIC_PAYMASTER_AND_BUNDLER_ENDPOINT="your_key_here"`

### Run the app
`npm run dev`

## Troubleshooting

The feature generating a post from an url is doing web scraping to extract the text from the web page shared. If you are running the app in Localhost then a Cross-Origin Resource Sharing (CORS) issue would occur. To fix the issue you would need to use the Firefox web browser and install the extension [CORS Everywhere](https://addons.mozilla.org/en-US/firefox/addon/cors-everywhere/).

## Tech behind

This app is connecting to Base Sepolia blockchain and is using Google AI API for connecting to Gemini 1.5 Flash LLM.

## Copyrights

All copyrights reserved to Dev Bambino user, 2024. The commercial use of the code provided in this repository is forbidden without express authorization.