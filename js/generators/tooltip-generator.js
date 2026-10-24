// Tool: HeroUI Rich Tooltip & Popover Builder
// Directional placements (top, bottom, left, right), arrow pointers, shortcuts & interactive card popovers
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';
import { copyToClipboard } from '../clipboard.js';

export const meta = {
  id: 'tooltip-generator',
  name: 'CSS Tooltip Builder'
};

let config = {
  position: 'top', // top, bottom, left, right
  variant: 'rich', // simple, rich, shortcut
  title: 'Cloud Deployment',
  desc: 'Triggers instant production edge build and CDN cache invalidation.',
  shortcut: '⌘D',
  arrow: true,
  radius: 8
};

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    id: 'tooltip-preview-stage',
    style: {
      width: '100%',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '30px',
      padding: '40px 20px 60px'
    }
  });

  const demoCard = el('div', {
    style: {
      padding: '50px 60px',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      position: 'relative'
    }
  });

  const targetWrapper = el('div', { id: 'tooltip-interactive-target' });
  const hint = el('div', {
    style: { fontSize: '0.72rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px' },
    innerHTML: `<span>Hover or focus on the button to reveal the tooltip</span>`
  });

  demoCard.appendChild(targetWrapper);
  demoCard.appendChild(hint);
  centerStage.appendChild(demoCard);
  previewStage.appendChild(centerStage);

  renderControls();
  renderTooltip();

  function renderControls() {
    controlsStage.innerHTML = '';

    const section = el('div', { className: 'control-section' }, [
      el('div', { className: 'control-section-header' }, [
        el('h4', { className: 'control-section-title', textContent: 'Placement Direction' })
      ]),
      el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', marginBottom: '18px' } }, [
        createPosBtn('Top', 'top'),
        createPosBtn('Bottom', 'bottom'),
        createPosBtn('Left', 'left'),
        createPosBtn('Right', 'right')
      ]),

      el('div', { className: 'control-section-header' }, [
        el('h4', { className: 'control-section-title', textContent: 'Tooltip Style' })
      ]),
      el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '16px' } }, [
        createStyleBtn('Rich Card', 'rich'),
        createStyleBtn('Shortcut', 'shortcut'),
        createStyleBtn('Simple', 'simple')
      ]),

      el('div', { className: 'control-section-header' }, [
        el('h4', { className: 'control-section-title', textContent: 'Tooltip Content' })
      ]),
      el('input', {
        type: 'text',
        value: config.title,
        placeholder: 'Title...',
        style: { width: '100%', padding: '8px 12px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', fontSize: '0.82rem', marginBottom: '10px' },
        oninput: (e) => {
          config.title = e.target.value;
          renderTooltip();
        }
      }),

      createToggle('Pointer Arrow', config.arrow, (v) => {
        config.arrow = v;
        renderTooltip();
      })
    ]);

    controlsStage.appendChild(section);
  }

  function createPosBtn(label, pKey) {
    return el('button', {
      className: `btn btn-outline ${config.position === pKey ? 'active' : ''}`,
      style: { fontSize: '0.75rem', padding: '6px 8px' },
      textContent: label,
      onclick: () => {
        config.position = pKey;
        renderControls();
        renderTooltip();
      }
    });
  }

  function createStyleBtn(label, sKey) {
    return el('button', {
      className: `btn btn-outline ${config.variant === sKey ? 'active' : ''}`,
      style: { fontSize: '0.72rem', padding: '5px 4px' },
      textContent: label,
      onclick: () => {
        config.variant = sKey;
        renderControls();
        renderTooltip();
      }
    });
  }

  function renderTooltip() {
    const pos = config.position;
    const arrow = config.arrow;

    targetWrapper.innerHTML = `
      <style>
        .has-hero-tooltip {
          position: relative;
          display: inline-flex;
        }

        .hero-tooltip-box {
          position: absolute;
          z-index: 100;
          background: var(--bg-card);
          border: 1px solid var(--border-strong);
          border-radius: ${config.radius}px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
          pointer-events: none;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.18s cubic-bezier(0.16, 1, 0.3, 1), transform 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Hover Reveal */
        .has-hero-tooltip:hover .hero-tooltip-box,
        .has-hero-tooltip:focus-within .hero-tooltip-box {
          opacity: 1;
          visibility: visible;
        }

        /* Directional Offsets */
        ${pos === 'top' ? `
          .hero-tooltip-box {
            bottom: calc(100% + 10px);
            left: 50%;
            transform: translateX(-50%) translateY(4px);
          }
          .has-hero-tooltip:hover .hero-tooltip-box {
            transform: translateX(-50%) translateY(0);
          }
          ${arrow ? `
            .hero-tooltip-box::after {
              content: '';
              position: absolute;
              top: 100%;
              left: 50%;
              transform: translateX(-50%);
              border-width: 6px 6px 0;
              border-style: solid;
              border-color: var(--border-strong) transparent transparent;
            }
          ` : ''}
        ` : ''}

        ${pos === 'bottom' ? `
          .hero-tooltip-box {
            top: calc(100% + 10px);
            left: 50%;
            transform: translateX(-50%) translateY(-4px);
          }
          .has-hero-tooltip:hover .hero-tooltip-box {
            transform: translateX(-50%) translateY(0);
          }
          ${arrow ? `
            .hero-tooltip-box::after {
              content: '';
              position: absolute;
              bottom: 100%;
              left: 50%;
              transform: translateX(-50%);
              border-width: 0 6px 6px;
              border-style: solid;
              border-color: transparent transparent var(--border-strong);
            }
          ` : ''}
        ` : ''}

        ${pos === 'left' ? `
          .hero-tooltip-box {
            right: calc(100% + 10px);
            top: 50%;
            transform: translateY(-50%) translateX(4px);
          }
          .has-hero-tooltip:hover .hero-tooltip-box {
            transform: translateY(-50%) translateX(0);
          }
          ${arrow ? `
            .hero-tooltip-box::after {
              content: '';
              position: absolute;
              left: 100%;
              top: 50%;
              transform: translateY(-50%);
              border-width: 6px 0 6px 6px;
              border-style: solid;
              border-color: transparent transparent transparent var(--border-strong);
            }
          ` : ''}
        ` : ''}

        ${pos === 'right' ? `
          .hero-tooltip-box {
            left: calc(100% + 10px);
            top: 50%;
            transform: translateY(-50%) translateX(-4px);
          }
          .has-hero-tooltip:hover .hero-tooltip-box {
            transform: translateY(-50%) translateX(0);
          }
          ${arrow ? `
            .hero-tooltip-box::after {
              content: '';
              position: absolute;
              right: 100%;
              top: 50%;
              transform: translateY(-50%);
              border-width: 6px 6px 6px 0;
              border-style: solid;
              border-color: transparent var(--border-strong) transparent transparent;
            }
          ` : ''}
        ` : ''}
      </style>

      <div class="has-hero-tooltip">
        <button class="btn btn-primary" style="padding:10px 18px; font-weight:600; font-size:0.85rem; display:flex; align-items:center; gap:8px;">
          ${ICONS.rocket || ICONS.zap}
          <span>Deploy to Edge</span>
        </button>

        <div class="hero-tooltip-box" style="${config.variant === 'rich' ? 'width:240px; padding:12px 14px;' : config.variant === 'shortcut' ? 'padding:6px 10px; white-space:nowrap;' : 'padding:5px 10px; white-space:nowrap;'}">
          ${config.variant === 'rich' ? `
            <div style="font-size:0.8rem; font-weight:700; color:var(--text-main); margin-bottom:4px; display:flex; justify-content:space-between; align-items:center;">
              <span>${config.title}</span>
              <kbd style="font-size:0.65rem; font-family:var(--font-mono); color:var(--text-dim); background:var(--bg-input); padding:1px 5px; border-radius:3px; border:1px solid var(--border);">${config.shortcut}</kbd>
            </div>
            <p style="font-size:0.72rem; color:var(--text-muted); margin:0 0 8px; line-height:1.4;">${config.desc}</p>
            <div style="font-size:0.68rem; color:var(--accent); font-weight:600;">Status: Ready to trigger</div>
          ` : config.variant === 'shortcut' ? `
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:0.75rem; font-weight:500; color:var(--text-main);">${config.title}</span>
              <kbd style="font-size:0.65rem; font-family:var(--font-mono); color:var(--text-dim); background:var(--bg-input); padding:1px 5px; border-radius:3px; border:1px solid var(--border);">${config.shortcut}</kbd>
            </div>
          ` : `
            <span style="font-size:0.75rem; color:var(--text-main); font-weight:500;">${config.title}</span>
          `}
        </div>
      </div>
    `;

    generateCode();
  }

  function generateCode() {
    const css = `/* HeroUI / shadcn Tooltip (${config.position}) */
.ui-tooltip-trigger {
  position: relative;
  display: inline-flex;
}

.ui-tooltip {
  position: absolute;
  z-index: 50;
  background: var(--bg-card);
  border: 1px solid var(--border-strong);
  border-radius: ${config.radius}px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.18s ease, transform 0.18s ease;
  ${config.position === 'top' ? 'bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%) translateY(4px);' : ''}
  ${config.position === 'bottom' ? 'top: calc(100% + 8px); left: 50%; transform: translateX(-50%) translateY(-4px);' : ''}
}

.ui-tooltip-trigger:hover .ui-tooltip {
  opacity: 1;
  visibility: visible;
  ${config.position === 'top' ? 'transform: translateX(-50%) translateY(0);' : ''}
  ${config.position === 'bottom' ? 'transform: translateX(-50%) translateY(0);' : ''}
}`;

    const tailwind = `<!-- shadcn / HeroUI Tooltip -->
<div class="group relative inline-flex">
  <button class="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900">
    Deploy
  </button>
  <div class="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-900 shadow-md group-hover:flex dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
    ${config.title}
  </div>
</div>`;

    const react = `// React / Tailwind Tooltip Component
import React from 'react';

export function Tooltip({ text = '${config.title}', children }) {
  return (
    <div className="group relative inline-flex">
      {children}
      <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-900 shadow-lg group-hover:flex dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
        {text}
      </div>
    </div>
  );
}`;

    onCodeChange({ css, tailwind, react });
  }

  function createToggle(label, initial, onChange) {
    const wrapper = el('div', { className: 'control-item' });
    const row = el('div', { className: 'control-label-row', style: { width: '100%', display: 'flex', justifyContent: 'space-between' } }, [
      el('label', { className: 'control-label', textContent: label }),
      el('input', {
        type: 'checkbox',
        checked: initial,
        style: { cursor: 'pointer' },
        onchange: (e) => onChange(e.target.checked)
      })
    ]);
    wrapper.appendChild(row);
    return wrapper;
  }
}
