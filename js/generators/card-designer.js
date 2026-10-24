// Tool 9: Card Designer Generator (Deeply interactive inspired by Astra, Tavola & Cloudflare)
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';
import { copyToClipboard } from '../clipboard.js';

export const meta = {
  id: 'card-designer',
  name: 'Card Designer'
};

let config = {
  preset: 'metric', // metric, security, ticket, template, error
  radius: 12,
  padding: 20,
  hoverLift: true,
  borderGlow: false
};

const recoveryCodes = [
  '330231528', '928469218',
  '344097187', '426668272',
  '488459199', '641686636',
  '851945219', '016848291'
];

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
      gap: '20px'
    }
  });

  const cardWrapper = el('div', {
    id: 'designer-card-el',
    style: {
      width: '100%',
      maxWidth: config.preset === 'security' ? '460px' : config.preset === 'ticket' ? '360px' : '390px',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: `${config.radius}px`,
      padding: `${config.padding}px`,
      color: 'var(--text-main)',
      transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
      position: 'relative'
    }
  });

  centerStage.appendChild(cardWrapper);
  previewStage.appendChild(centerStage);

  renderCard();

  function renderCard() {
    cardWrapper.style.maxWidth = config.preset === 'security' ? '460px' : config.preset === 'ticket' ? '360px' : '390px';
    cardWrapper.style.borderRadius = `${config.radius}px`;
    cardWrapper.style.padding = `${config.padding}px`;

    if (config.hoverLift) {
      cardWrapper.onmouseenter = () => {
        cardWrapper.style.transform = 'translateY(-3px)';
        cardWrapper.style.borderColor = 'var(--border-strong)';
        cardWrapper.style.boxShadow = '0 10px 24px -4px rgba(0, 0, 0, 0.35)';
      };
      cardWrapper.onmouseleave = () => {
        cardWrapper.style.transform = 'translateY(0)';
        cardWrapper.style.borderColor = 'var(--border)';
        cardWrapper.style.boxShadow = 'none';
      };
    } else {
      cardWrapper.onmouseenter = null;
      cardWrapper.onmouseleave = null;
    }

    if (config.preset === 'metric') {
      renderMetricPreset(cardWrapper);
    } else if (config.preset === 'pricing') {
      renderPricingPreset(cardWrapper);
    } else if (config.preset === 'blur') {
      renderBlurPreset(cardWrapper);
    } else if (config.preset === 'security') {
      renderSecurityPreset(cardWrapper);
    } else if (config.preset === 'ticket') {
      renderTicketPreset(cardWrapper);
    } else if (config.preset === 'template') {
      renderTemplatePreset(cardWrapper);
    } else if (config.preset === 'error') {
      renderErrorPreset(cardWrapper);
    }

    updateCode();
  }

  // Preset 1: SaaS Analytics Metric Card (from MikroTik & SaaS Inspiration)
  function renderMetricPreset(target) {
    target.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
        <div>
          <span style="font-size:0.72rem; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-dim);">Revenue Collected</span>
          <div style="font-size:1.65rem; font-weight:700; color:var(--text-main); margin-top:2px; letter-spacing:-0.02em;">$11,664</div>
        </div>
        <span style="display:inline-flex; align-items:center; gap:4px; font-size:0.72rem; padding:3px 8px; border-radius:999px; background:rgba(16, 185, 129, 0.12); color:#10b981; border:1px solid rgba(16, 185, 129, 0.25); font-weight:600;">
          +18.4%
        </span>
      </div>

      <div style="margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-dim); margin-bottom:8px;">
          <span>Daily volume distribution</span>
          <span style="font-family:var(--font-mono); color:var(--text-muted);">43 payments</span>
        </div>
        <!-- Interactive distribution bar chart -->
        <div id="metric-bars-row" style="display:flex; align-items:flex-end; gap:6px; height:60px; padding:6px 0; border-bottom:1px solid var(--border);">
          ${[35, 55, 40, 75, 48, 90, 65, 85, 70, 95, 60, 80].map((h, i) => `
            <div class="interactive-bar-col" data-index="${i}" data-val="${h * 12}" style="flex:1; height:${h}%; background:var(--text-dim); border-radius:3px 3px 0 0; transition:all 0.15s ease; cursor:pointer;" title="Day ${i+1}: $${h*12}"></div>
          `).join('')}
        </div>
        <div id="bar-tooltip-label" style="height:18px; font-size:0.72rem; color:var(--text-muted); text-align:center; margin-top:4px;">Hover any column to inspect day data</div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; pt-2; border-top:1px solid var(--border); padding-top:10px;">
        <span style="font-size:0.72rem; color:var(--text-dim);">Avg $6,500/mo</span>
        <button class="btn btn-outline" id="metric-details-btn" style="padding:4px 10px; font-size:0.75rem; display:inline-flex; align-items:center; gap:4px;">
          <span>View Report</span>
          ${ICONS.arrowUpRight}
        </button>
      </div>
    `;

    // Interactivity: bar hover
    const bars = target.querySelectorAll('.interactive-bar-col');
    const label = target.querySelector('#bar-tooltip-label');
    bars.forEach(b => {
      b.onmouseenter = () => {
        bars.forEach(other => other.style.background = 'var(--text-dim)');
        b.style.background = 'var(--text-main)';
        b.style.transform = 'scaleY(1.08)';
        if (label) label.textContent = `Day ${parseInt(b.dataset.index) + 1}: $${b.dataset.val} · 6 transactions`;
      };
      b.onmouseleave = () => {
        b.style.transform = 'none';
        b.style.background = 'var(--text-dim)';
        if (label) label.textContent = 'Hover any column to inspect day data';
      };
    });

    const reportBtn = target.querySelector('#metric-details-btn');
    if (reportBtn) {
      reportBtn.onclick = () => {
        reportBtn.style.transform = 'scale(0.96)';
        setTimeout(() => reportBtn.style.transform = 'none', 120);
      };
    }
  }

  // Preset 2: HeroUI / shadcn Pricing Tier Block
  function renderPricingPreset(target) {
    target.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <span style="font-size:0.75rem; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-dim);">Developer Pro</span>
        <span style="font-size:0.7rem; font-weight:600; padding:2px 8px; border-radius:999px; background:var(--text-main); color:var(--bg-app);">Most Popular</span>
      </div>

      <div style="margin-bottom:16px;">
        <div style="display:flex; align-items:baseline; gap:4px;">
          <span style="font-size:2.2rem; font-weight:800; color:var(--text-main); letter-spacing:-0.03em;">$29</span>
          <span style="font-size:0.825rem; color:var(--text-dim);">/ month</span>
        </div>
        <p style="font-size:0.8rem; color:var(--text-muted); line-height:1.45; margin:4px 0 0;">
          Full access to all 50+ generative tools, priority updates, and commercial production exports.
        </p>
      </div>

      <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:20px; padding-top:14px; border-top:1px solid var(--border);">
        ${[
          'Unlimited SVG & CSS generator exports',
          'Production Tailwind & React JSX code snippets',
          'Commercial license for client projects',
          'Offline PWA desktop & mobile installation',
          'Priority Discord community support'
        ].map(item => `
          <div style="display:flex; align-items:center; gap:8px; font-size:0.8rem; color:var(--text-muted);">
            <span style="color:#22c55e; display:flex;">${ICONS.check}</span>
            <span>${item}</span>
          </div>
        `).join('')}
      </div>

      <button class="btn btn-primary" id="pricing-cta-btn" style="width:100%; padding:10px; font-size:0.85rem; font-weight:600; justify-content:center;">
        <span>Upgrade to Pro</span>
      </button>
    `;

    const btn = target.querySelector('#pricing-cta-btn');
    if (btn) {
      btn.onclick = () => {
        btn.innerHTML = `${ICONS.checkCircle} <span>Active Subscription</span>`;
        btn.style.background = '#22c55e';
        btn.style.borderColor = '#22c55e';
        btn.style.color = '#ffffff';
      };
    }
  }

  // Preset 3: HeroUI Frosted Blur Card
  function renderBlurPreset(target) {
    target.innerHTML = `
      <div style="position:relative; overflow:hidden; border-radius:calc(${config.radius}px - 2px);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <span style="font-size:0.7rem; font-weight:600; padding:2px 8px; border-radius:999px; background:rgba(255, 255, 255, 0.08); border:1px solid var(--border-strong); color:var(--text-main);">
            Next-Gen Interface
          </span>
          <span style="font-size:0.72rem; color:var(--text-dim); font-family:var(--font-mono);">v2.4.0</span>
        </div>

        <h3 style="font-size:1.15rem; font-weight:700; color:var(--text-main); margin:0 0 8px; letter-spacing:-0.02em;">
          High-Craft Design Tokens
        </h3>
        <p style="font-size:0.825rem; color:var(--text-muted); line-height:1.55; margin:0 0 20px;">
          Frosted glass surfaces with hardware-accelerated backdrop blur, high dynamic range borders, and responsive light reflection.
        </p>

        <div style="display:flex; justify-content:space-between; align-items:center; padding-top:14px; border-top:1px solid var(--border);">
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="width:8px; height:8px; border-radius:50%; background:#22c55e;"></span>
            <span style="font-size:0.75rem; color:var(--text-main); font-weight:500;">Zero Runtime Overhead</span>
          </div>
          <button class="btn btn-outline" style="padding:4px 10px; font-size:0.75rem; display:inline-flex; align-items:center; gap:4px;">
            <span>Explore</span> ${ICONS.arrowUpRight}
          </button>
        </div>
      </div>
    `;
  }

  // Preset 2: Cloudflare 2FA Recovery Codes Box (from Screenshot_20261024-200927.jpg)
  function renderSecurityPreset(target) {
    target.innerHTML = `
      <div style="margin-bottom:14px;">
        <div style="font-size:0.7rem; color:var(--text-dim); margin-bottom:4px; font-weight:500;">SECURITY & ACCESS</div>
        <h3 style="font-size:1.05rem; font-weight:600; color:var(--text-main); margin:0 0 6px;">Review and save your recovery codes</h3>
        <p style="font-size:0.78rem; color:var(--text-muted); line-height:1.45; margin:0;">
          If you get locked out of your account, you can restore access with any of the following one-time use security keys.
        </p>
      </div>

      <div style="background:var(--bg-app); border:1px dashed var(--border-strong); border-radius:var(--radius-sm); padding:16px; margin-bottom:16px;">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px 24px;">
          ${recoveryCodes.map(c => `
            <div style="font-family:var(--font-mono); font-size:0.875rem; color:var(--text-main); letter-spacing:0.08em; text-align:center; padding:4px 8px; border-radius:var(--radius-xs); background:var(--bg-input);">
              ${c}
            </div>
          `).join('')}
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
        <div style="display:flex; gap:6px;">
          <button class="btn btn-outline" id="cf-download-btn" style="padding:4px 8px; font-size:0.75rem;">
            ${ICONS.download} <span>Download</span>
          </button>
          <button class="btn btn-outline" id="cf-copy-btn" style="padding:4px 8px; font-size:0.75rem;">
            ${ICONS.copy} <span>Copy</span>
          </button>
          <button class="btn btn-outline" id="cf-print-btn" style="padding:4px 8px; font-size:0.75rem;">
            ${ICONS.printer} <span>Print</span>
          </button>
        </div>
        <button class="btn btn-primary" id="cf-next-btn" style="padding:4px 14px; font-size:0.75rem;">
          <span>Next</span>
        </button>
      </div>
    `;

    // Interactivity: Copy, Download, Print
    const copyBtn = target.querySelector('#cf-copy-btn');
    if (copyBtn) {
      copyBtn.onclick = () => {
        copyToClipboard(recoveryCodes.join('\n'));
      };
    }

    const dlBtn = target.querySelector('#cf-download-btn');
    if (dlBtn) {
      dlBtn.onclick = () => {
        const blob = new Blob([recoveryCodes.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'huragon-2fa-recovery-codes.txt';
        a.click();
        URL.revokeObjectURL(url);
      };
    }

    const printBtn = target.querySelector('#cf-print-btn');
    if (printBtn) {
      printBtn.onclick = () => {
        window.print();
      };
    }
  }

  // Preset 3: Tavola Kitchen / Task Ticket Card (from media_1792876308312_a1d2de3d.png)
  function renderTicketPreset(target) {
    target.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-family:var(--font-mono); font-weight:700; font-size:0.8rem; color:var(--text-dim);">#1062</span>
          <span style="font-size:0.68rem; padding:2px 7px; border-radius:999px; background:rgba(234, 179, 8, 0.12); color:#eab308; border:1px solid rgba(234, 179, 8, 0.25); font-weight:500;">
            21 min
          </span>
        </div>
        <span style="font-size:0.75rem; color:var(--text-dim); cursor:pointer;">···</span>
      </div>

      <div style="margin-bottom:12px;">
        <h4 style="font-size:1.1rem; font-weight:700; color:var(--text-main); margin:0 0 8px;">Table 7</h4>
        <div style="display:flex; flex-direction:column; gap:5px; font-size:0.8rem; color:var(--text-muted);">
          <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
            <input type="checkbox" style="cursor:pointer;" />
            <span>2× Tagliatelle al ragù</span>
          </label>
          <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
            <input type="checkbox" style="cursor:pointer;" />
            <span>1× Pizza Margherita</span>
          </label>
          <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
            <input type="checkbox" style="cursor:pointer;" />
            <span>1× Cacio e pepe</span>
          </label>
          <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
            <input type="checkbox" style="cursor:pointer;" />
            <span>4× Aperol spritz</span>
          </label>
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; pt-2; border-top:1px solid var(--border); padding-top:10px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-weight:700; font-size:1rem; color:var(--text-main);">$127</span>
        </div>
        <button class="btn btn-primary" id="ticket-ready-btn" style="padding:5px 12px; font-size:0.75rem; font-weight:600;">
          <span>Mark ready</span>
        </button>
      </div>
    `;

    const readyBtn = target.querySelector('#ticket-ready-btn');
    if (readyBtn) {
      readyBtn.onclick = () => {
        const isReady = readyBtn.classList.contains('ready-state');
        if (!isReady) {
          readyBtn.classList.add('ready-state');
          readyBtn.innerHTML = `${ICONS.checkCircle} <span>Ready</span>`;
          readyBtn.style.background = '#10b981';
          readyBtn.style.borderColor = '#10b981';
          readyBtn.style.color = '#ffffff';
        } else {
          readyBtn.classList.remove('ready-state');
          readyBtn.innerHTML = `<span>Mark ready</span>`;
          readyBtn.style.background = 'var(--text-main)';
          readyBtn.style.borderColor = 'var(--text-main)';
          readyBtn.style.color = 'var(--bg-app)';
        }
      };
    }
  }

  // Preset 4: DigitalOcean Starter Template Card (from Screenshot_20261024-075745.jpg)
  function renderTemplatePreset(target) {
    target.innerHTML = `
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
        <div style="width:32px; height:32px; border-radius:6px; background:var(--bg-input); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; color:var(--text-main);">
          ${ICONS.shapes}
        </div>
        <div>
          <h4 style="font-size:0.95rem; font-weight:600; color:var(--text-main); margin:0;">Nuxt.js Starter</h4>
          <span style="font-size:0.7rem; color:var(--text-dim);">Universal SSR application</span>
        </div>
      </div>

      <p style="font-size:0.8rem; color:var(--text-muted); line-height:1.45; margin:0 0 14px;">
        Build a SEO-friendly, dynamic website or full-stack application with Vue and edge routing.
      </p>

      <div style="display:flex; gap:6px; margin-bottom:16px;">
        <span style="font-size:0.68rem; padding:2px 8px; border-radius:999px; background:var(--bg-input); border:1px solid var(--border); color:var(--text-muted); font-weight:500;">Nuxt.js</span>
        <span style="font-size:0.68rem; padding:2px 8px; border-radius:999px; background:var(--bg-input); border:1px solid var(--border); color:var(--text-muted); font-weight:500;">Vue.js</span>
        <span style="font-size:0.68rem; padding:2px 8px; border-radius:999px; background:var(--bg-input); border:1px solid var(--border); color:var(--text-muted); font-weight:500;">SSR</span>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; position:relative;">
        <!-- Interactive Split Action Button -->
        <div class="split-button-container" id="template-split-btn">
          <button class="split-button-main" id="split-deploy-main">Deploy</button>
          <button class="split-button-arrow" id="split-deploy-toggle">${ICONS.chevronDown}</button>
          <div class="split-dropdown-menu" id="split-menu" style="display:none;">
            <div class="split-dropdown-item"><span>Deploy latest commit</span> ${ICONS.arrowUpRight}</div>
            <div class="split-dropdown-item"><span>Deploy with clean cache</span></div>
            <div class="split-dropdown-item"><span>Download archive</span></div>
          </div>
        </div>

        <button class="btn btn-ghost" style="padding:4px 8px; font-size:0.75rem; display:inline-flex; align-items:center; gap:4px;">
          <span>Details</span>
          ${ICONS.arrowUpRight}
        </button>
      </div>
    `;

    // Dropdown toggle
    const toggle = target.querySelector('#split-deploy-toggle');
    const menu = target.querySelector('#split-menu');
    if (toggle && menu) {
      toggle.onclick = (e) => {
        e.stopPropagation();
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
      };
      document.addEventListener('click', () => {
        if (menu) menu.style.display = 'none';
      });
    }
  }

  // Preset 5: Error / Empty State Card (from Screenshot_20261024-154534.jpg)
  function renderErrorPreset(target) {
    target.innerHTML = `
      <div style="text-align:center; padding:10px 0;">
        <div style="width:40px; height:40px; border-radius:50%; background:rgba(239, 68, 68, 0.12); color:#ef4444; display:flex; align-items:center; justify-content:center; margin:0 auto 12px;">
          ${ICONS.alertTriangle}
        </div>
        <h4 style="font-size:0.95rem; font-weight:600; color:var(--text-main); margin:0 0 6px;">Unable to load subscribers</h4>
        <p style="font-size:0.775rem; color:var(--text-muted); line-height:1.45; margin:0 0 16px; font-family:var(--font-mono);">
          Unexpected token '&lt;', "&lt;!DOCTYPE "... is not valid JSON
        </p>
        <button class="btn btn-primary" id="error-retry-btn" style="padding:6px 18px; font-size:0.775rem;">
          <span>Try again</span>
        </button>
      </div>
    `;

    const retryBtn = target.querySelector('#error-retry-btn');
    if (retryBtn) {
      retryBtn.onclick = () => {
        retryBtn.innerHTML = `<span>Connecting...</span>`;
        retryBtn.disabled = true;
        setTimeout(() => {
          retryBtn.disabled = false;
          retryBtn.innerHTML = `${ICONS.checkCircle} <span>Reconnected</span>`;
          setTimeout(() => {
            retryBtn.innerHTML = `<span>Try again</span>`;
          }, 1500);
        }, 1000);
      };
    }
  }

  function updateCode() {
    const css = `/* Huragon/ui — Interactive ${config.preset.toUpperCase()} Card */
.ui-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: ${config.radius}px;
  padding: ${config.padding}px;
  color: var(--text-main);
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

${config.hoverLift ? `.ui-card:hover {
  transform: translateY(-3px);
  border-color: var(--border-strong);
  box-shadow: 0 10px 24px -4px rgba(0, 0, 0, 0.35);
}` : ''}`;

    const tailwind = `<div class="bg-zinc-900 border border-zinc-800 rounded-[${config.radius}px] p-[${config.padding}px] text-zinc-100 ${config.hoverLift ? 'transition-all hover:-translate-y-1 hover:border-zinc-700 hover:shadow-xl' : ''}">
  <!-- Card Content for ${config.preset} -->
</div>`;

    onCodeChange({ css, tailwind });
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const sec = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', textContent: 'Card Preset Template' }),

      el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', marginBottom: '16px' } }, [
        { id: 'metric', name: 'SaaS Metric' },
        { id: 'pricing', name: 'Pricing Tier Block' },
        { id: 'blur', name: 'HeroUI Blur Card' },
        { id: 'security', name: '2FA Recovery Keys' },
        { id: 'ticket', name: 'Kitchen Task' },
        { id: 'template', name: 'Starter Template' },
        { id: 'error', name: 'Error / Empty State' }
      ].map(p => el('button', {
        className: `btn ${config.preset === p.id ? 'btn-primary' : 'btn-outline'}`,
        style: { padding: '6px 8px', fontSize: '0.72rem' },
        textContent: p.name,
        onclick: () => {
          config.preset = p.id;
          renderControls();
          renderCard();
        }
      }))),

      el('div', { className: 'section-title', textContent: 'Dimensions & Behavior' }),

      createSlider('Border Radius', config.radius, 0, 28, (v) => { config.radius = v; renderCard(); }, 'px'),
      createSlider('Internal Padding', config.padding, 12, 36, (v) => { config.padding = v; renderCard(); }, 'px'),

      el('div', { className: 'switch-container', style: { marginTop: '14px' } }, [
        el('span', { style: { fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-muted)' }, textContent: 'Hover Lift Effect' }),
        el('label', { className: 'switch' }, [
          el('input', {
            type: 'checkbox',
            checked: config.hoverLift,
            onchange: (e) => {
              config.hoverLift = e.target.checked;
              renderCard();
            }
          }),
          el('span', { className: 'slider-toggle' })
        ])
      ])
    ]);

    controlsStage.appendChild(sec);
  }

  function createSlider(label, val, min, max, onChange, unit = '') {
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
