import DOMPurify from 'dompurify';

export const sanitizeHTML = (html: string) => {
  if (typeof window === 'undefined') return html; // Fallback for SSR
  return DOMPurify.sanitize(html);
};

export const trimAndLimit = (str: string, limit: number) => {
  return str.trim().slice(0, limit);
};

export const validateFile = (file: File) => {
  const allowedTypes = ['application/pdf'];
  const maxSize = 20 * 1024 * 1024; // 20MB
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only PDF files are allowed');
  }
  
  if (file.size > maxSize) {
    throw new Error('File size exceeds 20MB limit');
  }

  // Basic path traversal check
  if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
    throw new Error('Invalid file name');
  }

  return true;
};
