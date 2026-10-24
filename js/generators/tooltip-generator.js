// Tool 17: Pure CSS Tooltip Builder
import { el, qs } from '../utils/dom.js';

export const meta = {
  id: 'tooltip-generator',
  name: 'CSS Tooltip Builder'
};

let config = {
  position: 'top', // top, bottom, left, right
  tooltipText: 'Quick tooltip message',
  bg: '#18181b',
  textColor: '#f4f4f5',
  radius: 6,
  arrow: true
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

  const targetWrapper = el('div', { id: 'tooltip-demo-wrapper' });
  centerStage.appendChild(targetWrapper);
  previewStage.appendChild(centerStage);

  function renderTooltip() {
    targetWrapper.innerHTML = `
      <style>
        .ui-has-tooltip {
          position: relative;
          display: inline-flex;
        }
        .ui-has-tooltip .ui-tooltip-content {
          position: absolute;
          background: ${config.bg};
          color: ${config.textColor};
          padding: 5px 10px;
          border-radius: ${config.radius}px;
          border: 1px solid var(--border-strong);
          font-size: 0.75rem;
          white-space: nowrap;
          pointer-events: none;
          box-shadow: var(--shadow-md);
          z-index: 100;
          transition: opacity 0.15s ease, transform 0.15s ease;
          opacity: 0;
          visibility: hidden;
        }

        /* Positions */
        ${config.position === 'top' ? `
        .ui-has-tooltip .ui-tooltip-content {
          bottom: 100%;
          left: 50%;
          transform: translate(-50%, -6px);
        }
        .ui-has-tooltip:hover .ui-tooltip-content {
          opacity: 1;
          visibility: visible;
          transform: translate(-50%, -10px);
        }
        ` : ''}

        ${config.position === 'bottom' ? `
        .ui-has-tooltip .ui-tooltip-content {
          top: 100%;
          left: 50%;
          transform: translate(-50%, 6px);
        }
        .ui-has-tooltip:hover .ui-tooltip-content {
          opacity: 1;
          visibility: visible;
          transform: translate(-50%, 10px);
        }
        ` : ''}

        ${config.position === 'left' ? `
        .ui-has-tooltip .ui-tooltip-content {
          right: 100%;
          top: 50%;
          transform: translate(-6px, -50%);
        }
        .ui-has-tooltip:hover .ui-tooltip-content {
          opacity: 1;
          visibility: visible;
          transform: translate(-10px, -50%);
        }
        ` : ''}

        ${config.position === 'right' ? `
        .ui-has-tooltip .ui-tooltip-content {
          left: 100%;
          top: 50%;
          transform: translate(6px, -50%);
        }
        .ui-has-tooltip:hover .ui-tooltip-content {
          opacity: 1;
          visibility: visible;
          transform: translate(10px, -50%);
        }
        ` : ''}
      </style>
      <div class="ui-has-tooltip">
        <button class="btn btn-outline">Hover over me</button>
        <span class="ui-tooltip-content">${config.tooltipText}</span>
      </div>
    `;

    const css = `/* Huragon/ui — Pure CSS Directional Tooltip */
.has-tooltip {
  position: relative;
  display: inline-flex;
}

.has-tooltip .tooltip-bubble {
  position: absolute;
  ${config.position === 'top' ? 'bottom: 100%; left: 50%; transform: translate(-50%, -8px);' : ''}
  ${config.position === 'bottom' ? 'top: 100%; left: 50%; transform: translate(-50%, 8px);' : ''}
  ${config.position === 'left' ? 'right: 100%; top: 50%; transform: translate(-8px, -50%);' : ''}
  ${config.position === 'right' ? 'left: 100%; top: 50%; transform: translate(8px, -50%);' : ''}
  background: ${config.bg};
  color: ${config.textColor};
  padding: 5px 10px;
  border-radius: ${config.radius}px;
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.has-tooltip:hover .tooltip-bubble {
  opacity: 1;
}`;

    onCodeChange({ css });
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const sec = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', textContent: 'Placement & Content' }),

      el('div', { className: 'control-group' }, [
        el('div', { className: 'control-label-row' }, [
          el('span', { className: 'control-label', textContent: 'Direction' })
        ]),
        el('div', { style: { display: 'flex', gap: '6px' } }, [
          'top', 'bottom', 'left', 'right'
        ].map(p => el('button', {
          className: `btn ${config.position === p ? 'btn-primary' : 'btn-outline'}`,
          style: { flex: '1', fontSize: '0.72rem', textTransform: 'capitalize' },
          textContent: p,
          onclick: () => {
            config.position = p;
            renderControls();
            renderTooltip();
          }
        })))
      ]),

      el('div', { className: 'control-group' }, [
        el('div', { className: 'control-label-row' }, [
          el('span', { className: 'control-label', textContent: 'Tooltip Text' })
        ]),
        el('input', {
          type: 'text',
          value: config.tooltipText,
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
            config.tooltipText = e.target.value;
            renderTooltip();
          }
        })
      ])
    ]);

    controlsStage.appendChild(sec);
  }

  renderControls();
  renderTooltip();
}
