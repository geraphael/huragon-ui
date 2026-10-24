// Tool: Mathematical Type Scale System
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';
import { copyToClipboard } from '../clipboard.js';

export const meta = {
  id: 'typography-scale',
  name: 'Type Scale System'
};

let config = {
  baseSize: 16,
  ratioName: 'Major Third',
  ratio: 1.25
};

const RATIOS = [
  { name: 'Major Second', val: 1.125 },
  { name: 'Minor Third', val: 1.200 },
  { name: 'Major Third', val: 1.250 },
  { name: 'Perfect Fourth', val: 1.333 },
  { name: 'Augmented Fourth', val: 1.414 },
  { name: 'Perfect Fifth', val: 1.500 },
  { name: 'Golden Ratio', val: 1.618 }
];

const STEPS = [
  { key: '4xl', exp: 4, label: 'Hero Display' },
  { key: '3xl', exp: 3, label: 'Heading 1' },
  { key: '2xl', exp: 2, label: 'Heading 2' },
  { key: 'xl', exp: 1, label: 'Heading 3' },
  { key: 'base', exp: 0, label: 'Body Text' },
  { key: 'sm', exp: -1, label: 'Caption' },
  { key: 'xs', exp: -2, label: 'Micro Footnote' }
];

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    id: 'type-scale-preview-container',
    style: {
      width: '100%',
      maxWidth: '720px',
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
      el('h4', { className: 'control-section-title', textContent: 'Modular Ratio' })
    ]),
    el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '16px' } },
      RATIOS.map(r => el('button', {
        className: `btn btn-outline ${config.ratioName === r.name ? 'active' : ''}`,
        style: { fontSize: '0.75rem', padding: '6px 8px' },
        textContent: `${r.name} (${r.val})`,
        onclick: (e) => {
          config.ratioName = r.name;
          config.ratio = r.val;
          controlsStage.querySelectorAll('.btn-outline').forEach(b => b.classList.remove('active'));
          e.currentTarget.classList.add('active');
          update();
        }
      }))
    ),

    el('div', { className: 'control-section-header' }, [
      el('h4', { className: 'control-section-title', textContent: 'Base Font Size' })
    ]),
    createSlider('Base Size (1rem)', 12, 22, 1, config.baseSize, 'px', (v) => {
      config.baseSize = v;
      update();
    })
  ]);

  controlsStage.appendChild(section);

  function update() {
    const calculated = STEPS.map(s => {
      const px = Math.round(config.baseSize * Math.pow(config.ratio, s.exp) * 10) / 10;
      const rem = (px / config.baseSize).toFixed(2).replace(/\.?0+$/, '') + 'rem';
      return { ...s, px, rem };
    });

    renderHierarchy(centerStage, calculated);
    generateCode(calculated);
  }

  function renderHierarchy(target, calculated) {
    target.innerHTML = `
      <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:24px; box-shadow:var(--shadow-md);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
          <div>
            <h3 style="font-size:1.05rem; font-weight:600; color:var(--text-main); margin-bottom:4px;">
              ${config.ratioName} Ratio (${config.ratio})
            </h3>
            <span style="font-size:0.75rem; color:var(--text-muted);">Click any row to copy font-size definition</span>
          </div>
          <span style="font-size:0.75rem; font-family:var(--font-mono); color:var(--text-dim); background:var(--bg-main); padding:4px 8px; border-radius:4px; border:1px solid var(--border);">
            base: ${config.baseSize}px
          </span>
        </div>

        <div style="display:flex; flex-direction:column; gap:12px;">
          ${calculated.map(s => `
            <div class="type-scale-row" data-val="${s.rem}" style="display:flex; align-items:baseline; justify-content:space-between; padding:12px 16px; background:var(--bg-main); border:1px solid var(--border); border-radius:var(--radius-md); cursor:pointer; transition:background 0.15s ease;">
              <div style="display:flex; align-items:baseline; gap:16px; overflow:hidden;">
                <span style="font-family:var(--font-mono); font-size:0.75rem; font-weight:600; color:var(--text-muted); width:40px; flex-shrink:0;">${s.key}</span>
                <span style="font-size:${Math.min(36, s.px)}px; font-weight:600; color:var(--text-main); line-height:1.2; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                  ${s.label}
                </span>
              </div>
              <div style="display:flex; align-items:baseline; gap:12px; flex-shrink:0;">
                <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-dim);">${s.px}px</span>
                <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-main); font-weight:600;">${s.rem}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    target.querySelectorAll('.type-scale-row').forEach(row => {
      row.addEventListener('click', () => {
        copyToClipboard(`font-size: ${row.dataset.val};`);
      });
    });
  }

  function generateCode(calculated) {
    const cssVars = calculated.map(s => `  --text-${s.key}: ${s.rem}; /* ${s.px}px */`).join('\n');
    const css = `/* Huragon/ui ${config.ratioName} Type Scale */
:root {
${cssVars}
}`;

    const twFonts = calculated.map(s => `      '${s.key}': '${s.rem}',`).join('\n');
    const tailwind = `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontSize: {
${twFonts}
      }
    }
  }
};`;

    onCodeChange({ css, tailwind });
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

  update();
}
