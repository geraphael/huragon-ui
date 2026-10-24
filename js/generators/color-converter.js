// Tool: Color Format Converter (HEX, RGB, HSL, OKLCH, CMYK)
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';
import { copyToClipboard } from '../clipboard.js';

export const meta = {
  id: 'color-converter',
  name: 'Color Format Converter'
};

let config = {
  hex: '#6366f1',
  alpha: 1.0
};

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    id: 'converter-preview-container',
    style: {
      width: '100%',
      maxWidth: '620px',
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
      el('h4', { className: 'control-section-title', textContent: 'Color Input' })
    ]),
    createColorControl('Color Picker', config.hex, (v) => {
      config.hex = v;
      update();
    }),
    createSlider('Alpha (Opacity)', 0, 1, 0.05, config.alpha, '', (v) => {
      config.alpha = v;
      update();
    }),

    el('div', { className: 'control-section-header', style: { marginTop: '16px' } }, [
      el('h4', { className: 'control-section-title', textContent: 'Quick Presets' })
    ]),
    el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' } }, [
      createPresetBtn('Pure White', '#ffffff'),
      createPresetBtn('Zinc Dark', '#09090b'),
      createPresetBtn('Zinc Neutral', '#71717a'),
      createPresetBtn('Indigo Brand', '#6366f1'),
      createPresetBtn('Emerald', '#10b981'),
      createPresetBtn('Rose Accent', '#f43f5e')
    ])
  ]);

  controlsStage.appendChild(section);

  function createPresetBtn(label, hex) {
    return el('button', {
      className: 'btn btn-outline',
      style: { fontSize: '0.75rem', padding: '6px 8px', display: 'flex', alignItems: 'center', gap: '6px' },
      innerHTML: `<span style="width:10px; height:10px; border-radius:50%; background:${hex}; border:1px solid rgba(255,255,255,0.2);"></span> ${label}`,
      onclick: () => {
        config.hex = hex;
        update();
      }
    });
  }

  function update() {
    const formats = calculateFormats(config.hex, config.alpha);
    renderFormats(centerStage, formats);
    generateCode(formats);
  }

  function renderFormats(target, formats) {
    target.innerHTML = `
      <!-- Swatch Hero Card -->
      <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:24px; box-shadow:var(--shadow-md);">
        <div style="width:100%; height:80px; border-radius:var(--radius-md); background:${formats.rgba}; border:1px solid var(--border); margin-bottom:20px; display:flex; align-items:center; justify-content:center; box-shadow:inset 0 0 0 1px rgba(255,255,255,0.05);">
          <span style="font-family:var(--font-mono); font-size:1.1rem; font-weight:600; color:${formats.isLight ? '#09090b' : '#ffffff'};">
            ${formats.hexUpper}
          </span>
        </div>

        <div style="display:flex; flex-direction:column; gap:10px;">
          ${renderFormatRow('HEX', formats.hexUpper)}
          ${renderFormatRow('RGB', formats.rgb)}
          ${renderFormatRow('RGBA', formats.rgba)}
          ${renderFormatRow('HSL', formats.hsl)}
          ${renderFormatRow('OKLCH', formats.oklch)}
          ${renderFormatRow('CMYK', formats.cmyk)}
        </div>
      </div>
    `;

    target.querySelectorAll('.copy-format-row').forEach(row => {
      row.addEventListener('click', () => {
        const val = row.dataset.val;
        copyToClipboard(val);
      });
    });
  }

  function renderFormatRow(label, value) {
    return `
      <div class="copy-format-row" data-val="${value}" style="display:flex; align-items:center; justify-content:space-between; padding:10px 14px; background:var(--bg-main); border:1px solid var(--border); border-radius:var(--radius-sm); cursor:pointer; transition:background 0.15s ease;">
        <span style="font-size:0.75rem; font-weight:600; color:var(--text-muted); width:60px;">${label}</span>
        <span style="font-family:var(--font-mono); font-size:0.825rem; color:var(--text-main); flex:1; text-align:left;">${value}</span>
        <span style="color:var(--text-dim); display:flex; align-items:center;">${ICONS.copy}</span>
      </div>
    `;
  }

  function generateCode(formats) {
    const css = `/* Huragon/ui Color Format Definitions */
:root {
  --color-hex: ${formats.hexUpper};
  --color-rgb: ${formats.rgb};
  --color-rgba: ${formats.rgba};
  --color-hsl: ${formats.hsl};
  --color-oklch: ${formats.oklch};
}`;

    const tailwind = `<!-- Tailwind Arbitrary Color Values -->
<div class="bg-[${formats.hexUpper}] text-white">...</div>
<div class="bg-[${formats.rgba}]">...</div>
<div class="bg-[${formats.oklch}]">...</div>`;

    onCodeChange({ css, tailwind });
  }

  update();
}

function calculateFormats(hex, alpha) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);

  // RGB
  const rgb = `rgb(${r}, ${g}, ${b})`;
  const rgba = `rgba(${r}, ${g}, ${b}, ${alpha})`;

  // HSL
  const rf = r / 255;
  const gf = g / 255;
  const bf = b / 255;
  const max = Math.max(rf, gf, bf);
  const min = Math.min(rf, gf, bf);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rf: h = (gf - bf) / d + (gf < bf ? 6 : 0); break;
      case gf: h = (bf - rf) / d + 2; break;
      case bf: h = (rf - gf) / d + 4; break;
    }
    h /= 6;
  }
  const hsl = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;

  // CMYK
  let cmykK = 1 - Math.max(rf, gf, bf);
  let cmykC = cmykK === 1 ? 0 : (1 - rf - cmykK) / (1 - cmykK);
  let cmykM = cmykK === 1 ? 0 : (1 - gf - cmykK) / (1 - cmykK);
  let cmykY = cmykK === 1 ? 0 : (1 - bf - cmykK) / (1 - cmykK);
  const cmyk = `cmyk(${Math.round(cmykC * 100)}%, ${Math.round(cmykM * 100)}%, ${Math.round(cmykY * 100)}%, ${Math.round(cmykK * 100)}%)`;

  // OKLCH approximation
  const lOklch = (0.21 * rf + 0.72 * gf + 0.07 * bf);
  const oklch = `oklch(${lOklch.toFixed(2)} ${(s * 0.2).toFixed(2)} ${Math.round(h * 360)})`;

  return {
    hexUpper: hex.toUpperCase(),
    rgb,
    rgba,
    hsl,
    oklch,
    cmyk,
    isLight: l >= 0.6
  };
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
