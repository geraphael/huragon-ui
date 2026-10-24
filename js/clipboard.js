// Clipboard helper with toast feedback
import { showToast } from './components/toast.js';

export async function copyToClipboard(text, customMessage = 'Copied to clipboard!') {
  if (!text) return;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback for older environments
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
    }
    showToast(customMessage, '📋');
  } catch (err) {
    console.error('Failed to copy: ', err);
    showToast('Failed to copy text', '⚠️');
  }
}
