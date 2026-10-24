// Lightweight client-side CSS syntax highlighter
export function highlightCSS(code) {
  if (!code) return '';
  
  // Escape HTML characters
  let safe = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return safe
    // Comments
    .replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color:#64748b;font-style:italic;">$1</span>')
    // Selectors
    .replace(/(^|[\n\r\}])\s*([.#a-zA-Z0-9_\-\:\[\]=",\s>+~]+)\s*\{/g, '$1<span style="color:#f43f5e;font-weight:600;">$2</span> {')
    // CSS properties
    .replace(/([\w\-]+)\s*:/g, '<span style="color:#38bdf8;">$1</span>:')
    // Functions like rgba(), blur(), radial-gradient()
    .replace(/([a-zA-Z\-]+)\(/g, '<span style="color:#c084fc;">$1</span>(')
    // Numbers and units
    .replace(/(\b\d+(\.\d+)?(px|%|rem|em|deg|s|ms|fr|vw|vh|vmin|vmax)?\b)/g, '<span style="color:#fbbf24;">$1</span>')
    // Hex colors
    .replace(/(#[0-9a-fA-F]{3,8})/g, '<span style="color:#4ade80;">$1</span>');
}
