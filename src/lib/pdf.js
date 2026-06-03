import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export const parseResume = async (file) => {
  const parsePromise = new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const typedarray = new Uint8Array(e.target.result);
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        const text = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text.push(content.items.map(item => item.str).join(' '));
        }
        resolve(text.join(' '));
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('PDF parsing timeout (5s)')), 5000)
  );

  return Promise.race([parsePromise, timeoutPromise]);
};

