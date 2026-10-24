// Tool: Media Query & Container Query Breakpoint Studio
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';

export const meta = {
  id: 'media-query',
  name: 'Media Query Builder'
};

let config = {
  type: 'min-width', // 'min-width', 'max-width', 'range', 'container'
  breakpoint: 768,
  rangeMax: 1024,
  prefersDark: false,
  reducedMotion: false
};

const BREAKPOINT_PRESETS = [
  { name: 'sm (640px)', val: 640 },
  { name: 'md (768px)', val: 768 },
  { name: 'lg (1024px)', val: 1024 },
  { name: 'xl (1280px)', val: 1280 },
  { name: '2xl (1536px)', val: 1536 }
];

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    id: 'media-query-preview-container',
    style: {
      width: '100%',
      maxWidth: '680px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }
  });

  previewStage.appendChild(centerStage);

  // Controls
  controlsStage.innerHTML = '';

  const section = el('div', { className: 'control-section' }, [
    el('div', { className: 'control-section-header' }, [
      el('h4', { className: 'control-section-title', textContent: 'Query Strategy' })
    ]),
    el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '16px' } }, [
      createTypeBtn('Mobile First (min-width)', 'min-width'),
      createTypeBtn('Desktop First (max-width)', 'max-width'),
      createTypeBtn('Modern Range Syntax', 'range'),
      createTypeBtn('Container Query (@container)', 'container')
    ]),

    el('div', { className: 'control-section-header' }, [
      el('h4', { className: 'control-section-title', textContent: 'Standard Breakpoints' })
    ]),
    el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '14px' } },
      BREAKPOINT_PRESETS.map(p => el('button', {
        className: `btn btn-outline ${config.breakpoint === p.val ? 'active' : ''}`,
        style: { fontSize: '0.75rem', padding: '6px' },
        textContent: p.name,
        onclick: (e) => {
          config.breakpoint = p.val;
          controlsStage.querySelectorAll('.btn-outline').forEach(b => {
            if (b.textContent.includes('px)')) b.classList.remove('active');
          });
          e.currentTarget.classList.add('active');
          update();
        }
      }))
    ),

    el('div', { className: 'control-section-header' }, [
      el('h4', { className: 'control-section-title', textContent: 'Custom Width Limits' })
    ]),
    createSlider('Breakpoint Width', 320, 1920, 10, config.breakpoint, 'px', (v) => {
      config.breakpoint = v;
      update();
    }),
    createSlider('Range Upper Limit', 480, 2560, 10, config.rangeMax, 'px', (v) => {
      config.rangeMax = v;
      update();
    }),

    el('div', { className: 'control-section-header', style: { marginTop: '14px' } }, [
      el('h4', { className: 'control-section-title', textContent: 'Accessibility Modifiers' })
    ]),
    createToggle('prefers-color-scheme: dark', config.prefersDark, (v) => {
      config.prefersDark = v;
      update();
    }),
    createToggle('prefers-reduced-motion: reduce', config.reducedMotion, (v) => {
      config.reducedMotion = v;
      update();
    })
  ]);

  controlsStage.appendChild(section);

  function createTypeBtn(label, t) {
    return el('button', {
      className: `btn btn-outline ${config.type === t ? 'active' : ''}`,
      style: { fontSize: '0.75rem', padding: '6px 8px' },
      textContent: label,
      onclick: (e) => {
        config.type = t;
        controlsStage.querySelectorAll('.btn-outline').forEach(b => {
          if (['Mobile First (min-width)', 'Desktop First (max-width)', 'Modern Range Syntax', 'Container Query (@container)'].includes(b.textContent.trim())) {
            b.classList.remove('active');
          }
        });
        e.currentTarget.classList.add('active');
        update();
      }
    });
  }

  function update() {
    renderView(centerStage);
    generateCode();
  }

  function renderView(target) {
    target.innerHTML = `
      <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:24px; box-shadow:var(--shadow-md);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <div>
            <h3 style="font-size:1.05rem; font-weight:600; color:var(--text-main); margin-bottom:4px;">Responsive Breakpoint Spectrum</h3>
            <span style="font-size:0.75rem; color:var(--text-muted);">Visual ruler across common viewport boundaries</span>
          </div>
          <span style="font-size:0.8rem; font-family:var(--font-mono); color:var(--text-main); background:var(--bg-main); padding:4px 10px; border-radius:4px; border:1px solid var(--border);">
            ${config.breakpoint}px
          </span>
        </div>

        <!-- Spectrum Visualizer -->
        <div style="width:100%; height:40px; background:var(--bg-main); border:1px solid var(--border); border-radius:var(--radius-sm); position:relative; overflow:hidden; margin-bottom:20px;">
          <!-- Marks -->
          <div style="position:absolute; left:33%; top:0; bottom:0; width:1px; background:var(--border);"></div>
          <div style="position:absolute; left:53%; top:0; bottom:0; width:1px; background:var(--border);"></div>
          <div style="position:absolute; left:67%; top:0; bottom:0; width:1px; background:var(--border);"></div>

          <!-- Highlight Trigger Range -->
          <div style="position:absolute; left:0; width:${Math.min(100, (config.breakpoint / 1536) * 100)}%; top:0; bottom:0; background:rgba(255, 255, 255, 0.08); border-right:2px solid #ffffff;"></div>

          <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:space-between; padding:0 12px; font-size:0.7rem; font-family:var(--font-mono); color:var(--text-muted); pointer-events:none;">
            <span>320px</span>
            <span>640px</span>
            <span>768px</span>
            <span>1024px</span>
            <span>1536px</span>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; font-size:0.8rem;">
          <div style="background:var(--bg-main); padding:12px; border-radius:var(--radius-sm); border:1px solid var(--border);">
            <div style="font-size:0.7rem; color:var(--text-muted); margin-bottom:4px;">Target Device</div>
            <div style="font-weight:600; color:var(--text-main);">${getDeviceName(config.breakpoint)}</div>
          </div>
          <div style="background:var(--bg-main); padding:12px; border-radius:var(--radius-sm); border:1px solid var(--border);">
            <div style="font-size:0.7rem; color:var(--text-muted); margin-bottom:4px;">Rem Equivalent</div>
            <div style="font-weight:600; color:var(--text-main); font-family:var(--font-mono);">${(config.breakpoint / 16).toFixed(2)}rem</div>
          </div>
          <div style="background:var(--bg-main); padding:12px; border-radius:var(--radius-sm); border:1px solid var(--border);">
            <div style="font-size:0.7rem; color:var(--text-muted); margin-bottom:4px;">Tailwind Token</div>
            <div style="font-weight:600; color:var(--text-main); font-family:var(--font-mono);">${getTailwindToken(config.breakpoint)}</div>
          </div>
        </div>
      </div>
    `;
  }

  function getDeviceName(w) {
    if (w < 640) return 'Mobile Handset';
    if (w < 768) return 'Large Mobile / Phablet';
    if (w < 1024) return 'Tablet (Portrait)';
    if (w < 1280) return 'Tablet (Landscape) / Small Laptop';
    return 'Desktop Monitor';
  }

  function getTailwindToken(w) {
    if (w <= 640) return 'sm:';
    if (w <= 768) return 'md:';
    if (w <= 1024) return 'lg:';
    if (w <= 1280) return 'xl:';
    return '2xl:';
  }

  function generateCode() {
    let queryHead = '';
    let twPrefix = getTailwindToken(config.breakpoint);

    if (config.type === 'min-width') {
      queryHead = `@media (min-width: ${config.breakpoint}px)`;
    } else if (config.type === 'max-width') {
      queryHead = `@media (max-width: ${config.breakpoint}px)`;
    } else if (config.type === 'range') {
      queryHead = `@media (${config.breakpoint}px <= width <= ${config.rangeMax}px)`;
    } else {
      queryHead = `@container (min-width: ${config.breakpoint}px)`;
    }

    if (config.prefersDark) {
      queryHead += ' and (prefers-color-scheme: dark)';
    }
    if (config.reducedMotion) {
      queryHead += ' and (prefers-reduced-motion: reduce)';
    }

    const css = `/* Huragon/ui Breakpoint Rule */
${queryHead} {
  .responsive-element {
    /* Styles applied at this breakpoint */
    padding: 2rem;
    display: flex;
  }
}`;

    const tailwind = `<!-- Tailwind Breakpoint Responsive Syntax -->
<div class="p-4 ${twPrefix}p-8 flex-col ${twPrefix}flex-row">
  ...
</div>`;

    onCodeChange({ css, tailwind });
  }

  function createSlider(label, min, max, step, initial, unit, onChange) {
    const wrapper = el('div', { className: 'control-item' });
    const row = el('div', { className: 'control-label-row' }, [
      el('label', { className: 'control-label', textContent: label }),
      el('span', { className: 'control-value', textContent: `${initial}${unit}` })
    ]);
    const valSpan = row.querySelector('.control-value');
    const slider = el('input', {
      type: 'range',
      min,
      max,
      step,
      value: initial,
      oninput: (e) => {
        const v = parseFloat(e.target.value);
        valSpan.textContent = `${v}${unit}`;
        onChange(v);
      }
    });

    wrapper.appendChild(row);
    wrapper.appendChild(slider);
    return wrapper;
  }

  function createToggle(label, initial, onChange) {
    const wrapper = el('div', { className: 'control-item', style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' } });
    const lbl = el('label', { className: 'control-label', textContent: label });
    const chk = el('input', {
      type: 'checkbox',
      checked: initial,
      style: { cursor: 'pointer', width: '16px', height: '16px', accentColor: '#ffffff' },
      onchange: (e) => onChange(e.target.checked)
    });

    wrapper.appendChild(lbl);
    wrapper.appendChild(chk);
    return wrapper;
  }

  update();
}
