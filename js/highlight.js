// Professional, non-corrupting syntax tokenizers for CSS & HTML
export function highlightCSS(code) {
  if (!code) return '';

  const lines = code.split('\n');
  const highlightedLines = lines.map(line => {
    // If comment line
    if (line.trim().startsWith('/*') && line.trim().endsWith('*/')) {
      return `<span class="token-comment">${escapeHtml(line)}</span>`;
    }

    // Escape HTML first
    let l = escapeHtml(line);

    // Rule: Selector block opening
    if (l.includes('{') && !l.includes(':')) {
      return l.replace(/([^{]+)\{/, '<span class="token-selector">$1</span>{');
    }

    // Property-value line
    if (l.includes(':') && !l.trim().startsWith('&lt;!--')) {
      const colonIndex = l.indexOf(':');
      const prop = l.slice(0, colonIndex);
      const val = l.slice(colonIndex + 1);

      let coloredVal = val
        // Functions: rgba(), blur(), radial-gradient, etc.
        .replace(/\b([a-z\-]+)\(/g, '<span class="token-func">$1</span>(')
        // Numbers & units
        .replace(/(\b\d+(\.\d+)?(px|%|rem|em|deg|s|ms|fr|vw|vh)?\b)/g, '<span class="token-number">$1</span>')
        // Hex colors
        .replace(/(#[0-9a-fA-F]{3,8}\b)/g, '<span class="token-color">$1</span>');

      return `<span class="token-prop">${prop}</span>:<span class="token-value">${coloredVal}</span>`;
    }

    // HTML comments
    if (l.trim().startsWith('&lt;!--') && l.trim().endsWith('--&gt;')) {
      return `<span class="token-comment">${l}</span>`;
    }

    // HTML tags in snippets
    if (l.includes('&lt;') && l.includes('&gt;')) {
      return l
        .replace(/(&lt;\/?[a-z0-9\-]+)/gi, '<span class="token-tag">$1</span>')
        .replace(/([a-z\-]+)=&quot;/gi, '<span class="token-attr">$1</span>=&quot;')
        .replace(/(&quot;[^&]*&quot;)/gi, '<span class="token-string">$1</span>');
    }

    return l;
  });

  return highlightedLines.join('\n');
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
