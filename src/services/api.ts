import axios from 'axios';
import { Settings, UploadedFile } from '../types';

const OLLAMA_API_URL = 'http://localhost:11434';

export const fetchOllamaModels = async (): Promise<string[]> => {
  try {
    const response = await axios.get(`${OLLAMA_API_URL}/api/tags`);
    return response.data.models.map((model: { name: string }) => model.name);
  } catch (error) {
    console.error('Error fetching Ollama models:', error);
    return [];
  }
};

export const summarizeContent = async (
  file: UploadedFile,
  settings: Settings
): Promise<string> => {
  const prompt = `Please provide a concise summary of the following ${file.type} content:\n\n${file.content}`;
  
  if (settings.model === 'ollama') {
    try {
      const response = await axios.post(`${OLLAMA_API_URL}/api/generate`, {
        model: settings.ollamaModel,
        prompt,
        stream: false,
        options: {
          temperature: settings.temperature,
        },
      });
      return response.data.response;
    } catch (error) {
      console.error('Error generating summary:', error);
      throw error;
    }
  } else {
    // Gemini implementation
    // TODO: Implement Gemini API call
    return 'Gemini API not implemented yet';
  }
};

export const generateResponse = async (
  input: string, 
  settings: Settings,
  uploadedFiles: UploadedFile[]
): Promise<string> => {
  const filesContext = uploadedFiles
    .map(file => `[${file.name}]:\n${file.content}\n`)
    .join('\n');

  const prompt = `
Context from uploaded files:
${filesContext}

Based on the above context, please answer the following:
${input}

If the question is not related to the context, you can answer based on your general knowledge.
`;

  if (settings.model === 'ollama') {
    try {
      const response = await axios.post(`${OLLAMA_API_URL}/api/generate`, {
        model: settings.ollamaModel,
        prompt,
        stream: false,
        options: {
          temperature: settings.temperature,
        },
      });
      return response.data.response;
    } catch (error) {
      console.error('Error generating Ollama response:', error);
      throw error;
    }
  } else {
    // Gemini implementation
    // TODO: Implement Gemini API call
    return 'Gemini API not implemented yet';
  }
}; 