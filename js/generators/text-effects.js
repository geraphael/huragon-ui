// Tool 12: Modern CSS Text Effects
import { el, qs } from '../utils/dom.js';

export const meta = {
  id: 'text-effects',
  name: 'Text Effects'
};

let config = {
  text: 'Huragon Studio',
  type: 'gradient', // gradient, stroke, glow, emboss
  fontSize: 52,
  fontWeight: 700,
  color1: '#ffffff',
  color2: '#71717a',
  glowColor: '#3b82f6',
  glowSize: 16
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
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      textAlign: 'center'
    }
  });

  const textElement = el('div', {
    id: 'preview-text-element',
    style: {
      fontFamily: 'Inter, sans-serif',
      letterSpacing: '-0.03em',
      lineHeight: '1.1'
    }
  });

  centerStage.appendChild(textElement);
  previewStage.appendChild(centerStage);

  function applyStyles() {
    textElement.textContent = config.text;
    textElement.style.fontSize = `${config.fontSize}px`;
    textElement.style.fontWeight = config.fontWeight;

    textElement.style.background = 'none';
    textElement.style.webkitBackgroundClip = 'unset';
    textElement.style.webkitTextFillColor = 'unset';
    textElement.style.webkitTextStroke = 'unset';
    textElement.style.textShadow = 'none';
    textElement.style.color = 'var(--text-main)';

    let effectCSS = '';

    if (config.type === 'gradient') {
      textElement.style.background = `linear-gradient(135deg, ${config.color1} 0%, ${config.color2} 100%)`;
      textElement.style.webkitBackgroundClip = 'text';
      textElement.style.webkitTextFillColor = 'transparent';
      effectCSS = `  background: linear-gradient(135deg, ${config.color1} 0%, ${config.color2} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;`;
    } else if (config.type === 'stroke') {
      textElement.style.color = 'transparent';
      textElement.style.webkitTextStroke = `1.5px ${config.color1}`;
      effectCSS = `  color: transparent;
  -webkit-text-stroke: 1.5px ${config.color1};`;
    } else if (config.type === 'glow') {
      textElement.style.color = '#ffffff';
      textElement.style.textShadow = `0 0 ${config.glowSize}px ${config.glowColor}, 0 0 ${config.glowSize * 2}px ${config.glowColor}`;
      effectCSS = `  color: #ffffff;
  text-shadow: 0 0 ${config.glowSize}px ${config.glowColor}, 0 0 ${config.glowSize * 2}px ${config.glowColor};`;
    } else if (config.type === 'emboss') {
      textElement.style.color = 'var(--bg-app)';
      textElement.style.textShadow = `-1px -1px 0 rgba(255,255,255,0.1), 1px 1px 1px rgba(0,0,0,0.8)`;
      effectCSS = `  color: var(--bg-app);
  text-shadow: -1px -1px 0 rgba(255, 255, 255, 0.1), 1px 1px 1px rgba(0, 0, 0, 0.8);`;
    }

    const css = `/* Huragon/ui — Text Effect */
.ui-text-effect {
  font-size: ${config.fontSize}px;
  font-weight: ${config.fontWeight};
  letter-spacing: -0.03em;
${effectCSS}
}`;

    onCodeChange({ css });
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const sec = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', textContent: 'Effect Variant' }),
      el('div', { style: { display: 'flex', gap: '6px' } }, [
        'gradient', 'stroke', 'glow', 'emboss'
      ].map(t => el('button', {
        className: `btn ${config.type === t ? 'btn-primary' : 'btn-outline'}`,
        style: { flex: '1', fontSize: '0.72rem', textTransform: 'capitalize' },
        textContent: t,
        onclick: () => {
          config.type = t;
          renderControls();
          applyStyles();
        }
      })))
    ]);
    controlsStage.appendChild(sec);

    const secProps = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', textContent: 'Typography' }),

      el('div', { className: 'control-group' }, [
        el('div', { className: 'control-label-row' }, [
          el('span', { className: 'control-label', textContent: 'Sample Text' })
        ]),
        el('input', {
          type: 'text',
          value: config.text,
          style: {
            width: '100%',
            padding: '7px 10px',
            background: 'var(--bg-input)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-main)',
            fontSize: '0.8rem'
          },
          oninput: (e) => {
            config.text = e.target.value;
            applyStyles();
          }
        })
      ]),

      createSlider('Font Size', config.fontSize, 24, 84, (v) => { config.fontSize = v; applyStyles(); }, 'px')
    ]);

    controlsStage.appendChild(secProps);
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
  applyStyles();
}
