// Tool: WCAG Contrast Checker & Accessibility Compliance
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';

export const meta = {
  id: 'contrast-checker',
  name: 'WCAG Contrast Checker'
};

let config = {
  textColor: '#ffffff',
  bgColor: '#09090b',
  sampleText: 'The quick brown fox jumps over the lazy dog.'
};

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    id: 'contrast-preview-container',
    style: {
      width: '100%',
      maxWidth: '600px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }
  });

  previewStage.appendChild(centerStage);

  // Controls
  controlsStage.innerHTML = '';

  const section = el('div', { className: 'control-section' }, [
    el('div', { className: 'control-section-header' }, [
      el('h4', { className: 'control-section-title', textContent: 'Color Pair' })
    ]),
    el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' } }, [
      createColorControl('Text Color', config.textColor, (v) => {
        config.textColor = v;
        update();
      }),
      createColorControl('Background', config.bgColor, (v) => {
        config.bgColor = v;
        update();
      })
    ]),

    el('div', { style: { display: 'flex', gap: '8px', marginTop: '12px' } }, [
      el('button', {
        className: 'btn btn-outline',
        style: { flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' },
        innerHTML: `${ICONS.refresh} Swap Colors`,
        onclick: () => {
          const temp = config.textColor;
          config.textColor = config.bgColor;
          config.bgColor = temp;
          mount(container, onCodeChange);
        }
      })
    ]),

    el('div', { className: 'control-section-header', style: { marginTop: '20px' } }, [
      el('h4', { className: 'control-section-title', textContent: 'Quick Presets' })
    ]),
    el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' } }, [
      createPresetBtn('High Contrast Dark', '#ffffff', '#09090b'),
      createPresetBtn('Subtle Zinc Text', '#a1a1aa', '#18181b'),
      createPresetBtn('Light Mode Crisp', '#09090b', '#ffffff'),
      createPresetBtn('Low Contrast (Warn)', '#71717a', '#27272a')
    ])
  ]);

  controlsStage.appendChild(section);

  function createPresetBtn(label, text, bg) {
    return el('button', {
      className: 'btn btn-outline',
      style: { fontSize: '0.75rem', padding: '6px 8px' },
      textContent: label,
      onclick: () => {
        config.textColor = text;
        config.bgColor = bg;
        mount(container, onCodeChange);
      }
    });
  }

  function update() {
    const ratio = getContrastRatio(config.textColor, config.bgColor);
    renderResults(centerStage, ratio);
    generateCode(ratio);
  }

  function renderResults(target, ratio) {
    const normalAA = ratio >= 4.5;
    const normalAAA = ratio >= 7.0;
    const largeAA = ratio >= 3.0;
    const largeAAA = ratio >= 4.5;
    const uiAA = ratio >= 3.0;

    target.innerHTML = `
      <!-- Score Metric Card -->
      <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:24px; box-shadow:var(--shadow-md); text-align:center;">
        <span style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-muted); font-weight:600;">Contrast Ratio</span>
        <div style="font-size:3.2rem; font-weight:700; letter-spacing:-0.03em; margin:8px 0; color:${normalAA ? 'var(--text-main)' : '#ef4444'}; font-family:var(--font-mono);">
          ${ratio.toFixed(2)}<span style="font-size:1.6rem; color:var(--text-dim); font-weight:400;">:1</span>
        </div>
        
        <!-- Compliance Matrix Grid -->
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; margin-top:20px; text-align:left;">
          <div style="background:var(--bg-main); border:1px solid var(--border); border-radius:var(--radius-md); padding:12px;">
            <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:4px;">Normal Text</div>
            <div style="display:flex; gap:6px; align-items:center;">
              <span style="font-size:0.75rem; font-weight:600; padding:2px 6px; border-radius:4px; ${badgeStyle(normalAA)}">AA ${normalAA ? 'Pass' : 'Fail'}</span>
              <span style="font-size:0.75rem; font-weight:600; padding:2px 6px; border-radius:4px; ${badgeStyle(normalAAA)}">AAA ${normalAAA ? 'Pass' : 'Fail'}</span>
            </div>
          </div>

          <div style="background:var(--bg-main); border:1px solid var(--border); border-radius:var(--radius-md); padding:12px;">
            <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:4px;">Large Text (18pt+)</div>
            <div style="display:flex; gap:6px; align-items:center;">
              <span style="font-size:0.75rem; font-weight:600; padding:2px 6px; border-radius:4px; ${badgeStyle(largeAA)}">AA ${largeAA ? 'Pass' : 'Fail'}</span>
              <span style="font-size:0.75rem; font-weight:600; padding:2px 6px; border-radius:4px; ${badgeStyle(largeAAA)}">AAA ${largeAAA ? 'Pass' : 'Fail'}</span>
            </div>
          </div>

          <div style="background:var(--bg-main); border:1px solid var(--border); border-radius:var(--radius-md); padding:12px;">
            <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:4px;">UI Components</div>
            <div style="display:flex; gap:6px; align-items:center;">
              <span style="font-size:0.75rem; font-weight:600; padding:2px 6px; border-radius:4px; ${badgeStyle(uiAA)}">AA ${uiAA ? 'Pass' : 'Fail'}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Live Visual Preview Box -->
      <div style="background:${config.bgColor}; color:${config.textColor}; border:1px solid var(--border); border-radius:var(--radius-lg); padding:28px; box-shadow:var(--shadow-md);">
        <h3 style="font-size:1.4rem; font-weight:700; margin-bottom:8px; line-height:1.2;">
          Typography in Action
        </h3>
        <p style="font-size:0.95rem; line-height:1.6; opacity:0.95; margin-bottom:16px;">
          ${config.sampleText}
        </p>
        <div style="display:flex; align-items:center; gap:12px; font-size:0.8rem; opacity:0.8;">
          <span>Captions (12px)</span>
          <span>•</span>
          <span>Mono Hex: ${config.textColor.toUpperCase()} on ${config.bgColor.toUpperCase()}</span>
        </div>
      </div>
    `;
  }

  function badgeStyle(passed) {
    if (passed) {
      return 'background: rgba(34, 197, 94, 0.15); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.3);';
    }
    return 'background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3);';
  }

  function generateCode(ratio) {
    const normalAA = ratio >= 4.5 ? 'PASS' : 'FAIL';
    const normalAAA = ratio >= 7.0 ? 'PASS' : 'FAIL';

    const css = `/* Huragon/ui Accessible Color Pair */
/* WCAG 2.1 Contrast Ratio: ${ratio.toFixed(2)}:1 */
/* Normal Text AA: ${normalAA} (req. 4.5:1) | AAA: ${normalAAA} (req. 7.0:1) */

.accessible-container {
  background-color: ${config.bgColor};
  color: ${config.textColor};
}`;

    const tailwind = `<!-- Accessible Container (Contrast ${ratio.toFixed(1)}:1) -->
<div class="bg-[${config.bgColor}] text-[${config.textColor}] p-6 rounded-lg">
  <h2 class="text-xl font-bold">Accessible Heading</h2>
  <p class="text-base mt-2">High contrast body text for optimal readability.</p>
</div>`;

    onCodeChange({ css, tailwind });
  }

  update();
}

// Relative luminance formula per WCAG 2.1
function getLuminance(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;

  const a = [r, g, b].map(v => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(hex1, hex2) {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

function createColorControl(label, initial, onChange) {
  const wrapper = el('div', { className: 'control-item' });
  const row = el('div', { className: 'control-label-row' }, [
    el('label', { className: 'control-label', textContent: label })
  ]);
  const picker = el('input', {
    type: 'color',
    value: initial,
    style: { width: '100%', height: '34px', padding: '0', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: 'transparent' },
    oninput: (e) => onChange(e.target.value)
  });

  wrapper.appendChild(row);
  wrapper.appendChild(picker);
  return wrapper;
}
