// Tool 4: SVG Wave Divider Generator
import { el, qs } from '../utils/dom.js';

export const meta = {
  id: 'svg-wave',
  name: 'SVG Wave Divider'
};

let config = {
  amplitude: 35,
  frequency: 2,
  fillColor: '#27272a',
  bgColor: '#09090b',
  layers: 2,
  layerOpacity: 0.5,
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
      border: '1px solid var(--border)'
    }
  });

  const contentZone = el('div', {
    style: {
      padding: '36px',
      color: '#fff',
      zIndex: '2'
    },
    innerHTML: `
      <span style="display:inline-block; padding:2px 8px; border-radius:4px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); font-size:0.72rem; font-weight:500; margin-bottom:12px; color:var(--text-muted);">Section Transition</span>
      <h2 style="font-size:1.5rem; font-weight:600; margin-bottom:6px; letter-spacing:-0.02em;">Vector Wave Dividers</h2>
      <p style="color:var(--text-muted); max-width:440px; font-size:0.825rem; line-height:1.5;">
        Generate fluid mathematical SVG curves and dividers for modern section flow.
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
    const path2 = generateWavePath(config.amplitude * 0.75, config.frequency * 1.2, Math.PI / 3);

    const animCss = config.animated ? `
      animation: waveFlow ${config.animationSpeed}s ease-in-out infinite;
    ` : '';

    waveContainer.innerHTML = `
      <style>
        @keyframes waveFlow {
          0% { transform: translateX(0); }
          50% { transform: translateX(-24px) scaleY(1.04); }
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
    const inlineSvg = `<!-- Huragon/ui Wave Divider -->
<div class="wave-divider" style="position:relative; width:100%; overflow:hidden; line-height:0;">
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
      el('div', { className: 'section-title', textContent: 'Wave Geometry' }),

      createSlider('Amplitude (Height)', config.amplitude, 10, 80, (v) => { config.amplitude = v; renderWave(); }, 'px'),
      createSlider('Frequency (Waves)', config.frequency, 1, 6, (v) => { config.frequency = v; renderWave(); }, ''),
      createSlider('Layers', config.layers, 1, 3, (v) => { config.layers = v; renderWave(); }, ''),
      createSlider('Animation Speed', config.animationSpeed, 2, 20, (v) => { config.animationSpeed = v; renderWave(); }, 's'),

      el('div', { className: 'control-group' }, [
        el('div', { className: 'control-label-row' }, [
          el('span', { className: 'control-label', textContent: 'Fill Color' }),
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

      el('div', { className: 'switch-container', style: { marginTop: '14px' } }, [
        el('span', { style: { fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-muted)' }, textContent: 'Looping Motion' }),
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

      el('div', { className: 'switch-container', style: { marginTop: '12px' } }, [
        el('span', { style: { fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-muted)' }, textContent: 'Invert Orientation' }),
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
