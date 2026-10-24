// Tool 7: CSS Loading Spinners & Loaders Gallery
import { el, qs } from '../utils/dom.js';

export const meta = {
  id: 'loading-spinner',
  name: 'CSS Spinners & Loaders',
  icon: '🔄'
};

let config = {
  spinnerType: 'dual-ring', // dual-ring, pulse, dots, bar, orbit
  color: '#8b5cf6',
  size: 54,
  speed: 1.2
};

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '32px'
    }
  });

  const spinnerBox = el('div', { id: 'spinner-display-box' });
  centerStage.appendChild(spinnerBox);
  previewStage.appendChild(centerStage);

  function renderSpinner() {
    let htmlSnippet = '';
    let cssSnippet = '';

    if (config.spinnerType === 'dual-ring') {
      htmlSnippet = `<div class="loader-dual-ring"></div>`;
      cssSnippet = `.loader-dual-ring {
  display: inline-block;
  width: ${config.size}px;
  height: ${config.size}px;
}
.loader-dual-ring:after {
  content: " ";
  display: block;
  width: ${config.size * 0.8}px;
  height: ${config.size * 0.8}px;
  margin: ${config.size * 0.1}px;
  border-radius: 50%;
  border: 4px solid ${config.color};
  border-color: ${config.color} transparent ${config.color} transparent;
  animation: dualRingSpin ${config.speed}s linear infinite;
}
@keyframes dualRingSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
    } else if (config.spinnerType === 'pulse') {
      htmlSnippet = `<div class="loader-pulse"></div>`;
      cssSnippet = `.loader-pulse {
  width: ${config.size}px;
  height: ${config.size}px;
  background-color: ${config.color};
  border-radius: 100%;
  animation: pulseScale ${config.speed}s infinite ease-in-out;
}
@keyframes pulseScale {
  0% { transform: scale(0); opacity: 0.8; }
  100% { transform: scale(1.0); opacity: 0; }
}`;
    } else if (config.spinnerType === 'dots') {
      htmlSnippet = `<div class="loader-dots"><span></span><span></span><span></span></div>`;
      cssSnippet = `.loader-dots {
  display: flex;
  align-items: center;
  gap: 8px;
}
.loader-dots span {
  width: ${config.size / 3.5}px;
  height: ${config.size / 3.5}px;
  background-color: ${config.color};
  border-radius: 50%;
  display: inline-block;
  animation: dotsBounce ${config.speed}s infinite ease-in-out both;
}
.loader-dots span:nth-child(1) { animation-delay: -0.32s; }
.loader-dots span:nth-child(2) { animation-delay: -0.16s; }
@keyframes dotsBounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1.0); }
}`;
    }

    spinnerBox.innerHTML = `
      <style>${cssSnippet}</style>
      ${htmlSnippet}
    `;

    const fullCode = `/* Huragon/ui — Pure CSS Loader */
${cssSnippet}`;

    onCodeChange({ css: fullCode, tailwind: htmlSnippet });
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const sec = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', innerHTML: '<span>🔄</span> Spinner Styles' }),

      el('div', { className: 'control-group' }, [
        el('div', { className: 'control-label-row' }, [
          el('span', { className: 'control-label', textContent: 'Animation Variant' })
        ]),
        el('div', { style: { display: 'flex', gap: '6px' } }, [
          { id: 'dual-ring', name: 'Dual Ring' },
          { id: 'pulse', name: 'Pulse Wave' },
          { id: 'dots', name: 'Bouncing Dots' }
        ].map(s => el('button', {
          className: `btn ${config.spinnerType === s.id ? 'btn-primary' : 'btn-outline'}`,
          style: { flex: '1', fontSize: '0.75rem', padding: '6px' },
          textContent: s.name,
          onclick: () => {
            config.spinnerType = s.id;
            renderControls();
            renderSpinner();
          }
        })))
      ]),

      createSlider('Size', config.size, 24, 120, (v) => { config.size = v; renderSpinner(); }, 'px'),
      createSlider('Animation Duration', config.speed, 0.4, 3, (v) => { config.speed = v; renderSpinner(); }, 's', 0.1),

      // Color picker
      el('div', { className: 'control-group' }, [
        el('div', { className: 'control-label-row' }, [
          el('span', { className: 'control-label', textContent: 'Spinner Hue' }),
          el('span', { className: 'control-value', textContent: config.color })
        ]),
        el('div', { className: 'color-picker-wrapper' }, [
          el('input', {
            type: 'color',
            value: config.color,
            oninput: (e) => {
              config.color = e.target.value;
              renderSpinner();
            }
          }),
          el('span', { className: 'color-hex-text', textContent: config.color })
        ])
      ])
    ]);

    controlsStage.appendChild(sec);
  }

  function createSlider(label, val, min, max, onChange, unit = '', step = 1) {
    const valSpan = el('span', { className: 'control-value', textContent: `${val}${unit}` });
    return el('div', { className: 'control-group' }, [
      el('div', { className: 'control-label-row' }, [
        el('span', { className: 'control-label', textContent: label }),
        valSpan
      ]),
      el('input', {
        type: 'range',
        min,
        max,
        step,
        value: val,
        oninput: (e) => {
          const v = parseFloat(e.target.value);
          valSpan.textContent = `${v}${unit}`;
          onChange(v);
        }
      })
    ]);
  }

  renderControls();
  renderSpinner();
}
