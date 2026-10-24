// Tool 10: Toggle Switch & Custom Checkbox Generator (Interactive Switch, Selectable Card Grid & Segmented State)
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';

export const meta = {
  id: 'toggle-checkbox',
  name: 'Toggle & Checkbox'
};

let config = {
  mode: 'cards', // switch, cards, segmented
  width: 44,
  height: 24,
  radius: 24,
  checked: true
};

const CARD_OPTIONS = [
  { id: 'analytics', title: 'Telemetry & Analytics', desc: 'Collect anonymized node metrics and CPU cycle telemetry.', badge: 'Standard', checked: true },
  { id: 'routing', title: 'Automated Edge Routing', desc: 'Dynamically rebalance traffic across nearest regional clusters.', badge: 'Recommended', checked: true },
  { id: 'backups', title: 'Daily Snapshots', desc: 'Perform automated differential snapshot backup every 24 hours.', badge: 'Optional', checked: false },
  { id: 'alerts', title: 'Incident Pager Alerts', desc: 'Dispatch SMS and webhook payloads when latency crosses 250ms.', badge: 'Realtime', checked: false }
];

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    style: {
      width: '100%',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
      padding: '30px'
    }
  });

  const previewWrapper = el('div', {
    id: 'toggle-preview-wrapper',
    style: {
      width: '100%',
      maxWidth: config.mode === 'cards' ? '540px' : '360px',
      transition: 'all 0.2s ease'
    }
  });

  centerStage.appendChild(previewWrapper);

  const interactiveHint = el('div', {
    style: {
      fontSize: '0.75rem',
      color: 'var(--text-dim)',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    innerHTML: `${ICONS.sparkles} <span>Click any switch or card to toggle state and update CSS styles live</span>`
  });
  centerStage.appendChild(interactiveHint);

  previewStage.appendChild(centerStage);

  renderPreview();

  function renderPreview() {
    previewWrapper.innerHTML = '';
    previewWrapper.style.maxWidth = config.mode === 'cards' ? '540px' : '360px';

    if (config.mode === 'switch') {
      renderSwitch(previewWrapper);
    } else if (config.mode === 'cards') {
      renderSelectableCards(previewWrapper);
    } else if (config.mode === 'segmented') {
      renderSegmentedToggle(previewWrapper);
    }

    updateCode();
  }

  // 1. Single Accessible Switch
  function renderSwitch(target) {
    const box = el('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-card)',
        padding: '18px 24px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)'
      }
    });

    box.innerHTML = `
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
          background-color: var(--bg-input);
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
          background-color: var(--text-main);
          border-color: var(--text-main);
        }
        .custom-ui-switch input:checked + .switch-track::before {
          transform: translateX(${config.width - config.height}px);
          background-color: var(--bg-app);
        }
      </style>
      <div>
        <div style="font-size:0.875rem; font-weight:600; color:var(--text-main); margin-bottom:2px;">Production Telemetry</div>
        <div style="font-size:0.75rem; color:var(--text-dim);">Stream cluster events to external observability node</div>
      </div>
      <label class="custom-ui-switch">
        <input type="checkbox" ${config.checked ? 'checked' : ''} id="toggle-input-el">
        <span class="switch-track"></span>
      </label>
    `;

    const input = box.querySelector('#toggle-input-el');
    if (input) {
      input.onchange = (e) => {
        config.checked = e.target.checked;
        updateCode();
      };
    }

    target.appendChild(box);
  }

  // 2. Multi-Select Checkbox Card Grid (from Screenshot_20261024-061148.jpg Centipid review)
  function renderSelectableCards(target) {
    const wrap = el('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }
    });

    wrap.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
        <span style="font-size:0.72rem; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-dim);">Cluster Capabilities</span>
        <span id="cards-selected-count" style="font-size:0.72rem; color:var(--text-muted); font-weight:500;">
          ${CARD_OPTIONS.filter(c => c.checked).length} selected
        </span>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:10px;">
        ${CARD_OPTIONS.map(opt => `
          <div class="checkbox-feature-card ${opt.checked ? 'card-selected' : ''}" data-id="${opt.id}" style="padding:14px; background:var(--bg-card); border:1px solid ${opt.checked ? 'var(--text-main)' : 'var(--border)'}; border-radius:10px; cursor:pointer; transition:all 0.16s ease; display:flex; flex-direction:column; gap:8px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <div style="display:flex; align-items:center; gap:8px;">
                <input type="checkbox" class="feature-card-cb" ${opt.checked ? 'checked' : ''} style="cursor:pointer;" />
                <span style="font-size:0.85rem; font-weight:600; color:var(--text-main);">${opt.title}</span>
              </div>
              <span style="font-size:0.65rem; padding:1px 6px; border-radius:4px; background:var(--bg-input); border:1px solid var(--border); color:var(--text-dim); font-weight:500;">${opt.badge}</span>
            </div>
            <p style="font-size:0.75rem; color:var(--text-muted); line-height:1.45; margin:0;">${opt.desc}</p>
          </div>
        `).join('')}
      </div>
    `;

    // Interactive toggle per card
    const cardEls = wrap.querySelectorAll('.checkbox-feature-card');
    cardEls.forEach(card => {
      card.onclick = (e) => {
        const id = card.dataset.id;
        const opt = CARD_OPTIONS.find(c => c.id === id);
        if (!opt) return;

        if (e.target.tagName !== 'INPUT') {
          opt.checked = !opt.checked;
        } else {
          opt.checked = e.target.checked;
        }

        renderSelectableCards(target);
        updateCode();
      };
    });

    target.appendChild(wrap);
  }

  // 3. Segmented Pill Switcher (Import / Export)
  function renderSegmentedToggle(target) {
    const wrap = el('div', {
      style: {
        background: 'var(--bg-card)',
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }
    });

    let activePill = 'Import';

    wrap.innerHTML = `
      <div style="font-size:0.875rem; font-weight:600; color:var(--text-main);">Data Direction Switcher</div>
      <div class="segmented-pill-bar" id="direction-segmented">
        <button class="segmented-pill-btn active" data-val="Import">Import Data</button>
        <button class="segmented-pill-btn" data-val="Export">Export Data</button>
      </div>
      <div id="direction-info" style="font-size:0.75rem; color:var(--text-muted); text-align:center;">
        Receiving incoming payload packets from external edge routers.
      </div>
    `;

    const btns = wrap.querySelectorAll('.segmented-pill-btn');
    const info = wrap.querySelector('#direction-info');
    btns.forEach(b => {
      b.onclick = () => {
        btns.forEach(btn => btn.classList.remove('active'));
        b.classList.add('active');
        activePill = b.dataset.val;
        if (info) {
          info.textContent = activePill === 'Import'
            ? 'Receiving incoming payload packets from external edge routers.'
            : 'Exporting telemetry CSV reports to connected cloud storage.';
        }
      };
    });

    target.appendChild(wrap);
  }

  function updateCode() {
    let css = '';
    let tailwind = '';

    if (config.mode === 'cards') {
      css = `/* Huragon/ui — Interactive Checkbox Card */
.checkbox-card {
  padding: 14px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.16s ease;
}

.checkbox-card.selected {
  border-color: var(--text-main);
  box-shadow: 0 0 0 1px var(--text-main);
}`;
      tailwind = `<div class="p-3.5 bg-zinc-900 border border-zinc-800 rounded-lg cursor-pointer transition-all hover:border-zinc-700">
  <div class="flex items-center gap-2">
    <input type="checkbox" class="rounded border-zinc-700" />
    <span class="text-sm font-semibold text-zinc-100">Feature Option</span>
  </div>
</div>`;
    } else {
      css = `/* Huragon/ui — Accessible Switch */
.custom-switch {
  position: relative;
  display: inline-block;
  width: ${config.width}px;
  height: ${config.height}px;
}

.switch-track {
  position: absolute;
  inset: 0;
  background-color: var(--bg-input);
  border-radius: ${config.radius}px;
  transition: background-color 0.2s ease;
}`;
      tailwind = `<label class="relative inline-block w-11 h-6">
  <input type="checkbox" class="sr-only peer" />
  <span class="absolute inset-0 bg-zinc-800 rounded-full peer-checked:bg-zinc-100 transition-colors"></span>
</label>`;
    }

    onCodeChange({ css, tailwind });
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const sec = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', textContent: 'Toggle Archetype' }),

      el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '16px' } }, [
        { id: 'cards', name: 'Card Grids' },
        { id: 'switch', name: 'Switch' },
        { id: 'segmented', name: 'Segmented' }
      ].map(m => el('button', {
        className: `btn ${config.mode === m.id ? 'btn-primary' : 'btn-outline'}`,
        style: { padding: '6px 4px', fontSize: '0.72rem' },
        textContent: m.name,
        onclick: () => {
          config.mode = m.id;
          renderControls();
          renderPreview();
        }
      }))),

      ...(config.mode === 'switch' ? [
        el('div', { className: 'section-title', textContent: 'Dimensions' }),
        createSlider('Width', config.width, 32, 64, (v) => { config.width = v; renderPreview(); }, 'px'),
        createSlider('Height', config.height, 16, 36, (v) => { config.height = v; renderPreview(); }, 'px')
      ] : [])
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
}
