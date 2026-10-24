// Tool 10: Toggle Switch & Custom Checkbox Generator
import { el, qs } from '../utils/dom.js';

export const meta = {
  id: 'toggle-checkbox',
  name: 'Toggle & Checkbox'
};

let config = {
  type: 'switch', // switch, checkbox
  width: 44,
  height: 24,
  radius: 24,
  activeBg: '#ffffff',
  inactiveBg: '#27272a',
  knobColor: '#09090b',
  checked: true
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

  const previewWrapper = el('div', {
    id: 'toggle-preview-wrapper',
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      background: 'var(--bg-card)',
      padding: '20px 28px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border)'
    }
  });

  centerStage.appendChild(previewWrapper);
  previewStage.appendChild(centerStage);

  function renderElement() {
    previewWrapper.innerHTML = `
      <style>
        .custom-ui-switch {
          position: relative;
          display: inline-block;
          width: ${config.width}px;
          height: ${config.height}px;
        }
        .custom-ui-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .switch-track {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: ${config.inactiveBg};
          transition: 0.2s ease;
          border-radius: ${config.radius}px;
          border: 1px solid var(--border-strong);
        }
        .switch-track::before {
          position: absolute;
          content: "";
          height: ${config.height - 6}px;
          width: ${config.height - 6}px;
          left: 3px;
          bottom: 2px;
          background-color: var(--text-dim);
          transition: 0.2s ease;
          border-radius: 50%;
        }
        .custom-ui-switch input:checked + .switch-track {
          background-color: ${config.activeBg};
        }
        .custom-ui-switch input:checked + .switch-track::before {
          transform: translateX(${config.width - config.height}px);
          background-color: ${config.knobColor};
        }
      </style>
      <label class="custom-ui-switch">
        <input type="checkbox" ${config.checked ? 'checked' : ''} id="toggle-input-el">
        <span class="switch-track"></span>
      </label>
      <span style="font-size:0.875rem; font-weight:500; color:var(--text-main);">Enable Feature Flag</span>
    `;

    const inputEl = qs('#toggle-input-el', previewWrapper);
    if (inputEl) {
      inputEl.addEventListener('change', (e) => {
        config.checked = e.target.checked;
        updateCode();
      });
    }

    updateCode();
  }

  function updateCode() {
    const css = `/* Huragon/ui — Accessible CSS Toggle Switch */
.custom-switch {
  position: relative;
  display: inline-block;
  width: ${config.width}px;
  height: ${config.height}px;
}

.custom-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.switch-track {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: ${config.inactiveBg};
  border-radius: ${config.radius}px;
  transition: background-color 0.2s ease;
}

.switch-track::before {
  content: "";
  position: absolute;
  height: ${config.height - 6}px;
  width: ${config.height - 6}px;
  left: 3px;
  bottom: 3px;
  background-color: var(--text-dim);
  border-radius: 50%;
  transition: transform 0.2s ease;
}

.custom-switch input:checked + .switch-track {
  background-color: ${config.activeBg};
}

.custom-switch input:checked + .switch-track::before {
  transform: translateX(${config.width - config.height}px);
  background-color: ${config.knobColor};
}`;

    const html = `<label class="custom-switch">
  <input type="checkbox">
  <span class="switch-track"></span>
</label>`;

    onCodeChange({ css, tailwind: html });
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const sec = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', textContent: 'Dimensions & Scale' }),

      createSlider('Width', config.width, 32, 64, (v) => { config.width = v; renderElement(); }, 'px'),
      createSlider('Height', config.height, 16, 36, (v) => { config.height = v; renderElement(); }, 'px'),
      createSlider('Border Radius', config.radius, 0, 30, (v) => { config.radius = v; renderElement(); }, 'px')
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
  renderElement();
}
