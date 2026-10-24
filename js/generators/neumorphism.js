// Tool 6: Neumorphism (Soft UI) Generator
import { el, qs } from '../utils/dom.js';
import { lightenDarkenColor } from '../utils/color.js';

export const meta = {
  id: 'neumorphism',
  name: 'Neumorphism (Soft UI)'
};

let config = {
  size: 180,
  radius: 28,
  distance: 14,
  blur: 28,
  bgColor: '#1c1c22',
  shape: 'flat' // flat, concave, convex, pressed
};

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    id: 'neumorph-canvas-area',
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-md)',
      transition: 'background 0.2s ease',
      background: config.bgColor
    }
  });

  const softBox = el('div', {
    id: 'neumorph-element',
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      userSelect: 'none',
      transition: 'all 0.15s ease'
    },
    innerHTML: '<div style="width:16px; height:16px; border-radius:50%; background:var(--text-muted); opacity:0.4;"></div>'
  });

  centerStage.appendChild(softBox);
  previewStage.appendChild(centerStage);

  function applyNeumorphism() {
    centerStage.style.background = config.bgColor;
    softBox.style.width = `${config.size}px`;
    softBox.style.height = `${config.size}px`;
    softBox.style.borderRadius = `${config.radius}px`;

    const darkShadowColor = lightenDarkenColor(config.bgColor, -25);
    const lightShadowColor = lightenDarkenColor(config.bgColor, 25);

    let bgStyle = config.bgColor;
    let shadowStyle = '';

    if (config.shape === 'flat') {
      shadowStyle = `${config.distance}px ${config.distance}px ${config.blur}px ${darkShadowColor}, -${config.distance}px -${config.distance}px ${config.blur}px ${lightShadowColor}`;
    } else if (config.shape === 'pressed') {
      shadowStyle = `inset ${config.distance}px ${config.distance}px ${config.blur}px ${darkShadowColor}, inset -${config.distance}px -${config.distance}px ${config.blur}px ${lightShadowColor}`;
    } else if (config.shape === 'convex') {
      bgStyle = `linear-gradient(145deg, ${lightenDarkenColor(config.bgColor, 8)}, ${lightenDarkenColor(config.bgColor, -8)})`;
      shadowStyle = `${config.distance}px ${config.distance}px ${config.blur}px ${darkShadowColor}, -${config.distance}px -${config.distance}px ${config.blur}px ${lightShadowColor}`;
    } else if (config.shape === 'concave') {
      bgStyle = `linear-gradient(145deg, ${lightenDarkenColor(config.bgColor, -8)}, ${lightenDarkenColor(config.bgColor, 8)})`;
      shadowStyle = `${config.distance}px ${config.distance}px ${config.blur}px ${darkShadowColor}, -${config.distance}px -${config.distance}px ${lightShadowColor}`;
    }

    softBox.style.background = bgStyle;
    softBox.style.boxShadow = shadowStyle;

    const css = `/* Huragon/ui — Neumorphism (Soft UI) */
.neumorphic-element {
  border-radius: ${config.radius}px;
  background: ${bgStyle};
  box-shadow: ${shadowStyle};
}`;

    onCodeChange({ css });
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const sec = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', textContent: 'Soft UI Geometry' }),

      el('div', { className: 'control-group' }, [
        el('div', { className: 'control-label-row' }, [
          el('span', { className: 'control-label', textContent: 'Shape Type' })
        ]),
        el('div', { style: { display: 'flex', gap: '6px' } }, [
          'flat', 'concave', 'convex', 'pressed'
        ].map(s => el('button', {
          className: `btn ${config.shape === s ? 'btn-primary' : 'btn-outline'}`,
          style: { flex: '1', padding: '5px 4px', fontSize: '0.72rem', textTransform: 'capitalize' },
          textContent: s,
          onclick: () => {
            config.shape = s;
            renderControls();
            applyNeumorphism();
          }
        })))
      ]),

      createSlider('Size', config.size, 100, 280, (v) => { config.size = v; applyNeumorphism(); }, 'px'),
      createSlider('Radius', config.radius, 0, 80, (v) => { config.radius = v; applyNeumorphism(); }, 'px'),
      createSlider('Distance', config.distance, 4, 36, (v) => { config.distance = v; applyNeumorphism(); }, 'px'),
      createSlider('Blur', config.blur, 8, 60, (v) => { config.blur = v; applyNeumorphism(); }, 'px'),

      el('div', { className: 'control-group' }, [
        el('div', { className: 'control-label-row' }, [
          el('span', { className: 'control-label', textContent: 'Surface Color' }),
          el('span', { className: 'control-value', textContent: config.bgColor })
        ]),
        el('div', { className: 'color-picker-wrapper' }, [
          el('input', {
            type: 'color',
            value: config.bgColor,
            oninput: (e) => {
              config.bgColor = e.target.value;
              applyNeumorphism();
            }
          }),
          el('span', { className: 'color-hex-text', textContent: config.bgColor })
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
  applyNeumorphism();
}
