# Web3-To-Human v1
🚀 Unveiling Web3 To Human: 

## Features
Here's what it offers:

- 🪄 **Feat1** Desc1. 
<img src="res/feature1.png" width="612" height="300">

- ✂️ **Feat2** Desc2. 
<img src="res/feature2.png" width="612" height="300">

- 📲 **Feat3** Desc3. 
<img src="res/feature3.png" width="612" height="300">

- 🧠 **Powered by Gemini Pro:** Leverages advanced AI capabilities for top-notch content quality.
<img src="res/feature4.png" width="612" height="300">

- 🛡️ **Committed to Responsible AI:** We've implemented safety measures to prevent our AI from generating harmful content. This includes filtering for categories like harassment, hate speech, sexually explicit material, and dangerous suggestions.
<img src="res/feature5.png" width="612" height="300">

- 💻 **Responsive Design:** Enjoy a user-friendly experience across all devices. 

## How to use it

### Install all the dependencies
`npm install`

### Create .env in root
Include your Google Gemini API key there with the variable name: 
`GOOGLE_API_KEY="your_key_here"`

### Run the app
`npm run dev`

## Troubleshooting

The feature generating a post from an url is doing web scraping to extract the text from the web page shared. If you are running the app in Localhost then a Cross-Origin Resource Sharing (CORS) issue would occur. To fix the issue you would need to use the Firefox web browser and install the extension [CORS Everywhere](https://addons.mozilla.org/en-US/firefox/addon/cors-everywhere/).

## Tech behind

This app is using Google AI API for connecting to Gemini 1.5 Flash LLM.

## Copyrights

All copyrights reserved to Dev Bambino user, 2024. The commercial use of the code provided in this repository is forbidden without express authorization.