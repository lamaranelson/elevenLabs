# Voice Modality with Eleven Labs

Two separate CLI programs that transform user prompts into speech by cleaning and enhancing input with GPT models and generating audio using the Eleven Labs API—either by selecting a random voice or intelligently matching the best-fitting voice to the prompt.

## Overview

This project consists of two voice generation scripts powered by the Eleven Labs API and OpenAI's GPT models via the LangChain framework. They take user input and transform it into speech through a multi-step process:

1. **GPT Cleaning**: The user input is cleaned and enhanced using a GPT model to ensure clarity and coherence.
2. **Voice Selection**:
   - **Random Voice ID**: Selects a random voice from Eleven Labs for speech synthesis.
   - **Voice Agent**: Intelligently matches the user prompt to the most suitable voice based on voice labels such as use case and description.
3. **Speech Generation**: The cleaned prompt is sent to Eleven Labs to generate speech using the selected voice.

## Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/voice_modality.git
cd voice_modality
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root directory and add your API keys and configurations:

```env
API_ENDPOINT='https://api.elevenlabs.io/v1'
ELEVEN_LABS_API_KEY='your_eleven_labs_api_key'
OPENAI_API_KEY='your_openai_api_key'
OPENAI_CHAT_MODEL='gpt-4-0613'
OPENAI_TEMPERATURE=0.1
PROMPT_TEXT='Your default prompt here'
```

## Usage

### 1. Prompt to Voice with Random Voice ID

**Script**: `src/prompt_2_voice_randomID.mjs`

#### Description

- **GPT Cleaning**: The script uses a GPT model to clean and enhance the user input before sending it to Eleven Labs.
- **Random Voice Selection**: Fetches a list of available voices from Eleven Labs and selects one at random.
- **Speech Generation**: Converts the cleaned input into speech using the randomly selected voice.
- **Output**: Saves the resulting speech as `output.mp3` in the project root.

#### Running the Script

```bash
node src/prompt_2_voice_randomID.mjs
```

### 2. Voice Selection With GPT

**Script**: `src/prompt_2_voice_agent.mjs`

#### Description

- **GPT Cleaning**: The script uses a GPT model to clean and enhance the user input before sending it to Eleven Labs.
- **Voice ID Matching**: Fetches the list of voices and their labels (use case and description) from Eleven Labs. Uses a GPT model to score and select the voice that best matches the user prompt.
- **Speech Generation**: Converts the cleaned input into speech using the selected voice.
- **Output**: Saves the resulting speech as `output.mp3` in the project root.

#### Running the Script

```bash
node src/prompt_2_voice_agent.mjs
```
