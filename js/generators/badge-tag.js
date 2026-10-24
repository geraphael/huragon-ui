// Tool: HeroUI Chips & Status Badges
// Status dots with radar pulse, Avatar chips, numeric counters, dismissible tags & variant styles
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';
import { copyToClipboard } from '../clipboard.js';

export const meta = {
  id: 'badge-tag',
  name: 'Badge & Status Tag'
};

const PRESETS = [
  { text: 'Active System',   variant: 'dot',     dotColor: '#22c55e', label: 'Online Radar' },
  { text: 'Beta v2.4',       variant: 'outline', label: 'Outline Version' },
  { text: 'Deprecated',      variant: 'soft',    label: 'Soft Muted' },
  { text: 'Sarah Connor',    variant: 'avatar',  avatarText: 'SC', label: 'User Avatar Chip' },
  { text: '99+ Unread',      variant: 'counter', label: 'Numeric Count' }
];

let config = {
  text: 'Active System',
  variant: 'dot', // dot, outline, solid, soft, avatar, counter
  radius: 999, // 999 = pill, 6 = rounded, 0 = square
  dotColor: '#22c55e',
  pulsing: true
};

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    id: 'badge-preview-stage',
    style: {
      width: '100%',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '28px',
      padding: '30px 20px 60px'
    }
  });

  const mainDisplay = el('div', { id: 'badge-main-display' });
  const showcaseRow = el('div', { id: 'badge-showcase-row', style: { width: '100%', maxWidth: '580px' } });

  centerStage.appendChild(mainDisplay);
  centerStage.appendChild(showcaseRow);
  previewStage.appendChild(centerStage);

  renderControls();
  renderBadge();

  function renderControls() {
    controlsStage.innerHTML = '';

    const section = el('div', { className: 'control-section' }, [
      el('div', { className: 'control-section-header' }, [
        el('h4', { className: 'control-section-title', textContent: 'Chip Archetypes' })
      ]),
      el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', marginBottom: '18px' } }, [
        createVariantBtn('Status Dot', 'dot'),
        createVariantBtn('Outline', 'outline'),
        createVariantBtn('Soft Fill', 'soft'),
        createVariantBtn('Solid Dark', 'solid'),
        createVariantBtn('Avatar Chip', 'avatar'),
        createVariantBtn('Counter Pill', 'counter')
      ]),

      el('div', { className: 'control-section-header' }, [
        el('h4', { className: 'control-section-title', textContent: 'Badge Text' })
      ]),
      el('input', {
        type: 'text',
        value: config.text,
        style: { width: '100%', padding: '8px 12px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', fontSize: '0.85rem', marginBottom: '16px' },
        oninput: (e) => {
          config.text = e.target.value;
          renderBadge();
        }
      }),

      el('div', { className: 'control-section-header' }, [
        el('h4', { className: 'control-section-title', textContent: 'Radar Pulsing' })
      ]),
      createToggle('Radar Animation Wave', config.pulsing, (v) => {
        config.pulsing = v;
        renderBadge();
      }),

      el('div', { className: 'control-section-header', style: { marginTop: '14px' } }, [
        el('h4', { className: 'control-section-title', textContent: 'Border Radius' })
      ]),
      el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' } }, [
        createRadiusBtn('Pill (Full)', 999),
        createRadiusBtn('Rounded', 6),
        createRadiusBtn('Square', 0)
      ])
    ]);

    controlsStage.appendChild(section);
  }

  function createVariantBtn(label, vKey) {
    return el('button', {
      className: `btn btn-outline ${config.variant === vKey ? 'active' : ''}`,
      style: { fontSize: '0.75rem', padding: '6px 8px' },
      textContent: label,
      onclick: () => {
        config.variant = vKey;
        renderControls();
        renderBadge();
      }
    });
  }

  function createRadiusBtn(label, rVal) {
    return el('button', {
      className: `btn btn-outline ${config.radius === rVal ? 'active' : ''}`,
      style: { fontSize: '0.72rem', padding: '5px 4px' },
      textContent: label,
      onclick: () => {
        config.radius = rVal;
        renderControls();
        renderBadge();
      }
    });
  }

  function getBadgeSnippet(cfg) {
    let extraCss = '';
    let innerHtml = '';
    const r = `${cfg.radius}px`;

    if (cfg.variant === 'dot') {
      extraCss = `background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border); border-radius: ${r}; padding: 4px 10px;`;
      const pulseStyle = cfg.pulsing ? `
        <span style="position:relative; display:inline-flex; width:8px; height:8px; margin-right:6px;">
          <span style="position:absolute; width:100%; height:100%; border-radius:50%; background:${cfg.dotColor || '#22c55e'}; opacity:0.75; animation:ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
          <span style="position:relative; display:inline-flex; border-radius:50%; width:8px; height:8px; background:${cfg.dotColor || '#22c55e'};"></span>
        </span>
      ` : `<span style="width:7px; height:7px; border-radius:50%; background:${cfg.dotColor || '#22c55e'}; display:inline-block; margin-right:6px;"></span>`;
      innerHtml = `${pulseStyle}<span>${cfg.text}</span>`;
    } else if (cfg.variant === 'outline') {
      extraCss = `background: transparent; color: var(--text-main); border: 1px solid var(--border-strong); border-radius: ${r}; padding: 4px 10px;`;
      innerHtml = `<span>${cfg.text}</span>`;
    } else if (cfg.variant === 'soft') {
      extraCss = `background: var(--bg-input); color: var(--text-muted); border: 1px solid var(--border); border-radius: ${r}; padding: 4px 10px;`;
      innerHtml = `<span>${cfg.text}</span>`;
    } else if (cfg.variant === 'solid') {
      extraCss = `background: var(--text-main); color: var(--bg-app); border: 1px solid var(--text-main); border-radius: ${r}; padding: 4px 10px; font-weight: 600;`;
      innerHtml = `<span>${cfg.text}</span>`;
    } else if (cfg.variant === 'avatar') {
      extraCss = `background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border); border-radius: ${r}; padding: 3px 8px 3px 3px; gap: 6px;`;
      innerHtml = `
        <span style="width:20px; height:20px; border-radius:50%; background:var(--bg-input); border:1px solid var(--border); display:inline-flex; align-items:center; justify-content:center; font-size:0.65rem; font-weight:700;">${cfg.avatarText || 'SC'}</span>
        <span>${cfg.text}</span>
      `;
    } else if (cfg.variant === 'counter') {
      extraCss = `background: var(--bg-input); color: var(--text-main); border: 1px solid var(--border-strong); border-radius: ${r}; padding: 3px 8px; font-family: var(--font-mono); font-size: 0.72rem;`;
      innerHtml = `<span>${cfg.text}</span>`;
    }

    const html = `<span class="ui-badge" style="display:inline-flex; align-items:center; font-size:0.75rem; font-weight:500; letter-spacing:0.02em; ${extraCss}">${innerHtml}</span>`;
    return { html, extraCss, innerHtml };
  }

  function renderBadge() {
    const { html: currentHtml } = getBadgeSnippet(config);

    mainDisplay.innerHTML = `
      <style>
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      </style>
      <div style="padding: 28px 40px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); display: flex; flex-direction: column; align-items: center; gap: 10px;">
        ${currentHtml}
        <span style="font-size: 0.7rem; color: var(--text-dim); font-family: var(--font-mono); margin-top: 4px;">HeroUI Chip Specimen</span>
      </div>
    `;

    // Preset gallery below
    showcaseRow.innerHTML = `
      <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 16px 20px;">
        <div style="font-size: 0.68rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-dim); margin-bottom: 12px;">Preset Chips Gallery (Click to inspect)</div>
        <div style="display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
          ${PRESETS.map((p, idx) => {
            const b = getBadgeSnippet({ ...config, ...p });
            return `
              <div class="preset-badge-item" data-idx="${idx}" style="cursor: pointer; transition: transform 0.15s ease;" title="Click to apply ${p.label}">
                ${b.html}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    showcaseRow.querySelectorAll('.preset-badge-item').forEach(item => {
      item.onclick = () => {
        const idx = parseInt(item.dataset.idx, 10);
        const p = PRESETS[idx];
        config = { ...config, ...p };
        renderControls();
        renderBadge();
      };
    });

    generateCode();
  }

  function generateCode() {
    const css = `/* HeroUI Chip / Status Badge */
.ui-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: ${config.radius}px;
  padding: 4px 10px;
  background: var(--bg-${config.variant === 'solid' ? 'main' : 'card'});
  color: var(--text-${config.variant === 'solid' ? 'inv' : 'main'});
  border: 1px solid var(--border);
}

.radar-ping {
  position: relative;
  display: inline-flex;
  width: 8px;
  height: 8px;
  margin-right: 6px;
}

.radar-ping::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #22c55e;
  opacity: 0.75;
  animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}`;

    const tailwind = `<!-- shadcn / HeroUI Status Badge -->
<span class="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2.5 py-0.5 text-xs font-medium text-zinc-900 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
  <span class="relative flex h-2 w-2">
    <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
    <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
  </span>
  <span>${config.text}</span>
</span>`;

    const react = `// React / Tailwind Chip Component
import React from 'react';

export function StatusBadge({ label = '${config.text}' }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2.5 py-0.5 text-xs font-medium text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <span>{label}</span>
    </span>
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
