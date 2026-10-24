// Tool: HeroUI & shadcn/ui Navbar & Header Studio
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';

export const meta = {
  id: 'navbar-builder',
  name: 'Navbar Generator'
};

let config = {
  archetype: 'floating', // 'floating', 'saas', 'megamenu', 'minimal'
  brandText: 'Huragon Studio',
  blur: 16,
  opacity: 0.85,
  radius: 999,
  sticky: true,
  border: true,
  mobilePreview: false,
  mobileDrawerOpen: false,
  openDropdown: null // 'solutions' or 'profile' or null
};

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    id: 'navbar-stage-root',
    style: {
      width: '100%',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      background: 'var(--bg-app)',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-md)'
    }
  });

  previewStage.appendChild(centerStage);

  function getGlassBg() {
    const isLight = document.body.classList.contains('theme-light');
    return isLight ? `rgba(255, 255, 255, ${config.opacity})` : `rgba(18, 18, 22, ${config.opacity})`;
  }

  window.addEventListener('huragon:theme-change', renderNavbarStage);

  renderNavbarStage();

  function renderNavbarStage() {
    centerStage.innerHTML = '';

    // Outer mock browser frame / viewport container
    const viewportContainer = el('div', {
      style: {
        width: '100%',
        minHeight: '480px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: 'var(--bg-app)'
      }
    });

    // 1. Render Top announcement bar if megamenu archetype
    if (config.archetype === 'megamenu') {
      const announcementBar = el('div', {
        style: {
          width: '100%',
          padding: '7px 16px',
          background: 'var(--bg-input)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }
      }, [
        el('span', { style: { padding: '1px 6px', borderRadius: '4px', background: 'var(--text-main)', color: 'var(--bg-app)', fontWeight: '600', fontSize: '0.65rem' }, textContent: 'NEW' }),
        el('span', { textContent: 'Free worldwide shipping on orders over $150 — Shop Winter Collection' }),
        el('span', { style: { display: 'flex', alignItems: 'center', color: 'var(--text-main)', fontWeight: '500', cursor: 'pointer' }, innerHTML: `<span>Explore</span> ${ICONS.arrowUpRight}` })
      ]);
      viewportContainer.appendChild(announcementBar);
    }

    // 2. Render Main Navbar Component
    const navWrapper = el('div', {
      style: {
        width: '100%',
        zIndex: 40,
        position: config.sticky ? 'sticky' : 'relative',
        top: '0',
        padding: config.archetype === 'floating' ? '16px 20px 0' : '0'
      }
    });

    let navInnerHtml = '';
    let navStyle = '';

    if (config.archetype === 'floating') {
      navStyle = `
        max-width: 900px;
        margin: 0 auto;
        padding: 10px 18px;
        border-radius: ${config.radius}px;
        background: ${getGlassBg()};
        backdrop-filter: blur(${config.blur}px);
        -webkit-backdrop-filter: blur(${config.blur}px);
        border: ${config.border ? '1px solid var(--border-strong)' : 'none'};
        box-shadow: 0 16px 36px -8px rgba(0, 0, 0, 0.45);
      `;
      navInnerHtml = getFloatingIslandNavHtml();
    } else if (config.archetype === 'saas') {
      navStyle = `
        width: 100%;
        padding: 10px 24px;
        background: ${getGlassBg()};
        backdrop-filter: blur(${config.blur}px);
        -webkit-backdrop-filter: blur(${config.blur}px);
        border-bottom: ${config.border ? '1px solid var(--border)' : 'none'};
      `;
      navInnerHtml = getSaaSNavHtml();
    } else if (config.archetype === 'megamenu') {
      navStyle = `
        width: 100%;
        padding: 12px 24px;
        background: ${getGlassBg()};
        backdrop-filter: blur(${config.blur}px);
        -webkit-backdrop-filter: blur(${config.blur}px);
        border-bottom: ${config.border ? '1px solid var(--border)' : 'none'};
      `;
      navInnerHtml = getMegaMenuNavHtml();
    } else {
      // Minimalist
      navStyle = `
        width: 100%;
        padding: 14px 28px;
        background: ${getGlassBg()};
        backdrop-filter: blur(${config.blur}px);
        -webkit-backdrop-filter: blur(${config.blur}px);
        border-bottom: ${config.border ? '1px solid var(--border)' : 'none'};
      `;
      navInnerHtml = getMinimalNavHtml();
    }

    const headerEl = el('header', {
      style: navStyle,
      innerHTML: navInnerHtml
    });

    navWrapper.appendChild(headerEl);
    viewportContainer.appendChild(navWrapper);

    // 3. Render Realistic Hero Section behind the Navbar
    const heroMock = el('section', {
      style: {
        flex: 1,
        padding: '60px 24px 80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        position: 'relative'
      }
    }, [
      // Ambient radial glow behind hero
      el('div', {
        style: {
          position: 'absolute',
          top: '20%',
          width: '320px',
          height: '180px',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }
      }),
      // Pill badge
      el('div', {
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 12px',
          borderRadius: '999px',
          background: 'var(--bg-input)',
          border: '1px solid var(--border)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          marginBottom: '20px'
        }
      }, [
        el('span', { style: { width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' } }),
        el('span', { textContent: 'Production-Grade UI Architecture' }),
        el('span', { style: { color: 'var(--text-dim)' }, textContent: '→' })
      ]),
      // Main Heading
      el('h1', {
        style: {
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          fontWeight: '800',
          color: 'var(--text-main)',
          letterSpacing: '-0.03em',
          maxWidth: '680px',
          margin: '0 0 14px',
          lineHeight: '1.2'
        },
        textContent: 'Elevate Every Surface with High-Craft Navigation'
      }),
      // Subtitle
      el('p', {
        style: {
          fontSize: '0.9rem',
          color: 'var(--text-muted)',
          maxWidth: '520px',
          lineHeight: '1.6',
          margin: '0 0 28px'
        },
        textContent: 'Adaptive responsive headers featuring hardware-accelerated frosted glass physics, interactive mega menus, and zero runtime dependencies.'
      }),
      // Action Buttons
      el('div', { style: { display: 'flex', gap: '10px', alignItems: 'center' } }, [
        el('button', { className: 'btn btn-primary', style: { padding: '8px 18px', fontSize: '0.825rem', borderRadius: 'var(--radius-sm)' }, textContent: 'Start Building Free' }),
        el('button', { className: 'btn btn-outline', style: { padding: '8px 18px', fontSize: '0.825rem', borderRadius: 'var(--radius-sm)' }, textContent: 'Read Specifications' })
      ])
    ]);

    viewportContainer.appendChild(heroMock);

    // 4. Render Mobile Drawer overlay if open
    if (config.mobileDrawerOpen) {
      const mobileDrawer = el('div', {
        style: {
          position: 'absolute',
          inset: '0',
          background: document.body.classList.contains('theme-light') ? 'rgba(255, 255, 255, 0.98)' : 'rgba(9, 9, 11, 0.98)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          animation: 'fadeIn 0.15s ease'
        }
      }, [
        el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' } }, [
          el('div', { style: { fontWeight: '700', fontSize: '1rem', color: 'var(--text-main)' }, textContent: config.brandText }),
          el('button', {
            className: 'btn btn-ghost btn-icon',
            innerHTML: ICONS.close,
            onclick: () => {
              config.mobileDrawerOpen = false;
              renderNavbarStage();
            }
          })
        ]),
        el('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px', flex: '1' } }, [
          el('a', { style: { padding: '10px 0', fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-main)', borderBottom: '1px solid var(--border)' }, textContent: 'Features' }),
          el('a', { style: { padding: '10px 0', fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-main)', borderBottom: '1px solid var(--border)' }, textContent: 'Solutions' }),
          el('a', { style: { padding: '10px 0', fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-main)', borderBottom: '1px solid var(--border)' }, textContent: 'Changelog' }),
          el('a', { style: { padding: '10px 0', fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-main)', borderBottom: '1px solid var(--border)' }, textContent: 'Pricing' })
        ]),
        el('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '16px', borderTop: '1px solid var(--border)' } }, [
          el('button', { className: 'btn btn-primary', style: { width: '100%', padding: '10px' }, textContent: 'Get Started' }),
          el('button', { className: 'btn btn-outline', style: { width: '100%', padding: '10px' }, textContent: 'Sign In' })
        ])
      ]);
      viewportContainer.appendChild(mobileDrawer);
    }

    centerStage.appendChild(viewportContainer);

    bindNavbarInteractions(headerEl);
    updateCode();
  }

  // Archetype 1: Floating Capsule Island
  function getFloatingIslandNavHtml() {
    return `
      <div style="display:flex; align-items:center; justify-content:space-between; position:relative;">
        <!-- Brand -->
        <div style="display:flex; align-items:center; gap:8px; cursor:pointer;">
          <div style="width:26px; height:26px; border-radius:6px; background:var(--text-main); color:var(--bg-app); font-weight:800; font-size:0.8rem; display:flex; align-items:center; justify-content:center;">
            H
          </div>
          <span style="font-weight:700; font-size:0.875rem; color:var(--text-main); letter-spacing:-0.02em;">${config.brandText}</span>
          <span style="font-size:0.62rem; padding:1px 5px; border-radius:999px; background:var(--bg-input); border:1px solid var(--border); color:var(--text-dim); font-family:var(--font-mono);">v2.4</span>
        </div>

        <!-- Desktop Navigation Links with Mega Dropdown -->
        <nav style="display:flex; align-items:center; gap:4px; font-size:0.8rem;">
          <a class="nav-pill-link" style="padding:6px 12px; border-radius:999px; color:var(--text-main); font-weight:500; cursor:pointer; background:var(--bg-input);">
            Features
          </a>

          <div style="position:relative;">
            <button id="nav-dropdown-btn" class="nav-pill-link" style="padding:6px 12px; border-radius:999px; color:var(--text-muted); cursor:pointer; border:none; background:transparent; font-size:0.8rem; display:inline-flex; align-items:center; gap:4px;">
              <span>Solutions</span>
              ${ICONS.chevronDown}
            </button>

            <!-- HeroUI Rich Mega Dropdown Menu -->
            <div id="nav-mega-menu" style="display:${config.openDropdown === 'solutions' ? 'block' : 'none'}; position:absolute; top:calc(100% + 12px); left:-60px; width:340px; background:var(--bg-panel); border:1px solid var(--border-strong); border-radius:var(--radius-lg); padding:12px; box-shadow:0 20px 48px rgba(0,0,0,0.55); z-index:100; animation:cmdEnter 0.16s ease-out;">
              <div style="font-size:0.68rem; font-weight:600; text-transform:uppercase; color:var(--text-dim); padding:4px 8px 8px; letter-spacing:0.05em;">Capabilities</div>
              <div style="display:flex; flex-direction:column; gap:4px;">
                ${[
                  { title: 'Edge Analytics', desc: 'Real-time telemetry and metrics', icon: 'activity' },
                  { title: 'Design Tokens', desc: 'Semantic variables & dark mode', icon: 'palette' },
                  { title: 'Component Blocks', desc: 'HeroUI & shadcn copy-paste blocks', icon: 'box' }
                ].map(item => `
                  <div class="mega-menu-item" style="display:flex; align-items:center; gap:10px; padding:8px 10px; border-radius:var(--radius-sm); cursor:pointer; transition:background var(--transition-fast);">
                    <div style="width:30px; height:30px; border-radius:6px; background:var(--bg-input); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; color:var(--text-main); flex-shrink:0;">
                      ${ICONS[item.icon] || ICONS.zap}
                    </div>
                    <div>
                      <div style="font-size:0.8rem; font-weight:600; color:var(--text-main);">${item.title}</div>
                      <div style="font-size:0.7rem; color:var(--text-dim);">${item.desc}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <a class="nav-pill-link" style="padding:6px 12px; border-radius:999px; color:var(--text-muted); cursor:pointer;">Changelog</a>
          <a class="nav-pill-link" style="padding:6px 12px; border-radius:999px; color:var(--text-muted); cursor:pointer;">Pricing</a>
        </nav>

        <!-- Right Actions -->
        <div style="display:flex; align-items:center; gap:8px;">
          <button id="nav-search-shortcut" style="display:inline-flex; align-items:center; gap:6px; padding:4px 8px; border-radius:999px; background:var(--bg-input); border:1px solid var(--border); color:var(--text-dim); font-size:0.72rem; cursor:pointer;">
            ${ICONS.search}
            <kbd class="kbd" style="font-size:0.6rem; padding:1px 4px;">⌘K</kbd>
          </button>
          <button class="btn btn-primary" style="padding:6px 14px; font-size:0.75rem; border-radius:999px; font-weight:600;">
            Get Started
          </button>
          <button id="nav-mobile-toggle" class="btn btn-ghost btn-icon" style="display:none; width:30px; height:30px;">
            ${ICONS.menu}
          </button>
        </div>
      </div>
    `;
  }

  // Archetype 2: SaaS Enterprise Application Header
  function getSaaSNavHtml() {
    return `
      <div style="max-width:1240px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; gap:16px;">
        <!-- Left Org / Workspace Switcher -->
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="display:flex; align-items:center; gap:8px; cursor:pointer; padding:4px 8px; border-radius:var(--radius-sm); border:1px solid var(--border); background:var(--bg-input);">
            <div style="width:20px; height:20px; border-radius:4px; background:var(--text-main); color:var(--bg-app); font-weight:700; font-size:0.75rem; display:flex; align-items:center; justify-content:center;">H</div>
            <span style="font-weight:600; font-size:0.8rem; color:var(--text-main);">Acme Corp</span>
            <span style="color:var(--text-dim); font-size:0.75rem;">/</span>
            <span style="font-size:0.75rem; color:var(--text-muted);">Production</span>
            ${ICONS.chevronDown}
          </div>
        </div>

        <!-- Center Global Search Input -->
        <div style="flex:1; max-width:400px; position:relative; display:flex; align-items:center;">
          <span style="position:absolute; left:10px; color:var(--text-dim); display:flex;">${ICONS.search}</span>
          <input type="text" placeholder="Search resources, logs, deployments..." style="width:100%; padding:6px 36px 6px 32px; background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-sm); color:var(--text-main); font-size:0.775rem;" />
          <kbd class="kbd" style="position:absolute; right:8px; font-size:0.65rem;">⌘K</kbd>
        </div>

        <!-- Right Side User & Alerts -->
        <div style="display:flex; align-items:center; gap:10px;">
          <button class="btn btn-ghost btn-icon" title="Notifications" style="position:relative; width:32px; height:32px;">
            ${ICONS.bell}
            <span style="position:absolute; top:6px; right:6px; width:6px; height:6px; border-radius:50%; background:#22c55e;"></span>
          </button>
          <div style="position:relative;">
            <div id="nav-user-avatar" style="width:30px; height:30px; border-radius:50%; background:var(--bg-card); border:1.5px solid var(--border-strong); display:flex; align-items:center; justify-content:center; font-weight:600; font-size:0.75rem; color:var(--text-main); cursor:pointer;">
              JH
            </div>
            <!-- Profile Dropdown Menu -->
            <div id="nav-profile-menu" style="display:${config.openDropdown === 'profile' ? 'block' : 'none'}; position:absolute; top:calc(100% + 8px); right:0; width:180px; background:var(--bg-panel); border:1px solid var(--border-strong); border-radius:var(--radius-sm); padding:6px; box-shadow:var(--shadow-lg); z-index:100;">
              <div style="padding:6px 10px; font-size:0.75rem; color:var(--text-main); font-weight:600; border-bottom:1px solid var(--border);">jordan@acme.corp</div>
              <div style="padding:6px 10px; font-size:0.75rem; color:var(--text-muted); cursor:pointer;">Account Settings</div>
              <div style="padding:6px 10px; font-size:0.75rem; color:var(--text-muted); cursor:pointer;">Billing ($29/mo)</div>
              <div style="padding:6px 10px; font-size:0.75rem; color:#ef4444; cursor:pointer; border-top:1px solid var(--border);">Sign Out</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Archetype 3: E-Commerce Mega-Menu
  function getMegaMenuNavHtml() {
    return `
      <div style="max-width:1200px; margin:0 auto; display:flex; align-items:center; justify-content:space-between;">
        <div style="display:flex; align-items:center; gap:24px;">
          <div style="font-weight:700; font-size:1.05rem; color:var(--text-main); letter-spacing:-0.03em; cursor:pointer;">
            ${config.brandText}
          </div>
          <nav style="display:flex; align-items:center; gap:18px; font-size:0.825rem; color:var(--text-muted);">
            <span style="color:var(--text-main); font-weight:500; cursor:pointer;">Store</span>
            <span style="cursor:pointer;">Mechanical Keyboards</span>
            <span style="cursor:pointer;">Displays</span>
            <span style="cursor:pointer;">Accessories</span>
          </nav>
        </div>

        <div style="display:flex; align-items:center; gap:12px;">
          <span style="font-size:0.75rem; color:var(--text-dim); font-family:var(--font-mono);">$ USD</span>
          <button class="btn btn-outline" style="padding:5px 12px; font-size:0.75rem; display:inline-flex; align-items:center; gap:6px;">
            <span>Cart</span>
            <span style="padding:1px 5px; border-radius:999px; background:var(--text-main); color:var(--bg-app); font-weight:700; font-size:0.65rem;">3</span>
          </button>
          <button class="btn btn-primary" style="padding:5px 14px; font-size:0.75rem;">Checkout</button>
        </div>
      </div>
    `;
  }

  // Archetype 4: Minimal Frosted Glass
  function getMinimalNavHtml() {
    return `
      <div style="max-width:1120px; margin:0 auto; display:flex; align-items:center; justify-content:space-between;">
        <div style="font-weight:700; font-size:0.95rem; color:var(--text-main); letter-spacing:-0.02em;">
          ${config.brandText}
        </div>
        <nav style="display:flex; align-items:center; gap:20px; font-size:0.825rem; color:var(--text-muted);">
          <a style="color:var(--text-main); font-weight:500; cursor:pointer;">Docs</a>
          <a style="cursor:pointer;">Components</a>
          <a style="cursor:pointer;">Blocks</a>
          <a style="cursor:pointer;">Showcase</a>
        </nav>
        <div style="display:flex; align-items:center; gap:8px;">
          <button class="btn btn-ghost" style="font-size:0.78rem;">Sign In</button>
          <button class="btn btn-primary" style="padding:5px 14px; font-size:0.78rem;">Deploy Now</button>
        </div>
      </div>
    `;
  }

  function bindNavbarInteractions(header) {
    const dropBtn = header.querySelector('#nav-dropdown-btn');
    if (dropBtn) {
      dropBtn.onclick = (e) => {
        e.stopPropagation();
        config.openDropdown = config.openDropdown === 'solutions' ? null : 'solutions';
        renderNavbarStage();
      };
    }

    const avatarBtn = header.querySelector('#nav-user-avatar');
    if (avatarBtn) {
      avatarBtn.onclick = (e) => {
        e.stopPropagation();
        config.openDropdown = config.openDropdown === 'profile' ? null : 'profile';
        renderNavbarStage();
      };
    }

    const mobileToggle = header.querySelector('#nav-mobile-toggle');
    if (mobileToggle) {
      mobileToggle.onclick = () => {
        config.mobileDrawerOpen = true;
        renderNavbarStage();
      };
    }

    // Hover effect on mega menu items
    header.querySelectorAll('.mega-menu-item').forEach(it => {
      it.onmouseenter = () => { it.style.background = 'var(--bg-hover)'; };
      it.onmouseleave = () => { it.style.background = 'transparent'; };
    });

    document.addEventListener('click', () => {
      if (config.openDropdown) {
        config.openDropdown = null;
        renderNavbarStage();
      }
    }, { once: true });
  }

  function updateCode() {
    let css = '';
    let tailwind = '';

    if (config.archetype === 'floating') {
      css = `/* HeroUI / Linear Floating Capsule Navbar */
.navbar-capsule {
  position: ${config.sticky ? 'sticky' : 'relative'};
  top: 16px;
  max-width: 900px;
  margin: 0 auto;
  z-index: 50;
  padding: 10px 18px;
  background-color: var(--glass-bg, rgba(18, 18, 22, ${config.opacity}));
  backdrop-filter: blur(${config.blur}px);
  -webkit-backdrop-filter: blur(${config.blur}px);
  border: 1px solid var(--border-strong);
  border-radius: ${config.radius}px;
  box-shadow: 0 16px 36px -8px rgba(0, 0, 0, 0.45);
}

.nav-link {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-muted);
  transition: all 0.15s ease;
}

.nav-link:hover, .nav-link.active {
  color: var(--text-main);
  background: var(--bg-input);
}`;
      tailwind = `<!-- Floating Capsule Navbar Component -->
<header class="sticky top-4 z-50 mx-auto max-w-4xl rounded-full border border-zinc-800 bg-zinc-950/85 px-5 py-2.5 shadow-2xl backdrop-blur-md">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div class="h-6 w-6 rounded-md bg-white text-zinc-950 font-bold flex items-center justify-center text-xs">H</div>
      <span class="text-sm font-bold tracking-tight text-white">${config.brandText}</span>
    </div>
    <nav class="hidden md:flex items-center gap-2 text-xs">
      <a href="#" class="rounded-full bg-zinc-900 px-3 py-1.5 font-medium text-white">Features</a>
      <a href="#" class="rounded-full px-3 py-1.5 text-zinc-400 hover:text-white">Solutions</a>
      <a href="#" class="rounded-full px-3 py-1.5 text-zinc-400 hover:text-white">Pricing</a>
    </nav>
    <button class="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-200">
      Get Started
    </button>
  </div>
</header>`;
    } else {
      css = `/* SaaS Enterprise Sticky Navbar */
.navbar-enterprise {
  position: ${config.sticky ? 'sticky' : 'relative'};
  top: 0;
  width: 100%;
  z-index: 50;
  padding: 10px 24px;
  background-color: var(--glass-bg, rgba(18, 18, 22, ${config.opacity}));
  backdrop-filter: blur(${config.blur}px);
  -webkit-backdrop-filter: blur(${config.blur}px);
  border-bottom: 1px solid var(--border);
}`;
      tailwind = `<!-- Enterprise SaaS Navbar -->
<header class="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 px-6 py-2.5 backdrop-blur-md">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-4">
    <div class="font-bold text-white text-sm">${config.brandText}</div>
    <!-- Search Bar & Avatar -->
  </div>
</header>`;
    }

    onCodeChange({ css, tailwind });
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const sec = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', textContent: 'Navbar Archetype' }),
      el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', marginBottom: '16px' } }, [
        { id: 'floating', name: 'Floating Capsule' },
        { id: 'saas', name: 'SaaS App Header' },
        { id: 'megamenu', name: 'E-Commerce Mega' },
        { id: 'minimal', name: 'Minimal Glass' }
      ].map(a => el('button', {
        className: `btn ${config.archetype === a.id ? 'btn-primary' : 'btn-outline'}`,
        style: { fontSize: '0.72rem', padding: '6px' },
        textContent: a.name,
        onclick: () => {
          config.archetype = a.id;
          renderControls();
          renderNavbarStage();
        }
      }))),

      el('div', { className: 'section-title', textContent: 'Brand Configuration' }),
      el('div', { className: 'control-group' }, [
        el('div', { className: 'control-label-row' }, [
          el('span', { className: 'control-label', textContent: 'Brand Name' })
        ]),
        el('input', {
          type: 'text',
          value: config.brandText,
          style: { width: '100%', padding: '7px 10px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.8rem' },
          oninput: (e) => {
            config.brandText = e.target.value;
            renderNavbarStage();
          }
        })
      ]),

      el('div', { className: 'section-title', textContent: 'Physics & Blur' }),
      createSlider('Backdrop Blur', config.blur, 0, 24, (v) => { config.blur = v; renderNavbarStage(); }, 'px'),
      createSlider('Background Opacity', config.opacity, 0.3, 1.0, (v) => { config.opacity = v; renderNavbarStage(); }, '', 0.05),

      el('div', { className: 'section-title', textContent: 'Options' }),
      el('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } }, [
        el('label', { style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer' } }, [
          el('input', {
            type: 'checkbox',
            checked: config.sticky,
            onchange: (e) => {
              config.sticky = e.target.checked;
              renderNavbarStage();
            }
          }),
          el('span', { textContent: 'Sticky Position to Top' })
        ]),
        el('label', { style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer' } }, [
          el('input', {
            type: 'checkbox',
            checked: config.border,
            onchange: (e) => {
              config.border = e.target.checked;
              renderNavbarStage();
            }
          }),
          el('span', { textContent: 'Thin 1px Border Outline' })
        ]),
        el('label', { style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer', marginTop: '6px' } }, [
          el('button', {
            className: `btn ${config.mobileDrawerOpen ? 'btn-primary' : 'btn-outline'}`,
            style: { width: '100%', fontSize: '0.75rem', justifyContent: 'center' },
            textContent: config.mobileDrawerOpen ? 'Close Mobile Drawer View' : 'Simulate Mobile Drawer Menu →',
            onclick: () => {
              config.mobileDrawerOpen = !config.mobileDrawerOpen;
              renderNavbarStage();
            }
          })
        ])
      ])
    ]);

    controlsStage.appendChild(sec);
  }

  function createSlider(label, val, min, max, onChange, unit = '', step = 1) {
    const valSpan = el('span', { className: 'control-value', textContent: `${val}${unit}` });
    return el('div', { className: 'control-group' }, [
      el('div', { className: 'control-label-row' }, [
        el('span', { className: 'control-label', textContent: label }),
        valSpan
      ]),
      el('input', {
        type: 'range',
        min,
        max,
        step,
        value: val,
        oninput: (e) => {
          const v = parseFloat(e.target.value);
          valSpan.textContent = `${v}${unit}`;
          onChange(v);
        }
      })
    ]);
  }

  renderControls();
}
