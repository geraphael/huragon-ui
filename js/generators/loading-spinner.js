// Tool 7: CSS Loading Spinners & Loaders Gallery
import { el, qs } from '../utils/dom.js';

export const meta = {
  id: 'loading-spinner',
  name: 'CSS Spinners & Loaders'
};

const SPINNER_PRESETS = [
  { id: 'dual-ring', name: 'Dual Ring', desc: 'Minimal dual arc spinner' },
  { id: 'pulse', name: 'Pulse', desc: 'Expanding radar pulse' },
  { id: 'dots', name: 'Bounce Dots', desc: 'Three bouncing dots' },
  { id: 'orbit', name: 'Orbit Arc', desc: 'Single trailing orbital rim' },
  { id: 'bars', name: 'Wave Bars', desc: 'Audio equalizer wave' }
];

let config = {
  spinnerType: 'dual-ring',
  color: '#e4e4e7',
  size: 40,
  speed: 1.0,
  mode: 'single' // 'single' or 'gallery'
};

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    id: 'spinner-stage-root',
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px',
      padding: '24px'
    }
  });

  const displayBox = el('div', { id: 'spinner-display-box', style: { width: '100%', display: 'flex', justifyContent: 'center' } });
  centerStage.appendChild(displayBox);
  previewStage.appendChild(centerStage);

  function getSpinnerCSS(type, size, speed, color) {
    if (type === 'dual-ring') {
      return {
        html: `<div class="loader-dual-ring"></div>`,
        css: `.loader-dual-ring {
  display: inline-block;
  width: ${size}px;
  height: ${size}px;
  box-sizing: border-box;
}
.loader-dual-ring:after {
  content: " ";
  display: block;
  width: ${Math.round(size * 0.8)}px;
  height: ${Math.round(size * 0.8)}px;
  margin: ${Math.round(size * 0.1)}px;
  border-radius: 50%;
  border: 2px solid ${color};
  border-color: ${color} transparent ${color} transparent;
  animation: dualRingSpin ${speed}s linear infinite;
  box-sizing: border-box;
}
@keyframes dualRingSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`
      };
    } else if (type === 'pulse') {
      return {
        html: `<div class="loader-pulse"></div>`,
        css: `.loader-pulse {
  width: ${size}px;
  height: ${size}px;
  background-color: ${color};
  border-radius: 50%;
  animation: pulseScale ${speed}s infinite ease-in-out;
}
@keyframes pulseScale {
  0% { transform: scale(0); opacity: 0.8; }
  100% { transform: scale(1.0); opacity: 0; }
}`
      };
    } else if (type === 'dots') {
      const dotSize = Math.max(4, Math.round(size / 4));
      return {
        html: `<div class="loader-dots"><span></span><span></span><span></span></div>`,
        css: `.loader-dots {
  display: inline-flex;
  align-items: center;
  gap: ${Math.round(dotSize * 0.7)}px;
}
.loader-dots span {
  width: ${dotSize}px;
  height: ${dotSize}px;
  background-color: ${color};
  border-radius: 50%;
  display: inline-block;
  animation: dotsBounce ${speed}s infinite ease-in-out both;
}
.loader-dots span:nth-child(1) { animation-delay: -0.32s; }
.loader-dots span:nth-child(2) { animation-delay: -0.16s; }
@keyframes dotsBounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1.0); }
}`
      };
    } else if (type === 'orbit') {
      return {
        html: `<div class="loader-orbit"></div>`,
        css: `.loader-orbit {
  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.12);
  border-top-color: ${color};
  animation: orbitSpin ${speed * 0.85}s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
  box-sizing: border-box;
}
@keyframes orbitSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`
      };
    } else if (type === 'bars') {
      const barW = Math.max(3, Math.round(size / 8));
      return {
        html: `<div class="loader-bars"><span></span><span></span><span></span><span></span></div>`,
        css: `.loader-bars {
  display: inline-flex;
  align-items: center;
  gap: ${Math.round(barW * 0.8)}px;
  height: ${size}px;
}
.loader-bars span {
  width: ${barW}px;
  height: 100%;
  background-color: ${color};
  border-radius: 2px;
  animation: waveBar ${speed}s ease-in-out infinite;
}
.loader-bars span:nth-child(1) { animation-delay: 0.1s; }
.loader-bars span:nth-child(2) { animation-delay: 0.2s; }
.loader-bars span:nth-child(3) { animation-delay: 0.3s; }
.loader-bars span:nth-child(4) { animation-delay: 0.4s; }
@keyframes waveBar {
  0%, 40%, 100% { transform: scaleY(0.3); }
  20% { transform: scaleY(1); }
}`
      };
    }
    return { html: '', css: '' };
  }

  function renderSpinner() {
    if (config.mode === 'gallery') {
      // Gallery grid showing all spinners simultaneously
      let combinedCss = '';
      const cards = SPINNER_PRESETS.map(preset => {
        const { html, css } = getSpinnerCSS(preset.id, config.size, config.speed, config.color);
        combinedCss += css + '\n';
        const isSelected = config.spinnerType === preset.id;
        return `
          <div class="spinner-card" data-id="${preset.id}" style="
            background: var(--bg-card);
            border: 1px solid ${isSelected ? 'var(--text-main)' : 'var(--border)'};
            border-radius: var(--radius-md);
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 14px;
            cursor: pointer;
            transition: all var(--transition-fast);
            min-height: 130px;
          ">
            <div style="height: ${config.size}px; display: flex; align-items: center; justify-content: center;">
              ${html}
            </div>
            <div style="text-align: center;">
              <div style="font-size: 0.78rem; font-weight: 600; color: var(--text-main);">${preset.name}</div>
              <div style="font-size: 0.68rem; color: var(--text-dim); margin-top: 2px;">${preset.desc}</div>
            </div>
          </div>
        `;
      }).join('');

      displayBox.innerHTML = `
        <style>${combinedCss}</style>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 14px; width: 100%; max-width: 680px;">
          ${cards}
        </div>
      `;

      displayBox.querySelectorAll('.spinner-card').forEach(c => {
        c.addEventListener('click', () => {
          config.spinnerType = c.dataset.id;
          config.mode = 'single';
          renderControls();
          renderSpinner();
        });
      });

      const fullCode = `/* Huragon/ui — Loader Gallery (${config.spinnerType}) */\n` + getSpinnerCSS(config.spinnerType, config.size, config.speed, config.color).css;
      onCodeChange({ css: fullCode, tailwind: getSpinnerCSS(config.spinnerType, config.size, config.speed, config.color).html });
    } else {
      // Single preview with focused interactive controls
      const { html, css } = getSpinnerCSS(config.spinnerType, config.size, config.speed, config.color);
      displayBox.innerHTML = `
        <style>${css}</style>
        <div style="
          padding: 40px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          min-width: 220px;
          box-shadow: var(--shadow-md);
        ">
          <div style="height: ${config.size}px; display: flex; align-items: center; justify-content: center;">
            ${html}
          </div>
          <span style="font-size: 0.75rem; color: var(--text-dim); font-family: var(--font-mono);">
            ${config.spinnerType} · ${config.size}px · ${config.speed}s
          </span>
        </div>
      `;

      const fullCode = `/* Huragon/ui — Pure CSS ${config.spinnerType} Loader */\n${css}`;
      onCodeChange({ css: fullCode, tailwind: html });
    }
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const sec = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', textContent: 'View Mode' }),
      el('div', { style: { display: 'flex', gap: '6px', marginBottom: '16px' } }, [
        el('button', {
          className: `btn ${config.mode === 'single' ? 'btn-primary' : 'btn-outline'}`,
          style: { flex: '1', fontSize: '0.75rem', padding: '6px' },
          textContent: 'Single Focus',
          onclick: () => {
            config.mode = 'single';
            renderControls();
            renderSpinner();
          }
        }),
        el('button', {
          className: `btn ${config.mode === 'gallery' ? 'btn-primary' : 'btn-outline'}`,
          style: { flex: '1', fontSize: '0.75rem', padding: '6px' },
          textContent: 'All Gallery',
          onclick: () => {
            config.mode = 'gallery';
            renderControls();
            renderSpinner();
          }
        })
      ]),

      el('div', { className: 'section-title', textContent: 'Loader Archetype' }),
      el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', marginBottom: '16px' } },
        SPINNER_PRESETS.map(s => el('button', {
          className: `btn ${config.spinnerType === s.id ? 'btn-primary' : 'btn-outline'}`,
          style: { fontSize: '0.72rem', padding: '6px 8px' },
          textContent: s.name,
          onclick: () => {
            config.spinnerType = s.id;
            renderControls();
            renderSpinner();
          }
        }))
      ),

      el('div', { className: 'section-title', textContent: 'Geometry & Timing' }),
      createSlider('Size', config.size, 20, 80, (v) => { config.size = v; renderSpinner(); }, 'px'),
      createSlider('Cycle Duration', config.speed, 0.4, 2.5, (v) => { config.speed = v; renderSpinner(); }, 's', 0.1)
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
