// Tool 5: Button Studio Generator
import { el, qs } from '../utils/dom.js';

export const meta = {
  id: 'button-generator',
  name: 'Button Studio'
};

let config = {
  text: 'Get Started',
  fontSize: 14,
  fontWeight: 500,
  paddingX: 16,
  paddingY: 8,
  borderRadius: 8,
  variant: 'primary', // primary, secondary, outline, ghost
  hoverScale: 1.02
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
      gap: '20px',
      padding: '40px'
    }
  });

  const buttonWrapper = el('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px'
    }
  });

  const btn = el('button', {
    id: 'interactive-preview-btn',
    style: {
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
      transition: 'all 0.15s ease'
    }
  });

  buttonWrapper.appendChild(btn);
  centerStage.appendChild(buttonWrapper);

  const stateLabels = el('div', {
    style: {
      display: 'flex',
      gap: '20px',
      fontSize: '0.75rem',
      color: 'var(--text-dim)'
    },
    innerHTML: '<span>Interactive state preview: Hover & Click button above</span>'
  });
  centerStage.appendChild(stateLabels);

  previewStage.appendChild(centerStage);

  function applyButtonStyles() {
    btn.textContent = config.text;
    btn.style.fontSize = `${config.fontSize}px`;
    btn.style.fontWeight = config.fontWeight;
    btn.style.padding = `${config.paddingY}px ${config.paddingX}px`;
    btn.style.borderRadius = `${config.borderRadius}px`;

    let bgStyle = '';
    let textColor = '';
    let borderStyle = '1px solid transparent';
    let shadowStyle = 'none';

    if (config.variant === 'primary') {
      bgStyle = 'var(--text-main)';
      textColor = 'var(--bg-app)';
      borderStyle = '1px solid var(--text-main)';
      shadowStyle = '0 1px 2px rgba(0, 0, 0, 0.2)';
    } else if (config.variant === 'secondary') {
      bgStyle = 'var(--bg-card)';
      textColor = 'var(--text-main)';
      borderStyle = '1px solid var(--border)';
    } else if (config.variant === 'outline') {
      bgStyle = 'transparent';
      textColor = 'var(--text-main)';
      borderStyle = '1px solid var(--border-strong)';
    } else if (config.variant === 'ghost') {
      bgStyle = 'transparent';
      textColor = 'var(--text-muted)';
      borderStyle = '1px solid transparent';
    }

    btn.style.background = bgStyle;
    btn.style.color = textColor;
    btn.style.border = borderStyle;
    btn.style.boxShadow = shadowStyle;

    btn.onmouseenter = () => {
      btn.style.transform = `scale(${config.hoverScale})`;
      if (config.variant === 'ghost') btn.style.background = 'var(--bg-hover)';
    };
    btn.onmouseleave = () => {
      btn.style.transform = 'scale(1)';
      if (config.variant === 'ghost') btn.style.background = 'transparent';
    };
    btn.onmousedown = () => {
      btn.style.transform = 'scale(0.98)';
    };
    btn.onmouseup = () => {
      btn.style.transform = `scale(${config.hoverScale})`;
    };

    updateCode();
  }

  function updateCode() {
    const css = `/* Huragon/ui — Button Component */
.ui-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${config.paddingY}px ${config.paddingX}px;
  font-size: ${config.fontSize}px;
  font-weight: ${config.fontWeight};
  border-radius: ${config.borderRadius}px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.ui-button:hover {
  transform: scale(${config.hoverScale});
}

.ui-button:active {
  transform: scale(0.98);
}`;

    const tailwind = `<button class="inline-flex items-center justify-center px-[${config.paddingX}px] py-[${config.paddingY}px] text-[${config.fontSize}px] font-[${config.fontWeight}] rounded-[${config.borderRadius}px] transition-all hover:scale-[${config.hoverScale}] active:scale-95">
  ${config.text}
</button>`;

    onCodeChange({ css, tailwind });
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const sec = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', textContent: 'Button Configuration' }),

      el('div', { className: 'control-group' }, [
        el('div', { className: 'control-label-row' }, [
          el('span', { className: 'control-label', textContent: 'Button Label' })
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
            applyButtonStyles();
          }
        })
      ]),

      el('div', { className: 'control-group' }, [
        el('div', { className: 'control-label-row' }, [
          el('span', { className: 'control-label', textContent: 'Style Variant' })
        ]),
        el('div', { style: { display: 'flex', gap: '6px' } }, [
          'primary', 'secondary', 'outline', 'ghost'
        ].map(v => el('button', {
          className: `btn ${config.variant === v ? 'btn-primary' : 'btn-outline'}`,
          style: { flex: '1', padding: '5px 8px', fontSize: '0.72rem', textTransform: 'capitalize' },
          textContent: v,
          onclick: () => {
            config.variant = v;
            renderControls();
            applyButtonStyles();
          }
        })))
      ]),

      createSlider('Border Radius', config.borderRadius, 0, 32, (v) => { config.borderRadius = v; applyButtonStyles(); }, 'px'),
      createSlider('Horizontal Padding', config.paddingX, 8, 40, (v) => { config.paddingX = v; applyButtonStyles(); }, 'px'),
      createSlider('Vertical Padding', config.paddingY, 4, 20, (v) => { config.paddingY = v; applyButtonStyles(); }, 'px'),
      createSlider('Font Size', config.fontSize, 12, 18, (v) => { config.fontSize = v; applyButtonStyles(); }, 'px')
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
