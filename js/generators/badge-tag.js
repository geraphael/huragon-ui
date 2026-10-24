// Tool 18: Badge & Status Tag Generator (Interactive Showcase)
import { el, qs } from '../utils/dom.js';

export const meta = {
  id: 'badge-tag',
  name: 'Badge & Status Tag'
};

const PRESETS = [
  { text: 'Active', variant: 'dot', dotColor: '#22c55e', label: 'Online Status' },
  { text: 'Beta v2.4', variant: 'outline', label: 'Version Tag' },
  { text: 'Deprecated', variant: 'soft', dotColor: '#ef4444', label: 'Soft Warning' },
  { text: 'Enterprise', variant: 'solid', label: 'Solid Accent' },
  { text: '99+ Unread', variant: 'pill-counter', label: 'Numeric Count' }
];

let config = {
  text: 'Active',
  variant: 'dot', // solid, outline, soft, dot, pill-counter
  radius: 999, // 999 = pill, 6 = rounded, 0 = square
  fontSize: 12,
  dotColor: '#22c55e',
  showGallery: true
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
      gap: '32px',
      padding: '30px'
    }
  });

  const mainDisplay = el('div', { id: 'badge-main-display' });
  const showcaseRow = el('div', { id: 'badge-showcase-row', style: { width: '100%', maxWidth: '520px' } });

  centerStage.appendChild(mainDisplay);
  centerStage.appendChild(showcaseRow);
  previewStage.appendChild(centerStage);

  function getBadgeSnippet(cfg) {
    let extraCss = '';
    let dotHtml = '';

    if (cfg.variant === 'solid') {
      extraCss = 'background: var(--text-main); color: var(--bg-app); border: 1px solid var(--text-main);';
    } else if (cfg.variant === 'outline') {
      extraCss = 'background: transparent; color: var(--text-main); border: 1px solid var(--border-strong);';
    } else if (cfg.variant === 'soft') {
      extraCss = 'background: var(--bg-input-focus); color: var(--text-muted); border: 1px solid var(--border);';
    } else if (cfg.variant === 'dot') {
      extraCss = 'background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border);';
      dotHtml = `<span style="width:6px; height:6px; border-radius:50%; background:${cfg.dotColor || '#22c55e'}; display:inline-block; margin-right:6px;"></span>`;
    } else if (cfg.variant === 'pill-counter') {
      extraCss = 'background: var(--bg-input); color: var(--text-main); border: 1px solid var(--border-strong); font-family: var(--font-mono);';
    }

    const html = `<span class="ui-badge" style="display:inline-flex; align-items:center; padding:3px 10px; font-size:${cfg.fontSize || 12}px; font-weight:500; border-radius:${cfg.radius !== undefined ? cfg.radius : 999}px; letter-spacing:0.02em; ${extraCss}">${dotHtml}${cfg.text}</span>`;
    return { html, extraCss, dotHtml };
  }

  function renderBadge() {
    const { html: currentHtml, extraCss } = getBadgeSnippet(config);

    mainDisplay.innerHTML = `
      <div style="padding: 24px 36px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); display: flex; flex-direction: column; align-items: center; gap: 8px;">
        ${currentHtml}
        <span style="font-size: 0.7rem; color: var(--text-dim); font-family: var(--font-mono); margin-top: 4px;">Interactive Customizer</span>
      </div>
    `;

    // Render preset showcase gallery below
    showcaseRow.innerHTML = `
      <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 14px 18px;">
        <div style="font-size: 0.68rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-dim); margin-bottom: 12px;">Preset Archetypes (Click to load)</div>
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
      item.addEventListener('click', () => {
        const p = PRESETS[parseInt(item.dataset.idx, 10)];
        config.text = p.text;
        config.variant = p.variant;
        if (p.dotColor) config.dotColor = p.dotColor;
        renderControls();
        renderBadge();
      });
      item.addEventListener('mouseenter', () => { item.style.transform = 'translateY(-2px)'; });
      item.addEventListener('mouseleave', () => { item.style.transform = 'translateY(0)'; });
    });

    const css = `/* Huragon/ui — Badge / Tag */
.ui-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  font-size: ${config.fontSize}px;
  font-weight: 500;
  border-radius: ${config.radius}px;
  letter-spacing: 0.02em;
  ${extraCss}
}`;

    const tailwind = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-${config.radius > 50 ? 'full' : 'md'} text-xs font-medium border border-zinc-700 text-zinc-200">
  ${config.variant === 'dot' ? `<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>` : ''}${config.text}
</span>`;

    onCodeChange({ css, tailwind });
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const sec = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', textContent: 'Badge Settings' }),

      el('div', { className: 'control-group' }, [
        el('div', { className: 'control-label-row' }, [
          el('span', { className: 'control-label', textContent: 'Label Text' })
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
            renderBadge();
          }
        })
      ]),

      el('div', { className: 'control-group' }, [
        el('div', { className: 'control-label-row' }, [
          el('span', { className: 'control-label', textContent: 'Style Variant' })
        ]),
        el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' } }, [
          'dot', 'outline', 'solid', 'soft', 'pill-counter'
        ].map(v => el('button', {
          className: `btn ${config.variant === v ? 'btn-primary' : 'btn-outline'}`,
          style: { fontSize: '0.72rem', textTransform: 'capitalize', padding: '6px' },
          textContent: v === 'pill-counter' ? 'Counter' : v,
          onclick: () => {
            config.variant = v;
            renderControls();
            renderBadge();
          }
        })))
      ]),

      el('div', { className: 'control-group' }, [
        el('div', { className: 'control-label-row' }, [
          el('span', { className: 'control-label', textContent: 'Shape' })
        ]),
        el('div', { style: { display: 'flex', gap: '6px' } }, [
          { name: 'Pill', val: 999 },
          { name: 'Rounded', val: 6 },
          { name: 'Square', val: 0 }
        ].map(s => el('button', {
          className: `btn ${config.radius === s.val ? 'btn-primary' : 'btn-outline'}`,
          style: { flex: '1', fontSize: '0.72rem' },
          textContent: s.name,
          onclick: () => {
            config.radius = s.val;
            renderControls();
            renderBadge();
          }
        })))
      ]),

      el('div', { className: 'control-group' }, [
        el('div', { className: 'control-label-row' }, [
          el('span', { className: 'control-label', textContent: 'Font Size' }),
          el('span', { className: 'control-value', textContent: `${config.fontSize}px` })
        ]),
        el('input', {
          type: 'range',
          min: 10,
          max: 18,
          value: config.fontSize,
          oninput: (e) => {
            config.fontSize = parseInt(e.target.value, 10);
            renderBadge();
          }
        })
      ])
    ]);

    controlsStage.appendChild(sec);
  }

  renderControls();
  renderBadge();
}
