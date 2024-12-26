import { useState, useEffect } from 'react';
import { IconDownload, IconUpload, IconFileText, IconTrash } from '@tabler/icons-react';
import { useChatStore } from '../store';
import { ModelType, FileType } from '../types';
import { createUploadedFile, downloadChatHistory } from '../utils/fileHandlers';
import { fetchOllamaModels, summarizeContent } from '../services/api';

export const Settings = () => {
  const { 
    settings, 
    updateSettings, 
    currentChat, 
    addUploadedFile, 
    uploadedFiles,
    removeUploadedFile 
  } = useChatStore();
  const [fileType, setFileType] = useState<FileType>('text');
  const [ollamaModels, setOllamaModels] = useState<string[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  useEffect(() => {
    const loadOllamaModels = async () => {
      setIsLoadingModels(true);
      try {
        const models = await fetchOllamaModels();
        setOllamaModels(models);
      } catch (error) {
        console.error('Failed to fetch Ollama models:', error);
      } finally {
        setIsLoadingModels(false);
      }
    };

    if (settings.model === 'ollama') {
      loadOllamaModels();
    }
  }, [settings.model]);

  const handleFileUpload = async (file: File | null) => {
    if (!file) return;
    try {
      const uploadedFile = await createUploadedFile(file, fileType);
      addUploadedFile(uploadedFile);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleSummarize = async (fileId: string) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (!file) return;

    setSelectedFile(fileId);
    setIsSummarizing(true);
    setSummary('');

    try {
      const result = await summarizeContent(file, settings);
      setSummary(result);
    } catch (error) {
      console.error('Error summarizing file:', error);
      setSummary('Error generating summary');
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-6">Settings</h2>

      {/* File Operations */}
      <div className="space-y-4 mb-8 border-b pb-6">
        <div className="flex gap-2 items-center">
          <select
            value={fileType}
            onChange={(e) => setFileType(e.target.value as FileType)}
            className="input-field max-w-[100px]"
          >
            <option value="text">Text</option>
            <option value="pdf">PDF</option>
          </select>
        </div>
        <div className="flex gap-2 items-center">
          <label className="btn btn-outline cursor-pointer flex-1">
            <input
              type="file"
              onChange={(e) => handleFileUpload(e.target.files?.[0] || null)}
              accept={fileType === 'pdf' ? '.pdf' : '.txt'}
              className="hidden"
            />
            <IconUpload size={20} className="inline mr-2" />
            Upload
          </label>
          
          <button
            className="btn btn-outline flex-1"
            onClick={() => currentChat && downloadChatHistory(currentChat)}
            disabled={!currentChat}
          >
            <IconDownload size={20} className="inline mr-2" />
            Download
          </button>
        </div>
      </div>

      {/* Uploaded Files and Summarizer */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4 mb-8 border-b pb-6">
          <h3 className="text-lg font-medium">Uploaded Files</h3>
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="p-3 bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <IconFileText size={20} className="text-gray-500 mr-2" />
                    <span className="font-medium">{file.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleSummarize(file.id)}
                      disabled={isSummarizing && selectedFile === file.id}
                    >
                      {isSummarizing && selectedFile === file.id ? 'Summarizing...' : 'Summarize'}
                    </button>
                    <button
                      className="btn btn-outline btn-sm text-red-500 hover:bg-red-50"
                      onClick={() => removeUploadedFile(file.id)}
                    >
                      <IconTrash size={16} />
                    </button>
                  </div>
                </div>
                {selectedFile === file.id && summary && (
                  <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
                    {summary}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Model Settings */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Model
          </label>
          <select
            value={settings.model}
            onChange={(e) => updateSettings({ model: e.target.value as ModelType })}
            className="input-field"
          >
            <option value="ollama">Ollama</option>
            <option value="gemini">Google Gemini</option>
          </select>
        </div>

        {settings.model === 'ollama' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ollama Model
            </label>
            <select
              value={settings.ollamaModel}
              onChange={(e) => updateSettings({ ollamaModel: e.target.value })}
              className="input-field"
              disabled={isLoadingModels}
            >
              {isLoadingModels ? (
                <option>Loading models...</option>
              ) : ollamaModels.length > 0 ? (
                ollamaModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))
              ) : (
                <option value="">No models found</option>
              )}
            </select>
          </div>
        )}

        {settings.model === 'gemini' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Key
            </label>
            <input
              type="password"
              value={settings.apiKey || ''}
              onChange={(e) => updateSettings({ apiKey: e.target.value })}
              className="input-field"
              placeholder="Enter your Google API key"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Temperature
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.temperature}
            onChange={(e) => updateSettings({ temperature: parseFloat(e.target.value) })}
            className="w-full"
          />
          <div className="text-sm text-gray-500 text-center">
            {settings.temperature}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Tokens
          </label>
          <input
            type="number"
            value={settings.maxTokens}
            onChange={(e) => updateSettings({ maxTokens: parseInt(e.target.value) })}
            className="input-field"
            min="1"
            max="4096"
          />
        </div>
      </div>
    </div>
  );
}; 