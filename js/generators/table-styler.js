// Tool 29: Table & Data Grid Styler (SaaS Management Data Table with live filtering, bulk selection & sorting)
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';

export const meta = {
  id: 'table-styler',
  name: 'Data Table Studio'
};

const INITIAL_ROWS = [
  { id: 1, name: '1 Hour Premium', sub: 'PPPoE', offer: '$50', offerBadge: 'Standard', validity: '1 hour', speedDown: '25M', speedUp: '25M', routers: 'Router A', status: 'Active' },
  { id: 2, name: '24 Hour Pass', sub: 'Hotspot', offer: '$100', offerBadge: 'Unlimited', validity: '24 hours', speedDown: '50M', speedUp: '20M', routers: 'All routers', status: 'Inactive' },
  { id: 3, name: '5 mintest', sub: 'Hotspot', offer: '$2', offerBadge: 'Unlimited', validity: '5 minutes', speedDown: '15M', speedUp: '15M', routers: 'All routers', status: 'Active' },
  { id: 4, name: 'Weekly Heavy', sub: 'PPPoE', offer: '$450', offerBadge: 'High Bandwidth', validity: '7 days', speedDown: '100M', speedUp: '50M', routers: 'Router B', status: 'Active' }
];

let stateTable = {
  filter: 'All',
  searchQuery: '',
  selectedIds: new Set([1]),
  sortCol: 'name',
  sortAsc: true
};

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
      padding: '24px',
      gap: '16px'
    }
  });

  const tableContainer = el('div', {
    id: 'interactive-saas-table-box',
    style: {
      width: '100%',
      maxWidth: '780px',
      margin: '0 auto',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-md)'
    }
  });

  centerStage.appendChild(tableContainer);
  previewStage.appendChild(centerStage);

  renderTable();

  function renderTable() {
    let rows = [...INITIAL_ROWS];

    // Filter
    if (stateTable.filter !== 'All') {
      rows = rows.filter(r => r.status.toLowerCase() === stateTable.filter.toLowerCase());
    }

    // Search
    if (stateTable.searchQuery) {
      const q = stateTable.searchQuery.toLowerCase();
      rows = rows.filter(r => r.name.toLowerCase().includes(q) || r.sub.toLowerCase().includes(q) || r.routers.toLowerCase().includes(q));
    }

    // Sort
    rows.sort((a, b) => {
      const vA = a[stateTable.sortCol];
      const vB = b[stateTable.sortCol];
      return stateTable.sortAsc ? (vA > vB ? 1 : -1) : (vA < vB ? 1 : -1);
    });

    const allSelected = rows.length > 0 && rows.every(r => stateTable.selectedIds.has(r.id));
    const hasSelection = stateTable.selectedIds.size > 0;

    tableContainer.innerHTML = `
      <!-- Toolbar Header (Inspiration: Screenshot_20261024-154952.jpg) -->
      <div style="padding:12px 16px; border-bottom:1px solid var(--border); display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:10px; background:var(--bg-panel);">
        <div style="display:flex; align-items:center; gap:6px;">
          ${['All', 'Active', 'Inactive'].map(f => `
            <button class="table-filter-pill ${stateTable.filter === f ? 'active' : ''}" data-filter="${f}" style="padding:4px 10px; font-size:0.75rem; border-radius:999px; border:1px solid ${stateTable.filter === f ? 'var(--text-main)' : 'var(--border)'}; background:${stateTable.filter === f ? 'var(--text-main)' : 'var(--bg-input)'}; color:${stateTable.filter === f ? 'var(--bg-app)' : 'var(--text-muted)'}; cursor:pointer; font-weight:500;">
              ${f}
            </button>
          `).join('')}
        </div>

        <div style="position:relative; display:flex; align-items:center;">
          <span style="position:absolute; left:8px; color:var(--text-dim); display:flex;">${ICONS.search}</span>
          <input type="text" id="table-search-input" value="${stateTable.searchQuery}" placeholder="Search packages, routers..." style="padding:5px 10px 5px 28px; font-size:0.75rem; background:var(--bg-input); border:1px solid var(--border); border-radius:6px; color:var(--text-main); outline:none; width:180px;" />
        </div>
      </div>

      <!-- Bulk Actions Bar (slides in when rows are selected) -->
      ${hasSelection ? `
        <div style="padding:8px 16px; background:rgba(24, 24, 27, 0.95); border-bottom:1px solid var(--border-strong); display:flex; align-items:center; justify-content:space-between; animation:slideDown 0.15s ease;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:0.72rem; padding:2px 8px; border-radius:999px; background:var(--text-main); color:var(--bg-app); font-weight:600;">
              ${stateTable.selectedIds.size} selected
            </span>
            <button class="btn btn-outline" id="bulk-activate-btn" style="padding:3px 8px; font-size:0.72rem;">Bulk Activate</button>
            <button class="btn btn-outline" id="bulk-deactivate-btn" style="padding:3px 8px; font-size:0.72rem;">Bulk Deactivate</button>
            <button class="btn btn-outline" id="bulk-delete-btn" style="padding:3px 8px; font-size:0.72rem; color:#ef4444;">Bulk Delete</button>
          </div>
          <button class="btn btn-ghost" id="bulk-clear-btn" style="padding:3px 8px; font-size:0.72rem;">Clear</button>
        </div>
      ` : ''}

      <!-- Data Table -->
      <div style="overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.8rem;">
          <thead>
            <tr style="border-bottom:1px solid var(--border); background:var(--bg-app); color:var(--text-dim); font-size:0.7rem; text-transform:uppercase; letter-spacing:0.04em;">
              <th style="padding:10px 14px; width:36px;">
                <input type="checkbox" id="select-all-checkbox" ${allSelected ? 'checked' : ''} style="cursor:pointer;" />
              </th>
              <th style="padding:10px 14px; cursor:pointer;" data-col="name">PACKAGE ${stateTable.sortCol === 'name' ? (stateTable.sortAsc ? '↑' : '↓') : ''}</th>
              <th style="padding:10px 14px; cursor:pointer;" data-col="offer">OFFER</th>
              <th style="padding:10px 14px;">VALIDITY / DATA</th>
              <th style="padding:10px 14px;">SPEED</th>
              <th style="padding:10px 14px;">ROUTERS</th>
              <th style="padding:10px 14px;">STATE</th>
            </tr>
          </thead>
          <tbody>
            ${rows.length === 0 ? `
              <tr>
                <td colspan="7" style="padding:30px; text-align:center; color:var(--text-dim);">No packages matching query</td>
              </tr>
            ` : rows.map(r => `
              <tr class="table-data-row" style="border-bottom:1px solid var(--border); transition:background 0.1s ease; ${stateTable.selectedIds.has(r.id) ? 'background:rgba(255, 255, 255, 0.03);' : ''}">
                <td style="padding:10px 14px;">
                  <input type="checkbox" class="row-checkbox" data-id="${r.id}" ${stateTable.selectedIds.has(r.id) ? 'checked' : ''} style="cursor:pointer;" />
                </td>
                <td style="padding:10px 14px;">
                  <div style="font-weight:600; color:var(--text-main);">${r.name}</div>
                  <div style="font-size:0.7rem; color:var(--text-dim);">${r.sub}</div>
                </td>
                <td style="padding:10px 14px;">
                  <span style="font-weight:600; color:var(--text-main);">${r.offer}</span>
                  <span style="font-size:0.65rem; padding:1px 5px; border-radius:4px; background:var(--bg-input); border:1px solid var(--border); color:var(--text-muted); margin-left:4px;">${r.offerBadge}</span>
                </td>
                <td style="padding:10px 14px; color:var(--text-muted);">${r.validity}</td>
                <td style="padding:10px 14px; font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted);">
                  ↓ ${r.speedDown} · ↑ ${r.speedUp}
                </td>
                <td style="padding:10px 14px; color:var(--text-muted);">${r.routers}</td>
                <td style="padding:10px 14px;">
                  <span style="display:inline-flex; align-items:center; gap:5px; font-size:0.75rem; color:${r.status === 'Active' ? '#10b981' : 'var(--text-dim)'}; font-weight:500;">
                    <span style="width:6px; height:6px; border-radius:50%; background:${r.status === 'Active' ? '#10b981' : 'var(--text-dim)'};"></span>
                    ${r.status}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Total Summary Row (Inspiration: Screenshot_20261024-182217.png) -->
      <div style="padding:10px 16px; background:var(--bg-input); border-top:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; font-size:0.75rem;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-weight:600; color:var(--text-main); letter-spacing:0.04em;">TOTAL ACTIVE NODES</span>
          <span style="font-family:var(--font-mono); color:var(--text-muted);">${rows.length} rows loaded</span>
        </div>
        <span style="padding:2px 8px; border-radius:4px; background:rgba(16, 185, 129, 0.12); color:#10b981; border:1px solid rgba(16, 185, 129, 0.25); font-weight:600; font-size:0.7rem;">
          99.98% System Uptime
        </span>
      </div>
    `;

    bindTableEvents();
    updateCode();
  }

  function bindTableEvents() {
    // Filter buttons
    const filterPills = tableContainer.querySelectorAll('.table-filter-pill');
    filterPills.forEach(p => {
      p.onclick = () => {
        stateTable.filter = p.dataset.filter;
        renderTable();
      };
    });

    // Search input
    const searchInput = tableContainer.querySelector('#table-search-input');
    if (searchInput) {
      searchInput.oninput = (e) => {
        stateTable.searchQuery = e.target.value;
        renderTable();
        // Keep focus
        const nextInput = tableContainer.querySelector('#table-search-input');
        if (nextInput) {
          nextInput.focus();
          nextInput.selectionStart = nextInput.selectionEnd = nextInput.value.length;
        }
      };
    }

    // Select all checkbox
    const selectAll = tableContainer.querySelector('#select-all-checkbox');
    if (selectAll) {
      selectAll.onchange = (e) => {
        if (e.target.checked) {
          INITIAL_ROWS.forEach(r => stateTable.selectedIds.add(r.id));
        } else {
          stateTable.selectedIds.clear();
        }
        renderTable();
      };
    }

    // Row checkboxes
    const rowChecks = tableContainer.querySelectorAll('.row-checkbox');
    rowChecks.forEach(cb => {
      cb.onchange = (e) => {
        const id = parseInt(cb.dataset.id);
        if (e.target.checked) stateTable.selectedIds.add(id);
        else stateTable.selectedIds.delete(id);
        renderTable();
      };
    });

    // Clear bulk selection
    const clearBtn = tableContainer.querySelector('#bulk-clear-btn');
    if (clearBtn) {
      clearBtn.onclick = () => {
        stateTable.selectedIds.clear();
        renderTable();
      };
    }

    // Column sorting
    const sortHeaders = tableContainer.querySelectorAll('th[data-col]');
    sortHeaders.forEach(th => {
      th.onclick = () => {
        const col = th.dataset.col;
        if (stateTable.sortCol === col) {
          stateTable.sortAsc = !stateTable.sortAsc;
        } else {
          stateTable.sortCol = col;
          stateTable.sortAsc = true;
        }
        renderTable();
      };
    });
  }

  function updateCode() {
    const css = `/* Huragon/ui — Production SaaS Data Table */
.saas-table-container {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.saas-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.8rem;
}

.saas-table th {
  padding: 10px 14px;
  background: var(--bg-app);
  color: var(--text-dim);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid var(--border);
}

.saas-table td {
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  color: var(--text-muted);
}

.saas-table tr:hover {
  background: var(--bg-hover);
}`;

    const tailwind = `<div class="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow-lg">
  <table class="w-full text-left text-sm text-zinc-400">
    <thead class="bg-zinc-950 text-xs text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
      <tr>
        <th class="px-4 py-3">Package</th>
        <th class="px-4 py-3">Offer</th>
        <th class="px-4 py-3">Speed</th>
        <th class="px-4 py-3">Status</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-zinc-800">
      <!-- Interactive Data Rows -->
    </tbody>
  </table>
</div>`;

    onCodeChange({ css, tailwind });
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const sec = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', textContent: 'Data Table Capabilities' }),
      el('p', {
        style: { fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.45', margin: '0 0 14px' },
        textContent: 'Fully interactive data grid with live filter pills, search input, column sorting, and floating bulk action bar.'
      }),

      el('div', { className: 'section-title', textContent: 'Quick Actions' }),
      el('div', { style: { display: 'flex', gap: '8px' } }, [
        el('button', {
          className: 'btn btn-outline',
          style: { flex: '1', fontSize: '0.75rem' },
          textContent: 'Select All',
          onclick: () => {
            INITIAL_ROWS.forEach(r => stateTable.selectedIds.add(r.id));
            renderTable();
          }
        }),
        el('button', {
          className: 'btn btn-outline',
          style: { flex: '1', fontSize: '0.75rem' },
          textContent: 'Deselect All',
          onclick: () => {
            stateTable.selectedIds.clear();
            renderTable();
          }
        })
      ])
    ]);

    controlsStage.appendChild(sec);
  }

  renderControls();
}
