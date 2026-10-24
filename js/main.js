// Main Entry Point
import { qs, qsa, el } from './utils/dom.js';
import { CATEGORIES } from './tools-registry.js';
import { navigateTo } from './router.js';
import { copyToClipboard } from './clipboard.js';
import { highlightCSS } from './highlight.js';
import { state } from './state.js';

let latestCode = { css: '', tailwind: '' };

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderSidebar();
  renderLandingCategories();
  initDeviceSwitcher();
  initCodeTabs();
  initSearch();
  initRouting();
  bindGlobalEvents();
});

function initTheme() {
  const savedTheme = localStorage.getItem('huragon_theme') || 'dark';
  applyTheme(savedTheme);

  const themeBtn = qs('#theme-toggle-btn');
  const themeIcon = qs('#theme-icon');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const nextTheme = document.body.classList.contains('theme-light') ? 'dark' : 'light';
      applyTheme(nextTheme);
    });
  }
}

function applyTheme(theme) {
  if (theme === 'light') {
    document.body.classList.remove('theme-dark');
    document.body.classList.add('theme-light');
    const icon = qs('#theme-icon');
    if (icon) icon.textContent = '☀️';
    localStorage.setItem('huragon_theme', 'light');
  } else {
    document.body.classList.remove('theme-light');
    document.body.classList.add('theme-dark');
    const icon = qs('#theme-icon');
    if (icon) icon.textContent = '🌙';
    localStorage.setItem('huragon_theme', 'dark');
  }
}

function renderSidebar() {
  const container = qs('#sidebar-nav-container');
  if (!container) return;
  container.innerHTML = '';

  CATEGORIES.forEach(cat => {
    const catBox = el('div', { className: 'nav-category' }, [
      el('div', { className: 'category-title' }, [
        el('span', { textContent: `${cat.icon} ${cat.name}` }),
        el('span', { style: { fontSize: '0.65rem', opacity: '0.7' }, textContent: cat.tools.length })
      ])
    ]);

    cat.tools.forEach(tool => {
      const navItem = el('div', {
        className: 'nav-item',
        'data-tool-id': tool.id,
        onclick: () => {
          location.hash = `#${tool.id}`;
          // Close sidebar on mobile
          qs('#sidebar').classList.remove('open');
        }
      }, [
        el('span', { className: 'nav-item-icon', textContent: cat.icon }),
        el('span', { textContent: tool.name }),
        tool.badge ? el('span', { className: 'nav-item-badge', textContent: tool.badge }) : null
      ]);

      catBox.appendChild(navItem);
    });

    container.appendChild(catBox);
  });
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
      el('div', { className: 'card-icon-bubble', textContent: cat.icon }),
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
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const dev = btn.dataset.device;

      // Reset existing device frames
      previewStage.classList.remove('device-frame-mobile', 'device-frame-tablet', 'device-frame-laptop', 'device-frame-desktop');

      if (dev !== 'desktop') {
        previewStage.classList.add(`device-frame-${dev}`);
      }
    });
  });
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

  // Shortcut ⌘K / Ctrl+K focus search
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
    }
  });
}

function initRouting() {
  window.addEventListener('hashchange', () => {
    const route = location.hash.replace('#', '') || 'mesh-gradient';
    navigateTo(route, onCodeChange);
  });

  const initialRoute = location.hash.replace('#', '') || 'mesh-gradient';
  navigateTo(initialRoute, onCodeChange);
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

  const viewLandingBtn = qs('#view-landing-btn');
  if (viewLandingBtn) viewLandingBtn.addEventListener('click', openLanding);

  const closeLandingBtn = qs('#close-landing-btn');
  if (closeLandingBtn) closeLandingBtn.addEventListener('click', closeLanding);

  const heroStartBtn = qs('#hero-start-btn');
  if (heroStartBtn) heroStartBtn.addEventListener('click', closeLanding);

  const mobileToggle = qs('#mobile-toggle-btn');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      qs('#sidebar').classList.toggle('open');
    });
  }
}
