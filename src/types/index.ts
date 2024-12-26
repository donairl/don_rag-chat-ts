export type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
};

export type ChatHistory = {
  id: string;
  messages: Message[];
  title: string;
  createdAt: number;
};

export type ModelType = 'ollama' | 'gemini';

export type Settings = {
  model: ModelType;
  temperature: number;
  maxTokens: number;
  apiKey?: string;
  ollamaModel: string;
};

export type FileType = 'text' | 'pdf';

export type UploadedFile = {
  id: string;
  name: string;
  type: FileType;
  content: string;
}; 