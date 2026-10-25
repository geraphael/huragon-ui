// Tool: Living Application Canvas (Composite Dashboard)
// Combines cards, tables, charts, buttons, navbars, badges, tabs, and modals in a live interactive application.
// Features interactive aesthetic switchers: Glassmorphism, Claymorphism, Neumorphism, Cyber Matrix, and Flat Minimal,
// with feature toggles, live currency converter, interactive modal customizer, and combined CSS/Tailwind/React export.

import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';
import { copyToClipboard } from '../clipboard.js';
import { showToast } from '../components/toast.js';
import {
  catmullRomPath,
  catmullRomAreaPath,
  scaleToViewport,
  findNearestPoint,
  formatCurrency
} from '../utils/chart-math.js';
import { highlightCSS } from '../highlight.js';

export const meta = {
  id: 'app-canvas',
  name: 'App Canvas (Homescreen)'
};

// Canvas live configuration
let canvasConfig = {
  aesthetic: 'glassmorphism', // glassmorphism, claymorphism, neumorphism, cyber, flat
  accent: 'zinc',             // zinc, indigo, emerald, rose, amber
  radius: 14,                 // px
  blur: 20,                   // px
  ambientGlow: true,          // true / false
  hoverTilt: true,            // true / false
  tableDensity: 'normal',     // compact, normal, relaxed
  currency: '$',              // $, €, £, ¥, ₣
  timeRange: '30d',           // 7d, 30d, 90d, 1y
  revenueAmount: 45231.89,
  orderCount: 2350,
  customerCount: 12234,
  conversionRate: 3.42,
  searchQuery: '',
  selectedCategory: 'all'
};

// Product data table rows
let products = [
  { id: '1', name: 'AirPods Pro (2nd Gen)', sku: 'APP-002', category: 'Audio', price: 249.00, stock: 142, maxStock: 200, status: 'in-stock' },
  { id: '2', name: 'MacBook Air 15" M3', sku: 'MBA-M3-15', category: 'Hardware', price: 1199.00, stock: 48, maxStock: 100, status: 'in-stock' },
  { id: '3', name: 'Studio Display 27" 5K', sku: 'SD-5K-27', category: 'Displays', price: 1599.00, stock: 9, maxStock: 50, status: 'low-stock' },
  { id: '4', name: 'iPad Air 11" M2', sku: 'IPA-M2-11', category: 'Hardware', price: 599.00, stock: 83, maxStock: 150, status: 'in-stock' },
  { id: '5', name: 'MagSafe Duo Charger', sku: 'MSD-W01', category: 'Accessories', price: 129.00, stock: 0, maxStock: 80, status: 'pre-order' }
];

// Time range chart data curves with numerical series for mathematical projection
const CHART_TIMEFRAMES = {
  '7d': {
    values: [1420, 1980, 2650, 3120, 4890, 4210, 5680],
    labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
    revMult: 0.28,
    ordMult: 0.3
  },
  '30d': {
    values: [8400, 14200, 22100, 31800, 45231.89],
    labels: ['WEEK 1', 'WEEK 2', 'WEEK 3', 'WEEK 4', 'WEEK 5'],
    revMult: 1.0,
    ordMult: 1.0
  },
  '90d': {
    values: [28000, 52000, 89000, 124000],
    labels: ['MONTH 1', 'MONTH 2', 'MONTH 3', 'CURRENT'],
    revMult: 2.85,
    ordMult: 2.7
  },
  '1y': {
    values: [95000, 185000, 320000, 490000],
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    revMult: 11.4,
    ordMult: 10.8
  }
};

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  // Main canvas wrapper with optional ambient gradient backdrop
  const canvasWrapper = el('div', {
    id: 'composite-app-canvas',
    style: {
      position: 'relative',
      width: '100%',
      maxWidth: '1180px',
      margin: '0 auto',
      padding: '24px 16px 80px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      transition: 'all 0.3s ease'
    }
  });

  previewStage.appendChild(canvasWrapper);

  renderCanvas();
  renderControls();
  emitCode();

  function renderControls() {
    controlsStage.innerHTML = '';

    const panel = el('div', { className: 'control-section' }, [
      el('div', { className: 'control-section-header' }, [
        el('h4', { className: 'control-section-title', textContent: 'Dashboard Aesthetics' })
      ]),
      el('p', {
        style: 'font-size:0.75rem; color:var(--text-dim); margin-bottom:14px; line-height:1.4;',
        textContent: 'Switch between modern design paradigms (Glassmorphism, Claymorphism, Neumorphism, Cyber, Flat), customize components live in a modal, and export combined CSS.'
      }),

      // Aesthetic Dropdown / Pills
      el('div', { className: 'control-row', style: 'flex-direction:column; align-items:flex-start; gap:8px;' }, [
        el('label', { className: 'control-label', textContent: 'Design Style Aesthetic' }),
        el('div', { style: 'display:grid; grid-template-columns:1fr 1fr; gap:6px; width:100%;' }, [
          createAestheticBtn('glassmorphism', 'Glassmorphism'),
          createAestheticBtn('claymorphism', 'Claymorphism 3D'),
          createAestheticBtn('neumorphism', 'Neumorphism Soft'),
          createAestheticBtn('cyber', 'Cyber Matrix'),
          createAestheticBtn('flat', 'Flat Minimal (shadcn)')
        ])
      ]),

      // Modal Trigger & Export Action Buttons
      el('div', { style: 'display:flex; flex-direction:column; gap:8px; margin:16px 0;' }, [
        el('button', {
          className: 'btn btn-primary',
          style: 'width:100%; justify-content:center; gap:8px;',
          onclick: openCustomizeModal
        }, [
          el('span', { innerHTML: ICONS.sliders, style: 'display:flex;align-items:center;' }),
          el('span', { textContent: 'Customize Canvas in Modal' })
        ]),
        el('button', {
          className: 'btn btn-outline',
          style: 'width:100%; justify-content:center; gap:8px;',
          onclick: () => {
            const stageCodeView = qs('#stage-code-view');
            const pStage = qs('#preview-stage');
            if (stageCodeView) stageCodeView.style.display = 'flex';
            if (pStage) pStage.style.display = 'none';
            document.querySelectorAll('#stage-view-segmented .stage-tool-btn').forEach(b => {
              b.classList.toggle('active', b.dataset.stageView === 'code');
            });
            showToast('Exporting combined styles', ICONS.check);
          }
        }, [
          el('span', { innerHTML: ICONS.code, style: 'display:flex;align-items:center;' }),
          el('span', { textContent: 'Export Combined Bundle' })
        ]),
        el('button', {
          className: 'btn btn-outline',
          style: 'width:100%; justify-content:center; gap:8px;',
          onclick: openSkillModal
        }, [
          el('span', { innerHTML: ICONS.bot || ICONS.sparkles, style: 'display:flex;align-items:center;' }),
          el('span', { textContent: 'AI Agent Skill (Codex/Claude)' })
        ])
      ]),

      // Live Feature Toggles Section
      el('div', { className: 'control-section-header', style: 'margin-top:16px;' }, [
        el('h4', { className: 'control-section-title', textContent: 'Feature Toggles' })
      ]),

      // Ambient Mesh Glow Toggle
      createToggleRow('Ambient Mesh Glow', canvasConfig.ambientGlow, (val) => {
        canvasConfig.ambientGlow = val;
        renderCanvas();
        emitCode();
      }),

      // Hover 3D Tilt Toggle
      createToggleRow('Card Hover Perspective', canvasConfig.hoverTilt, (val) => {
        canvasConfig.hoverTilt = val;
        renderCanvas();
        emitCode();
      }),

      // Currency Selector Dropdown
      el('div', { className: 'control-row', style: 'justify-content:space-between; width:100%; margin-top:10px;' }, [
        el('label', { className: 'control-label', textContent: 'Currency Symbol' }),
        el('select', {
          style: 'background:var(--surface-2); border:1px solid var(--border); border-radius:6px; color:var(--text-primary); padding:4px 8px; font-size:0.75rem;',
          onchange: (e) => {
            canvasConfig.currency = e.target.value;
            renderCanvas();
            emitCode();
          }
        }, [
          el('option', { value: '$', textContent: '$ USD (Dollar)', selected: canvasConfig.currency === '$' }),
          el('option', { value: '€', textContent: '€ EUR (Euro)', selected: canvasConfig.currency === '€' }),
          el('option', { value: '£', textContent: '£ GBP (Pound)', selected: canvasConfig.currency === '£' }),
          el('option', { value: '¥', textContent: '¥ JPY (Yen)', selected: canvasConfig.currency === '¥' }),
          el('option', { value: '₣', textContent: '₣ CHF (Franc)', selected: canvasConfig.currency === '₣' })
        ])
      ]),

      // Table Density Dropdown
      el('div', { className: 'control-row', style: 'justify-content:space-between; width:100%; margin-top:10px;' }, [
        el('label', { className: 'control-label', textContent: 'Table Density' }),
        el('select', {
          style: 'background:var(--surface-2); border:1px solid var(--border); border-radius:6px; color:var(--text-primary); padding:4px 8px; font-size:0.75rem;',
          onchange: (e) => {
            canvasConfig.tableDensity = e.target.value;
            renderCanvas();
            emitCode();
          }
        }, [
          el('option', { value: 'compact', textContent: 'Compact (32px)', selected: canvasConfig.tableDensity === 'compact' }),
          el('option', { value: 'normal', textContent: 'Normal (44px)', selected: canvasConfig.tableDensity === 'normal' }),
          el('option', { value: 'relaxed', textContent: 'Relaxed (56px)', selected: canvasConfig.tableDensity === 'relaxed' })
        ])
      ]),

      // Accent Colors Grid
      el('div', { className: 'control-row', style: 'flex-direction:column; align-items:flex-start; gap:8px; margin-top:14px;' }, [
        el('label', { className: 'control-label', textContent: 'Accent Color Token' }),
        el('div', { style: 'display:flex; gap:6px; flex-wrap:wrap; width:100%;' }, [
          createAccentBtn('zinc', 'Zinc'),
          createAccentBtn('indigo', 'Indigo'),
          createAccentBtn('emerald', 'Emerald'),
          createAccentBtn('rose', 'Rose'),
          createAccentBtn('amber', 'Amber')
        ])
      ])
    ]);

    controlsStage.appendChild(panel);
  }

  function createAestheticBtn(key, label) {
    const isActive = canvasConfig.aesthetic === key;
    return el('button', {
      className: `btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline'}`,
      style: `font-size:0.72rem; padding:6px 10px; justify-content:center; ${key === 'flat' ? 'grid-column: span 2;' : ''}`,
      textContent: label,
      onclick: () => {
        canvasConfig.aesthetic = key;
        // Adjust radius/blur defaults based on aesthetic
        if (key === 'claymorphism') {
          canvasConfig.radius = 22;
        } else if (key === 'glassmorphism') {
          canvasConfig.radius = 16;
          canvasConfig.blur = 20;
        } else if (key === 'flat') {
          canvasConfig.radius = 8;
        } else if (key === 'cyber') {
          canvasConfig.radius = 6;
        } else if (key === 'neumorphism') {
          canvasConfig.radius = 18;
        }
        renderControls();
        renderCanvas();
        emitCode();
        showToast(`Switched to ${label}`, ICONS.check);
      }
    });
  }

  function createAccentBtn(colorKey, label) {
    const isActive = canvasConfig.accent === colorKey;
    return el('button', {
      className: `btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline'}`,
      style: 'flex:1; min-width:55px; font-size:0.7rem; padding:4px 6px;',
      textContent: label,
      onclick: () => {
        canvasConfig.accent = colorKey;
        renderControls();
        renderCanvas();
        emitCode();
      }
    });
  }

  function createToggleRow(label, initialVal, onToggle) {
    const switchId = `toggle-${label.replace(/\s+/g, '-').toLowerCase()}`;
    const row = el('div', { className: 'control-row', style: 'justify-content:space-between; width:100%; margin-top:8px;' });

    const lbl = el('label', { className: 'control-label', textContent: label });
    const switchWrap = el('label', { style: 'position:relative; display:inline-block; width:36px; height:20px; cursor:pointer;' });

    const input = el('input', {
      type: 'checkbox',
      id: switchId,
      style: 'opacity:0; width:0; height:0;',
      onchange: (e) => {
        const checked = e.target.checked;
        slider.style.backgroundColor = checked ? 'var(--text-primary)' : 'var(--surface-3)';
        knob.style.transform = checked ? 'translateX(16px)' : 'translateX(0px)';
        onToggle(checked);
      }
    });
    input.checked = initialVal;

    const slider = el('span', {
      style: `position:absolute; inset:0; background-color:${initialVal ? 'var(--text-primary)' : 'var(--surface-3)'}; border-radius:9999px; transition:0.2s;`
    });

    const knob = el('span', {
      style: `position:absolute; height:14px; width:14px; left:3px; bottom:3px; background-color:var(--bg-primary); border-radius:50%; transition:0.2s; transform:${initialVal ? 'translateX(16px)' : 'translateX(0px)'};`
    });

    switchWrap.appendChild(input);
    switchWrap.appendChild(slider);
    switchWrap.appendChild(knob);

    row.appendChild(lbl);
    row.appendChild(switchWrap);
    return row;
  }

  // ─── Style Resolver for Aesthetic Paradigms ──────────────────────────────
  function getAestheticStyles() {
    const aes = canvasConfig.aesthetic;
    const rad = `${canvasConfig.radius}px`;
    const accent = getAccentHex(canvasConfig.accent);

    if (aes === 'claymorphism') {
      return {
        cardStyle: `
          background: var(--surface-1);
          border-radius: ${rad};
          border: none;
          box-shadow: 12px 12px 28px rgba(0,0,0,0.5), inset -6px -6px 14px rgba(0,0,0,0.35), inset 6px 6px 14px rgba(255,255,255,0.06);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        `,
        hoverClass: canvasConfig.hoverTilt ? 'clay-tilt' : '',
        badgeClass: 'clay-badge'
      };
    } else if (aes === 'neumorphism') {
      return {
        cardStyle: `
          background: var(--surface-1);
          border-radius: ${rad};
          border: 1px solid rgba(255,255,255,0.03);
          box-shadow: 9px 9px 20px rgba(0,0,0,0.65), -9px -9px 20px rgba(255,255,255,0.035);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        `,
        hoverClass: canvasConfig.hoverTilt ? 'neu-tilt' : '',
        badgeClass: 'neu-badge'
      };
    } else if (aes === 'cyber') {
      return {
        cardStyle: `
          background: rgba(18, 18, 24, 0.9);
          border-radius: ${rad};
          border: 1px solid rgba(6, 182, 212, 0.35);
          box-shadow: 0 0 24px rgba(6, 182, 212, 0.12), inset 0 0 14px rgba(6, 182, 212, 0.04);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        `,
        hoverClass: canvasConfig.hoverTilt ? 'cyber-tilt' : '',
        badgeClass: 'cyber-badge'
      };
    } else if (aes === 'flat') {
      return {
        cardStyle: `
          background: var(--surface-1);
          border-radius: ${rad};
          border: 1px solid var(--border);
          box-shadow: var(--shadow-sm);
          transition: transform 0.15s ease, border-color 0.15s ease;
        `,
        hoverClass: '',
        badgeClass: 'flat-badge'
      };
    } else {
      // Default: Glassmorphism
      return {
        cardStyle: `
          background: rgba(24, 24, 27, 0.65);
          border-radius: ${rad};
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
          backdrop-filter: blur(${canvasConfig.blur}px);
          -webkit-backdrop-filter: blur(${canvasConfig.blur}px);
          transition: transform 0.2s ease, border-color 0.2s ease;
        `,
        hoverClass: canvasConfig.hoverTilt ? 'glass-tilt' : '',
        badgeClass: 'glass-badge'
      };
    }
  }

  function renderCanvas() {
    const wrapper = qs('#composite-app-canvas');
    if (!wrapper) return;

    const accentColor = getAccentHex(canvasConfig.accent);
    const { cardStyle } = getAestheticStyles();
    const curr = canvasConfig.currency;
    const timeframe = CHART_TIMEFRAMES[canvasConfig.timeRange] || CHART_TIMEFRAMES['30d'];
    const scaledPoints = scaleToViewport(timeframe.values, {
      width: 500,
      height: 160,
      padLeft: 20,
      padRight: 20,
      padTop: 20,
      padBottom: 25
    });
    const curveAreaD = catmullRomAreaPath(scaledPoints, 135);
    const curvePointsD = catmullRomPath(scaledPoints);

    // Scaled financial metrics based on time range
    const activeRevenue = canvasConfig.revenueAmount * timeframe.revMult;
    const activeOrders = Math.round(canvasConfig.orderCount * timeframe.ordMult);

    const ambientBackdrop = canvasConfig.ambientGlow ? `
      <div style="position:absolute; top:-60px; left:10%; width:340px; height:340px; background:radial-gradient(circle, ${accentColor}33 0%, transparent 70%); filter:blur(80px); pointer-events:none; z-index:0;"></div>
      <div style="position:absolute; bottom:10%; right:5%; width:380px; height:380px; background:radial-gradient(circle, #6366f128 0%, transparent 70%); filter:blur(90px); pointer-events:none; z-index:0;"></div>
    ` : '';

    wrapper.innerHTML = `
      ${ambientBackdrop}

      <!-- 1. Top Dynamic Island Application Header -->
      <header class="app-island-nav" style="
        position: relative;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 20px;
        ${cardStyle}
        gap: 16px;
      ">
        <div style="display:flex; align-items:center; gap:18px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <div style="width:28px; height:28px; border-radius:6px; background:${accentColor}; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:700; font-size:0.75rem;">H</div>
            <span style="font-size:0.85rem; font-weight:700; color:var(--text-primary); letter-spacing:-0.02em;">Acme Commerce</span>
            <span style="font-size:0.65rem; background:var(--surface-2); border:1px solid var(--border); padding:2px 7px; border-radius:9999px; color:var(--text-secondary); text-transform:uppercase; font-weight:600;">${canvasConfig.aesthetic}</span>
          </div>

          <!-- Interactive Nav links -->
          <nav style="display:flex; gap:16px; margin-left:10px;">
            <a href="#" class="nav-link active" style="font-size:0.75rem; font-weight:600; color:var(--text-primary); text-decoration:none;" onclick="event.preventDefault()">Dashboard</a>
            <a href="#" class="nav-link" style="font-size:0.75rem; color:var(--text-secondary); text-decoration:none;" onclick="event.preventDefault()">Inventory</a>
            <a href="#" class="nav-link" style="font-size:0.75rem; color:var(--text-secondary); text-decoration:none;" onclick="event.preventDefault()">Customers</a>
            <a href="#" class="nav-link" style="font-size:0.75rem; color:var(--text-secondary); text-decoration:none;" onclick="event.preventDefault()">Analytics</a>
          </nav>
        </div>

        <!-- Right Quick Controls: Currency Dropdown + Modal Customizer Button + Profile -->
        <div style="display:flex; align-items:center; gap:10px;">
          <!-- Quick Currency switcher inside dashboard -->
          <select id="canvas-quick-currency" style="background:var(--surface-2); border:1px solid var(--border); border-radius:9999px; color:var(--text-primary); padding:5px 10px; font-size:0.72rem; cursor:pointer;">
            <option value="$" ${curr === '$' ? 'selected' : ''}>$ USD</option>
            <option value="€" ${curr === '€' ? 'selected' : ''}>€ EUR</option>
            <option value="£" ${curr === '£' ? 'selected' : ''}>£ GBP</option>
            <option value="¥" ${curr === '¥' ? 'selected' : ''}>¥ JPY</option>
            <option value="₣" ${curr === '₣' ? 'selected' : ''}>₣ CHF</option>
          </select>

          <!-- Modal Trigger Button -->
          <button id="canvas-customize-btn" style="
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 14px;
            border-radius: 9999px;
            border: 1px solid var(--border);
            background: var(--surface-2);
            color: var(--text-primary);
            font-size: 0.72rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.15s ease;
          ">
            ${ICONS.sliders}
            <span>Edit in Modal</span>
          </button>

          <div style="position:relative; cursor:pointer; padding:4px;" id="canvas-notif-btn">
            <span style="display:flex; color:var(--text-secondary);">${ICONS.bell || ICONS.sliders}</span>
            <span style="position:absolute; top:2px; right:2px; width:7px; height:7px; background:var(--success); border-radius:50%; border:1px solid var(--surface-1);"></span>
          </div>

          <div style="width:28px; height:28px; border-radius:9999px; background:var(--surface-3); display:flex; align-items:center; justify-content:center; font-size:0.7rem; font-weight:600; color:var(--text-primary);">JD</div>
        </div>
      </header>

      <!-- 2. Metrics 4-Card Grid -->
      <section style="position:relative; z-index:10; display:grid; grid-template-columns:repeat(auto-fit, minmax(230px, 1fr)); gap:16px;">
        <!-- KPI 1: Gross Revenue -->
        <div class="kpi-card interactive-kpi-card" data-kpi="revenue" style="${cardStyle} padding:20px; display:flex; flex-direction:column; gap:6px; cursor:pointer; transition:transform 0.15s ease;" title="Click to customize in modal">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:0.72rem; font-weight:600; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.04em;">Gross Revenue</span>
            <span style="font-size:0.65rem; font-family:var(--font-mono); color:var(--text-dim); background:var(--surface-2); padding:2px 6px; border-radius:4px;">${curr} USD</span>
          </div>
          <div style="font-size:1.75rem; font-weight:700; color:var(--text-primary); letter-spacing:-0.03em;">
            ${curr}${activeRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style="display:flex; align-items:center; gap:4px; font-size:0.72rem; color:var(--success); font-weight:600;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
            <span>+20.1% vs previous period</span>
          </div>
        </div>

        <!-- KPI 2: Completed Orders -->
        <div class="kpi-card interactive-kpi-card" data-kpi="orders" style="${cardStyle} padding:20px; display:flex; flex-direction:column; gap:6px; cursor:pointer; transition:transform 0.15s ease;" title="Click to customize in modal">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:0.72rem; font-weight:600; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.04em;">Completed Orders</span>
            <span style="font-size:0.65rem; font-family:var(--font-mono); color:var(--text-dim); background:var(--surface-2); padding:2px 6px; border-radius:4px;">Qty</span>
          </div>
          <div style="font-size:1.75rem; font-weight:700; color:var(--text-primary); letter-spacing:-0.03em;">
            +${activeOrders.toLocaleString('en-US')}
          </div>
          <div style="display:flex; align-items:center; gap:4px; font-size:0.72rem; color:var(--success); font-weight:600;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
            <span>+180.1% vs previous period</span>
          </div>
        </div>

        <!-- KPI 3: Active Customers -->
        <div class="kpi-card interactive-kpi-card" data-kpi="customers" style="${cardStyle} padding:20px; display:flex; flex-direction:column; gap:6px; cursor:pointer; transition:transform 0.15s ease;" title="Click to customize in modal">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:0.72rem; font-weight:600; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.04em;">Active Customers</span>
            <span style="font-size:0.65rem; font-family:var(--font-mono); color:var(--text-dim); background:var(--surface-2); padding:2px 6px; border-radius:4px;">Users</span>
          </div>
          <div style="font-size:1.75rem; font-weight:700; color:var(--text-primary); letter-spacing:-0.03em;">
            +${canvasConfig.customerCount.toLocaleString('en-US')}
          </div>
          <div style="display:flex; align-items:center; gap:4px; font-size:0.72rem; color:var(--success); font-weight:600;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
            <span>+19.2% monthly recurring</span>
          </div>
        </div>

        <!-- KPI 4: Conversion Rate -->
        <div class="kpi-card interactive-kpi-card" data-kpi="conversion" style="${cardStyle} padding:20px; display:flex; flex-direction:column; gap:6px; cursor:pointer; transition:transform 0.15s ease;" title="Click to customize in modal">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:0.72rem; font-weight:600; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.04em;">Conversion Velocity</span>
            <span style="font-size:0.65rem; font-family:var(--font-mono); color:var(--text-dim); background:var(--surface-2); padding:2px 6px; border-radius:4px;">Rate</span>
          </div>
          <div style="font-size:1.75rem; font-weight:700; color:var(--text-primary); letter-spacing:-0.03em;">
            ${canvasConfig.conversionRate}%
          </div>
          <div style="display:flex; align-items:center; gap:4px; font-size:0.72rem; color:var(--success); font-weight:600;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
            <span>+4.1% funnel benchmark</span>
          </div>
        </div>
      </section>

      <!-- 3. Middle Section: Velocity Area Chart with Time Range Tabs + Live Order Stream -->
      <section style="position:relative; z-index:10; display:grid; grid-template-columns: 2fr 1.2fr; gap:16px;">
        <!-- Left: Velocity Chart Card -->
        <div style="${cardStyle} padding:22px; display:flex; flex-direction:column; gap:14px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <div>
              <h3 style="font-size:0.95rem; font-weight:700; color:var(--text-primary); margin:0 0 2px;">Transaction Velocity</h3>
              <p style="font-size:0.75rem; color:var(--text-secondary); margin:0;">Real-time checkout volume transformed across selected intervals.</p>
            </div>

            <!-- Time Range Filter Tabs -->
            <div style="display:flex; background:var(--surface-2); border:1px solid var(--border); border-radius:8px; padding:2px; gap:2px;">
              <button class="chart-time-btn ${canvasConfig.timeRange === '7d' ? 'active' : ''}" data-range="7d" style="padding:3px 8px; font-size:0.7rem; border-radius:6px; border:none; background:${canvasConfig.timeRange === '7d' ? 'var(--text-primary)' : 'transparent'}; color:${canvasConfig.timeRange === '7d' ? 'var(--bg-primary)' : 'var(--text-secondary)'}; cursor:pointer; font-weight:600;">7D</button>
              <button class="chart-time-btn ${canvasConfig.timeRange === '30d' ? 'active' : ''}" data-range="30d" style="padding:3px 8px; font-size:0.7rem; border-radius:6px; border:none; background:${canvasConfig.timeRange === '30d' ? 'var(--text-primary)' : 'transparent'}; color:${canvasConfig.timeRange === '30d' ? 'var(--bg-primary)' : 'var(--text-secondary)'}; cursor:pointer; font-weight:600;">30D</button>
              <button class="chart-time-btn ${canvasConfig.timeRange === '90d' ? 'active' : ''}" data-range="90d" style="padding:3px 8px; font-size:0.7rem; border-radius:6px; border:none; background:${canvasConfig.timeRange === '90d' ? 'var(--text-primary)' : 'transparent'}; color:${canvasConfig.timeRange === '90d' ? 'var(--bg-primary)' : 'var(--text-secondary)'}; cursor:pointer; font-weight:600;">90D</button>
              <button class="chart-time-btn ${canvasConfig.timeRange === '1y' ? 'active' : ''}" data-range="1y" style="padding:3px 8px; font-size:0.7rem; border-radius:6px; border:none; background:${canvasConfig.timeRange === '1y' ? 'var(--text-primary)' : 'transparent'}; color:${canvasConfig.timeRange === '1y' ? 'var(--bg-primary)' : 'var(--text-secondary)'}; cursor:pointer; font-weight:600;">1Y</button>
            </div>
          </div>

          <!-- SVG Area Chart with dynamic Catmull-Rom spline & crosshair -->
          <div style="width:100%; height:160px; position:relative;" id="canvas-chart-container">
            <svg id="canvas-area-svg" viewBox="0 0 500 160" style="width:100%; height:100%; overflow:visible; cursor:crosshair;" preserveAspectRatio="none">
              <defs>
                <linearGradient id="canvasAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.32"/>
                  <stop offset="100%" stop-color="${accentColor}" stop-opacity="0.0"/>
                </linearGradient>
              </defs>
              <line x1="0" y1="40" x2="500" y2="40" stroke="var(--border)" stroke-dasharray="3 3"/>
              <line x1="0" y1="80" x2="500" y2="80" stroke="var(--border)" stroke-dasharray="3 3"/>
              <line x1="0" y1="120" x2="500" y2="120" stroke="var(--border)" stroke-dasharray="3 3"/>
              <path d="${curveAreaD}" fill="url(#canvasAreaGrad)"/>
              <path d="${curvePointsD}" fill="none" stroke="${accentColor}" stroke-width="2.5" stroke-linecap="round"/>
              <line id="canvas-crosshair-line" x1="0" y1="0" x2="0" y2="135" stroke="var(--border-strong)" stroke-width="1.5" stroke-dasharray="2 2" style="display:none;"/>
              <circle id="canvas-crosshair-circle" cx="0" cy="0" r="5" fill="${accentColor}" stroke="var(--surface-1)" stroke-width="2.5" style="display:none;"/>
            </svg>
            <div id="canvas-chart-tooltip" style="display:none; position:absolute; pointer-events:none; background:var(--surface-1); border:1px solid var(--border); padding:6px 10px; border-radius:8px; box-shadow:var(--shadow-md); font-size:0.72rem; z-index:20; white-space:nowrap;"></div>
          </div>

          <div style="display:flex; justify-content:space-between; font-size:0.68rem; font-family:var(--font-mono); color:var(--text-dim); padding-top:4px;">
            ${timeframe.labels.map(l => `<span>${l}</span>`).join('')}
          </div>
        </div>

        <!-- Right: Recent Activity Card -->
        <div style="${cardStyle} padding:22px; display:flex; flex-direction:column; gap:14px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h3 style="font-size:0.95rem; font-weight:700; color:var(--text-primary); margin:0;">Live Feed</h3>
            <span style="font-size:0.7rem; color:var(--success); font-weight:600; display:flex; align-items:center; gap:4px;">
              <span style="width:6px; height:6px; background:var(--success); border-radius:50%;"></span>
              <span>Syncing</span>
            </span>
          </div>

          <div style="display:flex; flex-direction:column; gap:12px;">
            <div style="display:flex; align-items:center; justify-content:space-between; padding-bottom:10px; border-bottom:1px solid var(--border);">
              <div style="display:flex; align-items:center; gap:10px;">
                <div style="width:30px; height:30px; border-radius:50%; background:var(--surface-2); display:flex; align-items:center; justify-content:center; font-size:0.7rem; font-weight:600;">SR</div>
                <div>
                  <div style="font-size:0.78rem; font-weight:600; color:var(--text-primary);">Sophia Rivera</div>
                  <div style="font-size:0.7rem; color:var(--text-secondary);">Bought Studio Display 27"</div>
                </div>
              </div>
              <span style="font-size:0.8rem; font-weight:700; font-family:var(--font-mono); color:var(--text-primary);">${curr}1,599.00</span>
            </div>

            <div style="display:flex; align-items:center; justify-content:space-between; padding-bottom:10px; border-bottom:1px solid var(--border);">
              <div style="display:flex; align-items:center; gap:10px;">
                <div style="width:30px; height:30px; border-radius:50%; background:var(--surface-2); display:flex; align-items:center; justify-content:center; font-size:0.7rem; font-weight:600;">AL</div>
                <div>
                  <div style="font-size:0.78rem; font-weight:600; color:var(--text-primary);">Alex Thorne</div>
                  <div style="font-size:0.7rem; color:var(--text-secondary);">Bought AirPods Pro 2</div>
                </div>
              </div>
              <span style="font-size:0.8rem; font-weight:700; font-family:var(--font-mono); color:var(--text-primary);">${curr}249.00</span>
            </div>

            <div style="display:flex; align-items:center; justify-content:space-between;">
              <div style="display:flex; align-items:center; gap:10px;">
                <div style="width:30px; height:30px; border-radius:50%; background:var(--surface-2); display:flex; align-items:center; justify-content:center; font-size:0.7rem; font-weight:600;">MC</div>
                <div>
                  <div style="font-size:0.78rem; font-weight:600; color:var(--text-primary);">Marcus Chen</div>
                  <div style="font-size:0.7rem; color:var(--text-secondary);">Bought MacBook Air M3</div>
                </div>
              </div>
              <span style="font-size:0.8rem; font-weight:700; font-family:var(--font-mono); color:var(--text-primary);">${curr}1,199.00</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. E-commerce Products & Inventory Data Table -->
      <section style="position:relative; z-index:10; ${cardStyle} padding:22px; display:flex; flex-direction:column; gap:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <h3 style="font-size:0.95rem; font-weight:700; color:var(--text-primary); margin:0 0 2px;">Inventory Products</h3>
            <p style="font-size:0.75rem; color:var(--text-secondary); margin:0;">Manage prices, stock levels, and active catalog items.</p>
          </div>

          <!-- Filter & Search toolbar -->
          <div style="display:flex; align-items:center; gap:8px;">
            <div style="display:flex; align-items:center; background:var(--surface-2); border:1px solid var(--border); border-radius:9999px; padding:4px 12px; gap:6px;">
              <span style="display:flex; color:var(--text-dim);">${ICONS.search}</span>
              <input type="text" id="canvas-table-search" placeholder="Filter product..." value="${canvasConfig.searchQuery}" style="background:transparent; border:none; outline:none; font-size:0.75rem; color:var(--text-primary); width:130px;" />
            </div>

            <button class="btn btn-outline btn-sm" id="canvas-add-row-btn" style="border-radius:9999px; padding:5px 12px;">
              <span>+ Add Product</span>
            </button>
          </div>
        </div>

        <!-- Table Container -->
        <div style="width:100%; overflow-x:auto; border:1px solid var(--border); border-radius:10px;">
          <table style="width:100%; border-collapse:collapse; font-size:0.8rem; text-align:left;">
            <thead>
              <tr style="background:var(--surface-2); border-bottom:1px solid var(--border);">
                <th style="padding:${getTablePadding()}; font-weight:600; font-size:0.7rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.04em;">Product</th>
                <th style="padding:${getTablePadding()}; font-weight:600; font-size:0.7rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.04em;">Category</th>
                <th style="padding:${getTablePadding()}; font-weight:600; font-size:0.7rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.04em;">Price</th>
                <th style="padding:${getTablePadding()}; font-weight:600; font-size:0.7rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.04em;">Stock / Progress</th>
                <th style="padding:${getTablePadding()}; font-weight:600; font-size:0.7rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.04em;">Status</th>
                <th style="padding:${getTablePadding()}; font-weight:600; font-size:0.7rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.04em; text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${renderTableRows(accentColor)}
            </tbody>
          </table>
        </div>
      </section>
    `;

    // Bind event handlers
    const customizeBtn = qs('#canvas-customize-btn');
    if (customizeBtn) customizeBtn.addEventListener('click', openCustomizeModal);

    const addRowBtn = qs('#canvas-add-row-btn');
    if (addRowBtn) addRowBtn.addEventListener('click', openAddProductModal);

    const quickCurr = qs('#canvas-quick-currency');
    if (quickCurr) {
      quickCurr.addEventListener('change', (e) => {
        canvasConfig.currency = e.target.value;
        renderCanvas();
        renderControls();
        emitCode();
        showToast(`Currency changed to ${canvasConfig.currency}`, ICONS.check);
      });
    }

    const searchInput = qs('#canvas-table-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        canvasConfig.searchQuery = e.target.value.toLowerCase().trim();
        renderCanvas();
      });
    }

    // Area Chart interactive crosshair tracking
    const chartSvg = qs('#canvas-area-svg');
    const crosshairLine = qs('#canvas-crosshair-line');
    const crosshairCircle = qs('#canvas-crosshair-circle');
    const tooltip = qs('#canvas-chart-tooltip');
    const chartContainer = qs('#canvas-chart-container');

    if (chartSvg && crosshairLine && crosshairCircle && tooltip && chartContainer) {
      chartSvg.addEventListener('mousemove', (e) => {
        const rect = chartSvg.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const svgX = (mouseX / rect.width) * 500;
        const nearest = findNearestPoint(svgX, scaledPoints);
        if (!nearest) return;

        crosshairLine.setAttribute('x1', nearest.x);
        crosshairLine.setAttribute('x2', nearest.x);
        crosshairLine.style.display = 'block';

        crosshairCircle.setAttribute('cx', nearest.x);
        crosshairCircle.setAttribute('cy', nearest.y);
        crosshairCircle.style.display = 'block';

        const label = timeframe.labels[nearest.index] || '';
        const formattedVal = formatCurrency(nearest.value, canvasConfig.currency);
        tooltip.innerHTML = `
          <div style="font-size:0.65rem; color:var(--text-secondary); text-transform:uppercase; font-weight:600;">${label}</div>
          <div style="font-size:0.85rem; font-weight:700; color:var(--text-primary); font-family:var(--font-mono);">${formattedVal}</div>
        `;
        tooltip.style.display = 'block';

        const containerRect = chartContainer.getBoundingClientRect();
        const tooltipX = Math.max(10, Math.min(containerRect.width - 120, e.clientX - containerRect.left + 12));
        const tooltipY = Math.max(0, e.clientY - containerRect.top - 36);
        tooltip.style.left = `${tooltipX}px`;
        tooltip.style.top = `${tooltipY}px`;
      });

      chartSvg.addEventListener('mouseleave', () => {
        crosshairLine.style.display = 'none';
        crosshairCircle.style.display = 'none';
        tooltip.style.display = 'none';
      });
    }

    // Interactive KPI card clicks open inspector modal
    wrapper.querySelectorAll('.interactive-kpi-card').forEach(card => {
      card.addEventListener('click', () => {
        openCustomizeModal();
      });
    });

    // Chart time range tab buttons
    wrapper.querySelectorAll('.chart-time-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        canvasConfig.timeRange = btn.dataset.range;
        renderCanvas();
        emitCode();
      });
    });

    // Row edit and delete actions
    wrapper.querySelectorAll('.canvas-row-edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openEditProductModal(btn.dataset.productId);
      });
    });

    wrapper.querySelectorAll('.canvas-row-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        products = products.filter(p => p.id !== btn.dataset.productId);
        renderCanvas();
        emitCode();
        showToast('Product removed', ICONS.trash);
      });
    });
  }

  function getTablePadding() {
    if (canvasConfig.tableDensity === 'compact') return '6px 12px';
    if (canvasConfig.tableDensity === 'relaxed') return '16px 18px';
    return '10px 14px';
  }

  function renderTableRows(accentColor) {
    const q = canvasConfig.searchQuery;
    const curr = canvasConfig.currency;
    const padding = getTablePadding();

    const filtered = products.filter(p => {
      if (!q) return true;
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    });

    if (filtered.length === 0) {
      return `<tr><td colspan="6" style="padding:24px; text-align:center; color:var(--text-dim); font-size:0.78rem;">No products found matching &ldquo;${q}&rdquo;</td></tr>`;
    }

    return filtered.map(p => {
      const pct = Math.min(100, Math.round((p.stock / p.maxStock) * 100));
      const badgeHtml = p.status === 'in-stock'
        ? `<span style="display:inline-flex; align-items:center; gap:4px; padding:2px 8px; border-radius:9999px; font-size:0.68rem; font-weight:600; background:var(--success-muted); color:var(--success); border:1px solid var(--success-border);"><span style="width:5px;height:5px;border-radius:50%;background:var(--success);"></span>In Stock</span>`
        : p.status === 'low-stock'
        ? `<span style="display:inline-flex; align-items:center; gap:4px; padding:2px 8px; border-radius:9999px; font-size:0.68rem; font-weight:600; background:var(--warning-muted); color:var(--warning); border:1px solid var(--warning-border);"><span style="width:5px;height:5px;border-radius:50%;background:var(--warning);"></span>Low Stock</span>`
        : `<span style="display:inline-flex; align-items:center; gap:4px; padding:2px 8px; border-radius:9999px; font-size:0.68rem; font-weight:600; background:var(--surface-2); color:var(--text-secondary); border:1px solid var(--border);"><span style="width:5px;height:5px;border-radius:50%;background:var(--text-dim);"></span>Pre-order</span>`;

      return `
        <tr style="border-bottom:1px solid var(--border); transition:background 0.15s ease;">
          <td style="padding:${padding};">
            <div style="font-weight:600; color:var(--text-primary); font-size:0.8rem;">${p.name}</div>
            <div style="font-size:0.68rem; font-family:var(--font-mono); color:var(--text-dim);">${p.sku}</div>
          </td>
          <td style="padding:${padding}; color:var(--text-secondary); font-size:0.75rem;">${p.category}</td>
          <td style="padding:${padding}; font-weight:700; font-family:var(--font-mono); color:var(--text-primary); font-size:0.8rem;">
            ${curr}${p.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </td>
          <td style="padding:${padding}; width:160px;">
            <div style="display:flex; justify-content:space-between; font-size:0.68rem; color:var(--text-dim); margin-bottom:3px;">
              <span>${p.stock} units</span>
              <span>${pct}%</span>
            </div>
            <div style="width:100%; height:5px; background:var(--surface-3); border-radius:9999px; overflow:hidden;">
              <div style="width:${pct}%; height:100%; background:${accentColor}; border-radius:9999px;"></div>
            </div>
          </td>
          <td style="padding:${padding};">${badgeHtml}</td>
          <td style="padding:${padding}; text-align:right;">
            <div style="display:inline-flex; gap:6px;">
              <button class="btn btn-ghost btn-sm canvas-row-edit-btn" data-product-id="${p.id}" style="padding:3px 8px; font-size:0.7rem;" title="Edit product">Edit</button>
              <button class="btn btn-ghost btn-sm canvas-row-delete-btn" data-product-id="${p.id}" style="padding:3px 8px; font-size:0.7rem; color:var(--error);" title="Delete product">&times;</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function downloadStringAsFile(filename, content, mime = 'text/plain;charset=utf-8') {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function getAccentHex(key) {
    switch (key) {
      case 'indigo': return '#6366f1';
      case 'emerald': return '#10b981';
      case 'rose': return '#f43f5e';
      case 'amber': return '#f59e0b';
      case 'zinc':
      default: return 'var(--text-primary)';
    }
  }

  function getExportCodeBundle(config) {
    const accentHex = getAccentHex(config.accent);
    const rad = `${config.radius}px`;
    const aes = config.aesthetic;

    let aestheticCssRules = '';
    if (aes === 'claymorphism') {
      aestheticCssRules = `/* Claymorphism 3D Surface Tokens */
.card, .kpi-card, .app-nav {
  background: var(--surface-1);
  border-radius: ${rad};
  border: none;
  box-shadow: 12px 12px 28px rgba(0,0,0,0.5),
              inset -6px -6px 14px rgba(0,0,0,0.35),
              inset 6px 6px 14px rgba(255,255,255,0.06);
}`;
    } else if (aes === 'neumorphism') {
      aestheticCssRules = `/* Neumorphic Extruded Surface Tokens */
.card, .kpi-card, .app-nav {
  background: var(--surface-1);
  border-radius: ${rad};
  border: 1px solid rgba(255,255,255,0.03);
  box-shadow: 9px 9px 20px rgba(0,0,0,0.65),
              -9px -9px 20px rgba(255,255,255,0.035);
}`;
    } else if (aes === 'cyber') {
      aestheticCssRules = `/* Cyberpunk Luminescent Matrix Tokens */
.card, .kpi-card, .app-nav {
  background: rgba(18, 18, 24, 0.9);
  border-radius: ${rad};
  border: 1px solid rgba(6, 182, 212, 0.35);
  box-shadow: 0 0 24px rgba(6, 182, 212, 0.12),
              inset 0 0 14px rgba(6, 182, 212, 0.04);
  backdrop-filter: blur(12px);
}`;
    } else if (aes === 'flat') {
      aestheticCssRules = `/* Flat Minimal shadcn/ui Tokens */
.card, .kpi-card, .app-nav {
  background: var(--surface-1);
  border-radius: ${rad};
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
}`;
    } else {
      aestheticCssRules = `/* Glassmorphism Frosted Glass Tokens */
.card, .kpi-card, .app-nav {
  background: rgba(24, 24, 27, 0.65);
  border-radius: ${rad};
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  backdrop-filter: blur(${config.blur}px);
  -webkit-backdrop-filter: blur(${config.blur}px);
}`;
    }

    const css = `/* ── Huragon/UI Combined ${aes.toUpperCase()} Application Bundle ── */
:root {
  --canvas-accent: ${accentHex};
  --canvas-radius: ${rad};
  --canvas-blur: ${config.blur}px;
}

${aestheticCssRules}

/* Dynamic Island Application Navigation */
.app-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
}

/* Metric KPI 4-Card Grid */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 16px;
}

.kpi-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.kpi-val {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.03em;
}

/* Products Data Table */
.data-table-card {
  padding: 22px;
}

.huragon-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
  text-align: left;
}

.huragon-table th {
  padding: 10px 14px;
  background: var(--surface-2);
  color: var(--text-secondary);
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid var(--border);
}

.huragon-table td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--border);
}

/* Badges */
.badge-in-stock {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 0.68rem;
  font-weight: 600;
  background: var(--success-muted);
  color: var(--success);
  border: 1px solid var(--success-border);
}`;

    const tailwind = `<!-- Combined Application Layout (${aes} Paradigm) -->
<div class="max-w-6xl mx-auto p-6 space-y-6">
  <!-- Nav Bar -->
  <header class="flex items-center justify-between p-3 rounded-[${rad}] bg-zinc-900/80 border border-zinc-800 backdrop-blur-md shadow-sm">
    <div class="flex items-center space-x-3">
      <div class="w-7 h-7 rounded bg-zinc-100 text-zinc-950 font-bold flex items-center justify-center text-xs">H</div>
      <span class="text-sm font-bold text-zinc-100">Acme Commerce (${aes})</span>
    </div>
    <div class="flex items-center space-x-2">
      <button class="px-3 py-1.5 text-xs font-semibold rounded-full border border-zinc-700 bg-zinc-800 text-zinc-200">Settings</button>
    </div>
  </header>

  <!-- Metric Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <div class="p-5 rounded-[${rad}] bg-zinc-900 border border-zinc-800 shadow-sm space-y-2">
      <div class="text-xs font-medium text-zinc-400 uppercase tracking-wider">Gross Revenue</div>
      <div class="text-2xl font-bold text-zinc-100 tracking-tight">${config.currency}${config.revenueAmount.toLocaleString('en-US')}</div>
      <div class="text-xs text-emerald-500 font-medium">+20.1% vs previous period</div>
    </div>
  </div>
</div>`;

    const react = `// Combined Living Application Screen (${aes} Paradigm)
import React, { useState } from 'react';

export default function AppCanvasScreen() {
  const [currency, setCurrency] = useState('${config.currency}');
  const [revenue, setRevenue] = useState(${config.revenueAmount});

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between p-3 rounded-[${rad}] bg-zinc-900/80 border border-zinc-800 shadow-sm backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded bg-zinc-100 text-zinc-950 font-bold flex items-center justify-center text-xs">H</div>
          <span className="text-sm font-bold text-zinc-100">Acme Commerce (${aes})</span>
        </div>
      </header>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-[${rad}] bg-zinc-900 border border-zinc-800 shadow-sm">
          <div className="text-xs font-medium text-zinc-400 uppercase">Gross Revenue</div>
          <div className="text-2xl font-bold text-zinc-100 mt-1">{currency}{revenue.toLocaleString()}</div>
          <div className="text-xs text-emerald-500 mt-1 font-medium">+20.1% vs previous period</div>
        </div>
      </div>
    </div>
  );
}`;

    const tokensObj = {
      "$schema": "https://design-tokens.github.io/community-group/format/v1/schema.json",
      "token": {
        "aesthetic": { "value": aes, "type": "string" },
        "accent": { "value": accentHex, "type": "color" },
        "radius": { "value": rad, "type": "dimension" },
        "blur": { "value": `${config.blur}px`, "type": "dimension" },
        "currency": { "value": config.currency, "type": "string" },
        "revenue": { "value": `${config.currency}${config.revenueAmount}`, "type": "string" },
        "orders": { "value": String(config.orderCount), "type": "number" }
      }
    };

    return { css, tailwind, react, tokens: tokensObj };
  }

  // ─── Modal 1: Dual-Mode Live Interactive Customizer & Inspector ──────────
  let modalMode = 'visual'; // 'visual' | 'code'
  let modalCodeSubTab = 'css'; // 'css' | 'tailwind' | 'react' | 'tokens'

  function openCustomizeModal() {
    closeAnyModal();

    const overlay = el('div', {
      id: 'canvas-modal-overlay',
      style: 'position:fixed; inset:0; background:rgba(0,0,0,0.65); z-index:1000; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(6px); padding:20px;'
    });

    const modalBox = el('div', {
      style: `
        width: 100%;
        max-width: 640px;
        background: var(--surface-1);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        max-height: 85vh;
      `
    });

    overlay.appendChild(modalBox);
    document.body.appendChild(overlay);

    const closeModal = () => overlay.remove();
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    function updateModalView() {
      const isVisual = modalMode === 'visual';
      const codeBundle = getExportCodeBundle(canvasConfig);

      let codeContent = '';
      let codeDownloadFilename = 'app-canvas.css';
      let codeDownloadMime = 'text/css';

      if (modalCodeSubTab === 'css') {
        codeContent = highlightCSS(codeBundle.css);
        codeDownloadFilename = `app-canvas-${canvasConfig.aesthetic}.css`;
        codeDownloadMime = 'text/css';
      } else if (modalCodeSubTab === 'tailwind') {
        codeContent = escapeHtml(codeBundle.tailwind);
        codeDownloadFilename = `app-canvas-${canvasConfig.aesthetic}.html`;
        codeDownloadMime = 'text/html';
      } else if (modalCodeSubTab === 'react') {
        codeContent = escapeHtml(codeBundle.react);
        codeDownloadFilename = `AppCanvasScreen.jsx`;
        codeDownloadMime = 'text/javascript';
      } else {
        const jsonStr = JSON.stringify(codeBundle.tokens, null, 2);
        codeContent = escapeHtml(jsonStr);
        codeDownloadFilename = `app-canvas-tokens.json`;
        codeDownloadMime = 'application/json';
      }

      modalBox.innerHTML = `
        <div style="padding:16px 20px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="display:flex; color:var(--text-primary);">${ICONS.sliders}</span>
            <h3 style="font-size:0.95rem; font-weight:700; color:var(--text-primary); margin:0;">Component Inspector</h3>
          </div>

          <!-- Dual-Mode Segmented Selector -->
          <div style="display:flex; background:var(--surface-2); border:1px solid var(--border); border-radius:8px; padding:2px; gap:2px;">
            <button id="modal-mode-visual-btn" class="btn btn-sm ${isVisual ? 'btn-primary' : 'btn-ghost'}" style="padding:4px 12px; font-size:0.72rem; border-radius:6px; font-weight:600;">Visual Editor</button>
            <button id="modal-mode-code-btn" class="btn btn-sm ${!isVisual ? 'btn-primary' : 'btn-ghost'}" style="padding:4px 12px; font-size:0.72rem; border-radius:6px; font-weight:600;">Code &amp; Tokens</button>
          </div>

          <button id="modal-close-btn" class="btn btn-ghost btn-icon" style="padding:4px 6px;">&times;</button>
        </div>

        <div style="padding:20px; display:flex; flex-direction:column; gap:18px; max-height:calc(85vh - 130px); overflow-y:auto;">
          ${isVisual ? `
            <!-- Design Style Aesthetic Paradigm -->
            <div>
              <label style="display:block; font-size:0.72rem; font-weight:600; color:var(--text-secondary); margin-bottom:8px; text-transform:uppercase; letter-spacing:0.04em;">Style Paradigm</label>
              <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:6px;">
                <button class="modal-aes-btn ${canvasConfig.aesthetic === 'glassmorphism' ? 'active' : ''}" data-aes="glassmorphism" style="padding:8px 4px; border-radius:6px; font-size:0.72rem; border:1px solid var(--border); background:${canvasConfig.aesthetic === 'glassmorphism' ? 'var(--text-primary)' : 'var(--surface-2)'}; color:${canvasConfig.aesthetic === 'glassmorphism' ? 'var(--bg-primary)' : 'var(--text-primary)'}; font-weight:600; cursor:pointer;">Glassmorphism</button>
                <button class="modal-aes-btn ${canvasConfig.aesthetic === 'claymorphism' ? 'active' : ''}" data-aes="claymorphism" style="padding:8px 4px; border-radius:6px; font-size:0.72rem; border:1px solid var(--border); background:${canvasConfig.aesthetic === 'claymorphism' ? 'var(--text-primary)' : 'var(--surface-2)'}; color:${canvasConfig.aesthetic === 'claymorphism' ? 'var(--bg-primary)' : 'var(--text-primary)'}; font-weight:600; cursor:pointer;">Claymorphism 3D</button>
                <button class="modal-aes-btn ${canvasConfig.aesthetic === 'neumorphism' ? 'active' : ''}" data-aes="neumorphism" style="padding:8px 4px; border-radius:6px; font-size:0.72rem; border:1px solid var(--border); background:${canvasConfig.aesthetic === 'neumorphism' ? 'var(--text-primary)' : 'var(--surface-2)'}; color:${canvasConfig.aesthetic === 'neumorphism' ? 'var(--bg-primary)' : 'var(--text-primary)'}; font-weight:600; cursor:pointer;">Neumorphism</button>
                <button class="modal-aes-btn ${canvasConfig.aesthetic === 'cyber' ? 'active' : ''}" data-aes="cyber" style="padding:8px 4px; border-radius:6px; font-size:0.72rem; border:1px solid var(--border); background:${canvasConfig.aesthetic === 'cyber' ? 'var(--text-primary)' : 'var(--surface-2)'}; color:${canvasConfig.aesthetic === 'cyber' ? 'var(--bg-primary)' : 'var(--text-primary)'}; font-weight:600; cursor:pointer;">Cyber Matrix</button>
                <button class="modal-aes-btn ${canvasConfig.aesthetic === 'flat' ? 'active' : ''}" data-aes="flat" style="padding:8px 4px; border-radius:6px; font-size:0.72rem; border:1px solid var(--border); background:${canvasConfig.aesthetic === 'flat' ? 'var(--text-primary)' : 'var(--surface-2)'}; color:${canvasConfig.aesthetic === 'flat' ? 'var(--bg-primary)' : 'var(--text-primary)'}; font-weight:600; cursor:pointer; grid-column:span 2;">Flat Minimal (shadcn)</button>
              </div>
            </div>

            <!-- Accent Color Choice -->
            <div>
              <label style="display:block; font-size:0.72rem; font-weight:600; color:var(--text-secondary); margin-bottom:8px; text-transform:uppercase; letter-spacing:0.04em;">Accent Color Token</label>
              <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:6px;">
                <button class="modal-accent-btn ${canvasConfig.accent === 'zinc' ? 'active' : ''}" data-color="zinc" style="padding:7px 0; border-radius:6px; font-size:0.72rem; border:1px solid var(--border); background:${canvasConfig.accent === 'zinc' ? 'var(--text-primary)' : 'var(--surface-2)'}; color:${canvasConfig.accent === 'zinc' ? 'var(--bg-primary)' : 'var(--text-primary)'}; font-weight:600; cursor:pointer;">Zinc</button>
                <button class="modal-accent-btn ${canvasConfig.accent === 'indigo' ? 'active' : ''}" data-color="indigo" style="padding:7px 0; border-radius:6px; font-size:0.72rem; border:1px solid var(--border); background:${canvasConfig.accent === 'indigo' ? '#6366f1' : 'var(--surface-2)'}; color:${canvasConfig.accent === 'indigo' ? '#fff' : 'var(--text-primary)'}; font-weight:600; cursor:pointer;">Indigo</button>
                <button class="modal-accent-btn ${canvasConfig.accent === 'emerald' ? 'active' : ''}" data-color="emerald" style="padding:7px 0; border-radius:6px; font-size:0.72rem; border:1px solid var(--border); background:${canvasConfig.accent === 'emerald' ? 'var(--success)' : 'var(--surface-2)'}; color:${canvasConfig.accent === 'emerald' ? '#fff' : 'var(--text-primary)'}; font-weight:600; cursor:pointer;">Emerald</button>
                <button class="modal-accent-btn ${canvasConfig.accent === 'rose' ? 'active' : ''}" data-color="rose" style="padding:7px 0; border-radius:6px; font-size:0.72rem; border:1px solid var(--border); background:${canvasConfig.accent === 'rose' ? 'var(--error)' : 'var(--surface-2)'}; color:${canvasConfig.accent === 'rose' ? '#fff' : 'var(--text-primary)'}; font-weight:600; cursor:pointer;">Rose</button>
                <button class="modal-accent-btn ${canvasConfig.accent === 'amber' ? 'active' : ''}" data-color="amber" style="padding:7px 0; border-radius:6px; font-size:0.72rem; border:1px solid var(--border); background:${canvasConfig.accent === 'amber' ? 'var(--warning)' : 'var(--surface-2)'}; color:${canvasConfig.accent === 'amber' ? '#fff' : 'var(--text-primary)'}; font-weight:600; cursor:pointer;">Amber</button>
              </div>
            </div>

            <!-- Metric Values Editor -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
              <div>
                <label style="display:block; font-size:0.72rem; font-weight:600; color:var(--text-secondary); margin-bottom:6px;">Gross Revenue (${canvasConfig.currency})</label>
                <input type="number" id="modal-revenue-input" value="${canvasConfig.revenueAmount}" style="width:100%; box-sizing:border-box; padding:8px 10px; background:var(--surface-2); border:1px solid var(--border); border-radius:8px; color:var(--text-primary); font-size:0.8rem;" />
              </div>
              <div>
                <label style="display:block; font-size:0.72rem; font-weight:600; color:var(--text-secondary); margin-bottom:6px;">Completed Orders</label>
                <input type="number" id="modal-orders-input" value="${canvasConfig.orderCount}" style="width:100%; box-sizing:border-box; padding:8px 10px; background:var(--surface-2); border:1px solid var(--border); border-radius:8px; color:var(--text-primary); font-size:0.8rem;" />
              </div>
            </div>

            <!-- Border Radius Scale -->
            <div>
              <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.75rem;">
                <label style="font-weight:600; color:var(--text-secondary);">Corner Smoothing (Border Radius)</label>
                <span id="modal-rad-display" style="font-family:var(--font-mono); color:var(--text-dim);">${canvasConfig.radius}px</span>
              </div>
              <input type="range" id="modal-radius-slider" min="0" max="32" value="${canvasConfig.radius}" style="width:100%;" />
            </div>

            <!-- Backdrop Blur Scale -->
            <div>
              <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.75rem;">
                <label style="font-weight:600; color:var(--text-secondary);">Glassmorphism Blur Filter</label>
                <span id="modal-blur-display" style="font-family:var(--font-mono); color:var(--text-dim);">${canvasConfig.blur}px</span>
              </div>
              <input type="range" id="modal-blur-slider" min="0" max="40" value="${canvasConfig.blur}" style="width:100%;" />
            </div>
          ` : `
            <!-- Code & Tokens View -->
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
                <div style="display:flex; background:var(--surface-2); border:1px solid var(--border); border-radius:8px; padding:2px; gap:2px;">
                  <button class="modal-code-tab-btn ${modalCodeSubTab === 'css' ? 'active' : ''}" data-tab="css" style="padding:4px 10px; font-size:0.72rem; border-radius:6px; border:none; background:${modalCodeSubTab === 'css' ? 'var(--text-primary)' : 'transparent'}; color:${modalCodeSubTab === 'css' ? 'var(--bg-primary)' : 'var(--text-secondary)'}; font-weight:600; cursor:pointer;">CSS Variables</button>
                  <button class="modal-code-tab-btn ${modalCodeSubTab === 'tailwind' ? 'active' : ''}" data-tab="tailwind" style="padding:4px 10px; font-size:0.72rem; border-radius:6px; border:none; background:${modalCodeSubTab === 'tailwind' ? 'var(--text-primary)' : 'transparent'}; color:${modalCodeSubTab === 'tailwind' ? 'var(--bg-primary)' : 'var(--text-secondary)'}; font-weight:600; cursor:pointer;">Tailwind HTML</button>
                  <button class="modal-code-tab-btn ${modalCodeSubTab === 'react' ? 'active' : ''}" data-tab="react" style="padding:4px 10px; font-size:0.72rem; border-radius:6px; border:none; background:${modalCodeSubTab === 'react' ? 'var(--text-primary)' : 'transparent'}; color:${modalCodeSubTab === 'react' ? 'var(--bg-primary)' : 'var(--text-secondary)'}; font-weight:600; cursor:pointer;">React JSX</button>
                  <button class="modal-code-tab-btn ${modalCodeSubTab === 'tokens' ? 'active' : ''}" data-tab="tokens" style="padding:4px 10px; font-size:0.72rem; border-radius:6px; border:none; background:${modalCodeSubTab === 'tokens' ? 'var(--text-primary)' : 'transparent'}; color:${modalCodeSubTab === 'tokens' ? 'var(--bg-primary)' : 'var(--text-secondary)'}; font-weight:600; cursor:pointer;">Tokens (JSON)</button>
                </div>

                <div style="font-size:0.7rem; font-family:var(--font-mono); color:var(--text-dim);">${codeDownloadFilename}</div>
              </div>

              <pre style="margin:0; font-family:var(--font-mono); font-size:0.74rem; line-height:1.6; color:var(--text-primary); background:var(--bg-secondary); border:1px solid var(--border); border-radius:8px; padding:14px; overflow-x:auto; max-height:360px;"><code>${codeContent}</code></pre>
            </div>
          `}
        </div>

        <div style="padding:14px 20px; background:var(--surface-2); border-top:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
          ${isVisual ? `
            <span style="font-size:0.7rem; color:var(--text-dim);">Live changes apply instantly</span>
            <div style="display:flex; gap:10px;">
              <button class="btn btn-outline" id="modal-cancel-btn">Close</button>
              <button class="btn btn-primary" id="modal-apply-btn">Apply Changes</button>
            </div>
          ` : `
            <div style="display:flex; gap:8px;">
              <button class="btn btn-primary btn-sm" id="modal-copy-btn" style="display:inline-flex; align-items:center; gap:6px;">
                ${ICONS.copy}
                <span>Copy Code</span>
              </button>
              <button class="btn btn-outline btn-sm" id="modal-download-btn" style="display:inline-flex; align-items:center; gap:6px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                <span>Download</span>
              </button>
            </div>
            <button class="btn btn-outline btn-sm" id="modal-cancel-btn">Close</button>
          `}
        </div>
      `;

      // Bind modal header controls
      qs('#modal-close-btn')?.addEventListener('click', closeModal);
      qs('#modal-cancel-btn')?.addEventListener('click', closeModal);

      qs('#modal-mode-visual-btn')?.addEventListener('click', () => {
        modalMode = 'visual';
        updateModalView();
      });

      qs('#modal-mode-code-btn')?.addEventListener('click', () => {
        modalMode = 'code';
        updateModalView();
      });

      if (isVisual) {
        // Aesthetic paradigm switchers
        overlay.querySelectorAll('.modal-aes-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            canvasConfig.aesthetic = btn.dataset.aes;
            if (canvasConfig.aesthetic === 'claymorphism') canvasConfig.radius = 22;
            if (canvasConfig.aesthetic === 'glassmorphism') canvasConfig.radius = 16;
            if (canvasConfig.aesthetic === 'flat') canvasConfig.radius = 8;
            if (canvasConfig.aesthetic === 'cyber') canvasConfig.radius = 6;
            if (canvasConfig.aesthetic === 'neumorphism') canvasConfig.radius = 18;
            renderCanvas();
            renderControls();
            emitCode();
            updateModalView();
          });
        });

        // Accent switchers
        overlay.querySelectorAll('.modal-accent-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            canvasConfig.accent = btn.dataset.color;
            renderCanvas();
            renderControls();
            emitCode();
            updateModalView();
          });
        });

        const radSlider = qs('#modal-radius-slider');
        if (radSlider) {
          radSlider.addEventListener('input', (e) => {
            canvasConfig.radius = parseInt(e.target.value);
            const disp = qs('#modal-rad-display');
            if (disp) disp.textContent = `${canvasConfig.radius}px`;
            renderCanvas();
            emitCode();
          });
        }

        const blurSlider = qs('#modal-blur-slider');
        if (blurSlider) {
          blurSlider.addEventListener('input', (e) => {
            canvasConfig.blur = parseInt(e.target.value);
            const disp = qs('#modal-blur-display');
            if (disp) disp.textContent = `${canvasConfig.blur}px`;
            renderCanvas();
            emitCode();
          });
        }

        qs('#modal-apply-btn')?.addEventListener('click', () => {
          const revInput = qs('#modal-revenue-input');
          const ordInput = qs('#modal-orders-input');
          if (revInput) canvasConfig.revenueAmount = parseFloat(revInput.value) || 0;
          if (ordInput) canvasConfig.orderCount = parseInt(ordInput.value) || 0;
          renderCanvas();
          renderControls();
          emitCode();
          closeModal();
          showToast('App Canvas updated live', ICONS.check);
        });
      } else {
        // Code Sub-tabs
        overlay.querySelectorAll('.modal-code-tab-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            modalCodeSubTab = btn.dataset.tab;
            updateModalView();
          });
        });

        // Copy button
        qs('#modal-copy-btn')?.addEventListener('click', () => {
          let textToCopy = '';
          if (modalCodeSubTab === 'css') textToCopy = codeBundle.css;
          else if (modalCodeSubTab === 'tailwind') textToCopy = codeBundle.tailwind;
          else if (modalCodeSubTab === 'react') textToCopy = codeBundle.react;
          else textToCopy = JSON.stringify(codeBundle.tokens, null, 2);

          copyToClipboard(textToCopy, `${modalCodeSubTab.toUpperCase()} code copied!`);
        });

        // Download button
        qs('#modal-download-btn')?.addEventListener('click', () => {
          let textToDownload = '';
          if (modalCodeSubTab === 'css') textToDownload = codeBundle.css;
          else if (modalCodeSubTab === 'tailwind') textToDownload = codeBundle.tailwind;
          else if (modalCodeSubTab === 'react') textToDownload = codeBundle.react;
          else textToDownload = JSON.stringify(codeBundle.tokens, null, 2);

          downloadStringAsFile(codeDownloadFilename, textToDownload, codeDownloadMime);
          showToast(`Downloaded ${codeDownloadFilename}`, ICONS.check);
        });
      }
    }

    updateModalView();
  }

  // ─── Modal 2: Edit or Add Product Row ────────────────────────────────────
  function openEditProductModal(productId) {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    closeAnyModal();

    const overlay = el('div', {
      id: 'canvas-modal-overlay',
      style: 'position:fixed; inset:0; background:rgba(0,0,0,0.65); z-index:1000; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(4px); padding:20px;'
    });

    const modalBox = el('div', {
      style: `
        width: 100%;
        max-width: 440px;
        background: var(--surface-1);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      `
    });

    modalBox.innerHTML = `
      <div style="padding:16px 20px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between;">
        <h3 style="font-size:0.95rem; font-weight:700; color:var(--text-primary); margin:0;">Edit Product: ${prod.name}</h3>
        <button id="prod-modal-close" class="btn btn-ghost btn-icon">✕</button>
      </div>

      <div style="padding:20px; display:flex; flex-direction:column; gap:12px;">
        <div>
          <label style="display:block; font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;">Product Name</label>
          <input type="text" id="edit-prod-name" value="${prod.name}" style="width:100%; box-sizing:border-box; padding:8px 10px; background:var(--surface-2); border:1px solid var(--border); border-radius:8px; color:var(--text-primary); font-size:0.8rem;" />
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <div>
            <label style="display:block; font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;">Price (${canvasConfig.currency})</label>
            <input type="number" step="0.01" id="edit-prod-price" value="${prod.price}" style="width:100%; box-sizing:border-box; padding:8px 10px; background:var(--surface-2); border:1px solid var(--border); border-radius:8px; color:var(--text-primary); font-size:0.8rem;" />
          </div>
          <div>
            <label style="display:block; font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;">Stock Quantity</label>
            <input type="number" id="edit-prod-stock" value="${prod.stock}" style="width:100%; box-sizing:border-box; padding:8px 10px; background:var(--surface-2); border:1px solid var(--border); border-radius:8px; color:var(--text-primary); font-size:0.8rem;" />
          </div>
        </div>
        <div>
          <label style="display:block; font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;">Inventory Status</label>
          <select id="edit-prod-status" style="width:100%; box-sizing:border-box; padding:8px 10px; background:var(--surface-2); border:1px solid var(--border); border-radius:8px; color:var(--text-primary); font-size:0.8rem;">
            <option value="in-stock" ${prod.status === 'in-stock' ? 'selected' : ''}>In Stock</option>
            <option value="low-stock" ${prod.status === 'low-stock' ? 'selected' : ''}>Low Stock</option>
            <option value="pre-order" ${prod.status === 'pre-order' ? 'selected' : ''}>Pre-order</option>
          </select>
        </div>
      </div>

      <div style="padding:14px 20px; background:var(--surface-2); border-top:1px solid var(--border); display:flex; justify-content:flex-end; gap:10px;">
        <button class="btn btn-outline" id="prod-modal-cancel">Cancel</button>
        <button class="btn btn-primary" id="prod-modal-save">Save Product</button>
      </div>
    `;

    overlay.appendChild(modalBox);
    document.body.appendChild(overlay);

    const closeModal = () => overlay.remove();
    qs('#prod-modal-close')?.addEventListener('click', closeModal);
    qs('#prod-modal-cancel')?.addEventListener('click', closeModal);

    qs('#prod-modal-save')?.addEventListener('click', () => {
      const name = qs('#edit-prod-name')?.value.trim();
      const price = parseFloat(qs('#edit-prod-price')?.value) || 0;
      const stock = parseInt(qs('#edit-prod-stock')?.value) || 0;
      const status = qs('#edit-prod-status')?.value || 'in-stock';

      if (name) {
        prod.name = name;
        prod.price = price;
        prod.stock = stock;
        prod.status = status;
        renderCanvas();
        emitCode();
        showToast('Product updated live', ICONS.check);
      }
      closeModal();
    });
  }

  function openAddProductModal() {
    closeAnyModal();

    const overlay = el('div', {
      id: 'canvas-modal-overlay',
      style: 'position:fixed; inset:0; background:rgba(0,0,0,0.65); z-index:1000; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(4px); padding:20px;'
    });

    const modalBox = el('div', {
      style: `
        width: 100%;
        max-width: 440px;
        background: var(--surface-1);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      `
    });

    modalBox.innerHTML = `
      <div style="padding:16px 20px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between;">
        <h3 style="font-size:0.95rem; font-weight:700; color:var(--text-primary); margin:0;">Add New Inventory Product</h3>
        <button id="add-modal-close" class="btn btn-ghost btn-icon">✕</button>
      </div>

      <div style="padding:20px; display:flex; flex-direction:column; gap:12px;">
        <div>
          <label style="display:block; font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;">Product Name</label>
          <input type="text" id="add-prod-name" placeholder="e.g. Magic Trackpad" style="width:100%; box-sizing:border-box; padding:8px 10px; background:var(--surface-2); border:1px solid var(--border); border-radius:8px; color:var(--text-primary); font-size:0.8rem;" />
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <div>
            <label style="display:block; font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;">Category</label>
            <input type="text" id="add-prod-cat" placeholder="Accessories" style="width:100%; box-sizing:border-box; padding:8px 10px; background:var(--surface-2); border:1px solid var(--border); border-radius:8px; color:var(--text-primary); font-size:0.8rem;" />
          </div>
          <div>
            <label style="display:block; font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;">Price (${canvasConfig.currency})</label>
            <input type="number" step="0.01" id="add-prod-price" placeholder="129.00" style="width:100%; box-sizing:border-box; padding:8px 10px; background:var(--surface-2); border:1px solid var(--border); border-radius:8px; color:var(--text-primary); font-size:0.8rem;" />
          </div>
        </div>
      </div>

      <div style="padding:14px 20px; background:var(--surface-2); border-top:1px solid var(--border); display:flex; justify-content:flex-end; gap:10px;">
        <button class="btn btn-outline" id="add-modal-cancel">Cancel</button>
        <button class="btn btn-primary" id="add-modal-save">Add Product</button>
      </div>
    `;

    overlay.appendChild(modalBox);
    document.body.appendChild(overlay);

    const closeModal = () => overlay.remove();
    qs('#add-modal-close')?.addEventListener('click', closeModal);
    qs('#add-modal-cancel')?.addEventListener('click', closeModal);

    qs('#add-modal-save')?.addEventListener('click', () => {
      const name = qs('#add-prod-name')?.value.trim();
      const cat = qs('#add-prod-cat')?.value.trim() || 'General';
      const price = parseFloat(qs('#add-prod-price')?.value) || 99.00;

      if (name) {
        products.push({
          id: String(Date.now()),
          name,
          sku: `SKU-${Math.floor(100 + Math.random() * 900)}`,
          category: cat,
          price,
          stock: 50,
          maxStock: 100,
          status: 'in-stock'
        });
        renderCanvas();
        emitCode();
        showToast('Product added to table', ICONS.check);
      }
      closeModal();
    });
  }

  // ─── Modal 3: AI Agent Skill Info & Copy ──────────────────────────────────
  function openSkillModal() {
    closeAnyModal();

    const overlay = el('div', {
      id: 'canvas-modal-overlay',
      style: 'position:fixed; inset:0; background:rgba(0,0,0,0.65); z-index:1000; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(4px); padding:20px;'
    });

    const modalBox = el('div', {
      style: `
        width: 100%;
        max-width: 620px;
        background: var(--surface-1);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      `
    });

    modalBox.innerHTML = `
      <div style="padding:18px 22px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="display:flex; color:var(--text-primary);">${ICONS.bot || ICONS.sparkles}</span>
          <div>
            <h3 style="font-size:1rem; font-weight:700; color:var(--text-primary); margin:0;">AI Coding Agent Skill</h3>
            <p style="font-size:0.7rem; color:var(--text-secondary); margin:0;">For Google Antigravity, Claude Code, OpenAI Codex, and Cursor</p>
          </div>
        </div>
        <button id="skill-modal-close" class="btn btn-ghost btn-icon">✕</button>
      </div>

      <div style="padding:22px; display:flex; flex-direction:column; gap:14px; max-height:65vh; overflow-y:auto;">
        <p style="font-size:0.8rem; color:var(--text-secondary); margin:0; line-height:1.5;">
          This skill instructs your AI coding assistants to generate, refactor, and style production-grade Huragon/UI monochromatic zinc interfaces, cards, tables, and navbars.
        </p>

        <div style="background:var(--surface-2); border:1px solid var(--border); border-radius:8px; padding:12px 14px; font-size:0.75rem; color:var(--text-primary); display:flex; flex-direction:column; gap:6px;">
          <span style="font-weight:600;">Skill File Location:</span>
          <code style="font-family:var(--font-mono); color:var(--text-secondary); font-size:0.72rem;">skills/huragon-ui/SKILL.md</code>
        </div>

        <pre style="margin:0; font-family:var(--font-mono); font-size:0.72rem; line-height:1.6; color:var(--text-secondary); background:var(--bg-secondary); border:1px solid var(--border); border-radius:8px; padding:14px; overflow-x:auto;"><code>---
name: huragon-ui
description: Design, generate, and style monochromatic zinc web interfaces inspired by HeroUI and shadcn/ui.
---
# Huragon/UI Design System & Agent Skill
- Monochromatic zinc grayscale palette (50-950)
- Zero pictographic emojis (monochrome SVG icons only)
- Global currency formatting with $ USD
- Pure vanilla CSS custom properties & zero build step</code></pre>
      </div>

      <div style="padding:14px 22px; background:var(--surface-2); border-top:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:0.7rem; color:var(--text-dim);">Ready for instant agent consumption</span>
        <div style="display:flex; gap:10px;">
          <button class="btn btn-outline" id="skill-modal-copy-btn">Copy Skill Prompt</button>
          <button class="btn btn-primary" id="skill-modal-done-btn">Done</button>
        </div>
      </div>
    `;

    overlay.appendChild(modalBox);
    document.body.appendChild(overlay);

    const closeModal = () => overlay.remove();
    qs('#skill-modal-close')?.addEventListener('click', closeModal);
    qs('#skill-modal-done-btn')?.addEventListener('click', closeModal);

    qs('#skill-modal-copy-btn')?.addEventListener('click', () => {
      const promptText = `I want you to act as an expert frontend engineer using the Huragon/UI design system. Follow these rules:
1. Use the monochromatic zinc palette (#09090b background, #18181b card surface, #27272a border).
2. Format all currencies with $ USD.
3. Zero pictographic emojis in UI code, status labels, or buttons (use monochrome SVG icons).
4. Use standard CSS variables (--bg-primary, --surface-1, --border, --text-primary).
5. Support pure CSS, Tailwind CSS, and React JSX components.`;
      copyToClipboard(promptText, 'AI Agent Skill prompt copied!');
    });
  }

  function closeAnyModal() {
    const existing = qs('#canvas-modal-overlay');
    if (existing) existing.remove();
  }

  // ─── Combined Code Emitter (Aesthetic-Tailored) ───────────────────────────
  function emitCode() {
    const bundle = getExportCodeBundle(canvasConfig);
    onCodeChange(bundle);
  }
}
