// Tool: HeroUI & shadcn/ui Interactive Tabs Studio
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';

export const meta = {
  id: 'tabs-component',
  name: 'Tabs & Segmented Studio'
};

const TAB_ITEMS = [
  { id: 'overview', label: 'Overview', icon: 'grid', badge: null },
  { id: 'analytics', label: 'Analytics', icon: 'activity', badge: '12' },
  { id: 'orders', label: 'Orders', icon: 'box', badge: '5' },
  { id: 'settings', label: 'Settings', icon: 'sliders', badge: null }
];

let config = {
  style: 'pill', // 'pill', 'underline', 'bordered'
  size: 'md', // 'sm', 'md', 'lg'
  radius: 999, // 999 = full, 8 = rounded, 4 = soft
  showBadge: true,
  showIcon: true,
  activeTab: 'overview'
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
      alignItems: 'center',
      justifyContent: 'center',
      padding: '30px',
      gap: '24px'
    }
  });

  const tabContainer = el('div', {
    id: 'interactive-tabs-card',
    style: {
      width: '100%',
      maxWidth: '620px',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      boxShadow: 'var(--shadow-md)',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }
  });

  centerStage.appendChild(tabContainer);
  previewStage.appendChild(centerStage);

  renderTabs();

  function renderTabs() {
    let tabNavigationHtml = '';

    if (config.style === 'pill') {
      tabNavigationHtml = `
        <div class="heroui-tab-track" style="border-radius:${config.radius}px;">
          ${TAB_ITEMS.map(tab => {
            const isActive = config.activeTab === tab.id;
            return `
              <button class="heroui-tab-button ${isActive ? 'active' : ''}" data-tab="${tab.id}" style="border-radius:${Math.min(config.radius, 8)}px;">
                ${config.showIcon && ICONS[tab.icon] ? `<span style="display:flex; align-items:center;">${ICONS[tab.icon]}</span>` : ''}
                <span>${tab.label}</span>
                ${config.showBadge && tab.badge ? `<span class="heroui-tab-count">${tab.badge}</span>` : ''}
              </button>
            `;
          }).join('')}
        </div>
      `;
    } else if (config.style === 'underline') {
      tabNavigationHtml = `
        <div class="heroui-tab-underline-track">
          ${TAB_ITEMS.map(tab => {
            const isActive = config.activeTab === tab.id;
            return `
              <button class="heroui-tab-underline-btn ${isActive ? 'active' : ''}" data-tab="${tab.id}">
                ${config.showIcon && ICONS[tab.icon] ? `<span style="display:inline-flex; align-items:center; margin-right:6px;">${ICONS[tab.icon]}</span>` : ''}
                <span>${tab.label}</span>
                ${config.showBadge && tab.badge ? `<span class="heroui-tab-count" style="margin-left:6px;">${tab.badge}</span>` : ''}
              </button>
            `;
          }).join('')}
        </div>
      `;
    } else {
      // Bordered / Card Tabs
      tabNavigationHtml = `
        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:6px; background:var(--bg-input); padding:4px; border-radius:${config.radius}px; border:1px solid var(--border);">
          ${TAB_ITEMS.map(tab => {
            const isActive = config.activeTab === tab.id;
            return `
              <button class="heroui-tab-button ${isActive ? 'active' : ''}" data-tab="${tab.id}" style="justify-content:center; border-radius:${Math.min(config.radius, 6)}px;">
                ${config.showIcon && ICONS[tab.icon] ? `<span style="display:flex; align-items:center;">${ICONS[tab.icon]}</span>` : ''}
                <span>${tab.label}</span>
              </button>
            `;
          }).join('')}
        </div>
      `;
    }

    let tabBodyHtml = '';
    if (config.activeTab === 'overview') {
      tabBodyHtml = `
        <div style="display:flex; flex-direction:column; gap:12px; animation:fadeIn 0.16s ease;">
          <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:12px;">
            <div style="padding:14px; background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-sm);">
              <div style="font-size:0.72rem; color:var(--text-dim); text-transform:uppercase;">Active Users</div>
              <div style="font-size:1.4rem; font-weight:700; color:var(--text-main); margin-top:4px;">14,290</div>
            </div>
            <div style="padding:14px; background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-sm);">
              <div style="font-size:0.72rem; color:var(--text-dim); text-transform:uppercase;">Conversion Rate</div>
              <div style="font-size:1.4rem; font-weight:700; color:var(--text-main); margin-top:4px;">3.84%</div>
            </div>
          </div>
          <p style="font-size:0.8rem; color:var(--text-muted); line-height:1.5; margin:0;">
            Overview dashboard metric cards showing current conversion rates and connected user cohorts.
          </p>
        </div>
      `;
    } else if (config.activeTab === 'analytics') {
      tabBodyHtml = `
        <div style="display:flex; flex-direction:column; gap:12px; animation:fadeIn 0.16s ease;">
          <div style="padding:14px; background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-sm);">
            <div style="font-size:0.75rem; font-weight:600; color:var(--text-main); margin-bottom:8px;">Traffic Distribution Breakdown</div>
            <div style="display:flex; height:8px; border-radius:4px; overflow:hidden; gap:2px;">
              <div style="flex:5; background:var(--text-main);"></div>
              <div style="flex:3; background:var(--text-muted);"></div>
              <div style="flex:2; background:var(--border-strong);"></div>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:0.72rem; color:var(--text-dim); margin-top:8px;">
              <span>Desktop (50%)</span>
              <span>Mobile (30%)</span>
              <span>Tablet (20%)</span>
            </div>
          </div>
        </div>
      `;
    } else if (config.activeTab === 'orders') {
      tabBodyHtml = `
        <div style="display:flex; flex-direction:column; gap:8px; animation:fadeIn 0.16s ease;">
          ${[
            { id: '#ORD-9821', item: 'Ultra-Wide Curved Monitor 34"', amt: '$799.00', status: 'Delivered' },
            { id: '#ORD-9820', item: 'Minimalist Mechanical Keyboard', amt: '$189.00', status: 'Processing' }
          ].map(ord => `
            <div style="padding:10px 14px; background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-sm); display:flex; justify-content:space-between; align-items:center;">
              <div>
                <span style="font-weight:600; font-size:0.825rem; color:var(--text-main);">${ord.item}</span>
                <span style="font-size:0.7rem; color:var(--text-dim); margin-left:8px; font-family:var(--font-mono);">${ord.id}</span>
              </div>
              <div style="display:flex; align-items:center; gap:10px;">
                <span style="font-family:var(--font-mono); font-weight:600; font-size:0.85rem; color:var(--text-main);">${ord.amt}</span>
                <span style="font-size:0.68rem; padding:2px 6px; border-radius:4px; background:rgba(34, 197, 94, 0.1); color:#22c55e;">${ord.status}</span>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      // Settings
      tabBodyHtml = `
        <div style="display:flex; flex-direction:column; gap:10px; animation:fadeIn 0.16s ease;">
          <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-sm);">
            <div>
              <div style="font-size:0.825rem; font-weight:500; color:var(--text-main);">Email Notifications</div>
              <div style="font-size:0.72rem; color:var(--text-dim);">Receive weekly executive digests</div>
            </div>
            <input type="checkbox" checked style="cursor:pointer;" />
          </div>
        </div>
      `;
    }

    tabContainer.innerHTML = `
      ${tabNavigationHtml}
      <div style="min-height:120px;">
        ${tabBodyHtml}
      </div>
    `;

    // Bind tab clicks
    tabContainer.querySelectorAll('button[data-tab]').forEach(btn => {
      btn.onclick = () => {
        config.activeTab = btn.dataset.tab;
        renderTabs();
      };
    });

    updateCode();
  }

  function updateCode() {
    const css = `/* HeroUI / shadcn/ui — Animated Pill Tabs */
.tab-track {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--bg-input);
  padding: 4px;
  border-radius: ${config.radius}px;
  border: 1px solid var(--border);
}

.tab-btn {
  padding: 6px 14px;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-dim);
  background: transparent;
  border: none;
  border-radius: ${Math.min(config.radius, 8)}px;
  cursor: pointer;
  transition: all 0.15s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.tab-btn:hover {
  color: var(--text-main);
}

.tab-btn.active {
  color: var(--text-main);
  font-weight: 600;
  background: var(--bg-card);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}`;

    const tailwind = `<!-- HeroUI / shadcn/ui Segmented Tabs -->
<div class="inline-flex items-center gap-1 rounded-[${config.radius}px] border border-zinc-800 bg-zinc-950 p-1">
  <button class="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-100 shadow-sm">
    Overview
  </button>
  <button class="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-100">
    Analytics <span class="rounded-full bg-zinc-800 px-1.5 text-[10px] text-zinc-400">12</span>
  </button>
  <button class="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-100">
    Settings
  </button>
</div>`;

    onCodeChange({ css, tailwind });
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const sec = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', textContent: 'Tab Style' }),
      el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '16px' } }, [
        { id: 'pill', name: 'Pill Slider' },
        { id: 'underline', name: 'Underline' },
        { id: 'bordered', name: 'Card Grid' }
      ].map(s => el('button', {
        className: `btn ${config.style === s.id ? 'btn-primary' : 'btn-outline'}`,
        style: { fontSize: '0.75rem', padding: '6px' },
        textContent: s.name,
        onclick: () => {
          config.style = s.id;
          renderControls();
          renderTabs();
        }
      }))),

      el('div', { className: 'section-title', textContent: 'Corner Radius' }),
      el('div', { style: { display: 'flex', gap: '6px', marginBottom: '16px' } }, [
        { name: 'Pill Full', val: 999 },
        { name: 'Rounded', val: 8 },
        { name: 'Square', val: 4 }
      ].map(r => el('button', {
        className: `btn ${config.radius === r.val ? 'btn-primary' : 'btn-outline'}`,
        style: { flex: '1', fontSize: '0.72rem' },
        textContent: r.name,
        onclick: () => {
          config.radius = r.val;
          renderControls();
          renderTabs();
        }
      }))),

      el('div', { className: 'section-title', textContent: 'Toggles' }),
      el('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px' } }, [
        el('label', { style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer' } }, [
          el('input', {
            type: 'checkbox',
            checked: config.showBadge,
            onchange: (e) => {
              config.showBadge = e.target.checked;
              renderTabs();
            }
          }),
          el('span', { textContent: 'Show Numeric Badge Counters' })
        ]),
        el('label', { style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer' } }, [
          el('input', {
            type: 'checkbox',
            checked: config.showIcon,
            onchange: (e) => {
              config.showIcon = e.target.checked;
              renderTabs();
            }
          }),
          el('span', { textContent: 'Show Tab Icons' })
        ])
      ])
    ]);

    controlsStage.appendChild(sec);
  }

  renderControls();
}
