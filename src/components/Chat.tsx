import { useState, useRef, useEffect } from 'react';
import { IconSend } from '@tabler/icons-react';
import ReactMarkdown from 'react-markdown';
import { useChatStore } from '../store';
import { Message } from '../types';
import { generateResponse } from '../services/api';

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const Chat = () => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    currentChat,
    settings,
    addMessage,
    uploadedFiles,
  } = useChatStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const handleSend = async () => {
    if (!input.trim() || !currentChat) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: input,
      role: 'user',
      timestamp: Date.now(),
    };

    addMessage(userMessage);
    setInput('');

    try {
      const response = await generateResponse(input, settings, uploadedFiles);
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: response,
        role: 'assistant',
        timestamp: Date.now(),
      };
      addMessage(assistantMessage);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content: 'Sorry, there was an error generating the response.',
        role: 'assistant',
        timestamp: Date.now(),
      };
      addMessage(errorMessage);
    }
  };

  if (!currentChat) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Welcome to Chat RAG</h2>
          <p className="text-gray-500">Select or create a new chat to begin</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 bg-gray-50">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {currentChat.messages.map((message) => (
          <div
            key={message.id}
            className={`chat-message ${
              message.role === 'user' ? 'user-message' : 'assistant-message'
            } shadow-sm`}
          >
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>{message.role === 'user' ? 'You' : 'Assistant'}</span>
              <span>{formatTime(message.timestamp)}</span>
            </div>
            <ReactMarkdown className="prose max-w-none">
              {message.content}
            </ReactMarkdown>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="input-field"
        />
        <button
          onClick={handleSend}
          className="btn btn-primary"
          disabled={!input.trim()}
        >
          <IconSend size={20} />
        </button>
      </div>
    </div>
  );
}; 