declare module 'pdfjs-dist' {
  export * from 'pdfjs-dist/types/src/pdf';
}

declare module 'pdfjs-dist/build/pdf.worker.entry' {
  export const GlobalWorkerOptions: {
    workerSrc: string;
  };
} 