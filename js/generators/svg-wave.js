// Tool 4: SVG Wave Divider Generator
import { el, qs } from '../utils/dom.js';

export const meta = {
  id: 'svg-wave',
  name: 'SVG Wave Divider',
  icon: '🌊'
};

let config = {
  waveCount: 3,
  amplitude: 45,
  frequency: 2,
  fillColor: '#8b5cf6',
  bgColor: '#090915',
  layers: 2,
  layerOpacity: 0.45,
  animated: true,
  animationSpeed: 8,
  flip: false
};

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const wrapper = el('div', {
    style: {
      width: '100%',
      height: '100%',
      background: config.bgColor,
      borderRadius: 'var(--radius-md)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: 'var(--shadow-md)'
    }
  });

  const contentZone = el('div', {
    style: {
      padding: '40px',
      color: '#fff',
      zIndex: '2'
    },
    innerHTML: `
      <span style="display:inline-block; padding:4px 10px; border-radius:20px; background:rgba(255,255,255,0.1); font-size:0.75rem; font-weight:600; margin-bottom:12px;">Hero Section</span>
      <h2 style="font-size:2rem; font-weight:800; margin-bottom:8px;">Section Transitions</h2>
      <p style="color:var(--text-muted); max-width:480px; font-size:0.9rem;">
        Generate fluid mathematical SVG curves and dividers for modern landing pages.
      </p>
    `
  });

  const waveContainer = el('div', {
    style: {
      width: '100%',
      position: 'relative',
      lineHeight: '0',
      overflow: 'hidden'
    }
  });

  wrapper.appendChild(contentZone);
  wrapper.appendChild(waveContainer);
  previewStage.appendChild(wrapper);

  function generateWavePath(amplitude, frequency, phase = 0) {
    const width = 1440;
    const height = 150;
    let d = `M 0,${height / 2}`;
    const step = 20;

    for (let x = 0; x <= width; x += step) {
      const angle = (x / width) * Math.PI * 2 * frequency + phase;
      const y = (height / 2) + Math.sin(angle) * amplitude;
      d += ` L ${x},${y.toFixed(1)}`;
    }

    d += ` L ${width},${height} L 0,${height} Z`;
    return d;
  }

  function renderWave() {
    wrapper.style.background = config.bgColor;
    wrapper.style.transform = config.flip ? 'scaleY(-1)' : 'none';

    const path1 = generateWavePath(config.amplitude, config.frequency, 0);
    const path2 = generateWavePath(config.amplitude * 0.8, config.frequency * 1.2, Math.PI / 3);

    const animCss = config.animated ? `
      animation: waveFlow ${config.animationSpeed}s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite;
    ` : '';

    waveContainer.innerHTML = `
      <style>
        @keyframes waveFlow {
          0% { transform: translateX(0); }
          50% { transform: translateX(-35px) scaleY(1.05); }
          100% { transform: translateX(0); }
        }
      </style>
      <svg viewBox="0 0 1440 150" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:auto; display:block; ${animCss}">
        ${config.layers > 1 ? `<path d="${path2}" fill="${config.fillColor}" fill-opacity="${config.layerOpacity}" />` : ''}
        <path d="${path1}" fill="${config.fillColor}" />
      </svg>
    `;

    updateCode(path1, path2);
  }

  function updateCode(path1, path2) {
    const inlineSvg = `<!-- Huragon/ui SVG Wave Divider -->
<div class="wave-divider-wrapper" style="position:relative; width:100%; overflow:hidden; line-height:0;">
  <svg viewBox="0 0 1440 150" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:auto; display:block;">
    ${config.layers > 1 ? `<path d="${path2}" fill="${config.fillColor}" fill-opacity="${config.layerOpacity}" />` : ''}
    <path d="${path1}" fill="${config.fillColor}" />
  </svg>
</div>`;

    onCodeChange({ css: inlineSvg, tailwind: inlineSvg });
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const sec = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', innerHTML: '<span>🌊</span> Wave Parameters' }),

      // Amplitude
      createSlider('Wave Amplitude (Height)', config.amplitude, 10, 80, (v) => { config.amplitude = v; renderWave(); }, 'px'),
      // Frequency
      createSlider('Frequency (Wave Count)', config.frequency, 1, 6, (v) => { config.frequency = v; renderWave(); }, ''),
      // Layers
      createSlider('Layers', config.layers, 1, 3, (v) => { config.layers = v; renderWave(); }, ''),
      // Speed
      createSlider('Animation Speed', config.animationSpeed, 2, 20, (v) => { config.animationSpeed = v; renderWave(); }, 's'),

      // Color pickers
      el('div', { className: 'control-group' }, [
        el('div', { className: 'control-label-row' }, [
          el('span', { className: 'control-label', textContent: 'Wave Color' }),
          el('span', { className: 'control-value', textContent: config.fillColor })
        ]),
        el('div', { className: 'color-picker-wrapper' }, [
          el('input', {
            type: 'color',
            value: config.fillColor,
            oninput: (e) => {
              config.fillColor = e.target.value;
              renderWave();
            }
          }),
          el('span', { className: 'color-hex-text', textContent: config.fillColor })
        ])
      ]),

      // Animated Toggle
      el('div', { className: 'switch-container', style: { marginTop: '16px' } }, [
        el('span', { style: { fontSize: '0.85rem', fontWeight: '500' }, textContent: 'Looping Motion' }),
        el('label', { className: 'switch' }, [
          el('input', {
            type: 'checkbox',
            checked: config.animated,
            onchange: (e) => {
              config.animated = e.target.checked;
              renderWave();
            }
          }),
          el('span', { className: 'slider-toggle' })
        ])
      ]),

      // Flip Toggle
      el('div', { className: 'switch-container', style: { marginTop: '14px' } }, [
        el('span', { style: { fontSize: '0.85rem', fontWeight: '500' }, textContent: 'Flip Invert (Top / Bottom)' }),
        el('label', { className: 'switch' }, [
          el('input', {
            type: 'checkbox',
            checked: config.flip,
            onchange: (e) => {
              config.flip = e.target.checked;
              renderWave();
            }
          }),
          el('span', { className: 'slider-toggle' })
        ])
      ])
    ]);

    controlsStage.appendChild(sec);
  }

  function createSlider(label, val, min, max, onChange, unit = '') {
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
  renderWave();
}
