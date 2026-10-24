// Tool 25: Form Input & Field Styler
import { el, qs } from '../utils/dom.js';

export const meta = {
  id: 'form-input-styler',
  name: 'Input & Form Controls'
};

let config = {
  label: 'Email address',
  placeholder: 'name@example.com',
  radius: 8,
  paddingY: 9,
  paddingX: 12,
  borderWidth: 1,
  focusRing: true,
  disabled: false
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
      padding: '40px'
    }
  });

  const formGroup = el('div', {
    id: 'input-demo-form-group',
    style: {
      width: '320px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    }
  });

  centerStage.appendChild(formGroup);
  previewStage.appendChild(centerStage);

  function renderInput() {
    formGroup.innerHTML = `
      <style>
        .custom-ui-input {
          width: 100%;
          padding: ${config.paddingY}px ${config.paddingX}px;
          border-radius: ${config.radius}px;
          border: ${config.borderWidth}px solid var(--border);
          background: var(--bg-card);
          color: var(--text-main);
          font-size: 0.85rem;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .custom-ui-input:focus {
          border-color: var(--text-muted);
          ${config.focusRing ? 'box-shadow: 0 0 0 2px var(--accent-subtle);' : ''}
        }
        .custom-ui-input::placeholder {
          color: var(--text-dim);
        }
      </style>
      <label style="font-size:0.775rem; font-weight:500; color:var(--text-muted);">${config.label}</label>
      <input type="email" placeholder="${config.placeholder}" class="custom-ui-input" ${config.disabled ? 'disabled' : ''} />
      <span style="font-size:0.7rem; color:var(--text-dim);">We'll never share your email address.</span>
    `;

    const css = `/* Huragon/ui — Form Input Control */
.ui-input {
  width: 100%;
  padding: ${config.paddingY}px ${config.paddingX}px;
  border-radius: ${config.radius}px;
  border: ${config.borderWidth}px solid var(--border);
  background: var(--bg-card);
  color: var(--text-main);
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.ui-input:focus {
  border-color: var(--border-focus);
  ${config.focusRing ? 'box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);' : ''}
}

.ui-input::placeholder {
  color: var(--text-dim);
}`;

    const tailwind = `<div class="space-y-1.5 max-w-xs">
  <label class="text-xs font-medium text-zinc-400">${config.label}</label>
  <input type="text" placeholder="${config.placeholder}" class="w-full px-[${config.paddingX}px] py-[${config.paddingY}px] rounded-[${config.radius}px] bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500" />
</div>`;

    onCodeChange({ css, tailwind });
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const sec = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', textContent: 'Input Layout' }),

      createSlider('Border Radius', config.radius, 0, 24, (v) => { config.radius = v; renderInput(); }, 'px'),
      createSlider('Vertical Padding', config.paddingY, 4, 16, (v) => { config.paddingY = v; renderInput(); }, 'px'),
      createSlider('Horizontal Padding', config.paddingX, 8, 24, (v) => { config.paddingX = v; renderInput(); }, 'px'),

      el('div', { className: 'switch-container', style: { marginTop: '14px' } }, [
        el('span', { style: { fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-muted)' }, textContent: 'Focus Ring Halo' }),
        el('label', { className: 'switch' }, [
          el('input', {
            type: 'checkbox',
            checked: config.focusRing,
            onchange: (e) => {
              config.focusRing = e.target.checked;
              renderInput();
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
          const v = parseInt(e.target.value, 10);
          valSpan.textContent = `${v}${unit}`;
          onChange(v);
        }
      })
    ]);
  }

  renderControls();
  renderInput();
}
