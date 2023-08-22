# Voice Modality with Eleven Labs

This is a voice generation script powered by the Eleven Labs API. It takes user input and transforms it into speech using a two-step process. First, the user input is cleaned using a GPT model. Then, the cleaned prompt is sent to Eleven Labs.

## Features

- **GPT Cleaning**: The script uses a GPT model to clean and enhance the user input before sending it to Eleven Labs.
- **Voice ID Matching**: A custom Langchain agent is used to match the voice ID description with the user prompt. This ensures that the voice used for the speech output is the best match for the input prompt.
- **Eleven Labs Integration**: The application uses the Eleven Labs API to convert the cleaned and matched prompt into speech.

## How it Works

For text to voice generation Eleven Labs requires two API calls. The first is a GET request to retrieve the voice ID. The second is a POST request to get the actual voice. The voice used in the POST request must include the voice ID, which is matched to the user prompt using the Langchain agent.

## Setup

To run this script, you need to have Node.js installed and an API key from Eleven Labs. You also need to set up the environment variables for the OpenAI API key, Eleven Labs API key, and the API endpoint.

## Dependencies

This project uses the following npm packages:

- `node-fetch`: Used for making HTTP requests.
- `fs`: Used for handling file system operations.
- `dotenv`: Used for managing environment variables.
- `langchain`: Used for the GPT model, and for the agent.

## Usage

To use this, simply run the script with your desired user prompt as an environment variable. The application will clean the prompt, match it to a voice ID, and convert it into speech using Eleven Labs. The resulting speech will be saved as an MP3 file.
