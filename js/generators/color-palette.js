// Tool: Color Palette Studio (50-950 Tailwind Shade Generator)
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';
import { copyToClipboard } from '../clipboard.js';

export const meta = {
  id: 'color-palette',
  name: 'Color Palette Studio'
};

let config = {
  colorName: 'brand',
  baseColor: '#3b82f6',
  saturationAdjust: 0,
  preset: 'indigo'
};

const PRESETS = [
  { name: 'Zinc (Monochrome)', color: '#71717a', id: 'zinc' },
  { name: 'Slate Neutral', color: '#64748b', id: 'slate' },
  { name: 'Indigo Brand', color: '#6366f1', id: 'indigo' },
  { name: 'Cyan Technical', color: '#06b6d4', id: 'cyan' },
  { name: 'Emerald Forest', color: '#10b981', id: 'emerald' },
  { name: 'Amber Warmth', color: '#f59e0b', id: 'amber' },
  { name: 'Rose Crisp', color: '#f43f5e', id: 'rose' }
];

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    id: 'palette-preview-container',
    style: {
      width: '100%',
      maxWidth: '680px',
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
      el('h4', { className: 'control-section-title', textContent: 'Curated Scales' })
    ]),
    el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '16px' } }, 
      PRESETS.map(p => el('button', {
        className: `btn btn-outline ${config.preset === p.id ? 'active' : ''}`,
        style: { fontSize: '0.8rem', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '8px' },
        innerHTML: `<span style="width:12px; height:12px; border-radius:50%; background:${p.color}; border:1px solid rgba(255,255,255,0.2);"></span> ${p.name.split(' ')[0]}`,
        onclick: (e) => {
          config.preset = p.id;
          config.baseColor = p.color;
          config.colorName = p.id;
          controlsStage.querySelectorAll('.btn-outline').forEach(b => b.classList.remove('active'));
          e.currentTarget.classList.add('active');
          update();
        }
      }))
    ),

    el('div', { className: 'control-section-header' }, [
      el('h4', { className: 'control-section-title', textContent: 'Custom Base Tone' })
    ]),
    createColorControl('Seed Color', config.baseColor, (v) => {
      config.baseColor = v;
      config.preset = 'custom';
      update();
    }),

    createSlider('Vibrancy Adjust', -50, 50, 5, config.saturationAdjust, '%', (v) => {
      config.saturationAdjust = v;
      update();
    }),

    el('div', { style: { marginTop: '20px' } }, [
      el('button', {
        className: 'btn btn-outline',
        style: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' },
        innerHTML: `${ICONS.refresh} Reset to Indigo`,
        onclick: () => {
          config = {
            colorName: 'indigo',
            baseColor: '#6366f1',
            saturationAdjust: 0,
            preset: 'indigo'
          };
          mount(container, onCodeChange);
        }
      })
    ])
  ]);

  controlsStage.appendChild(section);

  function update() {
    const shades = generateShades(config.baseColor, config.saturationAdjust);
    renderSwatches(centerStage, shades);
    generateCode(shades);
  }

  function renderSwatches(target, shades) {
    target.innerHTML = `
      <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px; box-shadow:var(--shadow-md);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <div>
            <h3 style="font-size:1.05rem; font-weight:600; color:var(--text-main); margin-bottom:4px;">${config.colorName.toUpperCase()} Scale (50–950)</h3>
            <span style="font-size:0.75rem; color:var(--text-muted);">Click any swatch to copy its HEX value</span>
          </div>
          <span style="font-size:0.75rem; font-family:var(--font-mono); color:var(--text-dim); padding:4px 8px; background:var(--bg-card-hover); border-radius:4px; border:1px solid var(--border);">
            11 Steps
          </span>
        </div>
        <div style="display:flex; flex-direction:column; gap:4px; border-radius:var(--radius-md); overflow:hidden; border:1px solid var(--border);">
          ${shades.map(s => `
            <div class="palette-swatch-row" data-hex="${s.hex}" style="display:flex; align-items:center; justify-content:space-between; padding:10px 16px; background:${s.hex}; color:${s.isLight ? '#09090b' : '#ffffff'}; cursor:pointer; transition:transform 0.1s ease;">
              <div style="display:flex; align-items:center; gap:12px;">
                <span style="font-weight:600; font-size:0.85rem; width:36px;">${s.step}</span>
                <span style="font-family:var(--font-mono); font-size:0.8rem; opacity:0.9;">${s.hex.toUpperCase()}</span>
              </div>
              <span style="font-size:0.75rem; opacity:0.75; font-family:var(--font-mono);">${s.hsl}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    target.querySelectorAll('.palette-swatch-row').forEach(row => {
      row.addEventListener('click', () => {
        const hex = row.dataset.hex;
        copyToClipboard(hex);
      });
    });
  }

  function generateCode(shades) {
    const cssVars = shades.map(s => `  --color-${config.colorName}-${s.step}: ${s.hex};`).join('\n');
    const css = `/* Huragon/ui ${config.colorName.toUpperCase()} Palette Tokens */
:root {
${cssVars}
}`;

    const twColors = shades.map(s => `      ${s.step}: '${s.hex}',`).join('\n');
    const tailwind = `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        '${config.colorName}': {
${twColors}
        }
      }
    }
  }
};`;

    onCodeChange({ css, tailwind });
  }

  update();
}

// Generate 11 shades (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950)
function generateShades(hex, satAdjust) {
  const steps = [
    { step: 50, l: 96 },
    { step: 100, l: 92 },
    { step: 200, l: 84 },
    { step: 300, l: 74 },
    { step: 400, l: 62 },
    { step: 500, l: 50 },
    { step: 600, l: 40 },
    { step: 700, l: 30 },
    { step: 800, l: 20 },
    { step: 900, l: 14 },
    { step: 950, l: 8 }
  ];

  const hsl = hexToHsl(hex);

  return steps.map(s => {
    let sat = Math.max(0, Math.min(100, hsl.s + satAdjust));
    // Tone down saturation slightly at very high or very low lightness
    if (s.l > 90) sat *= 0.6;
    if (s.l < 15) sat *= 0.8;

    const shadeHex = hslToHex(hsl.h, sat, s.l);
    return {
      step: s.step,
      hex: shadeHex,
      hsl: `hsl(${Math.round(hsl.h)}, ${Math.round(sat)}%, ${s.l}%)`,
      isLight: s.l >= 60
    };
  });
}

function hexToHsl(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  const toHex = x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function createSlider(label, min, max, step, initial, unit, onChange) {
  const wrapper = el('div', { className: 'control-item' });
  const row = el('div', { className: 'control-label-row' }, [
    el('label', { className: 'control-label', textContent: label }),
    el('span', { className: 'control-value', textContent: `${initial}${unit}` })
  ]);
  const valSpan = row.querySelector('.control-value');
  const slider = el('input', {
    type: 'range',
    min,
    max,
    step,
    value: initial,
    oninput: (e) => {
      const v = parseFloat(e.target.value);
      valSpan.textContent = `${v}${unit}`;
      onChange(v);
    }
  });

  wrapper.appendChild(row);
  wrapper.appendChild(slider);
  return wrapper;
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
