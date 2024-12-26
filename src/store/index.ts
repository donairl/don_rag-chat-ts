import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatHistory, Message, Settings, UploadedFile } from '../types';

interface ChatStore {
  currentChat: ChatHistory | null;
  chatHistory: ChatHistory[];
  settings: Settings;
  uploadedFiles: UploadedFile[];
  setCurrentChat: (chat: ChatHistory | null) => void;
  addMessage: (message: Message) => void;
  createNewChat: () => void;
  updateSettings: (settings: Partial<Settings>) => void;
  addUploadedFile: (file: UploadedFile) => void;
  removeUploadedFile: (id: string) => void;
}

const defaultSettings: Settings = {
  model: 'ollama',
  temperature: 0.7,
  maxTokens: 1000,
  ollamaModel: 'llama2',
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      currentChat: null,
      chatHistory: [],
      settings: defaultSettings,
      uploadedFiles: [],

      setCurrentChat: (chat) => set({ currentChat: chat }),

      addMessage: (message) =>
        set((state) => {
          if (!state.currentChat) return state;

          const updatedChat = {
            ...state.currentChat,
            messages: [...state.currentChat.messages, message],
          };

          const updatedHistory = state.chatHistory.map((chat) =>
            chat.id === updatedChat.id ? updatedChat : chat
          );

          return {
            currentChat: updatedChat,
            chatHistory: updatedHistory,
          };
        }),

      createNewChat: () => {
        const newChat: ChatHistory = {
          id: crypto.randomUUID(),
          messages: [],
          title: 'New Chat',
          createdAt: Date.now(),
        };
        set((state) => ({
          currentChat: newChat,
          chatHistory: [newChat, ...state.chatHistory],
        }));
      },

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      addUploadedFile: (file) =>
        set((state) => ({
          uploadedFiles: [...state.uploadedFiles, file],
        })),

      removeUploadedFile: (id) =>
        set((state) => ({
          uploadedFiles: state.uploadedFiles.filter((file) => file.id !== id),
        })),
    }),
    {
      name: 'chat-storage',
    }
  )
); 