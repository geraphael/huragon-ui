// Tool: Avatar & Avatar Stack Generator
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';

export const meta = {
  id: 'avatar-stack',
  name: 'Avatar & Avatar Stack'
};

let config = {
  size: 44,
  overlap: -12,
  ringWidth: 3,
  ringColor: '#09090b',
  shape: 'circle', // 'circle', 'rounded'
  showStatus: true,
  hoverLift: true,
  count: 5,
  overflowCount: 4
};

const AVATAR_DATA = [
  { initials: 'JH', bg: '#27272a', text: '#e4e4e7', status: 'online' },
  { initials: 'AL', bg: '#3f3f46', text: '#ffffff', status: 'online' },
  { initials: 'SK', bg: '#18181b', text: '#a1a1aa', status: 'idle' },
  { initials: 'MR', bg: '#52525b', text: '#ffffff', status: 'offline' },
  { initials: 'TC', bg: '#27272a', text: '#d4d4d8', status: 'online' }
];

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    id: 'avatar-preview-container',
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px',
      padding: '40px',
      width: '100%'
    }
  });

  previewStage.appendChild(centerStage);

  // Controls
  controlsStage.innerHTML = '';

  const section = el('div', { className: 'control-section' }, [
    el('div', { className: 'control-section-header' }, [
      el('h4', { className: 'control-section-title', textContent: 'Dimensions & Spacing' })
    ]),
    createSlider('Avatar Size', 28, 64, 4, config.size, 'px', (v) => {
      config.size = v;
      update();
    }),
    createSlider('Stack Overlap', -24, 0, 2, config.overlap, 'px', (v) => {
      config.overlap = v;
      update();
    }),
    createSlider('Ring Thickness', 1, 5, 1, config.ringWidth, 'px', (v) => {
      config.ringWidth = v;
      update();
    }),

    el('div', { className: 'control-section-header', style: { marginTop: '16px' } }, [
      el('h4', { className: 'control-section-title', textContent: 'Shape & Style' })
    ]),
    el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' } }, [
      createShapeBtn('Circle', 'circle'),
      createShapeBtn('Rounded Squircle', 'rounded')
    ]),

    createToggle('Presence Indicator Dot', config.showStatus, (v) => {
      config.showStatus = v;
      update();
    }),
    createToggle('Hover Elevation Physics', config.hoverLift, (v) => {
      config.hoverLift = v;
      update();
    })
  ]);

  controlsStage.appendChild(section);

  function createShapeBtn(label, shp) {
    return el('button', {
      className: `btn btn-outline ${config.shape === shp ? 'active' : ''}`,
      style: { fontSize: '0.8rem', padding: '6px 10px' },
      textContent: label,
      onclick: (e) => {
        config.shape = shp;
        controlsStage.querySelectorAll('.btn-outline').forEach(b => {
          if (['Circle', 'Rounded Squircle'].includes(b.textContent.trim())) {
            b.classList.remove('active');
          }
        });
        e.currentTarget.classList.add('active');
        update();
      }
    });
  }

  function update() {
    renderStack(centerStage);
    generateCode();
  }

  function renderStack(target) {
    const radius = config.shape === 'circle' ? '50%' : '10px';
    const dotSize = Math.max(8, Math.round(config.size * 0.24));

    let hoverStyle = '';
    if (config.hoverLift) {
      hoverStyle = `
        .huragon-avatar-item {
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), z-index 0.2s;
        }
        .huragon-avatar-item:hover {
          transform: translateY(-4px) scale(1.1);
          z-index: 20 !important;
        }
      `;
    }

    let styleEl = qs('#avatar-stack-style');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'avatar-stack-style';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = hoverStyle;

    target.innerHTML = `
      <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:32px; box-shadow:var(--shadow-md); display:flex; flex-direction:column; align-items:center; gap:16px;">
        <!-- Stack -->
        <div style="display:flex; align-items:center;">
          ${AVATAR_DATA.slice(0, 4).map((av, idx) => `
            <div class="huragon-avatar-item" style="width:${config.size}px; height:${config.size}px; border-radius:${radius}; background:${av.bg}; color:${av.text}; border:${config.ringWidth}px solid var(--bg-card); display:flex; align-items:center; justify-content:center; font-weight:600; font-size:${Math.round(config.size * 0.36)}px; margin-left:${idx === 0 ? '0' : config.overlap + 'px'}; position:relative; cursor:pointer; box-shadow:0 1px 3px rgba(0,0,0,0.2); z-index:${idx};">
              ${av.initials}
              ${config.showStatus ? `
                <span style="position:absolute; bottom:-1px; right:-1px; width:${dotSize}px; height:${dotSize}px; border-radius:50%; background:${av.status === 'online' ? '#22c55e' : (av.status === 'idle' ? '#f59e0b' : '#71717a')}; border:${Math.max(1.5, config.ringWidth * 0.7)}px solid var(--bg-card);"></span>
              ` : ''}
            </div>
          `).join('')}

          <!-- Overflow Counter Pill -->
          <div class="huragon-avatar-item" style="width:${config.size}px; height:${config.size}px; border-radius:${radius}; background:var(--bg-card-hover); color:var(--text-muted); border:${config.ringWidth}px solid var(--bg-card); display:flex; align-items:center; justify-content:center; font-weight:600; font-size:${Math.round(config.size * 0.32)}px; margin-left:${config.overlap}px; cursor:pointer; z-index:10; font-family:var(--font-mono);">
            +${config.overflowCount}
          </div>
        </div>

        <div style="text-align:center;">
          <span style="font-size:0.85rem; font-weight:500; color:var(--text-main);">Active Contributors</span>
          <p style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">Overlapping stack with negative margins & cut-out rings</p>
        </div>
      </div>
    `;
  }

  function generateCode() {
    const radius = config.shape === 'circle' ? '50%' : '10px';

    const css = `/* Avatar Overlapping Stack */
.avatar-stack {
  display: flex;
  align-items: center;
}

.avatar-item {
  width: ${config.size}px;
  height: ${config.size}px;
  border-radius: ${radius};
  border: ${config.ringWidth}px solid var(--bg-surface);
  margin-left: ${config.overlap}px;
  position: relative;
  ${config.hoverLift ? `transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);\n}\n\n.avatar-item:hover {\n  transform: translateY(-4px) scale(1.1);\n  z-index: 10;\n}` : '}'}

.avatar-item:first-child {
  margin-left: 0;
}`;

    const tailwind = `<!-- Tailwind Avatar Group -->
<div class="flex -space-x-3 overflow-hidden p-2">
  <div class="inline-block h-10 w-10 rounded-full ring-2 ring-zinc-950 bg-zinc-800 text-white flex items-center justify-center font-medium text-xs">JH</div>
  <div class="inline-block h-10 w-10 rounded-full ring-2 ring-zinc-950 bg-zinc-700 text-white flex items-center justify-center font-medium text-xs">AL</div>
  <div class="inline-block h-10 w-10 rounded-full ring-2 ring-zinc-950 bg-zinc-900 text-zinc-400 flex items-center justify-center font-medium text-xs">+4</div>
</div>`;

    onCodeChange({ css, tailwind });
  }

  update();
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
