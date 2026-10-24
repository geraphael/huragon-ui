// Tool 18: Badge & Status Tag Generator
import { el, qs } from '../utils/dom.js';

export const meta = {
  id: 'badge-tag',
  name: 'Badge & Status Tag'
};

let config = {
  text: 'Active',
  variant: 'outline', // solid, outline, soft, dot
  radius: 999, // 999 = pill, 4 = rounded
  fontSize: 12,
  dotColor: '#22c55e'
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

  const badgeWrapper = el('div', { id: 'badge-display-box' });
  centerStage.appendChild(badgeWrapper);
  previewStage.appendChild(centerStage);

  function renderBadge() {
    let extraCss = '';
    let dotHtml = '';

    if (config.variant === 'solid') {
      extraCss = 'background: var(--text-main); color: var(--bg-app); border: 1px solid var(--text-main);';
    } else if (config.variant === 'outline') {
      extraCss = 'background: transparent; color: var(--text-main); border: 1px solid var(--border-strong);';
    } else if (config.variant === 'soft') {
      extraCss = 'background: var(--bg-input-focus); color: var(--text-muted); border: 1px solid var(--border);';
    } else if (config.variant === 'dot') {
      extraCss = 'background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border);';
      dotHtml = `<span style="width:6px; height:6px; border-radius:50%; background:${config.dotColor}; display:inline-block; margin-right:6px;"></span>`;
    }

    badgeWrapper.innerHTML = `
      <span class="ui-badge" style="display:inline-flex; align-items:center; padding:3px 10px; font-size:${config.fontSize}px; font-weight:500; border-radius:${config.radius}px; letter-spacing:0.02em; ${extraCss}">
        ${dotHtml}${config.text}
      </span>
    `;

    const css = `/* Huragon/ui — Badge / Tag */
.ui-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  font-size: ${config.fontSize}px;
  font-weight: 500;
  border-radius: ${config.radius}px;
  ${extraCss}
}`;

    const tailwind = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-${config.radius > 50 ? 'full' : 'md'} text-xs font-medium border border-zinc-700 text-zinc-200">
  ${config.text}
</span>`;

    onCodeChange({ css, tailwind });
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const sec = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', textContent: 'Badge Settings' }),

      el('div', { className: 'control-group' }, [
        el('div', { className: 'control-label-row' }, [
          el('span', { className: 'control-label', textContent: 'Badge Text' })
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
        el('div', { style: { display: 'flex', gap: '6px' } }, [
          'outline', 'solid', 'soft', 'dot'
        ].map(v => el('button', {
          className: `btn ${config.variant === v ? 'btn-primary' : 'btn-outline'}`,
          style: { flex: '1', fontSize: '0.72rem', textTransform: 'capitalize' },
          textContent: v,
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
      ])
    ]);

    controlsStage.appendChild(sec);
  }

  renderControls();
  renderBadge();
}
