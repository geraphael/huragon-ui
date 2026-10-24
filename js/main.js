// Main Entry Point
import { qs, qsa, el } from './utils/dom.js';
import { CATEGORIES, getToolMeta } from './tools-registry.js';
import { navigateTo } from './router.js';
import { copyToClipboard } from './clipboard.js';
import { highlightCSS } from './highlight.js';
import { state } from './state.js';
import { ICONS } from './utils/icons.js';

let latestCode = { css: '', tailwind: '' };

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSidebar();
  renderSidebar();
  renderLandingCategories();
  initDeviceSwitcher();
  initStageToolbar();
  initCodeTabs();
  initSearch();
  initRouting();
  bindGlobalEvents();
  initPWA();
});

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
}

function initSidebar() {
  const sidebar = qs('#sidebar');
  const toggleBtn = qs('#sidebar-collapse-btn');
  const toggleIcon = qs('#sidebar-toggle-icon');

  const isCollapsed = localStorage.getItem('huragon_sidebar_collapsed') === 'true';
  if (isCollapsed && sidebar) {
    sidebar.classList.add('collapsed');
  }

  updateSidebarToggleIcon();

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      const collapsed = sidebar.classList.contains('collapsed');
      localStorage.setItem('huragon_sidebar_collapsed', collapsed);
      updateSidebarToggleIcon();
    });
  }

  function updateSidebarToggleIcon() {
    if (!toggleIcon) return;
    const collapsed = sidebar ? sidebar.classList.contains('collapsed') : false;
    toggleIcon.innerHTML = collapsed ? ICONS.chevronRight : ICONS.chevronLeft;
  }
}

function renderSidebar() {
  const container = qs('#sidebar-nav-container');
  if (!container) return;
  container.innerHTML = '';

  // Load per-category collapse state from localStorage
  let catStates = {};
  try {
    catStates = JSON.parse(localStorage.getItem('huragon_cat_states') || '{}');
  } catch (_) { catStates = {}; }

  CATEGORIES.forEach(cat => {
    // Default: all categories expanded
    const isCollapsed = catStates[cat.id] === true;

    const catIconSvg = ICONS[cat.icon] || ICONS.sliders;

    // Category header row (accordion toggle)
    const chevronSpan = el('span', {
      className: 'cat-chevron',
      innerHTML: isCollapsed ? ICONS.chevronRight : ICONS.chevronDown
    });

    const titleRow = el('div', {
      className: 'category-title' + (isCollapsed ? ' cat-collapsed' : ''),
    }, [
      el('span', { className: 'cat-title-icon', innerHTML: catIconSvg }),
      el('span', { className: 'cat-title-text', textContent: cat.name }),
      el('span', { className: 'cat-count', textContent: cat.tools.length }),
      chevronSpan
    ]);

    // Tools list container
    const toolsList = el('div', {
      className: 'nav-tools-list' + (isCollapsed ? ' nav-tools-hidden' : '')
    });

    cat.tools.forEach(tool => {
      const toolIconSvg = ICONS[tool.icon] || ICONS[cat.icon] || ICONS.sliders;
      const navItem = el('div', {
        className: 'nav-item',
        'data-tool-id': tool.id,
        'data-tooltip': `${tool.name}`,
        onclick: () => {
          location.hash = `#${tool.id}`;
          qs('#sidebar').classList.remove('open');
        }
      }, [
        el('span', { className: 'nav-item-icon', innerHTML: toolIconSvg }),
        el('span', { className: 'nav-text', textContent: tool.name })
      ]);
      toolsList.appendChild(navItem);
    });

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
}

function updateBreadcrumbs(toolId) {
  const meta = getToolMeta(toolId);
  const catLabel = qs('#bc-cat-label');
  const toolLabel = qs('#bc-tool-label');
  if (!meta) return;

  const currentCategory = CATEGORIES.find(c => c.tools.some(t => t.id === toolId));
  if (catLabel && currentCategory) catLabel.textContent = currentCategory.name;
  if (toolLabel) toolLabel.textContent = meta.name;
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
      const codeText = state.codeTab === 'tailwind' && latestCode.tailwind
        ? latestCode.tailwind
        : latestCode.css;
      copyToClipboard(codeText);
    });
  }
}

function onCodeChange(codeObj) {
  latestCode = codeObj;
  renderCurrentCode();
}

function renderCurrentCode() {
  const codeBody = qs('#code-output-body');
  if (!codeBody) return;
  const rawCode = state.codeTab === 'tailwind' && latestCode.tailwind
    ? latestCode.tailwind
    : latestCode.css;
  codeBody.innerHTML = `<code>${highlightCSS(rawCode)}</code>`;
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
    const route = location.hash.replace('#', '') || 'mesh-gradient';
    navigateTo(route, onCodeChange);
    updateBreadcrumbs(route);
  });

  const initialRoute = location.hash.replace('#', '') || 'mesh-gradient';
  navigateTo(initialRoute, onCodeChange);
  updateBreadcrumbs(initialRoute);
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
  if (brandBtn) brandBtn.addEventListener('click', openLanding);

  const bcBrandBtn = qs('#bc-brand-btn');
  if (bcBrandBtn) bcBrandBtn.addEventListener('click', openLanding);

  const viewLandingBtn = qs('#view-landing-btn');
  if (viewLandingBtn) viewLandingBtn.addEventListener('click', openLanding);

  const closeLandingBtn = qs('#close-landing-btn');
  if (closeLandingBtn) closeLandingBtn.addEventListener('click', closeLanding);

  const heroStartBtn = qs('#hero-start-btn');
  if (heroStartBtn) heroStartBtn.addEventListener('click', closeLanding);

  const ghHeaderIcon = qs('#github-header-icon');
  if (ghHeaderIcon) ghHeaderIcon.innerHTML = ICONS.github;

  const mobileToggle = qs('#mobile-toggle-btn');
  if (mobileToggle) {
    mobileToggle.innerHTML = ICONS.menu;
    mobileToggle.addEventListener('click', () => {
      qs('#sidebar').classList.toggle('open');
    });
  }
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
