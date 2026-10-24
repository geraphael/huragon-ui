// Tool: HeroUI & shadcn/ui Interactive Lists & Accordions Studio
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';

export const meta = {
  id: 'list-accordion',
  name: 'Lists & Accordions Studio'
};

const ACCORDION_DATA = [
  {
    id: 1,
    title: 'Is this completely pure CSS with zero framework lock-in?',
    content: 'Yes. All components generate standalone, pure CSS and HTML that can be dropped into Next.js, Vite, Astro, Svelte, or vanilla web stacks without third-party dependencies.'
  },
  {
    id: 2,
    title: 'How does theme switching work across components?',
    content: 'The entire design system relies on semantic CSS custom variables (--bg-app, --text-main, --border). Toggling the theme-dark or theme-light class on the document root smoothly recalculates all surfaces.'
  },
  {
    id: 3,
    title: 'Are interactive states like hover, active and focus supported?',
    content: 'All components include complete multi-state definitions including accessible focus rings, active press shrink transforms, and seamless disabled states.'
  }
];

const LISTBOX_DATA = [
  { id: 1, name: 'Sarah Chen', email: 'sarah.c@company.com', role: 'Staff Engineer', status: 'online', initials: 'SC' },
  { id: 2, name: 'Marcus Vance', email: 'm.vance@company.com', role: 'Product Lead', status: 'online', initials: 'MV' },
  { id: 3, name: 'Elena Rostova', email: 'elena@company.com', role: 'Design Systems', status: 'idle', initials: 'ER' },
  { id: 4, name: 'David Kim', email: 'dkim@company.com', role: 'Infrastructure', status: 'offline', initials: 'DK' }
];

let config = {
  mode: 'accordion', // 'accordion', 'listbox', 'command'
  accordionMulti: false,
  openIds: new Set([1]),
  selectedListId: 1
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

  const cardWrapper = el('div', {
    id: 'list-accordion-card',
    style: {
      width: '100%',
      maxWidth: '560px',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      boxShadow: 'var(--shadow-md)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }
  });

  centerStage.appendChild(cardWrapper);
  previewStage.appendChild(centerStage);

  renderView();

  function renderView() {
    if (config.mode === 'accordion') {
      renderAccordion();
    } else if (config.mode === 'listbox') {
      renderListbox();
    } else {
      renderCommandList();
    }

    updateCode();
  }

  function renderAccordion() {
    cardWrapper.innerHTML = `
      <div style="margin-bottom:8px;">
        <h3 style="font-size:1rem; font-weight:600; color:var(--text-main); margin:0;">Frequently Asked Questions</h3>
        <p style="font-size:0.75rem; color:var(--text-dim); margin:2px 0 0;">Interactive collapsible accordion with smooth height transition</p>
      </div>

      <div class="heroui-accordion">
        ${ACCORDION_DATA.map(item => {
          const isOpen = config.openIds.has(item.id);
          return `
            <div class="heroui-accordion-item ${isOpen ? 'open' : ''}" data-id="${item.id}">
              <button class="heroui-accordion-trigger" data-id="${item.id}">
                <span>${item.title}</span>
                <span class="heroui-accordion-chevron">${ICONS.chevronDown}</span>
              </button>
              <div class="heroui-accordion-content">
                ${item.content}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    cardWrapper.querySelectorAll('.heroui-accordion-trigger').forEach(btn => {
      btn.onclick = () => {
        const id = parseInt(btn.dataset.id, 10);
        if (config.openIds.has(id)) {
          config.openIds.delete(id);
        } else {
          if (!config.accordionMulti) config.openIds.clear();
          config.openIds.add(id);
        }
        renderAccordion();
      };
    });
  }

  function renderListbox() {
    cardWrapper.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <div>
          <h3 style="font-size:1rem; font-weight:600; color:var(--text-main); margin:0;">Team Cohort</h3>
          <p style="font-size:0.75rem; color:var(--text-dim); margin:2px 0 0;">Interactive HeroUI listbox with user status</p>
        </div>
        <span style="font-size:0.7rem; padding:2px 8px; border-radius:999px; background:var(--bg-input); border:1px solid var(--border); color:var(--text-dim);">
          ${LISTBOX_DATA.length} members
        </span>
      </div>

      <div style="display:flex; flex-direction:column; gap:4px;">
        ${LISTBOX_DATA.map(user => {
          const isSelected = config.selectedListId === user.id;
          const statusColor = user.status === 'online' ? '#22c55e' : user.status === 'idle' ? '#eab308' : '#71717a';
          return `
            <div class="listbox-user-item" data-id="${user.id}" style="padding:10px 14px; border-radius:var(--radius-sm); border:1px solid ${isSelected ? 'var(--border-strong)' : 'transparent'}; background:${isSelected ? 'var(--bg-input-focus)' : 'var(--bg-input)'}; display:flex; align-items:center; justify-content:space-between; cursor:pointer; transition:all var(--transition-fast);">
              <div style="display:flex; align-items:center; gap:12px;">
                <div style="position:relative; width:36px; height:36px; border-radius:50%; background:var(--bg-card); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; font-weight:600; font-size:0.8rem; color:var(--text-main);">
                  ${user.initials}
                  <span style="position:absolute; bottom:0; right:0; width:8px; height:8px; border-radius:50%; background:${statusColor}; border:1.5px solid var(--bg-card);"></span>
                </div>
                <div>
                  <div style="font-size:0.825rem; font-weight:600; color:var(--text-main);">${user.name}</div>
                  <div style="font-size:0.72rem; color:var(--text-dim);">${user.email}</div>
                </div>
              </div>
              <span style="font-size:0.7rem; padding:2px 8px; border-radius:var(--radius-xs); background:var(--bg-card); border:1px solid var(--border); color:var(--text-muted);">
                ${user.role}
              </span>
            </div>
          `;
        }).join('')}
      </div>
    `;

    cardWrapper.querySelectorAll('.listbox-user-item').forEach(item => {
      item.onclick = () => {
        config.selectedListId = parseInt(item.dataset.id, 10);
        renderListbox();
      };
    });
  }

  function renderCommandList() {
    const items = [
      { cat: 'Suggestions', icon: 'zap', title: 'Open Quick Terminal', kbd: '⌘T' },
      { cat: 'Suggestions', icon: 'palette', title: 'Switch Color Theme', kbd: '⌘D' },
      { cat: 'Navigation', icon: 'grid', title: 'Go to Data Table Studio', kbd: 'G T' },
      { cat: 'Navigation', icon: 'barChart', title: 'Go to Charts Studio', kbd: 'G C' },
      { cat: 'Account', icon: 'users', title: 'Manage Team Permissions', kbd: '⌘P' }
    ];

    cardWrapper.innerHTML = `
      <div style="margin-bottom:8px;">
        <h3 style="font-size:1rem; font-weight:600; color:var(--text-main); margin:0;">Command Menu Block</h3>
        <p style="font-size:0.75rem; color:var(--text-dim); margin:2px 0 0;">Keyboard-driven command menu items with kbd shortcuts</p>
      </div>

      <div style="border:1px solid var(--border); border-radius:var(--radius-md); background:var(--bg-input); overflow:hidden;">
        ${items.map(it => `
          <div class="cmd-menu-row" style="padding:10px 14px; display:flex; align-items:center; justify-content:space-between; cursor:pointer; border-bottom:1px solid var(--border); transition:background var(--transition-fast);">
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="color:var(--text-dim); display:flex;">${ICONS[it.icon] || ICONS.zap}</span>
              <span style="font-size:0.825rem; font-weight:500; color:var(--text-main);">${it.title}</span>
            </div>
            <kbd class="kbd">${it.kbd}</kbd>
          </div>
        `).join('')}
      </div>
    `;

    cardWrapper.querySelectorAll('.cmd-menu-row').forEach(row => {
      row.onmouseenter = () => { row.style.background = 'var(--bg-hover)'; };
      row.onmouseleave = () => { row.style.background = 'transparent'; };
    });
  }

  function updateCode() {
    let css = '';
    let tailwind = '';

    if (config.mode === 'accordion') {
      css = `/* HeroUI / shadcn/ui — Collapsible FAQ Accordion */
.accordion {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-card);
}
.accordion-item + .accordion-item {
  border-top: 1px solid var(--border);
}
.accordion-trigger {
  width: 100%;
  padding: 14px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: transparent;
  border: none;
  color: var(--text-main);
  cursor: pointer;
}
.accordion-content {
  padding: 0 18px 14px;
  color: var(--text-muted);
}`;
      tailwind = `<!-- shadcn/ui Accordion Block -->
<div class="divide-y divide-zinc-800 rounded-lg border border-zinc-800 bg-zinc-900">
  <details class="group p-4">
    <summary class="flex cursor-pointer list-none items-center justify-between font-medium text-zinc-100">
      Question title here
      <span class="transition group-open:rotate-180">↓</span>
    </summary>
    <p class="mt-2 text-sm text-zinc-400">Answer contents...</p>
  </details>
</div>`;
    } else {
      css = `/* HeroUI Listbox Item */
.listbox-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-radius: 6px;
  background: var(--bg-card);
  transition: background 0.15s ease;
}
.listbox-item:hover {
  background: var(--bg-hover);
}`;
      tailwind = `<!-- HeroUI Listbox Item -->
<div class="flex items-center justify-between rounded-md bg-zinc-900 p-3 hover:bg-zinc-800/60">
  <div class="flex items-center gap-3">
    <div class="h-9 w-9 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-100">SC</div>
    <div>
      <p class="text-sm font-semibold text-zinc-100">Sarah Chen</p>
      <p class="text-xs text-zinc-500">sarah@company.com</p>
    </div>
  </div>
</div>`;
    }

    onCodeChange({ css, tailwind });
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const sec = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', textContent: 'Component Archetype' }),
      el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '16px' } }, [
        { id: 'accordion', name: 'Accordion' },
        { id: 'listbox', name: 'Listbox' },
        { id: 'command', name: 'Command List' }
      ].map(m => el('button', {
        className: `btn ${config.mode === m.id ? 'btn-primary' : 'btn-outline'}`,
        style: { fontSize: '0.72rem', padding: '6px' },
        textContent: m.name,
        onclick: () => {
          config.mode = m.id;
          renderControls();
          renderView();
        }
      }))),

      el('div', { className: 'section-title', textContent: 'Accordion Settings' }),
      el('label', { style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer' } }, [
        el('input', {
          type: 'checkbox',
          checked: config.accordionMulti,
          onchange: (e) => {
            config.accordionMulti = e.target.checked;
            renderView();
          }
        }),
        el('span', { textContent: 'Allow Multiple Items Open Simultaneously' })
      ])
    ]);

    controlsStage.appendChild(sec);
  }

  renderControls();
}
