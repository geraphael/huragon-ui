// Main Entry Point
import { qs, qsa, el } from './utils/dom.js';
import { CATEGORIES, getToolMeta } from './tools-registry.js';
import { navigateTo } from './router.js';
import { copyToClipboard } from './clipboard.js';
import { highlightCSS } from './highlight.js';
import { state } from './state.js';
import { ICONS } from './utils/icons.js';

let latestCode = { css: '', tailwind: '' };

function boot() {
  initTheme();
  initSidebar();
  renderSidebar();
  initFavourites();
  renderLandingCategories();
  initDeviceSwitcher();
  initStageToolbar();
  initCodeTabs();
  initSearch();
  initCommandPalette();
  initRouting();
  bindGlobalEvents();
  initMobileNav();
  initStageCodeView();
  initLandingPage();
  initPWA();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

function initTheme() {
  const savedTheme = localStorage.getItem('huragon_theme') || 'dark';
  applyTheme(savedTheme);

  const themeBtn = qs('#theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const nextTheme = document.body.classList.contains('theme-light') ? 'dark' : 'light';
      applyTheme(nextTheme);
    });
  }
}

function applyTheme(theme) {
  document.body.classList.add('theme-transitioning');

  const themeIcon = qs('#theme-icon');
  if (theme === 'light') {
    document.body.classList.remove('theme-dark');
    document.body.classList.add('theme-light');
    if (themeIcon) themeIcon.innerHTML = ICONS.sun;
    localStorage.setItem('huragon_theme', 'light');
  } else {
    document.body.classList.remove('theme-light');
    document.body.classList.add('theme-dark');
    if (themeIcon) themeIcon.innerHTML = ICONS.moon;
    localStorage.setItem('huragon_theme', 'dark');
  }
  // Sync landing page theme icon if visible
  const landingThemeIcon = qs('#landing-theme-icon');
  if (landingThemeIcon) landingThemeIcon.innerHTML = theme === 'dark' ? ICONS.moon : ICONS.sun;
  window.dispatchEvent(new CustomEvent('huragon:theme-change', { detail: { theme } }));

  setTimeout(() => {
    document.body.classList.remove('theme-transitioning');
  }, 160);
}

function initSidebar() {
  const sidebar = qs('#sidebar');
  const toggleBtn = qs('#sidebar-collapse-btn');
  const toggleIcon = qs('#sidebar-toggle-icon');

  const isCollapsed = localStorage.getItem('huragon_sidebar_collapsed') === 'true';
  if (isCollapsed && sidebar && window.innerWidth > 768) {
    sidebar.classList.add('collapsed');
  }

  updateSidebarToggleIcon();

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        const backdrop = qs('#sidebar-backdrop');
        if (backdrop) backdrop.classList.remove('active');
      } else {
        sidebar.classList.toggle('collapsed');
        const collapsed = sidebar.classList.contains('collapsed');
        localStorage.setItem('huragon_sidebar_collapsed', collapsed);
        updateSidebarToggleIcon();
      }
    });
  }

  function updateSidebarToggleIcon() {
    if (!toggleIcon) return;
    const collapsed = sidebar ? sidebar.classList.contains('collapsed') : false;
    toggleIcon.innerHTML = collapsed ? ICONS.chevronRight : ICONS.chevronLeft;
  }
}

// ─── Favourites & Pinned Tools ──────────────────────────────────────────────
function getFavourites() {
  try {
    return JSON.parse(localStorage.getItem('huragon_favourites') || '[]');
  } catch (_) {
    return [];
  }
}

function saveFavourites(favs) {
  localStorage.setItem('huragon_favourites', JSON.stringify(favs));
}

function initFavourites() {
  renderPinnedSection();
  window.addEventListener('huragon:favourites-changed', () => {
    renderPinnedSection();
  });
}

function renderPinnedSection() {
  const container = qs('#sidebar-nav-container');
  if (!container) return;

  const existing = qs('#nav-pinned-section');
  if (existing) existing.remove();

  const favs = getFavourites();
  if (favs.length === 0) return;

  const pinnedSection = el('div', { id: 'nav-pinned-section', className: 'nav-pinned-section' });

  const header = el('div', { className: 'nav-pinned-header' }, [
    el('span', { innerHTML: ICONS.pin, style: 'display:flex;align-items:center;' }),
    el('span', { textContent: 'Pinned' }),
    el('span', { className: 'cat-count', textContent: favs.length, style: 'margin-left:auto;' })
  ]);
  pinnedSection.appendChild(header);

  const list = el('div', { className: 'nav-pinned-list' });

  favs.forEach(toolId => {
    const meta = getToolMeta(toolId);
    if (!meta) return;

    const iconSvg = ICONS[meta.icon] || ICONS.sliders;
    const currentActive = location.hash === `#${toolId}`;

    const removeBtn = el('button', {
      className: 'nav-item-star starred',
      title: 'Unpin this tool',
      innerHTML: ICONS.starFilled
    });

    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const current = getFavourites().filter(id => id !== toolId);
      saveFavourites(current);
      renderPinnedSection();
      window.dispatchEvent(new CustomEvent('huragon:favourites-changed', { detail: current }));
      const mainStar = qs(`.nav-item[data-tool-id="${toolId}"] .nav-item-star`);
      if (mainStar) {
        mainStar.classList.remove('starred');
        mainStar.innerHTML = ICONS.star;
        mainStar.title = 'Pin this tool';
      }
    });

    const item = el('div', {
      className: 'nav-item' + (currentActive ? ' active' : ''),
      'data-tool-id': toolId,
      'data-tooltip': `${meta.name}`,
      onclick: () => {
        location.hash = `#${toolId}`;
        const sidebar = qs('#sidebar');
        if (sidebar && window.innerWidth <= 768) {
          sidebar.classList.remove('open');
          const backdrop = qs('#sidebar-backdrop');
          if (backdrop) backdrop.classList.remove('active');
        }
      }
    }, [
      el('span', { className: 'nav-item-icon', innerHTML: iconSvg }),
      el('span', { className: 'nav-text', textContent: meta.name }),
      removeBtn
    ]);

    list.appendChild(item);
  });

  pinnedSection.appendChild(list);
  const workspaceSection = qs('#nav-workspace-section') || qs('#nav-overview-item');
  if (workspaceSection && workspaceSection.nextSibling) {
    container.insertBefore(pinnedSection, workspaceSection.nextSibling);
  } else if (workspaceSection) {
    container.appendChild(pinnedSection);
  } else {
    container.insertBefore(pinnedSection, container.firstChild);
  }
}

function renderToolNavItem(tool) {
  const navItem = el('div', {
    className: 'nav-item',
    'data-tool-id': tool.id,
    'data-tooltip': `${tool.name}`,
    onclick: () => {
      location.hash = `#${tool.id}`;
      const sidebar = qs('#sidebar');
      if (sidebar && window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        const backdrop = qs('#sidebar-backdrop');
        if (backdrop) backdrop.classList.remove('active');
      }
    }
  }, [
    el('span', { className: 'nav-item-icon', innerHTML: ICONS[tool.icon] || ICONS.sliders }),
    el('span', { className: 'nav-text', textContent: tool.name })
  ]);

  // Star / favourite button
  const favs = getFavourites();
  const isStarred = favs.includes(tool.id);
  const starBtn = el('button', {
    className: 'nav-item-star' + (isStarred ? ' starred' : ''),
    title: isStarred ? 'Remove from pinned' : 'Pin this tool',
    innerHTML: isStarred ? ICONS.starFilled : ICONS.star
  });
  starBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const currentFavs = getFavourites();
    const alreadyStarred = currentFavs.includes(tool.id);
    let newFavs;
    if (alreadyStarred) {
      newFavs = currentFavs.filter(id => id !== tool.id);
    } else {
      if (currentFavs.length >= 8) return; // max 8
      newFavs = [...currentFavs, tool.id];
    }
    saveFavourites(newFavs);
    const nowStarred = newFavs.includes(tool.id);
    starBtn.classList.toggle('starred', nowStarred);
    starBtn.innerHTML = nowStarred ? ICONS.starFilled : ICONS.star;
    starBtn.title = nowStarred ? 'Remove from pinned' : 'Pin this tool';
    renderPinnedSection();
  });
  navItem.appendChild(starBtn);
  return navItem;
}

function renderSidebar() {
  const container = qs('#sidebar-nav-container');
  if (!container) return;
  container.innerHTML = '';

  // Workspace Section (Studio Overview & Live Dashboard)
  const currentRoute = location.hash.replace('#', '') || 'overview';
  const workspaceSection = el('div', {
    id: 'nav-workspace-section',
    className: 'nav-workspace-section',
    style: 'margin-bottom: 6px;'
  });

  const overviewNav = el('div', {
    id: 'nav-overview-item',
    className: 'nav-item nav-item-overview' + (currentRoute === 'overview' ? ' active' : ''),
    'data-tool-id': 'overview',
    'data-tooltip': 'Studio Overview',
    onclick: () => {
      location.hash = '#overview';
      const sidebar = qs('#sidebar');
      if (sidebar && window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        const backdrop = qs('#sidebar-backdrop');
        if (backdrop) backdrop.classList.remove('active');
      }
    }
  }, [
    el('span', { className: 'nav-item-icon', innerHTML: ICONS.home || ICONS.layout }),
    el('span', { className: 'nav-text', textContent: 'Studio Overview' })
  ]);

  const dashboardNav = el('div', {
    id: 'nav-dashboard-item',
    className: 'nav-item nav-item-dashboard' + (currentRoute === 'app-canvas' ? ' active' : ''),
    'data-tool-id': 'app-canvas',
    'data-tooltip': 'Live Dashboard (App Canvas)',
    onclick: () => {
      location.hash = '#app-canvas';
      const sidebar = qs('#sidebar');
      if (sidebar && window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        const backdrop = qs('#sidebar-backdrop');
        if (backdrop) backdrop.classList.remove('active');
      }
    }
  }, [
    el('span', { className: 'nav-item-icon', innerHTML: ICONS.layout || ICONS.sliders }),
    el('span', { className: 'nav-text', textContent: 'Live Dashboard' })
  ]);

  workspaceSection.appendChild(overviewNav);
  workspaceSection.appendChild(dashboardNav);
  container.appendChild(workspaceSection);

  // Load per-category collapse state from localStorage
  let catStates = {};
  try {
    catStates = JSON.parse(localStorage.getItem('huragon_cat_states') || '{}');
  } catch (_) { catStates = {}; }

  CATEGORIES.forEach(cat => {
    // Default: all categories expanded
    const isCollapsed = catStates[cat.id] === true;

    // Category header row (accordion toggle)
    const chevronSpan = el('span', {
      className: 'cat-chevron',
      innerHTML: isCollapsed ? ICONS.chevronRight : ICONS.chevronDown
    });

    const totalCount = cat.tools ? cat.tools.length : 0;

    const titleRow = el('div', {
      className: 'category-title' + (isCollapsed ? ' cat-collapsed' : ''),
    }, [
      el('span', { className: 'cat-title-text', textContent: cat.name }),
      el('span', { className: 'cat-count', textContent: totalCount }),
      chevronSpan
    ]);

    // Tools list container
    const toolsList = el('div', {
      className: 'nav-tools-list' + (isCollapsed ? ' nav-tools-hidden' : '')
    });

    if (cat.tools && cat.tools.length > 0) {
      cat.tools.forEach(tool => {
        toolsList.appendChild(renderToolNavItem(tool));
      });
    }

    // Accordion toggle logic
    titleRow.addEventListener('click', () => {
      const sidebar = qs('#sidebar');
      // Don't toggle accordion in collapsed rail mode
      if (sidebar && sidebar.classList.contains('collapsed')) return;

      const nowCollapsed = !toolsList.classList.contains('nav-tools-hidden');
      toolsList.classList.toggle('nav-tools-hidden', nowCollapsed);
      titleRow.classList.toggle('cat-collapsed', nowCollapsed);
      chevronSpan.innerHTML = nowCollapsed ? ICONS.chevronRight : ICONS.chevronDown;

      // Persist state
      catStates[cat.id] = nowCollapsed;
      localStorage.setItem('huragon_cat_states', JSON.stringify(catStates));
    });

    const catBox = el('div', { className: 'nav-category', 'data-cat-id': cat.id }, [titleRow, toolsList]);
    container.appendChild(catBox);
  });

  // Render pinned section if available
  renderPinnedSection();
}

function updateBreadcrumbs(toolId) {
  const catLabel = qs('#bc-cat-label');
  const toolLabel = qs('#bc-tool-label');
  const stageRuntimeTag = qs('#stage-runtime-tag');

  if (toolId === 'overview') {
    if (catLabel) catLabel.textContent = 'Workspace';
    if (toolLabel) toolLabel.textContent = 'Overview';
    if (stageRuntimeTag) {
      const txt = stageRuntimeTag.querySelector('span:last-child');
      if (txt) txt.textContent = 'Pure ESM';
    }
    return;
  }

  const meta = getToolMeta(toolId);
  if (!meta) return;

  if (catLabel) catLabel.textContent = meta.groupName ? `${meta.categoryName} / ${meta.groupName}` : meta.categoryName;
  if (toolLabel) toolLabel.textContent = meta.name;
  if (stageRuntimeTag) {
    const txt = stageRuntimeTag.querySelector('span:last-child');
    if (txt) txt.textContent = 'Pure CSS';
  }
}

function renderLandingCategories() {
  const grid = qs('#landing-categories-grid');
  if (!grid) return;
  grid.innerHTML = '';

  CATEGORIES.forEach(cat => {
    const card = el('div', {
      className: 'feature-category-card',
      onclick: () => {
        closeLanding();
        location.hash = `#${cat.tools[0].id}`;
      }
    }, [
      el('h3', { className: 'feature-card-title', textContent: cat.name }),
      el('p', { className: 'feature-card-desc', textContent: `${cat.tools.length} dedicated design tools & layout generators.` }),
      el('div', { className: 'feature-tool-tags' }, cat.tools.slice(0, 3).map(t => el('span', { className: 'tool-tag', textContent: t.name })))
    ]);
    grid.appendChild(card);
  });
}

function initDeviceSwitcher() {
  const buttons = qsa('.device-btn');
  const previewStage = qs('#preview-stage');

  buttons.forEach(btn => {
    const iconSpan = btn.querySelector('.device-icon');
    const iconKey = iconSpan ? iconSpan.dataset.icon : null;
    if (iconSpan && iconKey && ICONS[iconKey]) {
      iconSpan.innerHTML = ICONS[iconKey];
    }

    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const dev = btn.dataset.device;

      previewStage.classList.remove('device-frame-mobile', 'device-frame-tablet', 'device-frame-laptop', 'device-frame-desktop');

      if (dev !== 'desktop') {
        previewStage.classList.add(`device-frame-${dev}`);
      }
    });
  });
}

function initStageToolbar() {
  const previewStage = qs('#preview-stage');
  const stageWrapper = qs('#stage-wrapper');

  // Background toggles
  const bgBtns = qsa('#stage-bg-toggles .stage-tool-btn');
  const savedBg = localStorage.getItem('huragon_stage_bg') || 'matrix';
  applyStageBg(savedBg);

  bgBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const bg = btn.dataset.bg;
      applyStageBg(bg);
      localStorage.setItem('huragon_stage_bg', bg);
    });
  });

  function applyStageBg(bg) {
    if (!previewStage) return;
    previewStage.classList.remove('bg-dot-matrix', 'bg-grid-wireframe', 'bg-solid-dark', 'bg-solid-light', 'bg-checker');
    bgBtns.forEach(b => b.classList.toggle('active', b.dataset.bg === bg));

    if (bg === 'matrix') previewStage.classList.add('bg-dot-matrix');
    else if (bg === 'grid') previewStage.classList.add('bg-grid-wireframe');
    else if (bg === 'dark') previewStage.classList.add('bg-solid-dark');
    else if (bg === 'light') previewStage.classList.add('bg-solid-light');
    else if (bg === 'checker') previewStage.classList.add('bg-checker');
  }

  // State tester toggles
  const stateBtns = qsa('#stage-state-tester .stage-tool-btn');
  stateBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      stateBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const testState = btn.dataset.state;
      if (previewStage) {
        previewStage.classList.remove('state-force-hover', 'state-force-focus');
        if (testState !== 'normal') {
          previewStage.classList.add(`state-force-${testState}`);
        }
      }
    });
  });

  // Stage Fullscreen toggle
  const fsBtn = qs('#stage-fullscreen-btn');
  const fsIcon = qs('#fullscreen-icon');
  if (fsIcon) fsIcon.innerHTML = ICONS.maximize;

  if (fsBtn && stageWrapper) {
    fsBtn.addEventListener('click', () => {
      stageWrapper.classList.toggle('stage-fullscreen');
      const isFs = stageWrapper.classList.contains('stage-fullscreen');
      if (fsIcon) fsIcon.innerHTML = isFs ? ICONS.minimize : ICONS.maximize;
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && stageWrapper.classList.contains('stage-fullscreen')) {
        stageWrapper.classList.remove('stage-fullscreen');
        if (fsIcon) fsIcon.innerHTML = ICONS.maximize;
      }
    });
  }
}

function initCodeTabs() {
  const tabs = qsa('.code-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.codeTab = tab.dataset.tab;
      renderCurrentCode();
    });
  });

  const copyBtn = qs('#copy-code-btn');
  if (copyBtn) {
    copyBtn.innerHTML = `${ICONS.copy} <span>Copy</span>`;
    copyBtn.addEventListener('click', () => {
      let codeText = latestCode.css;
      if (state.codeTab === 'tailwind') {
        codeText = latestCode.tailwind || latestCode.css;
      } else if (state.codeTab === 'react') {
        codeText = getReactCodeSnippet();
      } else if (state.codeTab === 'tokens') {
        codeText = getTokensJsonSnippet();
      }
      copyToClipboard(codeText);
    });
  }
}

function getTokensJsonSnippet() {
  if (latestCode.tokens) {
    return typeof latestCode.tokens === 'string' ? latestCode.tokens : JSON.stringify(latestCode.tokens, null, 2);
  }
  const tokens = {};
  const css = latestCode.css || '';
  const lines = css.split('\n');
  for (const line of lines) {
    const match = line.match(/^\s*(--[\w-]+)\s*:\s*([^;]+);/);
    if (match) {
      const varName = match[1].replace(/^--/, '');
      const value = match[2].trim();
      const isColor = varName.includes('color') || value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl');
      const isDim = varName.includes('radius') || varName.includes('width') || varName.includes('size') || varName.includes('gap') || varName.includes('padding') || value.endsWith('px') || value.endsWith('rem');
      tokens[varName] = {
        value: value,
        type: isColor ? 'color' : isDim ? 'dimension' : varName.includes('shadow') ? 'shadow' : 'custom'
      };
    }
  }
  if (Object.keys(tokens).length === 0) {
    return JSON.stringify({
      "$schema": "https://design-tokens.github.io/community-group/format/v1/schema.json",
      "token": {
        "component": {
          "value": state.currentTool || 'huragon-component',
          "type": "string"
        },
        "style": {
          "value": (latestCode.css || '').trim(),
          "type": "custom"
        }
      }
    }, null, 2);
  }
  return JSON.stringify({
    "$schema": "https://design-tokens.github.io/community-group/format/v1/schema.json",
    "token": tokens
  }, null, 2);
}

function getReactCodeSnippet() {
  if (latestCode.react) return latestCode.react;
  const rawHtml = latestCode.tailwind || latestCode.html || '';
  if (rawHtml) {
    // Convert class to className for React
    const reactJsx = rawHtml.replace(/\bclass=/g, 'className=');
    return `import React from 'react';\n\nexport default function Component() {\n  return (\n    ${reactJsx}\n  );\n}`;
  }
  return `/* CSS Snippet */\n${latestCode.css}`;
}

function onCodeChange(codeObj) {
  latestCode = codeObj;
  renderCurrentCode();
}

function renderCurrentCode() {
  const codeBody = qs('#code-output-body');
  if (!codeBody) return;
  let rawCode = latestCode.css;
  if (state.codeTab === 'tailwind') {
    rawCode = latestCode.tailwind || latestCode.css;
  } else if (state.codeTab === 'react') {
    rawCode = getReactCodeSnippet();
  } else if (state.codeTab === 'tokens') {
    rawCode = getTokensJsonSnippet();
  }
  codeBody.innerHTML = `<code>${highlightCSS(rawCode)}</code>`;
  // Keep full-bleed code view in sync
  const stageCodeContent = qs('#stage-code-content');
  if (stageCodeContent) stageCodeContent.innerHTML = highlightCSS(rawCode);
}

function initCommandPalette() {
  const overlay = qs('#command-dialog-overlay');
  const input = qs('#cmd-palette-input');
  const list = qs('#cmd-palette-list');
  const cmdSearchIcon = qs('#cmd-search-icon');
  const topCmdBtn = qs('#top-cmd-btn');
  const topCmdIcon = qs('#top-cmd-search-icon');

  if (cmdSearchIcon) cmdSearchIcon.innerHTML = ICONS.search;
  if (topCmdIcon) topCmdIcon.innerHTML = ICONS.search;

  let selectedIndex = 0;
  let filteredTools = [];

  function openPalette() {
    if (!overlay || !input) return;
    overlay.style.display = 'flex';
    input.value = '';
    renderFilteredTools('');
    setTimeout(() => input.focus(), 50);
  }

  function closePalette() {
    if (!overlay) return;
    overlay.style.display = 'none';
  }

  function renderFilteredTools(query) {
    if (!list) return;
    const q = query.toLowerCase().trim();
    filteredTools = [];

    CATEGORIES.forEach(cat => {
      cat.tools.forEach(tool => {
        if (!q || tool.name.toLowerCase().includes(q) || cat.name.toLowerCase().includes(q)) {
          filteredTools.push({ ...tool, categoryName: cat.name, categoryIcon: cat.icon });
        }
      });
    });

    selectedIndex = 0;
    list.innerHTML = '';

    if (filteredTools.length === 0) {
      list.innerHTML = `<div style="padding:24px; text-align:center; color:var(--text-dim); font-size:0.8rem;">No tools or components found matching &ldquo;${query}&rdquo;</div>`;
      return;
    }

    // Group items by category
    const grouped = {};
    filteredTools.forEach(t => {
      if (!grouped[t.categoryName]) grouped[t.categoryName] = [];
      grouped[t.categoryName].push(t);
    });

    let globalIdx = 0;
    Object.keys(grouped).forEach(catName => {
      const groupEl = el('div', { className: 'cmd-group-label', textContent: catName });
      list.appendChild(groupEl);

      grouped[catName].forEach(tool => {
        const itemIdx = globalIdx++;
        const iconSvg = ICONS[tool.icon] || ICONS[tool.categoryIcon] || ICONS.sliders;
        const itemEl = el('div', {
          className: `cmd-item ${itemIdx === selectedIndex ? 'selected' : ''}`,
          'data-tool-id': tool.id,
          onclick: () => {
            location.hash = `#${tool.id}`;
            closePalette();
          }
        }, [
          el('div', { className: 'cmd-item-left' }, [
            el('span', { className: 'cmd-item-icon', innerHTML: iconSvg }),
            el('span', { textContent: tool.name })
          ]),
          el('span', { className: 'cmd-item-cat', textContent: catName })
        ]);
        list.appendChild(itemEl);
      });
    });
  }

  if (input) {
    input.addEventListener('input', (e) => {
      renderFilteredTools(e.target.value);
    });

    input.addEventListener('keydown', (e) => {
      const items = list ? list.querySelectorAll('.cmd-item') : [];
      if (items.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % items.length;
        updateSelection(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        updateSelection(items);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (items[selectedIndex]) {
          items[selectedIndex].click();
        }
      } else if (e.key === 'Escape') {
        closePalette();
      }
    });
  }

  function updateSelection(items) {
    items.forEach((it, idx) => {
      it.classList.toggle('selected', idx === selectedIndex);
      if (idx === selectedIndex) {
        it.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closePalette();
    });
  }

  if (topCmdBtn) {
    topCmdBtn.addEventListener('click', openPalette);
  }

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openPalette();
    } else if (e.key === 'Escape' && overlay && overlay.style.display !== 'none') {
      closePalette();
    }
  });
}

function initSearch() {
  const searchInput = qs('#tool-search-input');
  if (!searchInput) return;

  const searchIcon = qs('.search-icon');
  if (searchIcon) searchIcon.innerHTML = ICONS.search;

  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    const navItems = qsa('.nav-item');
    navItems.forEach(item => {
      const txt = item.textContent.toLowerCase();
      if (!q || txt.includes(q)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      const sidebar = qs('#sidebar');
      if (sidebar && sidebar.classList.contains('collapsed')) {
        sidebar.classList.remove('collapsed');
        localStorage.setItem('huragon_sidebar_collapsed', 'false');
        const toggleIcon = qs('#sidebar-toggle-icon');
        if (toggleIcon) toggleIcon.innerHTML = ICONS.chevronLeft;
      }
      searchInput.focus();
    }
  });
}

function initRouting() {
  window.addEventListener('hashchange', () => {
    const route = location.hash.replace('#', '') || 'overview';
    navigateTo(route, onCodeChange);
    updateBreadcrumbs(route);
  });

  if (!location.hash || location.hash === '#' || location.hash === '#/') {
    location.hash = '#overview';
  } else {
    const initialRoute = location.hash.replace('#', '') || 'overview';
    navigateTo(initialRoute, onCodeChange);
    updateBreadcrumbs(initialRoute);
  }
}

function openLanding() {
  const overlay = qs('#landing-page-overlay');
  if (overlay) overlay.style.display = 'flex';
}

function closeLanding() {
  const overlay = qs('#landing-page-overlay');
  if (overlay) overlay.style.display = 'none';
}

function bindGlobalEvents() {
  const brandBtn = qs('#brand-home-btn');
  if (brandBtn) {
    brandBtn.addEventListener('click', () => {
      closeLanding();
      location.hash = '#overview';
    });
  }

  const bcBrandBtn = qs('#bc-brand-btn');
  if (bcBrandBtn) {
    bcBrandBtn.addEventListener('click', () => {
      closeLanding();
      location.hash = '#overview';
    });
  }

  const viewLandingBtn = qs('#view-landing-btn');
  if (viewLandingBtn) viewLandingBtn.addEventListener('click', openLanding);

  const closeLandingBtn = qs('#close-landing-btn');
  if (closeLandingBtn) closeLandingBtn.addEventListener('click', closeLanding);

  const heroStartBtn = qs('#hero-start-btn');
  if (heroStartBtn) {
    heroStartBtn.addEventListener('click', () => {
      closeLanding();
      location.hash = '#overview';
    });
  }

  const ghHeaderIcon = qs('#github-header-icon');
  if (ghHeaderIcon) ghHeaderIcon.innerHTML = ICONS.github;

  const sidebarGhIcon = qs('#sidebar-github-icon');
  if (sidebarGhIcon) sidebarGhIcon.innerHTML = ICONS.github;

  const sidebarAiIcon = qs('#sidebar-ai-icon');
  if (sidebarAiIcon) sidebarAiIcon.innerHTML = ICONS.bot || ICONS.sliders;

  const sidebarAiBtn = qs('#sidebar-ai-skill-btn');
  if (sidebarAiBtn) sidebarAiBtn.addEventListener('click', openGlobalAiSkillModal);

  const shareBtn = qs('#share-url-btn');
  const shareIcon = qs('#share-url-icon');
  if (shareIcon) shareIcon.innerHTML = ICONS.link;
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      copyToClipboard(window.location.href, 'Link copied to clipboard!');
    });
  }

  // AI Skill Modal Triggers
  const topAiBtn = qs('#top-ai-skill-btn');
  const landingAiBtn = qs('#landing-ai-skill-btn');
  const topAiIcon = qs('#top-ai-skill-icon');
  const landingAiIcon = qs('#landing-ai-skill-icon');

  if (topAiIcon) topAiIcon.innerHTML = ICONS.bot || ICONS.sliders;
  if (landingAiIcon) landingAiIcon.innerHTML = ICONS.bot || ICONS.sliders;

  if (topAiBtn) topAiBtn.addEventListener('click', openGlobalAiSkillModal);
  if (landingAiBtn) landingAiBtn.addEventListener('click', openGlobalAiSkillModal);
}

function openGlobalAiSkillModal() {
  const existing = qs('#global-ai-skill-modal-overlay');
  if (existing) existing.remove();

  const overlay = el('div', {
    id: 'global-ai-skill-modal-overlay',
    style: 'position:fixed; inset:0; background:rgba(0,0,0,0.65); z-index:1000; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(6px); padding:20px;'
  });

  const modalBox = el('div', {
    style: `
      width: 100%;
      max-width: 580px;
      background: var(--surface-1);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    `
  });

  const skillPrompt = `---
name: huragon-ui
description: Design, generate, and style monochromatic zinc web interfaces inspired by HeroUI and shadcn/ui. Use when building web apps, components, cards, tables, navbars, forms, and landing pages with pure CSS, Tailwind, or React JSX.
---

# Huragon/UI Design System & Agent Skill
- Monochromatic zinc grayscale palette (50-950)
- Zero pictographic emojis (monochrome SVG icons only)
- Global currency formatting with $ USD
- Pure vanilla CSS custom properties & zero build step
- Design Tokens format compatible with W3C Design Tokens Community Group`;

  modalBox.innerHTML = `
    <div style="padding:18px 22px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between;">
      <div style="display:flex; align-items:center; gap:10px;">
        <span style="display:flex; color:var(--text-primary);">${ICONS.bot || ICONS.sliders}</span>
        <div>
          <h3 style="font-size:1rem; font-weight:700; color:var(--text-primary); margin:0;">Huragon AI Coding Agent Skill</h3>
          <p style="font-size:0.72rem; color:var(--text-secondary); margin:0;">For Antigravity, Claude Code, OpenAI Codex, and Cursor</p>
        </div>
      </div>
      <button id="global-skill-close-btn" class="btn btn-ghost btn-icon">✕</button>
    </div>

    <div style="padding:22px; display:flex; flex-direction:column; gap:14px; max-height:65vh; overflow-y:auto;">
      <p style="font-size:0.8rem; color:var(--text-secondary); margin:0; line-height:1.5;">
        Install this skill into your local workspace or project instructions to ensure your AI agents output production-grade Huragon/UI design system components.
      </p>

      <div style="background:var(--surface-2); border:1px solid var(--border); border-radius:8px; padding:10px 14px; font-size:0.75rem; color:var(--text-primary); display:flex; justify-content:space-between; align-items:center;">
        <span style="font-weight:600;">Skill File Location:</span>
        <code style="font-family:var(--font-mono); color:var(--text-secondary); font-size:0.72rem;">skills/huragon-ui/SKILL.md</code>
      </div>

      <pre style="margin:0; font-family:var(--font-mono); font-size:0.72rem; line-height:1.6; color:var(--text-secondary); background:var(--bg-app); border:1px solid var(--border); border-radius:8px; padding:14px; overflow-x:auto;"><code>${skillPrompt.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
    </div>

    <div style="padding:14px 22px; background:var(--surface-2); border-top:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
      <span style="font-size:0.72rem; color:var(--text-dim);">Ready for instant agent usage</span>
      <div style="display:flex; gap:10px;">
        <button class="btn btn-outline" id="global-skill-copy-btn">Copy Skill</button>
        <button class="btn btn-primary" id="global-skill-done-btn">Done</button>
      </div>
    </div>
  `;

  overlay.appendChild(modalBox);
  document.body.appendChild(overlay);

  const closeModal = () => overlay.remove();
  qs('#global-skill-close-btn')?.addEventListener('click', closeModal);
  qs('#global-skill-done-btn')?.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  qs('#global-skill-copy-btn')?.addEventListener('click', () => {
    copyToClipboard(skillPrompt, 'AI Agent Skill copied to clipboard!');
  });
}

// ─── Mobile Bottom Navigation ────────────────────────────────────────────────
function initMobileNav() {
  // Set icons
  const mobPreviewIcon = qs('#mob-preview-icon');
  const mobControlsIcon = qs('#mob-controls-icon');
  const mobCodeIcon = qs('#mob-code-icon');
  const mobToolsIcon = qs('#mob-tools-icon');
  if (mobPreviewIcon) mobPreviewIcon.innerHTML = ICONS.eye;
  if (mobControlsIcon) mobControlsIcon.innerHTML = ICONS.sliders;
  if (mobCodeIcon) mobCodeIcon.innerHTML = ICONS.code;
  if (mobToolsIcon) mobToolsIcon.innerHTML = ICONS.sliders || ICONS.menu;

  const sidebar = qs('#sidebar');
  const backdrop = qs('#sidebar-backdrop');

  function openSidebarMobile() {
    if (sidebar) sidebar.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
  }

  function closeSidebarMobile() {
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
  }

  // Set initial tab state on mobile
  function setMobileTab(tab) {
    document.body.classList.remove('mob-tab-preview', 'mob-tab-controls', 'mob-tab-code');
    document.body.classList.add(`mob-tab-${tab}`);
    // Update active button
    const navBtns = qsa('.mobile-nav-btn');
    navBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mobileTab === tab);
    });
  }

  const navBtns = qsa('.mobile-nav-btn');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.mobileTab;
      if (tab === 'tools') {
        if (sidebar && sidebar.classList.contains('open')) {
          closeSidebarMobile();
        } else {
          openSidebarMobile();
        }
      } else {
        closeSidebarMobile();
        setMobileTab(tab);
      }
    });
  });

  // Set preview as default on mobile
  if (window.innerWidth <= 768) {
    setMobileTab('preview');
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeSidebarMobile);
  }

  // Also close sidebar on nav item click (mobile)
  document.addEventListener('click', (e) => {
    const navItem = e.target.closest('.nav-item');
    if (navItem && window.innerWidth <= 768) {
      closeSidebarMobile();
    }
  });
}

// ─── Full-Bleed Stage Code View ───────────────────────────────────────────────
function initStageCodeView() {
  // Set icons
  const previewIcon = qs('#stage-view-preview-icon');
  const codeViewIcon = qs('#stage-view-code-icon');
  const copyIcon = qs('#stage-code-copy-icon');
  const dlIcon = qs('#stage-code-download-icon');
  const expandIcon = qs('#code-expand-icon');

  if (previewIcon) previewIcon.innerHTML = ICONS.eye;
  if (codeViewIcon) codeViewIcon.innerHTML = ICONS.code;
  if (copyIcon) copyIcon.innerHTML = ICONS.copy;
  if (dlIcon) dlIcon.innerHTML = ICONS.download;
  if (expandIcon) expandIcon.innerHTML = ICONS.maximize;

  const stageCodeView = qs('#stage-code-view');
  const previewStage = qs('#preview-stage');

  // Stage view segmented toggle (Preview / Code)
  const segBtns = qsa('#stage-view-segmented .stage-tool-btn');
  segBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      segBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const view = btn.dataset.stageView;
      if (view === 'code') {
        if (stageCodeView) stageCodeView.style.display = 'flex';
        if (previewStage) previewStage.style.display = 'none';
        syncStageCodeContent();
      } else {
        if (stageCodeView) stageCodeView.style.display = 'none';
        if (previewStage) previewStage.style.display = '';
      }
    });
  });

  // Stage code tabs (CSS / Tailwind / React)
  const stageCodeTabs = qsa('.stage-code-tab');
  stageCodeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      stageCodeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.codeTab = tab.dataset.tab;
      syncStageCodeContent();
      renderCurrentCode(); // keep docked panel in sync too
    });
  });

  // Copy from full-bleed view
  const copyBtn = qs('#stage-code-copy-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      let codeText = latestCode.css;
      if (state.codeTab === 'tailwind') {
        codeText = latestCode.tailwind || latestCode.css;
      } else if (state.codeTab === 'react') {
        codeText = getReactCodeSnippet();
      } else if (state.codeTab === 'tokens') {
        codeText = getTokensJsonSnippet();
      }
      copyToClipboard(codeText);
    });
  }

  // Download from full-bleed view
  const dlBtn = qs('#stage-code-download-btn');
  if (dlBtn) {
    dlBtn.addEventListener('click', () => {
      let codeText = latestCode.css;
      let ext = 'css';
      let mime = 'text/css';
      if (state.codeTab === 'tailwind') {
        codeText = latestCode.tailwind || latestCode.css;
        ext = 'html';
        mime = 'text/html';
      } else if (state.codeTab === 'react') {
        codeText = getReactCodeSnippet();
        ext = 'jsx';
        mime = 'text/javascript';
      } else if (state.codeTab === 'tokens') {
        codeText = getTokensJsonSnippet();
        ext = 'json';
        mime = 'application/json';
      }
      const blob = new Blob([codeText], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `huragon-${state.codeTab === 'tokens' ? 'tokens' : 'component'}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // Expand icon in docked code panel -> open full-bleed view
  const expandBtn = qs('#code-expand-btn');
  if (expandBtn) {
    expandBtn.addEventListener('click', () => {
      if (stageCodeView) stageCodeView.style.display = 'flex';
      if (previewStage) previewStage.style.display = 'none';
      // Sync segmented toggle active state
      segBtns.forEach(b => b.classList.toggle('active', b.dataset.stageView === 'code'));
      syncStageCodeContent();
    });
  }
}

// Sync the stage-code-content element with current code
function syncStageCodeContent() {
  const stageCodeContent = qs('#stage-code-content');
  if (!stageCodeContent) return;
  let rawCode = latestCode.css;
  if (state.codeTab === 'tailwind') {
    rawCode = latestCode.tailwind || latestCode.css;
  } else if (state.codeTab === 'react') {
    rawCode = getReactCodeSnippet();
  } else if (state.codeTab === 'tokens') {
    rawCode = getTokensJsonSnippet();
  }
  stageCodeContent.innerHTML = highlightCSS(rawCode);
}

// ─── Landing Page Wiring ──────────────────────────────────────────────────────
function initLandingPage() {
  // Icons
  const ghIcon = qs('#landing-github-icon');
  const enterIcon = qs('#landing-enter-icon');
  const themeIcon = qs('#landing-theme-icon');

  if (ghIcon) ghIcon.innerHTML = ICONS.github;
  if (enterIcon) enterIcon.innerHTML = ICONS.arrowUpRight;
  if (themeIcon) {
    const isDark = document.body.classList.contains('theme-dark');
    themeIcon.innerHTML = isDark ? ICONS.moon : ICONS.sun;
  }

  // Landing brand -> close (go back to studio if already used, otherwise stays)
  const brandHome = qs('#landing-brand-home');
  if (brandHome) {
    brandHome.addEventListener('click', () => {
      // If the overlay is being shown as the landing (first-visit style), just
      // close it if the user has previously used the studio.
      const overlay = qs('#landing-page-overlay');
      if (overlay) overlay.style.display = 'none';
    });
  }

  // Landing theme toggle (independent from workspace theme btn)
  const landingThemeToggle = qs('#landing-theme-toggle');
  if (landingThemeToggle) {
    landingThemeToggle.addEventListener('click', () => {
      const nextTheme = document.body.classList.contains('theme-light') ? 'dark' : 'light';
      applyTheme(nextTheme);
      // Update landing theme icon
      const icon = qs('#landing-theme-icon');
      if (icon) icon.innerHTML = nextTheme === 'dark' ? ICONS.moon : ICONS.sun;
    });
  }

  // CTA Launch button
  const ctaLaunchBtn = qs('#cta-launch-btn');
  if (ctaLaunchBtn) ctaLaunchBtn.addEventListener('click', closeLanding);

  // "Explore Blocks" smooth scroll
  const heroBlocksBtn = qs('#hero-blocks-btn');
  if (heroBlocksBtn) {
    heroBlocksBtn.addEventListener('click', () => {
      const section = qs('#landing-blocks-section');
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Landing block cards -> close landing + navigate to tool
  const blockCards = qsa('.landing-block-card[data-block-tool]');
  blockCards.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      closeLanding();
      const toolId = card.dataset.blockTool;
      if (toolId) location.hash = `#${toolId}`;
    });
  });

  // Hero showcase deck tabs
  const deckTabs = qsa('.hero-deck-tab');
  const deckBody = qs('#hero-deck-body');

  const DECK_CONTENT = {
    blocks: buildDeckBlocks(),
    nav: buildDeckNav(),
    components: buildDeckComponents(),
    code: buildDeckCode()
  };

  function switchDeck(deckKey) {
    if (!deckBody) return;
    deckBody.style.opacity = '0';
    setTimeout(() => {
      deckBody.innerHTML = DECK_CONTENT[deckKey] || '';
      deckBody.style.opacity = '1';
    }, 140);
  }

  deckTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      deckTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      switchDeck(tab.dataset.deck);
    });
  });

  // Populate initial deck
  if (deckBody) {
    deckBody.style.transition = 'opacity 0.14s ease';
    switchDeck('blocks');
  }
}

// ─── Hero Deck Specimen Builders ─────────────────────────────────────────────

function buildDeckBlocks() {
  return `
    <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:14px;">
      <div style="background:var(--surface-1); border:1px solid var(--border); border-radius:10px; padding:14px 16px;">
        <div style="font-size:0.68rem; color:var(--text-dim); letter-spacing:0.05em; text-transform:uppercase; margin-bottom:4px;">Total Revenue</div>
        <div style="font-size:1.3rem; font-weight:700; color:var(--text-primary);">$45,231</div>
        <div style="font-size:0.72rem; color:var(--success); margin-top:3px;">+20.1% from last month</div>
      </div>
      <div style="background:var(--surface-1); border:1px solid var(--border); border-radius:10px; padding:14px 16px;">
        <div style="font-size:0.68rem; color:var(--text-dim); letter-spacing:0.05em; text-transform:uppercase; margin-bottom:4px;">New Orders</div>
        <div style="font-size:1.3rem; font-weight:700; color:var(--text-primary);">+2,350</div>
        <div style="font-size:0.72rem; color:var(--success); margin-top:3px;">+180.1% from last month</div>
      </div>
      <div style="background:var(--surface-1); border:1px solid var(--border); border-radius:10px; padding:14px 16px;">
        <div style="font-size:0.68rem; color:var(--text-dim); letter-spacing:0.05em; text-transform:uppercase; margin-bottom:4px;">Active Users</div>
        <div style="font-size:1.3rem; font-weight:700; color:var(--text-primary);">+12,234</div>
        <div style="font-size:0.72rem; color:var(--success); margin-top:3px;">+19% from last month</div>
      </div>
    </div>
    <div style="background:var(--surface-1); border:1px solid var(--border); border-radius:10px; padding:14px 16px;">
      <div style="font-size:0.75rem; font-weight:600; color:var(--text-secondary); margin-bottom:10px;">Revenue Velocity</div>
      <svg viewBox="0 0 400 80" style="width:100%; height:60px;" preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--text-primary)" stop-opacity="0.18"/>
            <stop offset="100%" stop-color="var(--text-primary)" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <path d="M0,65 C40,55 70,30 110,28 C150,26 180,50 220,42 C260,34 290,10 340,8 C360,7 380,12 400,10 L400,80 L0,80 Z" fill="url(#areaGrad)"/>
        <path d="M0,65 C40,55 70,30 110,28 C150,26 180,50 220,42 C260,34 290,10 340,8 C360,7 380,12 400,10" fill="none" stroke="var(--text-primary)" stroke-width="1.5" stroke-linejoin="round"/>
      </svg>
    </div>`;
}

function buildDeckNav() {
  return `
    <div style="display:flex; flex-direction:column; gap:10px; align-items:center;">
      <div style="background:var(--surface-1); border:1px solid var(--border); border-radius:9999px; padding:10px 20px; display:inline-flex; align-items:center; gap:20px; width:auto; backdrop-filter:blur(8px);">
        <span style="font-size:0.8rem; font-weight:700; color:var(--text-primary);">huragon/ui</span>
        <div style="display:flex; gap:16px;">
          <span style="font-size:0.75rem; color:var(--text-secondary); cursor:pointer;">Docs</span>
          <span style="font-size:0.75rem; color:var(--text-secondary); cursor:pointer;">Components</span>
          <span style="font-size:0.75rem; color:var(--text-secondary); cursor:pointer;">Blocks</span>
          <span style="font-size:0.75rem; color:var(--text-secondary); cursor:pointer;">GitHub</span>
        </div>
        <button style="background:var(--text-primary); color:var(--bg-primary); border:none; border-radius:9999px; padding:5px 14px; font-size:0.72rem; font-weight:600; cursor:pointer;">Get Started</button>
      </div>
      <div style="background:var(--surface-1); border:1px solid var(--border); border-radius:10px; padding:10px 18px; display:flex; align-items:center; justify-content:space-between; width:100%; box-sizing:border-box;">
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="width:26px; height:26px; background:var(--surface-2); border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:0.7rem; font-weight:700; color:var(--text-primary);">H</div>
          <span style="font-size:0.8rem; font-weight:600; color:var(--text-primary);">SaaS Enterprise Header</span>
        </div>
        <div style="display:flex; gap:10px; align-items:center;">
          <span style="font-size:0.72rem; color:var(--text-dim);">Pricing</span>
          <span style="font-size:0.72rem; color:var(--text-dim);">Blog</span>
          <div style="width:26px; height:26px; background:var(--surface-2); border-radius:9999px; display:flex; align-items:center; justify-content:center; font-size:0.65rem; color:var(--text-primary); font-weight:600;">JD</div>
        </div>
      </div>
    </div>`;
}

function buildDeckComponents() {
  return `
    <div style="display:flex; flex-direction:column; gap:12px;">
      <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
        <button style="background:var(--text-primary); color:var(--bg-primary); border:none; border-radius:7px; padding:7px 16px; font-size:0.75rem; font-weight:600; cursor:pointer;">Primary</button>
        <button style="background:transparent; color:var(--text-primary); border:1px solid var(--border); border-radius:7px; padding:7px 16px; font-size:0.75rem; font-weight:500; cursor:pointer;">Outline</button>
        <button style="background:transparent; color:var(--text-secondary); border:none; border-radius:7px; padding:7px 16px; font-size:0.75rem; cursor:pointer;">Ghost</button>
        <button style="background:var(--error); color:#fff; border:none; border-radius:7px; padding:7px 16px; font-size:0.75rem; font-weight:600; cursor:pointer;">Danger</button>
        <button style="background:var(--surface-2); color:var(--text-dim); border:1px solid var(--border); border-radius:7px; padding:7px 16px; font-size:0.75rem; cursor:pointer;" disabled>Disabled</button>
      </div>
      <div style="display:flex; gap:7px; flex-wrap:wrap; align-items:center;">
        <span style="background:var(--surface-2); border:1px solid var(--border); border-radius:9999px; padding:3px 10px; font-size:0.7rem; color:var(--text-secondary);">Design System</span>
        <span style="background:var(--success-muted); border:1px solid var(--success-border); border-radius:9999px; padding:3px 10px; font-size:0.7rem; color:var(--success);">Active</span>
        <span style="background:var(--error-muted); border:1px solid var(--error-border); border-radius:9999px; padding:3px 10px; font-size:0.7rem; color:var(--error);">Error</span>
        <span style="background:var(--warning-muted); border:1px solid var(--warning-border); border-radius:9999px; padding:3px 10px; font-size:0.7rem; color:var(--warning);">Pending</span>
        <span style="background:var(--surface-2); border:1px solid var(--border); border-radius:9999px; padding:3px 10px; font-size:0.7rem; color:var(--text-dim);">Archived</span>
      </div>
      <div style="display:flex; gap:8px;">
        <div style="flex:1; background:var(--surface-1); border:1px solid var(--border); border-radius:8px; padding:10px 12px;">
          <div style="font-size:0.68rem; color:var(--text-dim); margin-bottom:4px; text-transform:uppercase; letter-spacing:0.04em;">Email</div>
          <div style="font-size:0.8rem; color:var(--text-secondary);">hello@huragon.dev</div>
        </div>
        <div style="flex:1; background:var(--surface-1); border:1px solid var(--border); border-radius:8px; padding:10px 12px;">
          <div style="font-size:0.68rem; color:var(--text-dim); margin-bottom:4px; text-transform:uppercase; letter-spacing:0.04em;">Plan</div>
          <div style="display:flex; align-items:center; gap:5px;"><span style="width:7px;height:7px;background:var(--success);border-radius:50%;display:inline-block;"></span><span style="font-size:0.8rem; color:var(--text-secondary);">Pro · $29/mo</span></div>
        </div>
      </div>
    </div>`;
}

function buildDeckCode() {
  const snippet = `:root {
  --gradient-start: #09090b;
  --gradient-end:   #18181b;
  --accent:         #a1a1aa;
  --radius:         12px;
}

.card {
  background: linear-gradient(
    135deg,
    var(--gradient-start),
    var(--gradient-end)
  );
  border-radius: var(--radius);
  border: 1px solid #27272a;
  padding: 24px;
}`;
  return `<pre style="margin:0; font-family:var(--font-mono, 'JetBrains Mono', monospace); font-size:0.72rem; line-height:1.7; color:var(--text-secondary); overflow:auto; padding:4px 0;"><code>${snippet
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/(--[\w-]+)/g, '<span style="color:#60a5fa;">$1</span>')
    .replace(/(:[\s]+)(#[0-9a-fA-F]{3,8}|[\d.]+(?:px|rem|deg|%)?)/g, '$1<span style="color:#a3e635;">$2</span>')
    .replace(/\b(root|card)\b(?=[\s{])/g, '<span style="color:#e879f9;">$&</span>')
  }</code></pre>`;
}

let deferredPWAInstallPrompt = null;

function initPWA() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => {
          console.log('[PWA] ServiceWorker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] ServiceWorker registration failed:', err);
        });
    });
  }

  const installBtn = qs('#pwa-install-btn');
  const installIcon = qs('#pwa-install-icon');
  if (installIcon) installIcon.innerHTML = ICONS.download;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPWAInstallPrompt = e;
    if (installBtn) {
      installBtn.style.display = 'inline-flex';
    }
  });

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (!deferredPWAInstallPrompt) return;
      deferredPWAInstallPrompt.prompt();
      const { outcome } = await deferredPWAInstallPrompt.userChoice;
      console.log('[PWA] User response to install prompt:', outcome);
      deferredPWAInstallPrompt = null;
      installBtn.style.display = 'none';
    });
  }

  window.addEventListener('appinstalled', () => {
    console.log('[PWA] Huragon/ui installed successfully');
    deferredPWAInstallPrompt = null;
    if (installBtn) installBtn.style.display = 'none';
  });
}
