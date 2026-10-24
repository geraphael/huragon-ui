// Tool: HeroUI Avatar & Interactive Avatar Stack
// Overlapping avatars, online status indicators, and interactive user hover card popovers
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';
import { copyToClipboard } from '../clipboard.js';

export const meta = {
  id: 'avatar-stack',
  name: 'Avatar & Avatar Stack'
};

let config = {
  size: 46,
  overlap: -12,
  ringWidth: 3,
  shape: 'circle', // 'circle', 'rounded'
  showStatus: true,
  hoverCard: true,
  overflowCount: 4
};

const AVATAR_DATA = [
  { initials: 'SC', name: 'Sarah Connor', role: 'Staff Systems Architect', email: 'sarah.c@acme.dev', status: 'online' },
  { initials: 'AL', name: 'Alex Rivera', role: 'Principal Designer', email: 'alex.r@acme.dev', status: 'online' },
  { initials: 'SK', name: 'Samantha Kim', role: 'Product Manager', email: 'samantha.k@acme.dev', status: 'idle' },
  { initials: 'MR', name: 'Marcus Reid', role: 'Backend Engineer', email: 'marcus.r@acme.dev', status: 'offline' },
  { initials: 'TC', name: 'Taylor Chen', role: 'Security Ops', email: 'taylor.c@acme.dev', status: 'online' }
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
      gap: '30px',
      padding: '40px 20px 60px',
      width: '100%',
      minHeight: '100%'
    }
  });

  const previewBox = el('div', {
    style: {
      padding: '40px 50px',
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

  const stackContainer = el('div', { id: 'avatar-stack-render' });
  const hint = el('div', {
    style: { fontSize: '0.72rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px' },
    innerHTML: `<span>Hover over any avatar to preview the user card popover</span>`
  });

  previewBox.appendChild(stackContainer);
  previewBox.appendChild(hint);
  centerStage.appendChild(previewBox);
  previewStage.appendChild(centerStage);

  renderControls();
  renderStack();

  function renderControls() {
    controlsStage.innerHTML = '';

    const section = el('div', { className: 'control-section' }, [
      el('div', { className: 'control-section-header' }, [
        el('h4', { className: 'control-section-title', textContent: 'Dimensions & Spacing' })
      ]),
      createSlider('Avatar Size', 32, 64, 2, config.size, 'px', (v) => {
        config.size = v;
        renderStack();
      }),
      createSlider('Stack Overlap', -24, 0, 2, config.overlap, 'px', (v) => {
        config.overlap = v;
        renderStack();
      }),
      createSlider('Ring Thickness', 1, 5, 1, config.ringWidth, 'px', (v) => {
        config.ringWidth = v;
        renderStack();
      }),

      el('div', { className: 'control-section-header', style: { marginTop: '16px' } }, [
        el('h4', { className: 'control-section-title', textContent: 'Shape & Features' })
      ]),
      el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' } }, [
        createShapeBtn('Circle', 'circle'),
        createShapeBtn('Squircle', 'rounded')
      ]),

      createToggle('Presence Indicator Dot', config.showStatus, (v) => {
        config.showStatus = v;
        renderStack();
      }),
      createToggle('Interactive Hover Popover', config.hoverCard, (v) => {
        config.hoverCard = v;
        renderStack();
      })
    ]);

    controlsStage.appendChild(section);
  }

  function createShapeBtn(label, shp) {
    return el('button', {
      className: `btn btn-outline ${config.shape === shp ? 'active' : ''}`,
      style: { fontSize: '0.78rem', padding: '6px 10px' },
      textContent: label,
      onclick: () => {
        config.shape = shp;
        renderControls();
        renderStack();
      }
    });
  }

  function renderStack() {
    const isCircle = config.shape === 'circle';
    const borderRadius = isCircle ? '50%' : '10px';
    const s = config.size;

    stackContainer.innerHTML = `
      <style>
        .avatar-hover-wrapper {
          position: relative;
          display: inline-flex;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), z-index 0.2s;
        }
        .avatar-hover-wrapper:hover {
          transform: translateY(-4px) scale(1.08);
          z-index: 50 !important;
        }
        .avatar-user-popover {
          position: absolute;
          bottom: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%) scale(0.95);
          width: 220px;
          background: var(--bg-card);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-md);
          padding: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          pointer-events: none;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.18s ease, transform 0.18s ease;
          z-index: 100;
        }
        .avatar-hover-wrapper:hover .avatar-user-popover {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) scale(1);
        }
      </style>

      <div style="display:flex; align-items:center;">
        ${AVATAR_DATA.map((u, i) => `
          <div class="avatar-hover-wrapper" style="margin-left:${i === 0 ? '0' : `${config.overlap}px`}; z-index:${10 - i};">
            <div style="width:${s}px; height:${s}px; border-radius:${borderRadius}; background:var(--bg-input); border:${config.ringWidth}px solid var(--bg-card); display:flex; align-items:center; justify-content:center; font-weight:700; color:var(--text-main); font-size:${Math.round(s * 0.36)}px; position:relative; box-shadow:0 2px 4px rgba(0,0,0,0.15); cursor:pointer;">
              ${u.initials}

              ${config.showStatus ? `
                <span style="position:absolute; bottom:0; right:0; width:${Math.max(8, Math.round(s * 0.24))}px; height:${Math.max(8, Math.round(s * 0.24))}px; border-radius:50%; background:${u.status === 'online' ? '#22c55e' : u.status === 'idle' ? '#eab308' : '#71717a'}; border:2px solid var(--bg-card);"></span>
              ` : ''}
            </div>

            <!-- Popover Card -->
            ${config.hoverCard ? `
              <div class="avatar-user-popover">
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                  <div style="width:28px; height:28px; border-radius:${borderRadius}; background:var(--bg-input); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.75rem; color:var(--text-main);">
                    ${u.initials}
                  </div>
                  <div style="overflow:hidden;">
                    <div style="font-size:0.78rem; font-weight:600; color:var(--text-main); white-space:nowrap; text-overflow:ellipsis; overflow:hidden;">${u.name}</div>
                    <div style="font-size:0.68rem; color:var(--text-dim); white-space:nowrap; text-overflow:ellipsis; overflow:hidden;">${u.role}</div>
                  </div>
                </div>
                <div style="font-size:0.68rem; color:var(--text-muted); font-family:var(--font-mono); margin-bottom:6px;">${u.email}</div>
                <div style="display:flex; align-items:center; gap:4px; font-size:0.68rem; color:${u.status === 'online' ? '#22c55e' : 'var(--text-dim)'}; font-weight:500;">
                  <span style="width:5px; height:5px; border-radius:50%; background:currentColor; display:inline-block;"></span>
                  <span>${u.status === 'online' ? 'Available now' : u.status === 'idle' ? 'Away' : 'Offline'}</span>
                </div>
              </div>
            ` : ''}
          </div>
        `).join('')}

        <!-- Overflow Count Badge -->
        <div style="margin-left:${config.overlap}px; z-index:4;">
          <div style="width:${s}px; height:${s}px; border-radius:${borderRadius}; background:var(--bg-card); border:${config.ringWidth}px solid var(--bg-card); display:flex; align-items:center; justify-content:center; font-weight:700; color:var(--text-muted); font-size:${Math.round(s * 0.32)}px; box-shadow:0 2px 4px rgba(0,0,0,0.15); cursor:pointer;" title="${config.overflowCount} more members">
            +${config.overflowCount}
          </div>
        </div>
      </div>
    `;

    generateCode();
  }

  function generateCode() {
    const isCircle = config.shape === 'circle';
    const borderRadius = isCircle ? '9999px' : '10px';

    const css = `/* HeroUI Avatar Stack */
.avatar-stack {
  display: flex;
  align-items: center;
}

.avatar-item {
  position: relative;
  width: ${config.size}px;
  height: ${config.size}px;
  border-radius: ${borderRadius};
  border: ${config.ringWidth}px solid var(--bg-card);
  background: var(--bg-input);
  margin-left: ${config.overlap}px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.avatar-item:first-child {
  margin-left: 0;
}

.avatar-item:hover {
  transform: translateY(-4px) scale(1.08);
  z-index: 50;
}`;

    const tailwind = `<!-- shadcn / HeroUI Avatar Stack -->
<div class="flex items-center -space-x-3">
  <div class="relative inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-zinc-100 font-semibold text-zinc-900 shadow-sm transition-transform hover:-translate-y-1 hover:scale-105 hover:z-10 dark:border-zinc-950 dark:bg-zinc-800 dark:text-zinc-100">
    SC
    <span class="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-950"></span>
  </div>
  <div class="relative inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-zinc-100 font-semibold text-zinc-900 shadow-sm transition-transform hover:-translate-y-1 hover:scale-105 hover:z-10 dark:border-zinc-950 dark:bg-zinc-800 dark:text-zinc-100">
    AL
  </div>
  <div class="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-zinc-200 text-xs font-bold text-zinc-700 dark:border-zinc-950 dark:bg-zinc-800 dark:text-zinc-300">
    +4
  </div>
</div>`;

    const react = `// React / Tailwind Avatar Stack
import React from 'react';

export function AvatarStack({ users = ['SC', 'AL', 'SK'], overflow = 4 }) {
  return (
    <div className="flex items-center -space-x-3">
      {users.map((initials, idx) => (
        <div key={idx} className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-white dark:border-zinc-950 bg-zinc-100 dark:bg-zinc-800 font-semibold text-zinc-900 dark:text-zinc-100 transition hover:-translate-y-1 hover:scale-105 hover:z-10">
          {initials}
        </div>
      ))}
      {overflow > 0 && (
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-white dark:border-zinc-950 bg-zinc-200 dark:bg-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300">
          +{overflow}
        </div>
      )}
    </div>
  );
}`;

    onCodeChange({ css, tailwind, react });
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
