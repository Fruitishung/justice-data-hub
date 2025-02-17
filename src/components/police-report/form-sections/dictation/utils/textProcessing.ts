
export const sanitizeText = (text: string, maxLength: number = 5000): string => {
  if (!text) return '';
  const sanitized = text
    .replace(/<[^>]*>?/gm, '')
    .replace(/[^\w\s.,!?-]/g, '')
    .trim();
  return sanitized.slice(0, maxLength);
};
