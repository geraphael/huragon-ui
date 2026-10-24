// Tool 19: Pure CSS Background Patterns
import { el, qs } from '../utils/dom.js';

export const meta = {
  id: 'background-patterns',
  name: 'CSS Background Patterns'
};

const patterns = {
  dots: {
    name: 'Dot Matrix',
    getCSS: (size, color, bg) => `background-color: ${bg};
background-image: radial-gradient(${color} 1px, transparent 1px);
background-size: ${size}px ${size}px;`
  },
  grid: {
    name: 'Blueprint Grid',
    getCSS: (size, color, bg) => `background-color: ${bg};
background-image:
  linear-gradient(${color} 1px, transparent 1px),
  linear-gradient(to right, ${color} 1px, transparent 1px);
background-size: ${size}px ${size}px;`
  },
  stripes: {
    name: 'Diagonal Stripes',
    getCSS: (size, color, bg) => `background-color: ${bg};
background-image: repeating-linear-gradient(45deg, ${color} 0, ${color} 1px, transparent 0, transparent ${size}px);`
  },
  cross: {
    name: 'Cross Hatch',
    getCSS: (size, color, bg) => `background-color: ${bg};
background-image:
  radial-gradient(${color} 1.5px, transparent 1.5px),
  radial-gradient(${color} 1.5px, ${bg} 1.5px);
background-size: ${size}px ${size}px;
background-position: 0 0, ${size / 2}px ${size / 2}px;`
  }
};

let currentPattern = 'dots';
let spacing = 24;
let dotColor = 'rgba(255, 255, 255, 0.12)';
let bgColor = '#09090b';

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const patternBox = el('div', {
    id: 'pattern-preview-viewport',
    style: {
      width: '100%',
      height: '100%',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    innerHTML: `
      <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:8px; padding:12px 20px; font-size:0.85rem; font-weight:500; color:var(--text-main); box-shadow:var(--shadow-md); z-index:2;">
        Procedural Pattern
      </div>
    `
  });

  previewStage.appendChild(patternBox);

  function applyPattern() {
    const generator = patterns[currentPattern];
    const cssBody = generator.getCSS(spacing, dotColor, bgColor);

    // Apply inline style directly
    patternBox.style.cssText += cssBody;

    const css = `/* Huragon/ui — ${generator.name} */
.pattern-surface {
${cssBody.split('\n').map(l => '  ' + l).join('\n')}
}`;

    onCodeChange({ css });
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const sec = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', textContent: 'Pattern Geometry' }),

      el('div', { className: 'control-group' }, [
        el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' } }, Object.keys(patterns).map(k => el('button', {
          className: `btn ${currentPattern === k ? 'btn-primary' : 'btn-outline'}`,
          style: { fontSize: '0.72rem' },
          textContent: patterns[k].name,
          onclick: () => {
            currentPattern = k;
            renderControls();
            applyPattern();
          }
        })))
      ]),

      el('div', { className: 'control-group' }, [
        el('div', { className: 'control-label-row' }, [
          el('span', { className: 'control-label', textContent: 'Pattern Grid Size' }),
          el('span', { className: 'control-value', id: 'pat-size-val', textContent: `${spacing}px` })
        ]),
        el('input', {
          type: 'range',
          min: 12,
          max: 64,
          value: spacing,
          oninput: (e) => {
            spacing = parseInt(e.target.value, 10);
            qs('#pat-size-val').textContent = `${spacing}px`;
            applyPattern();
          }
        })
      ])
    ]);

    controlsStage.appendChild(sec);
  }

  renderControls();
  applyPattern();
}
