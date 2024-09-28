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
            `You are an assistant that helps complete user prompts so that we can transform the completed piece into speech with a third party API.
        The user has asked you to complete the following prompt:
        \n
        ${topic}
        \n
        Response:`)
    ]);        
        return response.content;

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

async function textToSpeech(voiceId, promptText) {
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
  await textToSpeech(voiceId, process.env.PROMPT_TEXT);
})();