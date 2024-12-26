import { ChatHistory, FileType, UploadedFile } from '../types';
import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

export const readFileContent = async (
  file: File,
  type: FileType
): Promise<string> => {
  if (type === 'text') {
    return await file.text();
  } else {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }
      
      return fullText;
    } catch (error) {
      console.error('Error reading PDF:', error);
      throw new Error('Failed to read PDF file');
    }
  }
};

export const createUploadedFile = async (
  file: File,
  type: FileType
): Promise<UploadedFile> => {
  const content = await readFileContent(file, type);
  return {
    id: crypto.randomUUID(),
    name: file.name,
    type,
    content,
  };
};

export const downloadChatHistory = (chatHistory: ChatHistory): void => {
  const content = chatHistory.messages
    .map((msg) => `## ${msg.role}\n${msg.content}\n`)
    .join('\n---\n\n');

  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `chat-history-${chatHistory.id}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}; 