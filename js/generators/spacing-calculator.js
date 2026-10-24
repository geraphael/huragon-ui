// Tool: Spacing System (8pt/4pt Design Token Scale)
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';
import { copyToClipboard } from '../clipboard.js';

export const meta = {
  id: 'spacing-calculator',
  name: 'Spacing System (8pt/4pt)'
};

let config = {
  baseUnit: 8, // 4 or 8
  remBase: 16
};

const STEPS = [
  { key: '1', mult: 0.5 },
  { key: '2', mult: 1 },
  { key: '3', mult: 1.5 },
  { key: '4', mult: 2 },
  { key: '6', mult: 3 },
  { key: '8', mult: 4 },
  { key: '12', mult: 6 },
  { key: '16', mult: 8 },
  { key: '24', mult: 12 },
  { key: '32', mult: 16 }
];

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    id: 'spacing-preview-container',
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
      el('h4', { className: 'control-section-title', textContent: 'Base Grid System' })
    ]),
    el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' } }, [
      createBaseBtn('8pt Grid (Standard)', 8),
      createBaseBtn('4pt Grid (Fine Grain)', 4)
    ]),

    el('div', { className: 'control-section-header' }, [
      el('h4', { className: 'control-section-title', textContent: 'Root Font Size' })
    ]),
    createSlider('1rem Base', 12, 20, 1, config.remBase, 'px', (v) => {
      config.remBase = v;
      update();
    })
  ]);

  controlsStage.appendChild(section);

  function createBaseBtn(label, val) {
    return el('button', {
      className: `btn btn-outline ${config.baseUnit === val ? 'active' : ''}`,
      style: { fontSize: '0.75rem', padding: '6px 8px' },
      textContent: label,
      onclick: (e) => {
        config.baseUnit = val;
        controlsStage.querySelectorAll('.btn-outline').forEach(b => {
          if (b.textContent.includes('Grid')) b.classList.remove('active');
        });
        e.currentTarget.classList.add('active');
        update();
      }
    });
  }

  function update() {
    const scales = STEPS.map(s => {
      const px = s.mult * config.baseUnit;
      const rem = (px / config.remBase).toFixed(3).replace(/\.?0+$/, '') + 'rem';
      return { key: s.key, px, rem };
    });

    renderScale(centerStage, scales);
    generateCode(scales);
  }

  function renderScale(target, scales) {
    target.innerHTML = `
      <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:24px; box-shadow:var(--shadow-md);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
          <div>
            <h3 style="font-size:1.05rem; font-weight:600; color:var(--text-main); margin-bottom:4px;">
              ${config.baseUnit}pt Rhythm Scale
            </h3>
            <span style="font-size:0.75rem; color:var(--text-muted);">Click any bar to copy its rem value</span>
          </div>
          <span style="font-size:0.75rem; font-family:var(--font-mono); color:var(--text-dim); background:var(--bg-main); padding:4px 8px; border-radius:4px; border:1px solid var(--border);">
            base: ${config.baseUnit}px
          </span>
        </div>

        <div style="display:flex; flex-direction:column; gap:8px;">
          ${scales.map(s => `
            <div class="spacing-scale-row" data-val="${s.rem}" style="display:flex; align-items:center; gap:14px; padding:6px 10px; background:var(--bg-main); border:1px solid var(--border); border-radius:var(--radius-sm); cursor:pointer; transition:background 0.15s ease;">
              <span style="font-family:var(--font-mono); font-size:0.75rem; font-weight:600; color:var(--text-muted); width:40px;">--sp-${s.key}</span>
              <div style="flex:1; height:18px; background:rgba(255,255,255,0.03); border-radius:3px; position:relative; overflow:hidden;">
                <div style="height:100%; width:${Math.min(100, (s.px / 128) * 100)}%; background:#ffffff; opacity:0.85; border-radius:3px;"></div>
              </div>
              <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-main); width:45px; text-align:right;">${s.px}px</span>
              <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted); width:60px; text-align:right;">${s.rem}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    target.querySelectorAll('.spacing-scale-row').forEach(row => {
      row.addEventListener('click', () => {
        copyToClipboard(row.dataset.val);
      });
    });
  }

  function generateCode(scales) {
    const cssVars = scales.map(s => `  --spacing-${s.key}: ${s.rem}; /* ${s.px}px */`).join('\n');
    const css = `/* Huragon/ui ${config.baseUnit}pt Spacing Tokens */
:root {
${cssVars}
}`;

    const twSpacing = scales.map(s => `      '${s.key}': '${s.rem}',`).join('\n');
    const tailwind = `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      spacing: {
${twSpacing}
      }
    }
  }
};`;

    onCodeChange({ css, tailwind });
  }

  update();
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
