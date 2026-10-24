// Tool: Data Table Styler
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';

export const meta = {
  id: 'table-styler',
  name: 'Data Table Styler'
};

let config = {
  zebra: true,
  hoverHighlight: true,
  stickyHeader: true,
  density: 'normal', // 'compact', 'normal', 'relaxed'
  borders: 'horizontal', // 'horizontal', 'grid', 'none'
  borderRadius: 8
};

const ROWS = [
  { name: 'auth-service', env: 'Production', status: 'Active', latency: '42ms', qps: '1,420' },
  { name: 'payment-gateway', env: 'Production', status: 'Active', latency: '128ms', qps: '380' },
  { name: 'analytics-worker', env: 'Staging', status: 'Pending', latency: '85ms', qps: '95' },
  { name: 'notification-hub', env: 'Production', status: 'Active', latency: '64ms', qps: '850' },
  { name: 'image-optimizer', env: 'Deprecated', status: 'Revoked', latency: '210ms', qps: '12' }
];

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    id: 'table-preview-container',
    style: {
      width: '100%',
      maxWidth: '720px',
      overflowX: 'auto',
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
      el('h4', { className: 'control-section-title', textContent: 'Density & Padding' })
    ]),
    el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' } }, [
      createDensityBtn('Compact', 'compact'),
      createDensityBtn('Normal', 'normal'),
      createDensityBtn('Relaxed', 'relaxed')
    ]),

    el('div', { className: 'control-section-header' }, [
      el('h4', { className: 'control-section-title', textContent: 'Borders & Structure' })
    ]),
    el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' } }, [
      createBorderBtn('Horizontal', 'horizontal'),
      createBorderBtn('Full Grid', 'grid'),
      createBorderBtn('Borderless', 'none')
    ]),

    el('div', { className: 'control-section-header' }, [
      el('h4', { className: 'control-section-title', textContent: 'Table Features' })
    ]),
    createToggle('Zebra Striping', config.zebra, (v) => {
      config.zebra = v;
      update();
    }),
    createToggle('Row Hover Highlight', config.hoverHighlight, (v) => {
      config.hoverHighlight = v;
      update();
    }),
    createToggle('Sticky Header with Blur', config.stickyHeader, (v) => {
      config.stickyHeader = v;
      update();
    })
  ]);

  controlsStage.appendChild(section);

  function createDensityBtn(label, den) {
    return el('button', {
      className: `btn btn-outline ${config.density === den ? 'active' : ''}`,
      style: { fontSize: '0.75rem', padding: '6px 8px' },
      textContent: label,
      onclick: (e) => {
        config.density = den;
        controlsStage.querySelectorAll('.btn-outline').forEach(b => {
          if (['Compact', 'Normal', 'Relaxed'].includes(b.textContent.trim())) {
            b.classList.remove('active');
          }
        });
        e.currentTarget.classList.add('active');
        update();
      }
    });
  }

  function createBorderBtn(label, bdr) {
    return el('button', {
      className: `btn btn-outline ${config.borders === bdr ? 'active' : ''}`,
      style: { fontSize: '0.75rem', padding: '6px 8px' },
      textContent: label,
      onclick: (e) => {
        config.borders = bdr;
        controlsStage.querySelectorAll('.btn-outline').forEach(b => {
          if (['Horizontal', 'Full Grid', 'Borderless'].includes(b.textContent.trim())) {
            b.classList.remove('active');
          }
        });
        e.currentTarget.classList.add('active');
        update();
      }
    });
  }

  function update() {
    renderTable(centerStage);
    generateCode();
  }

  function renderTable(target) {
    const pad = config.density === 'compact' ? '6px 12px' : (config.density === 'relaxed' ? '14px 20px' : '10px 16px');
    const borderCell = config.borders === 'grid' ? 'border: 1px solid var(--border);' : (config.borders === 'horizontal' ? 'border-bottom: 1px solid var(--border);' : 'border: none;');

    target.innerHTML = `
      <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); overflow:hidden; box-shadow:var(--shadow-md);">
        <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.825rem;">
          <thead>
            <tr style="background:var(--bg-main); border-bottom:1px solid var(--border); ${config.stickyHeader ? 'position:sticky; top:0; z-index:2;' : ''}">
              <th style="padding:${pad}; color:var(--text-muted); font-weight:600; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.04em; ${borderCell}">Service</th>
              <th style="padding:${pad}; color:var(--text-muted); font-weight:600; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.04em; ${borderCell}">Environment</th>
              <th style="padding:${pad}; color:var(--text-muted); font-weight:600; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.04em; ${borderCell}">Status</th>
              <th style="padding:${pad}; color:var(--text-muted); font-weight:600; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.04em; ${borderCell}">Latency</th>
              <th style="padding:${pad}; color:var(--text-muted); font-weight:600; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.04em; text-align:right; ${borderCell}">Requests/s</th>
            </tr>
          </thead>
          <tbody>
            ${ROWS.map((row, idx) => {
              const bg = (config.zebra && idx % 2 === 1) ? 'background:rgba(255,255,255,0.02);' : 'background:transparent;';
              return `
                <tr class="huragon-table-row" style="${bg} transition:background 0.15s ease;">
                  <td style="padding:${pad}; font-weight:500; color:var(--text-main); font-family:var(--font-mono); ${borderCell}">${row.name}</td>
                  <td style="padding:${pad}; color:var(--text-muted); ${borderCell}">${row.env}</td>
                  <td style="padding:${pad}; ${borderCell}">
                    <span style="font-size:0.7rem; font-weight:500; padding:2px 8px; border-radius:999px; ${statusBadge(row.status)}">${row.status}</span>
                  </td>
                  <td style="padding:${pad}; color:var(--text-muted); font-family:var(--font-mono); ${borderCell}">${row.latency}</td>
                  <td style="padding:${pad}; text-align:right; font-family:var(--font-mono); color:var(--text-main); ${borderCell}">${row.qps}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

    if (config.hoverHighlight) {
      target.querySelectorAll('.huragon-table-row').forEach(tr => {
        tr.addEventListener('mouseenter', () => tr.style.background = 'var(--bg-card-hover)');
        tr.addEventListener('mouseleave', () => {
          const idx = Array.from(tr.parentElement.children).indexOf(tr);
          tr.style.background = (config.zebra && idx % 2 === 1) ? 'rgba(255,255,255,0.02)' : 'transparent';
        });
      });
    }
  }

  function statusBadge(status) {
    if (status === 'Active') {
      return 'background: rgba(34, 197, 94, 0.15); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.3);';
    } else if (status === 'Pending') {
      return 'background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3);';
    }
    return 'background: rgba(113, 113, 122, 0.15); color: #a1a1aa; border: 1px solid rgba(113, 113, 122, 0.3);';
  }

  function generateCode() {
    const pad = config.density === 'compact' ? '6px 12px' : (config.density === 'relaxed' ? '14px 20px' : '10px 16px');

    const css = `/* Modern Data Table */
.data-table-container {
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: ${config.borderRadius}px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.data-table th,
.data-table td {
  padding: ${pad};
  ${config.borders === 'grid' ? 'border: 1px solid var(--border);' : (config.borders === 'horizontal' ? 'border-bottom: 1px solid var(--border);' : '')}
}

.data-table th {
  background-color: var(--bg-surface);
  ${config.stickyHeader ? 'position: sticky;\n  top: 0;\n  z-index: 10;' : ''}
}

${config.zebra ? `.data-table tbody tr:nth-child(even) {\n  background-color: rgba(255, 255, 255, 0.02);\n}\n` : ''}${config.hoverHighlight ? `.data-table tbody tr:hover {\n  background-color: var(--bg-surface-hover);\n}` : ''}`;

    const tailwind = `<!-- Tailwind Data Table -->
<div class="overflow-x-auto rounded-lg border border-zinc-800">
  <table class="w-full text-left text-sm text-zinc-400">
    <thead class="bg-zinc-900 text-xs uppercase text-zinc-400 border-b border-zinc-800">
      <tr>
        <th class="px-4 py-3">Service</th>
        <th class="px-4 py-3">Status</th>
        <th class="px-4 py-3 text-right">Latency</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-zinc-800">
      <tr class="hover:bg-zinc-800/50">
        <td class="px-4 py-3 font-medium text-white">auth-service</td>
        <td class="px-4 py-3 text-green-400">Active</td>
        <td class="px-4 py-3 text-right">42ms</td>
      </tr>
    </tbody>
  </table>
</div>`;

    onCodeChange({ css, tailwind });
  }

  update();
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
