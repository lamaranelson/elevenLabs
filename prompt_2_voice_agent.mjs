import fetch from 'node-fetch';
import { promises as fs } from 'fs';
import { OpenAI } from 'langchain/llms/openai';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { SystemMessage } from 'langchain/schema';
import dotenv from 'dotenv';

dotenv.config();

async function gptCompletion(topic) {
    const chat = new ChatOpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        temperature: parseFloat(process.env.OPENAI_TEMPERATURE),
        maxTokens: 2000,
        modelName: process.env.OPENAI_CHAT_MODEL,
    });
    const response = await chat.call([
        new SystemMessage(
            `You are an assistant that helps complete user prompts so that we can transform the completed piece into speech with a third party API.\nThe user has asked you to complete the following prompt:\n\n${topic}\nResponse:`)
    ]);        
        return response.content;
}


async function getBestMatchVoiceId(inputPrompt, chatModel) { 
  const response = await fetch(`${process.env.API_ENDPOINT}/voices`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'xi-api-key': process.env.ELEVEN_LABS_API_KEY
    }
  });

  const data = await response.json();
  let bestMatchVoiceId = null;
  let highestScore = -Infinity;
  let oper_obj = {};

  for (let voice of data.voices) {
    const useCase = voice.labels['use case'];
    const description = voice.labels.description;
    const formattedData = `${voice.link} ==> ${voice.snippet}`;
    oper_obj[useCase] = formattedData;

    const formattedPrompt = `
      You are an assistant that specializes in matching user prompts with voice IDs based on the voice's labels, specifically their use case and description. When given a user prompt and the use case and description of a voice, determine how well they match and provide a score. A higher score indicates a better match.\nUser Prompt: ${inputPrompt}\nVoice Use Case: ${useCase}\nVoice Description: ${description}\n\nScore:`;

    const systemMessage = new SystemMessage("You are a helpful assistant.");
    const humanMessage = new SystemMessage(formattedPrompt);
    const response = await chatModel.call([systemMessage, humanMessage]);
    const score = parseFloat(response.content);

    if (score > highestScore) {
      highestScore = score;
      bestMatchVoiceId = voice.voice_id;
    }
  }

  return bestMatchVoiceId;
}

async function getRandomVoiceId() { 
  const response = await fetch(`${process.env.API_ENDPOINT}/voices`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'xi-api-key': process.env.ELEVEN_LABS_API_KEY
    }
  });

  const data = await response.json();
  data.voices.forEach((voice) => {
    console.log('labels:', voice.labels);
  });
  const randomIndex = Math.floor(Math.random() * data.voices.length);
  return data.voices[randomIndex].voice_id;
}

async function textToSpeech(promptText) {
  const chat = new ChatOpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        temperature: parseFloat(process.env.OPENAI_TEMPERATURE),
        maxTokens: 2000,
        modelName: process.env.OPENAI_CHAT_MODEL,
    });

  const voiceId = await getBestMatchVoiceId(promptText, chat);
  const completedText = await gptCompletion(promptText);
  
  const response = await fetch(`${process.env.API_ENDPOINT}/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'accept': 'audio/mpeg',
      'xi-api-key': process.env.ELEVEN_LABS_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: completedText,
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5
      }
    })
  });

  const audioData = await response.buffer();
  await fs.writeFile('output.mp3', audioData);
}

(async () => {
  const voiceId = await getRandomVoiceId();
  await textToSpeech(process.env.PROMPT_TEXT);
})();