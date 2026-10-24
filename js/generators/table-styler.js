// Tool 29: Table & Data Grid Styler (E-Commerce Products Catalog with live filtering, bulk selection & sorting)
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';

export const meta = {
  id: 'table-styler',
  name: 'Data Table Studio'
};

const INITIAL_ROWS = [
  { id: 1, name: 'Minimalist Mechanical Keyboard', sku: 'KB-M87-PRO', price: 189, priceTag: '$189.00', category: 'Peripherals', stock: 42, rating: '4.9', inventoryStatus: 'In Stock', status: 'Active' },
  { id: 2, name: 'Ultra-Wide Curved Monitor 34"', sku: 'DISP-UW34-4K', price: 799, priceTag: '$799.00', category: 'Displays', stock: 12, rating: '4.8', inventoryStatus: 'Low Stock', status: 'Active' },
  { id: 3, name: 'Ergonomic Desk Chair Pro', sku: 'FUR-ERGO-01', price: 449, priceTag: '$449.00', category: 'Furniture', stock: 0, rating: '4.7', inventoryStatus: 'Out of Stock', status: 'Inactive' },
  { id: 4, name: 'Precision Wireless Mouse', sku: 'MOU-WL-RGB', price: 89, priceTag: '$89.00', category: 'Peripherals', stock: 85, rating: '4.6', inventoryStatus: 'In Stock', status: 'Active' },
  { id: 5, name: 'Thunderbolt 4 Docking Station', sku: 'DOCK-TB4-PRO', price: 299, priceTag: '$299.00', category: 'Accessories', stock: 24, rating: '4.9', inventoryStatus: 'In Stock', status: 'Active' }
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
      maxWidth: '820px',
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
      rows = rows.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.sku.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
      );
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
          <input type="text" id="table-search-input" value="${stateTable.searchQuery}" placeholder="Search products, SKU, category..." style="padding:5px 10px 5px 28px; font-size:0.75rem; background:var(--bg-input); border:1px solid var(--border); border-radius:6px; color:var(--text-main); outline:none; width:220px;" />
        </div>
      </div>

      <!-- Bulk Actions Bar (slides in when rows are selected) -->
      ${hasSelection ? `
        <div style="padding:8px 16px; background:rgba(24, 24, 27, 0.95); border-bottom:1px solid var(--border-strong); display:flex; align-items:center; justify-content:space-between; animation:slideDown 0.15s ease;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:0.72rem; padding:2px 8px; border-radius:999px; background:var(--text-main); color:var(--bg-app); font-weight:600;">
              ${stateTable.selectedIds.size} selected
            </span>
            <button class="btn btn-outline" id="bulk-activate-btn" style="padding:3px 8px; font-size:0.72rem;">Publish</button>
            <button class="btn btn-outline" id="bulk-deactivate-btn" style="padding:3px 8px; font-size:0.72rem;">Archive</button>
            <button class="btn btn-outline" id="bulk-delete-btn" style="padding:3px 8px; font-size:0.72rem; color:#ef4444;">Delete</button>
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
              <th style="padding:10px 14px; cursor:pointer;" data-col="name">PRODUCT ${stateTable.sortCol === 'name' ? (stateTable.sortAsc ? '↑' : '↓') : ''}</th>
              <th style="padding:10px 14px; cursor:pointer;" data-col="price">PRICE</th>
              <th style="padding:10px 14px; cursor:pointer;" data-col="category">CATEGORY</th>
              <th style="padding:10px 14px; cursor:pointer;" data-col="stock">STOCK</th>
              <th style="padding:10px 14px;">RATING</th>
              <th style="padding:10px 14px;">STATUS</th>
            </tr>
          </thead>
          <tbody>
            ${rows.length === 0 ? `
              <tr>
                <td colspan="7" style="padding:30px; text-align:center; color:var(--text-dim);">No products matching query</td>
              </tr>
            ` : rows.map(r => `
              <tr class="table-data-row" style="border-bottom:1px solid var(--border); transition:background 0.1s ease; ${stateTable.selectedIds.has(r.id) ? 'background:rgba(255, 255, 255, 0.03);' : ''}">
                <td style="padding:10px 14px;">
                  <input type="checkbox" class="row-checkbox" data-id="${r.id}" ${stateTable.selectedIds.has(r.id) ? 'checked' : ''} style="cursor:pointer;" />
                </td>
                <td style="padding:10px 14px;">
                  <div style="font-weight:600; color:var(--text-main);">${r.name}</div>
                  <div style="font-size:0.7rem; color:var(--text-dim); font-family:var(--font-mono);">${r.sku}</div>
                </td>
                <td style="padding:10px 14px;">
                  <span style="font-weight:600; color:var(--text-main);">${r.priceTag}</span>
                </td>
                <td style="padding:10px 14px; color:var(--text-muted);">${r.category}</td>
                <td style="padding:10px 14px;">
                  <span style="font-family:var(--font-mono); font-size:0.75rem; color:${r.stock > 15 ? 'var(--text-main)' : r.stock > 0 ? '#eab308' : '#ef4444'};">
                    ${r.stock} units
                  </span>
                </td>
                <td style="padding:10px 14px; font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted);">
                  ${r.rating} / 5.0
                </td>
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
          <span style="font-weight:600; color:var(--text-main); letter-spacing:0.04em;">CATALOG SUMMARY</span>
          <span style="font-family:var(--font-mono); color:var(--text-muted);">${rows.length} products listed</span>
        </div>
        <span style="padding:2px 8px; border-radius:4px; background:rgba(16, 185, 129, 0.12); color:#10b981; border:1px solid rgba(16, 185, 129, 0.25); font-weight:600; font-size:0.7rem;">
          Live Store Sync
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
        const id = parseInt(cb.dataset.id, 10);
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
    const css = `/* Huragon/ui — E-Commerce Products Data Table */
.products-table-container {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.products-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.8rem;
}

.products-table th {
  padding: 10px 14px;
  background: var(--bg-app);
  color: var(--text-dim);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid var(--border);
}

.products-table td {
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  color: var(--text-muted);
}

.products-table tr:hover {
  background: var(--bg-hover);
}`;

    const tailwind = `<div class="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow-lg">
  <table class="w-full text-left text-sm text-zinc-400">
    <thead class="bg-zinc-950 text-xs text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
      <tr>
        <th class="px-4 py-3">Product</th>
        <th class="px-4 py-3">Price</th>
        <th class="px-4 py-3">Category</th>
        <th class="px-4 py-3">Stock</th>
        <th class="px-4 py-3">Rating</th>
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
        textContent: 'Fully interactive products data grid with live filter pills, search input, column sorting, and floating bulk action bar.'
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
