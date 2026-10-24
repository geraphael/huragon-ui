// Tool 20: Scrollbar Styler
import { el, qs } from '../utils/dom.js';

export const meta = {
  id: 'scrollbar-styler',
  name: 'Scrollbar Styler'
};

let config = {
  width: 8,
  thumbColor: '#52525b',
  trackColor: '#18181b',
  thumbHover: '#71717a',
  radius: 999
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

  const scrollBoxWrapper = el('div', { id: 'scrollbar-demo-wrapper' });
  centerStage.appendChild(scrollBoxWrapper);
  previewStage.appendChild(centerStage);

  function renderScrollbar() {
    scrollBoxWrapper.innerHTML = `
      <style>
        .custom-scroll-container::-webkit-scrollbar {
          width: ${config.width}px;
          height: ${config.width}px;
        }
        .custom-scroll-container::-webkit-scrollbar-track {
          background: ${config.trackColor};
          border-radius: ${config.radius}px;
        }
        .custom-scroll-container::-webkit-scrollbar-thumb {
          background: ${config.thumbColor};
          border-radius: ${config.radius}px;
        }
        .custom-scroll-container::-webkit-scrollbar-thumb:hover {
          background: ${config.thumbHover};
        }
        .custom-scroll-container {
          scrollbar-width: thin;
          scrollbar-color: ${config.thumbColor} ${config.trackColor};
        }
      </style>
      <div class="custom-scroll-container" style="width:300px; height:240px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-md); overflow-y:scroll; padding:20px; color:var(--text-main);">
        <h4 style="font-size:0.95rem; font-weight:600; margin-bottom:10px;">Scrollable Container</h4>
        <p style="font-size:0.8rem; line-height:1.6; color:var(--text-muted); margin-bottom:12px;">
          WebKit pseudo-elements combined with the standard CSS Scrollbars Module level 1 specifications for cross-browser consistency.
        </p>
        <p style="font-size:0.8rem; line-height:1.6; color:var(--text-muted); margin-bottom:12px;">
          Scroll down inside this box to test the scrollbar thickness, track hue, thumb curve and hover highlight response.
        </p>
        <p style="font-size:0.8rem; line-height:1.6; color:var(--text-muted); margin-bottom:12px;">
          Tested across Chromium, Safari, and Firefox rendering engines with graceful degradation fallbacks.
        </p>
        <div style="padding:12px; border-radius:6px; background:var(--bg-input); font-size:0.75rem; color:var(--text-dim);">
          End of scrollable viewport content.
        </div>
      </div>
    `;

    const css = `/* Huragon/ui — Cross-Browser Custom Scrollbar */

/* Chrome, Edge, Safari */
::-webkit-scrollbar {
  width: ${config.width}px;
  height: ${config.width}px;
}

::-webkit-scrollbar-track {
  background: ${config.trackColor};
  border-radius: ${config.radius}px;
}

::-webkit-scrollbar-thumb {
  background: ${config.thumbColor};
  border-radius: ${config.radius}px;
}

::-webkit-scrollbar-thumb:hover {
  background: ${config.thumbHover};
}

/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: ${config.thumbColor} ${config.trackColor};
}`;

    onCodeChange({ css });
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const sec = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', textContent: 'Scrollbar Metrics' }),

      createSlider('Width', config.width, 4, 16, (v) => { config.width = v; renderScrollbar(); }, 'px'),
      createSlider('Radius', config.radius, 0, 999, (v) => { config.radius = v; renderScrollbar(); }, 'px'),

      el('div', { className: 'control-group' }, [
        el('div', { className: 'control-label-row' }, [
          el('span', { className: 'control-label', textContent: 'Thumb Color' }),
          el('span', { className: 'control-value', textContent: config.thumbColor })
        ]),
        el('div', { className: 'color-picker-wrapper' }, [
          el('input', {
            type: 'color',
            value: config.thumbColor,
            oninput: (e) => {
              config.thumbColor = e.target.value;
              renderScrollbar();
            }
          }),
          el('span', { className: 'color-hex-text', textContent: config.thumbColor })
        ])
      ]),

      el('div', { className: 'control-group' }, [
        el('div', { className: 'control-label-row' }, [
          el('span', { className: 'control-label', textContent: 'Track Color' }),
          el('span', { className: 'control-value', textContent: config.trackColor })
        ]),
        el('div', { className: 'color-picker-wrapper' }, [
          el('input', {
            type: 'color',
            value: config.trackColor,
            oninput: (e) => {
              config.trackColor = e.target.value;
              renderScrollbar();
            }
          }),
          el('span', { className: 'color-hex-text', textContent: config.trackColor })
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
  renderScrollbar();
}
