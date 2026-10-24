// Tool 5: Button Studio Generator
import { el, qs } from '../utils/dom.js';

export const meta = {
  id: 'button-generator',
  name: 'Button Studio',
  icon: '🔘'
};

let config = {
  text: 'Explore Huragon',
  fontSize: 15,
  fontWeight: 600,
  paddingX: 24,
  paddingY: 12,
  borderRadius: 12,
  variant: 'gradient', // gradient, solid, glass, outline, neon
  bgColor1: '#8b5cf6',
  bgColor2: '#ec4899',
  textColor: '#ffffff',
  borderColor: '#ffffff',
  borderWidth: 1,
  shadowDepth: 18,
  shadowColor: '#8b5cf6',
  shadowOpacity: 0.4,
  hoverScale: 1.04,
  hasIcon: true
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
      gap: '24px',
      padding: '40px'
    }
  });

  const buttonWrapper = el('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    }
  });

  const btn = el('button', {
    id: 'interactive-preview-btn',
    style: {
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      userSelect: 'none',
      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
    }
  });

  buttonWrapper.appendChild(btn);
  centerStage.appendChild(buttonWrapper);

  // States display (Normal, Hover, Active)
  const stateLabels = el('div', {
    style: {
      display: 'flex',
      gap: '20px',
      fontSize: '0.8rem',
      color: 'var(--text-dim)'
    },
    innerHTML: '<span>💡 Hover & Click the preview button to test physical states</span>'
  });
  centerStage.appendChild(stateLabels);

  previewStage.appendChild(centerStage);

  function applyButtonStyles() {
    btn.innerHTML = `${config.hasIcon ? '✨ ' : ''}<span>${config.text}</span>`;
    btn.style.fontSize = `${config.fontSize}px`;
    btn.style.fontWeight = config.fontWeight;
    btn.style.padding = `${config.paddingY}px ${config.paddingX}px`;
    btn.style.borderRadius = `${config.borderRadius}px`;
    btn.style.color = config.textColor;

    let bgStyle = '';
    let borderStyle = 'none';
    let shadowStyle = '';

    if (config.variant === 'gradient') {
      bgStyle = `linear-gradient(135deg, ${config.bgColor1} 0%, ${config.bgColor2} 100%)`;
      shadowStyle = `0 8px ${config.shadowDepth}px 0 ${hexToRgba(config.shadowColor, config.shadowOpacity)}`;
    } else if (config.variant === 'solid') {
      bgStyle = config.bgColor1;
      shadowStyle = `0 6px ${config.shadowDepth}px 0 ${hexToRgba(config.shadowColor, config.shadowOpacity)}`;
    } else if (config.variant === 'outline') {
      bgStyle = 'transparent';
      borderStyle = `${config.borderWidth}px solid ${config.borderColor}`;
      shadowStyle = 'none';
    } else if (config.variant === 'glass') {
      bgStyle = 'rgba(255, 255, 255, 0.12)';
      borderStyle = '1px solid rgba(255, 255, 255, 0.25)';
      btn.style.backdropFilter = 'blur(12px)';
      btn.style.webkitBackdropFilter = 'blur(12px)';
      shadowStyle = '0 8px 32px 0 rgba(0, 0, 0, 0.3)';
    } else if (config.variant === 'neon') {
      bgStyle = '#0a0a14';
      borderStyle = `2px solid ${config.bgColor1}`;
      shadowStyle = `0 0 20px ${hexToRgba(config.bgColor1, 0.6)}, inset 0 0 10px ${hexToRgba(config.bgColor1, 0.3)}`;
    }

    btn.style.background = bgStyle;
    btn.style.border = borderStyle;
    btn.style.boxShadow = shadowStyle;

    // Hover listeners
    btn.onmouseenter = () => {
      btn.style.transform = `scale(${config.hoverScale}) translateY(-2px)`;
      btn.style.filter = 'brightness(1.1)';
    };
    btn.onmouseleave = () => {
      btn.style.transform = 'scale(1) translateY(0)';
      btn.style.filter = 'none';
    };
    btn.onmousedown = () => {
      btn.style.transform = 'scale(0.97)';
    };
    btn.onmouseup = () => {
      btn.style.transform = `scale(${config.hoverScale}) translateY(-2px)`;
    };

    updateCode(bgStyle, borderStyle, shadowStyle);
  }

  function hexToRgba(hex, a) {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16) || 0;
    const g = parseInt(clean.substring(2, 4), 16) || 0;
    const b = parseInt(clean.substring(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  function updateCode(bgStyle, borderStyle, shadowStyle) {
    const css = `/* Huragon/ui — Button Component */
.btn-huragon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${config.paddingY}px ${config.paddingX}px;
  font-size: ${config.fontSize}px;
  font-weight: ${config.fontWeight};
  color: ${config.textColor};
  background: ${bgStyle};
  border: ${borderStyle};
  border-radius: ${config.borderRadius}px;
  box-shadow: ${shadowStyle};
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-huragon:hover {
  transform: scale(${config.hoverScale}) translateY(-2px);
  filter: brightness(1.1);
}

.btn-huragon:active {
  transform: scale(0.97);
}`;

    const tailwind = `<!-- Tailwind Button -->
<button class="inline-flex items-center justify-center px-[${config.paddingX}px] py-[${config.paddingY}px] text-[${config.fontSize}px] font-[${config.fontWeight}] text-white rounded-[${config.borderRadius}px] transition-all hover:scale-105 active:scale-95 shadow-lg">
  ${config.text}
</button>`;

    onCodeChange({ css, tailwind });
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const sec = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', innerHTML: '<span>🔘</span> Button Style & Geometry' }),

      // Text input
      el('div', { className: 'control-group' }, [
        el('div', { className: 'control-label-row' }, [
          el('span', { className: 'control-label', textContent: 'Button Label' })
        ]),
        el('input', {
          type: 'text',
          value: config.text,
          style: {
            width: '100%',
            padding: '8px 12px',
            background: 'var(--bg-input)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            color: '#fff'
          },
          oninput: (e) => {
            config.text = e.target.value;
            applyButtonStyles();
          }
        })
      ]),

      // Variants
      el('div', { className: 'control-group' }, [
        el('div', { className: 'control-label-row' }, [
          el('span', { className: 'control-label', textContent: 'Style Variant' })
        ]),
        el('div', { style: { display: 'flex', gap: '6px', flexWrap: 'wrap' } }, [
          'gradient', 'solid', 'glass', 'outline', 'neon'
        ].map(v => el('button', {
          className: `btn ${config.variant === v ? 'btn-primary' : 'btn-outline'}`,
          style: { padding: '5px 10px', fontSize: '0.75rem', textTransform: 'capitalize' },
          textContent: v,
          onclick: () => {
            config.variant = v;
            renderControls();
            applyButtonStyles();
          }
        })))
      ]),

      createSlider('Border Radius', config.borderRadius, 0, 40, (v) => { config.borderRadius = v; applyButtonStyles(); }, 'px'),
      createSlider('Horizontal Padding', config.paddingX, 8, 48, (v) => { config.paddingX = v; applyButtonStyles(); }, 'px'),
      createSlider('Vertical Padding', config.paddingY, 6, 28, (v) => { config.paddingY = v; applyButtonStyles(); }, 'px'),
      createSlider('Font Size', config.fontSize, 12, 24, (v) => { config.fontSize = v; applyButtonStyles(); }, 'px'),

      // Color pickers
      el('div', { className: 'control-group' }, [
        el('div', { className: 'control-label-row' }, [
          el('span', { className: 'control-label', textContent: 'Primary Accent Color' }),
          el('span', { className: 'control-value', textContent: config.bgColor1 })
        ]),
        el('div', { className: 'color-picker-wrapper' }, [
          el('input', {
            type: 'color',
            value: config.bgColor1,
            oninput: (e) => {
              config.bgColor1 = e.target.value;
              config.shadowColor = e.target.value;
              applyButtonStyles();
            }
          }),
          el('span', { className: 'color-hex-text', textContent: config.bgColor1 })
        ])
      ]),

      config.variant === 'gradient' ? el('div', { className: 'control-group' }, [
        el('div', { className: 'control-label-row' }, [
          el('span', { className: 'control-label', textContent: 'Gradient Secondary Color' }),
          el('span', { className: 'control-value', textContent: config.bgColor2 })
        ]),
        el('div', { className: 'color-picker-wrapper' }, [
          el('input', {
            type: 'color',
            value: config.bgColor2,
            oninput: (e) => {
              config.bgColor2 = e.target.value;
              applyButtonStyles();
            }
          }),
          el('span', { className: 'color-hex-text', textContent: config.bgColor2 })
        ])
      ]) : null
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
  applyButtonStyles();
}
