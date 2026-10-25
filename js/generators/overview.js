// Tool: Studio Home Dashboard (Overview)
// Provides a developer workspace inspired by Linear, Vercel, and shadcn/ui.
// Pure vanilla HTML, CSS, and ES Modules.

import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';
import { CATEGORIES, getToolMeta } from '../tools-registry.js';

export const meta = {
  id: 'overview',
  name: 'Studio Overview',
  desc: 'Developer workspace, quick start tools, and design system workflow'
};

// Safe localStorage utilities
function getFavourites() {
  try {
    return JSON.parse(localStorage.getItem('huragon_favourites') || '[]');
  } catch (_) {
    return [];
  }
}

function saveFavourites(favs) {
  try {
    localStorage.setItem('huragon_favourites', JSON.stringify(favs));
    window.dispatchEvent(new CustomEvent('huragon:favourites-changed', { detail: favs }));
  } catch (_) {}
}

function getRecents() {
  try {
    const raw = localStorage.getItem('huragon_recents');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(item => {
      if (typeof item === 'string') return { id: item, timestamp: Date.now() };
      return item;
    });
  } catch (_) {
    return [];
  }
}

function formatTimeAgo(timestamp) {
  if (!timestamp) return 'Recently';
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

// Quick Start Curated Tools
const QUICK_START_TOOLS = [
  {
    id: 'app-canvas',
    name: 'App Canvas',
    desc: 'Live interactive workspace with 5 aesthetics, responsive frames, and code export.',
    icon: 'layout',
    tag: 'Workspace'
  },
  {
    id: 'color-palette',
    name: 'Color Palette Studio',
    desc: 'Harmonious palettes, 50-950 Tailwind shade scales, and OKLCH color math.',
    icon: 'droplet',
    tag: 'Foundations'
  },
  {
    id: 'gradient-builder',
    name: 'Gradient Builder',
    desc: 'Multi-stop linear, radial, and conic gradients with CSS & SVG exports.',
    icon: 'palette',
    tag: 'Visual'
  },
  {
    id: 'button-generator',
    name: 'Button Studio',
    desc: 'High-polish buttons with specular glow, pill, ghost, and loading states.',
    icon: 'zap',
    tag: 'Components'
  },
  {
    id: 'blocks-studio',
    name: 'Page Blocks Studio',
    desc: 'Hero sections, feature bento grids, pricing tiers, and footer assemblies.',
    icon: 'blocks',
    tag: 'Components'
  },
  {
    id: 'charts-studio',
    name: 'Charts & Graphs',
    desc: 'Spline area curves, segmented bars, and donut charts with pure SVG.',
    icon: 'barChart',
    tag: 'Data'
  }
];

// Workflow Steps: Build a Design System
const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Define Colors',
    desc: 'Establish semantic zinc tokens & 50-950 shade scales in OKLCH.',
    toolId: 'color-palette',
    toolName: 'Color Palette Studio'
  },
  {
    step: '02',
    title: 'Configure Typography',
    desc: 'Pair Google Fonts and preview harmonic type scale ratios.',
    toolId: 'font-pairing',
    toolName: 'Font Pairing Studio'
  },
  {
    step: '03',
    title: 'Establish Spacing',
    desc: 'Generate mathematical 8pt/4pt layout grid units.',
    toolId: 'spacing-calculator',
    toolName: 'Spacing System'
  },
  {
    step: '04',
    title: 'Build Components',
    desc: 'Style buttons, cards, forms, and interactive dialogs.',
    toolId: 'button-generator',
    toolName: 'Button Studio'
  },
  {
    step: '05',
    title: 'Preview and Export',
    desc: 'Assemble live screen layouts and export production tokens.',
    toolId: 'app-canvas',
    toolName: 'App Canvas'
  }
];

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  if (controlsStage) {
    controlsStage.innerHTML = '';
  }

  if (!previewStage) return;
  previewStage.innerHTML = '';

  // Calculate dynamic metrics
  const totalTools = CATEGORIES.reduce((acc, cat) => {
    if (cat.tools) return acc + cat.tools.length;
    if (cat.groups) return acc + cat.groups.reduce((gAcc, g) => gAcc + g.tools.length, 0);
    return acc;
  }, 0);

  const favs = getFavourites();
  const recents = getRecents();

  // Root Dashboard Element
  const dashboard = el('div', { className: 'studio-dashboard' });

  // ==========================================
  // SECTION 1: Welcome Section
  // ==========================================
  const welcomeCard = el('div', { className: 'dash-welcome-card' }, [
    el('div', { className: 'dash-welcome-content' }, [
      el('div', { className: 'dash-welcome-badge' }, [
        el('span', { className: 'dash-status-dot-pulse' }),
        el('span', { textContent: 'Studio Workspace Active' })
      ]),
      el('h1', { className: 'dash-welcome-title', textContent: 'Your design workspace' }),
      el('p', {
        className: 'dash-welcome-desc',
        textContent: 'Design, generate, and style monochromatic zinc web interfaces inspired by Linear, Vercel, and shadcn/ui. Pure vanilla CSS, zero dependencies.'
      }),
      el('div', { className: 'dash-welcome-actions' }, [
        el('button', {
          className: 'btn btn-primary',
          onclick: () => { location.hash = '#app-canvas'; }
        }, [
          el('span', { innerHTML: ICONS.layout, style: 'display:flex;align-items:center;' }),
          el('span', { textContent: 'Open App Canvas' })
        ]),
        el('button', {
          className: 'btn btn-outline',
          onclick: () => {
            const catSection = qs('#dash-explore-categories');
            if (catSection) {
              catSection.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }, [
          el('span', { innerHTML: ICONS.grid, style: 'display:flex;align-items:center;' }),
          el('span', { textContent: 'Browse Tools' })
        ]),
        el('button', {
          className: 'btn btn-outline',
          onclick: () => {
            const cmd = qs('#top-cmd-btn');
            if (cmd) cmd.click();
          }
        }, [
          el('span', { innerHTML: ICONS.command, style: 'display:flex;align-items:center;' }),
          el('span', { textContent: 'Command Palette' }),
          el('kbd', { className: 'kbd', textContent: '⌘K', style: 'font-size:0.65rem; margin-left:4px;' })
        ])
      ])
    ]),
    // Lightweight Geometric CSS Illustration
    el('div', { className: 'dash-welcome-graphic' }, [
      el('div', { className: 'dash-graphic-backdrop' }),
      el('div', { className: 'dash-graphic-layer dash-graphic-layer-1' }),
      el('div', { className: 'dash-graphic-layer dash-graphic-layer-2' }, [
        el('div', { className: 'dash-wireframe-header' }, [
          el('div', { className: 'dash-wireframe-pill' }),
          el('div', { className: 'dash-wireframe-tag' })
        ]),
        el('div', { className: 'dash-wireframe-body' }, [
          el('div', { className: 'dash-wireframe-line w-full' }),
          el('div', { className: 'dash-wireframe-line w-80' }),
          el('div', { className: 'dash-wireframe-row' }, [
            el('div', { className: 'dash-wireframe-col' }),
            el('div', { className: 'dash-wireframe-col' })
          ])
        ])
      ])
    ])
  ]);
  dashboard.appendChild(welcomeCard);

  // ==========================================
  // SECTION 2: Overview KPI Cards
  // ==========================================
  const kpiGrid = el('div', { className: 'dash-kpi-grid' }, [
    // Available Tools
    el('div', { className: 'dash-kpi-card' }, [
      el('div', { className: 'dash-kpi-header' }, [
        el('span', { className: 'dash-kpi-label', textContent: 'Available Tools' }),
        el('span', { className: 'dash-kpi-icon', innerHTML: ICONS.grid })
      ]),
      el('div', { className: 'dash-kpi-value', id: 'dash-kpi-tools-count', textContent: String(totalTools) }),
      el('div', { className: 'dash-kpi-footer' }, [
        el('span', { className: 'dash-kpi-footer-badge', textContent: '100% active' }),
        el('span', { textContent: 'Across 6 categories' })
      ])
    ]),
    // Pinned Tools
    el('div', { className: 'dash-kpi-card' }, [
      el('div', { className: 'dash-kpi-header' }, [
        el('span', { className: 'dash-kpi-label', textContent: 'Pinned Tools' }),
        el('span', { className: 'dash-kpi-icon', innerHTML: ICONS.star })
      ]),
      el('div', { className: 'dash-kpi-value', id: 'dash-kpi-pinned-count', textContent: String(favs.length) }),
      el('div', { className: 'dash-kpi-footer' }, [
        el('span', { textContent: 'In your quick access bar' })
      ])
    ]),
    // Recently Used Tools
    el('div', { className: 'dash-kpi-card' }, [
      el('div', { className: 'dash-kpi-header' }, [
        el('span', { className: 'dash-kpi-label', textContent: 'Recent Tools' }),
        el('span', { className: 'dash-kpi-icon', innerHTML: ICONS.clock || ICONS.activity })
      ]),
      el('div', { className: 'dash-kpi-value', id: 'dash-kpi-recents-count', textContent: String(recents.length) }),
      el('div', { className: 'dash-kpi-footer' }, [
        el('span', { textContent: 'Recorded in local storage' })
      ])
    ]),
    // Runtime Dependencies
    el('div', { className: 'dash-kpi-card' }, [
      el('div', { className: 'dash-kpi-header' }, [
        el('span', { className: 'dash-kpi-label', textContent: 'Dependencies' }),
        el('span', { className: 'dash-kpi-icon', innerHTML: ICONS.package || ICONS.box })
      ]),
      el('div', { className: 'dash-kpi-value', textContent: '0 KB' }),
      el('div', { className: 'dash-kpi-footer' }, [
        el('span', { className: 'dash-kpi-footer-badge', textContent: 'Pure ESM' }),
        el('span', { textContent: 'Vanilla Web Standards' })
      ])
    ])
  ]);
  dashboard.appendChild(kpiGrid);

  // ==========================================
  // SECTION 3: Quick Start
  // ==========================================
  const qsSection = el('section', { className: 'dash-section' }, [
    el('div', { className: 'dash-section-header' }, [
      el('div', { className: 'dash-section-title-wrap' }, [
        el('h2', { className: 'dash-section-title', textContent: 'Quick Start' }),
        el('p', { className: 'dash-section-desc', textContent: 'Jump straight into the most frequently used studios and visual generators' })
      ])
    ]),
    el('div', { className: 'dash-quickstart-grid' },
      QUICK_START_TOOLS.map(tool => {
        const iconSvg = ICONS[tool.icon] || ICONS.tool;
        return el('div', {
          className: 'dash-quickstart-card',
          role: 'button',
          tabIndex: 0,
          onclick: () => { location.hash = `#${tool.id}`; },
          onkeydown: (e) => { if (e.key === 'Enter') location.hash = `#${tool.id}`; }
        }, [
          el('div', { className: 'dash-qs-header' }, [
            el('div', { className: 'dash-qs-icon', innerHTML: iconSvg }),
            el('span', { className: 'dash-qs-arrow', innerHTML: ICONS.arrowUpRight })
          ]),
          el('div', { className: 'dash-qs-body' }, [
            el('h3', { className: 'dash-qs-title', textContent: tool.name }),
            el('p', { className: 'dash-qs-desc', textContent: tool.desc })
          ]),
          el('div', { className: 'dash-qs-footer' }, [
            el('span', { className: 'dash-qs-tag', textContent: tool.tag })
          ])
        ]);
      })
    )
  ]);
  dashboard.appendChild(qsSection);

  // ==========================================
  // SECTION 4: Split Grid (Recent Activity + Pinned Tools)
  // ==========================================
  const splitSection = el('section', { className: 'dash-split-grid' });

  // Left Column: Recent Activity
  const recentsCol = el('div', { className: 'dash-split-col' }, [
    el('div', { className: 'dash-section-header' }, [
      el('div', { className: 'dash-section-title-wrap' }, [
        el('h2', { className: 'dash-section-title' }, [
          el('span', { innerHTML: ICONS.clock || ICONS.activity, style: 'display:flex;align-items:center;color:var(--text-muted);' }),
          el('span', { textContent: 'Recent Activity' })
        ]),
        el('p', { className: 'dash-section-desc', textContent: 'Generators opened in your current workspace' })
      ]),
      recents.length > 0 ? el('button', {
        className: 'dash-section-action-btn',
        title: 'Clear recent activity',
        onclick: () => {
          localStorage.removeItem('huragon_recents');
          renderRecentsList(recentsListContainer);
          const kpi = qs('#dash-kpi-recents-count');
          if (kpi) kpi.textContent = '0';
        }
      }, [
        el('span', { innerHTML: ICONS.trash, style: 'display:flex;align-items:center;' }),
        el('span', { textContent: 'Clear' })
      ]) : null
    ])
  ]);

  const recentsListContainer = el('div', { className: 'dash-recents-list' });
  renderRecentsList(recentsListContainer);
  recentsCol.appendChild(recentsListContainer);
  splitSection.appendChild(recentsCol);

  // Right Column: Pinned Tools
  const pinnedCol = el('div', { className: 'dash-split-col' }, [
    el('div', { className: 'dash-section-header' }, [
      el('div', { className: 'dash-section-title-wrap' }, [
        el('h2', { className: 'dash-section-title' }, [
          el('span', { innerHTML: ICONS.star, style: 'display:flex;align-items:center;color:var(--text-muted);' }),
          el('span', { textContent: 'Pinned Tools' })
        ]),
        el('p', { className: 'dash-section-desc', textContent: 'Starred tools saved for instant one-click access' })
      ])
    ])
  ]);

  const pinnedGridContainer = el('div', { className: 'dash-pinned-grid' });
  renderPinnedGrid(pinnedGridContainer);
  pinnedCol.appendChild(pinnedGridContainer);
  splitSection.appendChild(pinnedCol);

  dashboard.appendChild(splitSection);

  // ==========================================
  // SECTION 5: Explore Categories
  // ==========================================
  const categoriesSection = el('section', { className: 'dash-section', id: 'dash-explore-categories' }, [
    el('div', { className: 'dash-section-header' }, [
      el('div', { className: 'dash-section-title-wrap' }, [
        el('h2', { className: 'dash-section-title', textContent: 'Explore Categories' }),
        el('p', { className: 'dash-section-desc', textContent: 'All 47 visual generators and design engineering utilities organized by workflow' })
      ])
    ]),
    el('div', { className: 'dash-categories-grid' },
      CATEGORIES.map(cat => {
        const catCount = cat.tools ? cat.tools.length : (cat.groups ? cat.groups.reduce((acc, g) => acc + g.tools.length, 0) : 0);
        const iconSvg = ICONS[cat.icon] || ICONS.grid;

        // Extract 3 notable tool preview tags
        let sampleTools = [];
        if (cat.tools) {
          sampleTools = cat.tools.slice(0, 3).map(t => t.name);
        } else if (cat.groups) {
          sampleTools = cat.groups.flatMap(g => g.tools).slice(0, 3).map(t => t.name);
        }

        // Target tool to open on card click
        const firstToolId = cat.tools ? cat.tools[0]?.id : cat.groups[0]?.tools[0]?.id;

        return el('div', {
          className: 'dash-category-card',
          role: 'button',
          tabIndex: 0,
          onclick: () => {
            if (firstToolId) location.hash = `#${firstToolId}`;
          },
          onkeydown: (e) => {
            if (e.key === 'Enter' && firstToolId) location.hash = `#${firstToolId}`;
          }
        }, [
          el('div', { className: 'dash-cat-header' }, [
            el('div', { className: 'dash-cat-title-row' }, [
              el('div', { className: 'dash-cat-icon', innerHTML: iconSvg }),
              el('span', { className: 'dash-cat-name', textContent: cat.name })
            ]),
            el('span', { className: 'dash-cat-badge', textContent: `${catCount} tools` })
          ]),
          el('div', { className: 'dash-cat-tags' },
            sampleTools.map(name => el('span', { className: 'dash-cat-tag', textContent: name }))
          )
        ]);
      })
    )
  ]);
  dashboard.appendChild(categoriesSection);

  // ==========================================
  // SECTION 6: Workflow Guidance ("Build a design system")
  // ==========================================
  const workflowSection = el('section', { className: 'dash-section' }, [
    el('div', { className: 'dash-workflow-card' }, [
      el('div', { className: 'dash-section-header', style: 'margin-bottom:0;' }, [
        el('div', { className: 'dash-section-title-wrap' }, [
          el('h2', { className: 'dash-section-title', textContent: 'Build a Design System' }),
          el('p', { className: 'dash-section-desc', textContent: 'Recommended 5-step engineering pipeline from core tokens to living components' })
        ])
      ]),
      el('div', { className: 'dash-workflow-steps' },
        WORKFLOW_STEPS.map(item => {
          return el('div', {
            className: 'dash-step-item',
            role: 'button',
            tabIndex: 0,
            onclick: () => { location.hash = `#${item.toolId}`; },
            onkeydown: (e) => { if (e.key === 'Enter') location.hash = `#${item.toolId}`; }
          }, [
            el('div', { className: 'dash-step-top' }, [
              el('span', { className: 'dash-step-num', textContent: item.step }),
              el('span', { className: 'dash-step-arrow', innerHTML: ICONS.arrowUpRight })
            ]),
            el('h4', { className: 'dash-step-title', textContent: item.title }),
            el('p', { className: 'dash-step-desc', textContent: item.desc }),
            el('div', { className: 'dash-step-tool' }, [
              el('span', { textContent: item.toolName })
            ])
          ]);
        })
      )
    ])
  ]);
  dashboard.appendChild(workflowSection);

  // Mount to Preview Stage
  previewStage.appendChild(dashboard);

  // Listen to external pin/unpin changes so dashboard updates immediately
  const onFavsChange = (e) => {
    const updatedFavs = e.detail || getFavourites();
    const kpi = qs('#dash-kpi-pinned-count');
    if (kpi) kpi.textContent = String(updatedFavs.length);
    renderPinnedGrid(pinnedGridContainer);
  };
  window.addEventListener('huragon:favourites-changed', onFavsChange);

  // Emit Design System Tokens Bundle to code panel
  emitDesignSystemTokens(onCodeChange);

  // Helper: Render Recents List
  function renderRecentsList(containerEl) {
    containerEl.innerHTML = '';
    const currentRecents = getRecents().slice(0, 5);

    if (currentRecents.length === 0) {
      containerEl.appendChild(
        el('div', { className: 'dash-empty-card' }, [
          el('div', { className: 'dash-empty-icon', innerHTML: ICONS.clock || ICONS.activity }),
          el('h4', { className: 'dash-empty-title', textContent: 'No recent activity yet' }),
          el('p', {
            className: 'dash-empty-text',
            textContent: 'Tools you launch from Quick Start or the sidebar will be recorded here for fast access.'
          })
        ])
      );
      return;
    }

    currentRecents.forEach(item => {
      const metaInfo = getToolMeta(item.id);
      if (!metaInfo) return;

      const iconSvg = ICONS[metaInfo.icon] || ICONS.tool;
      const row = el('div', {
        className: 'dash-recent-item',
        role: 'button',
        tabIndex: 0,
        onclick: () => { location.hash = `#${item.id}`; },
        onkeydown: (e) => { if (e.key === 'Enter') location.hash = `#${item.id}`; }
      }, [
        el('div', { className: 'dash-recent-left' }, [
          el('div', { className: 'dash-recent-icon', innerHTML: iconSvg }),
          el('div', { className: 'dash-recent-meta' }, [
            el('span', { className: 'dash-recent-name', textContent: metaInfo.name }),
            el('span', { className: 'dash-recent-cat', textContent: metaInfo.categoryName })
          ])
        ]),
        el('div', { className: 'dash-recent-right' }, [
          el('span', { className: 'dash-recent-time', textContent: formatTimeAgo(item.timestamp) }),
          el('span', { className: 'dash-recent-arrow', innerHTML: ICONS.arrowUpRight })
        ])
      ]);

      containerEl.appendChild(row);
    });
  }

  // Helper: Render Pinned Tools Grid
  function renderPinnedGrid(containerEl) {
    containerEl.innerHTML = '';
    const currentFavs = getFavourites();

    if (currentFavs.length === 0) {
      containerEl.appendChild(
        el('div', { className: 'dash-empty-card' }, [
          el('div', { className: 'dash-empty-icon', innerHTML: ICONS.star }),
          el('h4', { className: 'dash-empty-title', textContent: 'No pinned tools yet' }),
          el('p', {
            className: 'dash-empty-text',
            textContent: 'Pin your most frequent tools for one-click access using the star icon in the sidebar.'
          })
        ])
      );
      return;
    }

    currentFavs.forEach(toolId => {
      const metaInfo = getToolMeta(toolId);
      if (!metaInfo) return;

      const iconSvg = ICONS[metaInfo.icon] || ICONS.tool;
      const card = el('div', {
        className: 'dash-pinned-card',
        role: 'button',
        tabIndex: 0,
        onclick: (e) => {
          if (e.target.closest('.dash-pinned-unpin')) return;
          location.hash = `#${toolId}`;
        },
        onkeydown: (e) => {
          if (e.key === 'Enter' && !e.target.closest('.dash-pinned-unpin')) {
            location.hash = `#${toolId}`;
          }
        }
      }, [
        el('div', { className: 'dash-pinned-left' }, [
          el('span', { className: 'dash-pinned-icon', innerHTML: iconSvg }),
          el('span', { className: 'dash-pinned-title', textContent: metaInfo.name })
        ]),
        el('button', {
          className: 'dash-pinned-unpin',
          title: 'Unpin this tool',
          onclick: (e) => {
            e.stopPropagation();
            const updated = getFavourites().filter(id => id !== toolId);
            saveFavourites(updated);
            renderPinnedGrid(containerEl);
            const kpi = qs('#dash-kpi-pinned-count');
            if (kpi) kpi.textContent = String(updated.length);
          }
        }, [
          el('span', { innerHTML: ICONS.starFilled })
        ])
      ]);

      containerEl.appendChild(card);
    });
  }
}

// Generate code token payload for bottom drawer
function emitDesignSystemTokens(onCodeChange) {
  if (typeof onCodeChange !== 'function') return;

  const css = `/* Huragon/ui Design System — Core Tokens */
:root {
  /* Grayscale Palette (Zinc 50 to 950) */
  --zinc-50: #fafafa;
  --zinc-100: #f4f4f5;
  --zinc-200: #e4e4e7;
  --zinc-300: #d4d4d8;
  --zinc-400: #a1a1aa;
  --zinc-500: #71717a;
  --zinc-600: #52525b;
  --zinc-700: #3f3f46;
  --zinc-800: #27272a;
  --zinc-900: #18181b;
  --zinc-950: #09090b;

  /* Semantic Accents */
  --emerald-500: #22c55e;
  --amber-500: #f59e0b;
  --rose-500: #f43f5e;

  /* Surfaces & Borders */
  --bg-primary: var(--zinc-950);
  --surface-1: var(--zinc-900);
  --surface-2: var(--zinc-800);
  --surface-3: var(--zinc-700);
  --border: var(--zinc-800);
  --border-strong: var(--zinc-700);

  /* Typography & Spacing */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
}`;

  const tailwind = `// tailwind.config.js - Huragon/ui Monochromatic Zinc Theme
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        zinc: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
        accent: {
          emerald: '#22c55e',
          amber: '#f59e0b',
          rose: '#f43f5e',
        }
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
      }
    }
  }
};`;

  const react = `// DesignSystemProvider.jsx
import React, { createContext, useContext } from 'react';

const DesignSystemContext = createContext({
  theme: 'dark',
  tokens: {
    radius: '10px',
    fontSans: 'Inter, sans-serif',
  }
});

export const DesignSystemProvider = ({ children }) => {
  return (
    <DesignSystemContext.Provider value={{ theme: 'dark' }}>
      <div className="huragon-studio dark min-h-screen bg-zinc-950 text-zinc-50 font-sans antialiased">
        {children}
      </div>
    </DesignSystemContext.Provider>
  );
};

export const useDesignSystem = () => useContext(DesignSystemContext);`;

  const tokens = JSON.stringify({
    name: "Huragon/ui Studio Design Tokens",
    version: "1.2.0",
    theme: "zinc-monochrome",
    scales: {
      zinc: {
        "50": "#fafafa",
        "100": "#f4f4f5",
        "200": "#e4e4e7",
        "300": "#d4d4d8",
        "400": "#a1a1aa",
        "500": "#71717a",
        "600": "#52525b",
        "700": "#3f3f46",
        "800": "#27272a",
        "900": "#18181b",
        "950": "#09090b"
      },
      accents: {
        "emerald": "#22c55e",
        "amber": "#f59e0b",
        "rose": "#f43f5e"
      },
      radii: {
        "sm": "6px",
        "md": "10px",
        "lg": "14px",
        "full": "9999px"
      }
    }
  }, null, 2);

  onCodeChange({ css, tailwind, react, tokens });
}
