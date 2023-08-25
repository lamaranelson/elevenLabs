# Voice Modality with Eleven Labs

This is a voice generation script powered by the Eleven Labs API. It takes user input and transforms it into speech using a multi-step process. First, the user input is cleaned using a GPT model. Then, the cleaned prompt is sent to Eleven Labs to `GET` the `voiceid` that is necessary in the `POST` request to get the voice. We use the model to match the voice id parameters with user input.

## Features

- **GPT Cleaning**: The script uses a GPT model to clean and enhance the user input before sending it to Eleven Labs.
- **Voice ID Matching**: The model is also used later on to match the voice ID description with the user prompt. This ensures that the voice used for the speech output is the best match for the input prompt.
- **Eleven Labs Integration**: The application uses the Eleven Labs API to convert the cleaned and matched prompt into speech.

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
