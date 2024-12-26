# Chat RAG Application

A React TypeScript chat application that supports both Ollama and Google Gemini AI models, with RAG (Retrieval-Augmented Generation) capabilities for PDF and text files.

## Features

- Chat interface with message history
- Support for multiple AI models:
  - Ollama (local)
  - Google Gemini
- RAG support for PDF and text files
- Persistent chat history
- Configurable model settings:
  - Temperature
  - Max tokens
  - Model selection
- File operations:
  - Upload PDF/text files
  - Download chat history as markdown

## Prerequisites

- Node.js 18 or higher
- Ollama installed locally (for Ollama support)
- Google Gemini API key (for Gemini support)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Configure the AI models:
   - For Ollama: Make sure Ollama is running locally
   - For Google Gemini: Add your API key in the settings panel

## Usage

1. Select your preferred model in the settings panel
2. Configure model parameters (temperature, max tokens)
3. Upload files for RAG support
4. Start chatting!

## Development

- Build for production:
  ```bash
  npm run build
  ```

- Preview production build:
  ```bash
  npm run preview
  ```

## License

MIT
