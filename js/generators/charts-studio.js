// Tool: HeroUI & shadcn/ui Interactive Charts & Graphs Studio
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';
import {
  catmullRomPath,
  catmullRomAreaPath,
  arcPath,
  scaleToViewport,
  findNearestPoint,
  formatCurrency
} from '../utils/chart-math.js';

export const meta = {
  id: 'charts-studio',
  name: 'Charts & Graphs Studio'
};

const CHART_DATA = {
  '7d': [
    { label: 'Mon', val: 3420.50, orders: 24, delta: '+12.4%' },
    { label: 'Tue', val: 5120.00, orders: 38, delta: '+18.2%' },
    { label: 'Wed', val: 4230.75, orders: 31, delta: '+8.1%' },
    { label: 'Thu', val: 6890.20, orders: 52, delta: '+28.5%' },
    { label: 'Fri', val: 9450.00, orders: 68, delta: '+42.1%' },
    { label: 'Sat', val: 7810.40, orders: 55, delta: '+22.0%' },
    { label: 'Sun', val: 8650.00, orders: 61, delta: '+31.4%' }
  ],
  '30d': [
    { label: 'Week 1', val: 24500.00, orders: 180, delta: '+15.2%' },
    { label: 'Week 2', val: 31200.00, orders: 245, delta: '+24.1%' },
    { label: 'Week 3', val: 45800.50, orders: 340, delta: '+38.6%' },
    { label: 'Week 4', val: 52100.00, orders: 395, delta: '+46.0%' }
  ],
  '90d': [
    { label: 'Month 1', val: 112000.00, orders: 840, delta: '+19.5%' },
    { label: 'Month 2', val: 145000.00, orders: 1090, delta: '+29.4%' },
    { label: 'Month 3', val: 188500.00, orders: 1420, delta: '+41.2%' }
  ],
  '1y': [
    { label: 'Q1', val: 320000.00, orders: 2400, delta: '+18.0%' },
    { label: 'Q2', val: 410000.00, orders: 3100, delta: '+28.1%' },
    { label: 'Q3', val: 495000.00, orders: 3850, delta: '+36.5%' },
    { label: 'Q4', val: 620000.00, orders: 4900, delta: '+48.2%' }
  ]
};

const DONUT_DATA = [
  { label: 'Direct Commerce', percent: 45, val: 14850.00, color: 'var(--text-primary)' },
  { label: 'Affiliates', percent: 30, val: 9900.00, color: 'var(--text-secondary)' },
  { label: 'Organic Search', percent: 15, val: 4950.00, color: 'var(--text-muted)' },
  { label: 'Referral & Social', percent: 10, val: 3300.00, color: 'var(--text-dim)' }
];

let config = {
  type: 'area', // 'area', 'bar', 'donut'
  timeframe: '7d', // '7d', '30d', '90d', '1y'
  curved: true,
  showGrid: true,
  colorTone: 'zinc', // 'zinc', 'emerald', 'indigo'
  showSecondary: true
};

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';
  controlsStage.innerHTML = '';

  const centerStage = el('div', {
    id: 'charts-studio-container',
    style: {
      width: '100%',
      maxWidth: '720px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }
  });

  const chartCard = el('div', {
    id: 'interactive-chart-card',
    style: {
      background: 'var(--surface-1)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px 28px',
      boxShadow: 'var(--shadow-md)',
      position: 'relative',
      overflow: 'visible'
    }
  });

  centerStage.appendChild(chartCard);
  previewStage.appendChild(centerStage);

  renderChart();
  renderControls();

  function getToneColors() {
    if (config.colorTone === 'emerald') {
      return {
        line: '#22c55e',
        fillStart: 'rgba(34, 197, 94, 0.25)',
        fillEnd: 'rgba(34, 197, 94, 0.0)'
      };
    }
    if (config.colorTone === 'indigo') {
      return {
        line: '#6366f1',
        fillStart: 'rgba(99, 102, 241, 0.25)',
        fillEnd: 'rgba(99, 102, 241, 0.0)'
      };
    }
    return {
      line: 'var(--chart-line, var(--text-primary))',
      fillStart: 'var(--chart-fill-start, rgba(244, 244, 245, 0.2))',
      fillEnd: 'var(--chart-fill-end, rgba(244, 244, 245, 0.0))'
    };
  }

  function renderChart() {
    const data = CHART_DATA[config.timeframe] || CHART_DATA['7d'];
    const totalRev = data.reduce((acc, d) => acc + d.val, 0);
    const avgDelta = data[data.length - 1].delta;

    let chartBody = '';

    if (config.type === 'area') {
      chartBody = renderAreaChart(data);
    } else if (config.type === 'bar') {
      chartBody = renderBarChart(data);
    } else if (config.type === 'donut') {
      chartBody = renderDonutChart();
    }

    chartCard.innerHTML = `
      <!-- Card Header -->
      <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:flex-start; gap:16px; margin-bottom:24px;">
        <div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:0.75rem; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-dim);">Gross Revenue Velocity</span>
            <span style="display:inline-flex; align-items:center; gap:3px; font-size:0.7rem; padding:2px 8px; border-radius:999px; background:var(--success-muted); color:var(--success); border:1px solid var(--success-border); font-weight:600;">
              ${avgDelta} vs prev
            </span>
          </div>
          <div id="chart-total-metric" style="font-size:2rem; font-weight:700; color:var(--text-primary); margin-top:4px; letter-spacing:-0.03em;">
            ${config.type === 'donut' ? '$33,000.00' : formatCurrency(totalRev)}
          </div>
          <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">
            ${config.type === 'donut' ? 'Channel distribution volume' : 'Interactive mathematical SVG vector projection'}
          </div>
        </div>

        ${config.type !== 'donut' ? `
          <!-- Timeframe Segmented Switcher -->
          <div class="segmented-pill-bar">
            ${['7d', '30d', '90d', '1y'].map(tf => `
              <button class="segmented-pill-btn ${config.timeframe === tf ? 'active' : ''}" data-tf="${tf}">
                ${tf.toUpperCase()}
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>

      <!-- Chart Viewport -->
      ${chartBody}

      <!-- Interactive Crosshair Tooltip Container (Floating) -->
      <div id="chart-floating-tooltip" style="position:absolute; display:none; pointer-events:none; z-index:100; background:var(--surface-2); border:1px solid var(--border-strong); border-radius:var(--radius-sm); padding:8px 12px; box-shadow:var(--shadow-lg); font-size:0.75rem; transition:opacity 0.1s ease; transform:translate(-50%, -120%); white-space:nowrap;">
        <div id="tooltip-date" style="font-size:0.68rem; color:var(--text-dim); text-transform:uppercase; font-weight:600;"></div>
        <div id="tooltip-value" style="font-size:0.95rem; font-weight:700; color:var(--text-primary); margin-top:2px;"></div>
        <div id="tooltip-meta" style="font-size:0.7rem; color:var(--text-muted); margin-top:1px;"></div>
      </div>
    `;

    bindChartEvents();
    emitCode();
  }

  function renderAreaChart(data) {
    const w = 620;
    const h = 200;
    const padLeft = 40;
    const padRight = 20;
    const padTop = 20;
    const padBottom = 30;

    const values = data.map(d => d.val);
    const scaled = scaleToViewport(values, { width: w, height: h, padLeft, padRight, padTop, padBottom });
    const baselineY = h - padBottom;

    const pathD = config.curved ? catmullRomPath(scaled) : scaled.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const areaD = config.curved ? catmullRomAreaPath(scaled, baselineY) : `${pathD} L ${scaled[scaled.length - 1].x.toFixed(1)},${baselineY} L ${scaled[0].x.toFixed(1)},${baselineY} Z`;

    // Secondary comparison series (previous period 85% volume)
    const secValues = values.map(v => v * 0.82);
    const secScaled = scaleToViewport(secValues, { width: w, height: h, padLeft, padRight, padTop, padBottom });
    const secPathD = config.curved ? catmullRomPath(secScaled) : secScaled.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

    const tones = getToneColors();

    return `
      <div style="position:relative; width:100%; height:${h}px; user-select:none;">
        <svg id="area-chart-svg" viewBox="0 0 ${w} ${h}" style="width:100%; height:100%; overflow:visible;">
          <defs>
            <linearGradient id="areaCurveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="${tones.fillStart}" />
              <stop offset="100%" stop-color="${tones.fillEnd}" />
            </linearGradient>
          </defs>

          ${config.showGrid ? `
            <line x1="${padLeft}" y1="${padTop}" x2="${w - padRight}" y2="${padTop}" stroke="var(--chart-grid, var(--border))" stroke-dasharray="3 3" />
            <line x1="${padLeft}" y1="${(baselineY + padTop) / 2}" x2="${w - padRight}" y2="${(baselineY + padTop) / 2}" stroke="var(--chart-grid, var(--border))" stroke-dasharray="3 3" />
            <line x1="${padLeft}" y1="${baselineY}" x2="${w - padRight}" y2="${baselineY}" stroke="var(--border-strong)" />
          ` : ''}

          <!-- Area Fill -->
          <path d="${areaD}" fill="url(#areaCurveGradient)" />

          ${config.showSecondary ? `
            <!-- Secondary Series Guide -->
            <path d="${secPathD}" fill="none" stroke="var(--text-dim)" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.6" />
          ` : ''}

          <!-- Primary Curve -->
          <path d="${pathD}" fill="none" stroke="${tones.line}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

          <!-- Interactive Vertical Hairline (Dynamic) -->
          <line id="svg-crosshair-line" x1="0" y1="${padTop}" x2="0" y2="${baselineY}" stroke="var(--text-secondary)" stroke-width="1" stroke-dasharray="2 2" style="display:none;" />

          <!-- Interactive Active Point (Dynamic) -->
          <circle id="svg-crosshair-circle" cx="0" cy="0" r="5" fill="var(--surface-1)" stroke="${tones.line}" stroke-width="2.5" style="display:none;" />

          <!-- Data Points Circles -->
          ${scaled.map((p, idx) => `
            <circle class="static-chart-circle" data-idx="${idx}" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3.5" fill="var(--surface-1)" stroke="${tones.line}" stroke-width="1.5" />
          `).join('')}

          <!-- X-Axis Labels -->
          ${scaled.map((p, idx) => `
            <text x="${p.x.toFixed(1)}" y="${h - 8}" text-anchor="middle" fill="var(--text-dim)" font-size="10" font-family="var(--font-mono)">${data[idx].label}</text>
          `).join('')}
        </svg>
      </div>
    `;
  }

  function renderBarChart(data) {
    const maxVal = Math.max(...data.map(d => d.val)) * 1.15;
    const tones = getToneColors();

    return `
      <div style="height:220px; display:flex; flex-direction:column; justify-content:flex-end;">
        <div id="bar-chart-track" style="flex:1; display:flex; align-items:flex-end; gap:16px; border-bottom:1px solid var(--border-strong); padding-bottom:8px;">
          ${data.map((d, idx) => {
            const pct = Math.round((d.val / maxVal) * 100);
            return `
              <div class="interactive-bar-col" data-idx="${idx}" style="flex:1; display:flex; flex-direction:column; align-items:center; height:100%; justify-content:flex-end; cursor:pointer; position:relative;">
                <div class="bar-value-label" style="font-size:0.68rem; font-family:var(--font-mono); color:var(--text-dim); margin-bottom:6px; opacity:0; transition:opacity 0.15s ease;">
                  ${formatCurrency(d.val)}
                </div>
                <div class="bar-rect" style="width:100%; max-width:48px; height:${pct}%; background:${tones.line}; border-radius:6px 6px 0 0; transition:all 0.18s cubic-bezier(0.16, 1, 0.3, 1);"></div>
              </div>
            `;
          }).join('')}
        </div>
        <div style="display:flex; justify-content:space-between; padding-top:10px; font-size:0.75rem; color:var(--text-dim); font-family:var(--font-mono);">
          ${data.map(d => `<span style="flex:1; text-align:center;">${d.label}</span>`).join('')}
        </div>
      </div>
    `;
  }

  function renderDonutChart() {
    const total = DONUT_DATA.reduce((acc, d) => acc + d.val, 0);
    const cx = 100;
    const cy = 100;
    const rOuter = 82;
    const rInner = 56;

    let currentAngle = 0;
    const slices = DONUT_DATA.map(item => {
      const sliceAngle = (item.val / total) * (Math.PI * 2);
      const start = currentAngle;
      const end = currentAngle + sliceAngle;
      currentAngle = end;
      const path = arcPath(cx, cy, rInner, rOuter, start, end);
      return { ...item, path };
    });

    return `
      <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:center; gap:36px; padding:16px 0;">
        <div style="position:relative; width:200px; height:200px; flex-shrink:0;">
          <svg viewBox="0 0 200 200" style="width:100%; height:100%; overflow:visible;">
            ${slices.map((slice, idx) => `
              <path class="donut-arc-slice" data-idx="${idx}" d="${slice.path}" fill="${slice.color}" style="cursor:pointer; transition:transform 0.2s cubic-bezier(0.16, 1, 0.3, 1); transform-origin:100px 100px;" />
            `).join('')}
          </svg>
          <div id="donut-center-readout" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; pointer-events:none;">
            <span id="donut-center-label" style="font-size:0.68rem; color:var(--text-dim); text-transform:uppercase; font-weight:600; letter-spacing:0.04em;">All Channels</span>
            <span id="donut-center-val" style="font-size:1.25rem; font-weight:700; color:var(--text-primary); letter-spacing:-0.02em;">$33,000</span>
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:8px; flex:1; min-width:240px;">
          ${DONUT_DATA.map((item, idx) => `
            <div class="interactive-donut-legend" data-idx="${idx}" style="display:flex; align-items:center; justify-content:space-between; font-size:0.8rem; padding:8px 12px; border-radius:var(--radius-sm); border:1px solid transparent; cursor:pointer; transition:all 0.15s ease;">
              <div style="display:flex; align-items:center; gap:10px;">
                <span style="width:10px; height:10px; border-radius:50%; background:${item.color};"></span>
                <span style="color:var(--text-primary); font-weight:500;">${item.label}</span>
              </div>
              <div style="display:flex; align-items:center; gap:12px;">
                <span style="font-family:var(--font-mono); color:var(--text-dim); font-size:0.75rem;">${item.percent}%</span>
                <span style="font-weight:600; color:var(--text-primary); font-family:var(--font-mono);">${formatCurrency(item.val)}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function bindChartEvents() {
    // Timeframe segmented buttons
    const tfBtns = chartCard.querySelectorAll('.segmented-pill-btn[data-tf]');
    tfBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        config.timeframe = btn.dataset.tf;
        renderChart();
        renderControls();
      });
    });

    const tooltip = chartCard.querySelector('#chart-floating-tooltip');
    const tipDate = chartCard.querySelector('#tooltip-date');
    const tipVal = chartCard.querySelector('#tooltip-value');
    const tipMeta = chartCard.querySelector('#tooltip-meta');

    // Area Chart Crosshair Mouse Tracking
    if (config.type === 'area') {
      const svg = chartCard.querySelector('#area-chart-svg');
      const crosshairLine = chartCard.querySelector('#svg-crosshair-line');
      const crosshairCircle = chartCard.querySelector('#svg-crosshair-circle');
      const data = CHART_DATA[config.timeframe] || CHART_DATA['7d'];
      const values = data.map(d => d.val);
      const scaled = scaleToViewport(values, { width: 620, height: 200, padLeft: 40, padRight: 20, padTop: 20, padBottom: 30 });

      if (svg && crosshairLine && crosshairCircle && tooltip) {
        svg.addEventListener('mousemove', (e) => {
          const rect = svg.getBoundingClientRect();
          const mouseX = ((e.clientX - rect.left) / rect.width) * 620;
          const nearestIdx = findNearestPoint(mouseX, scaled);
          if (nearestIdx >= 0 && nearestIdx < scaled.length) {
            const pt = scaled[nearestIdx];
            const item = data[nearestIdx];

            crosshairLine.style.display = 'block';
            crosshairLine.setAttribute('x1', pt.x.toFixed(1));
            crosshairLine.setAttribute('x2', pt.x.toFixed(1));

            crosshairCircle.style.display = 'block';
            crosshairCircle.setAttribute('cx', pt.x.toFixed(1));
            crosshairCircle.setAttribute('cy', pt.y.toFixed(1));

            // Floating Tooltip Positioning
            const cardRect = chartCard.getBoundingClientRect();
            tooltip.style.display = 'block';
            tooltip.style.left = `${e.clientX - cardRect.left}px`;
            tooltip.style.top = `${e.clientY - cardRect.top}px`;

            tipDate.textContent = item.label;
            tipVal.textContent = formatCurrency(item.val);
            tipMeta.textContent = `${item.orders} orders (${item.delta})`;
          }
        });

        svg.addEventListener('mouseleave', () => {
          crosshairLine.style.display = 'none';
          crosshairCircle.style.display = 'none';
          tooltip.style.display = 'none';
        });
      }
    }

    // Bar Chart Hover Dimming
    if (config.type === 'bar') {
      const barCols = chartCard.querySelectorAll('.interactive-bar-col');
      const data = CHART_DATA[config.timeframe] || CHART_DATA['7d'];

      barCols.forEach(col => {
        const idx = parseInt(col.dataset.idx, 10);
        col.addEventListener('mouseenter', () => {
          barCols.forEach((c, i) => {
            const rect = c.querySelector('.bar-rect');
            const lbl = c.querySelector('.bar-value-label');
            if (i === idx) {
              rect.style.opacity = '1';
              rect.style.transform = 'scaleY(1.03)';
              lbl.style.opacity = '1';
            } else {
              rect.style.opacity = '0.35';
              lbl.style.opacity = '0';
            }
          });
          const item = data[idx];
          const totalEl = chartCard.querySelector('#chart-total-metric');
          if (totalEl) totalEl.textContent = formatCurrency(item.val);
        });

        col.addEventListener('mouseleave', () => {
          barCols.forEach(c => {
            const rect = c.querySelector('.bar-rect');
            const lbl = c.querySelector('.bar-value-label');
            rect.style.opacity = '1';
            rect.style.transform = 'scaleY(1)';
            lbl.style.opacity = '0';
          });
          const totalRev = data.reduce((acc, d) => acc + d.val, 0);
          const totalEl = chartCard.querySelector('#chart-total-metric');
          if (totalEl) totalEl.textContent = formatCurrency(totalRev);
        });
      });
    }

    // Donut Chart Hover Scaling & Center Readout Synchronization
    if (config.type === 'donut') {
      const slices = chartCard.querySelectorAll('.donut-arc-slice');
      const legends = chartCard.querySelectorAll('.interactive-donut-legend');
      const centerLabel = chartCard.querySelector('#donut-center-label');
      const centerVal = chartCard.querySelector('#donut-center-val');

      function setActiveSlice(idx) {
        slices.forEach((s, i) => {
          if (i === idx) {
            s.style.transform = 'scale(1.06)';
            s.style.filter = 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))';
          } else {
            s.style.transform = 'scale(1)';
            s.style.opacity = idx >= 0 ? '0.4' : '1';
            s.style.filter = 'none';
          }
        });

        legends.forEach((l, i) => {
          if (i === idx) {
            l.style.background = 'var(--surface-2)';
            l.style.borderColor = 'var(--border-strong)';
          } else {
            l.style.background = 'transparent';
            l.style.borderColor = 'transparent';
          }
        });

        if (idx >= 0 && idx < DONUT_DATA.length) {
          const item = DONUT_DATA[idx];
          if (centerLabel) centerLabel.textContent = item.label;
          if (centerVal) centerVal.textContent = formatCurrency(item.val);
        } else {
          if (centerLabel) centerLabel.textContent = 'All Channels';
          if (centerVal) centerVal.textContent = '$33,000';
        }
      }

      slices.forEach(slice => {
        const idx = parseInt(slice.dataset.idx, 10);
        slice.addEventListener('mouseenter', () => setActiveSlice(idx));
        slice.addEventListener('mouseleave', () => setActiveSlice(-1));
      });

      legends.forEach(legend => {
        const idx = parseInt(legend.dataset.idx, 10);
        legend.addEventListener('mouseenter', () => setActiveSlice(idx));
        legend.addEventListener('mouseleave', () => setActiveSlice(-1));
      });
    }
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    // Chart Type Selector
    const typeSection = el('div', { className: 'controls-section' }, [
      el('h4', { className: 'section-title', textContent: 'Chart Archetype' }),
      el('div', { className: 'segmented-pill-bar', style: { width: '100%', justifyContent: 'space-around' } }, [
        el('button', {
          className: `segmented-pill-btn ${config.type === 'area' ? 'active' : ''}`,
          textContent: 'Area Spline',
          onclick: () => { config.type = 'area'; renderChart(); renderControls(); }
        }),
        el('button', {
          className: `segmented-pill-btn ${config.type === 'bar' ? 'active' : ''}`,
          textContent: 'Bar Graph',
          onclick: () => { config.type = 'bar'; renderChart(); renderControls(); }
        }),
        el('button', {
          className: `segmented-pill-btn ${config.type === 'donut' ? 'active' : ''}`,
          textContent: 'Donut Distribution',
          onclick: () => { config.type = 'donut'; renderChart(); renderControls(); }
        })
      ])
    ]);
    controlsStage.appendChild(typeSection);

    // Color Palette Tone
    const toneSection = el('div', { className: 'controls-section' }, [
      el('h4', { className: 'section-title', textContent: 'Color Tone Accent' }),
      el('div', { className: 'segmented-pill-bar', style: { width: '100%', justifyContent: 'space-around' } }, [
        el('button', {
          className: `segmented-pill-btn ${config.colorTone === 'zinc' ? 'active' : ''}`,
          textContent: 'Zinc Monochrome',
          onclick: () => { config.colorTone = 'zinc'; renderChart(); renderControls(); }
        }),
        el('button', {
          className: `segmented-pill-btn ${config.colorTone === 'emerald' ? 'active' : ''}`,
          textContent: 'Emerald Growth',
          onclick: () => { config.colorTone = 'emerald'; renderChart(); renderControls(); }
        }),
        el('button', {
          className: `segmented-pill-btn ${config.colorTone === 'indigo' ? 'active' : ''}`,
          textContent: 'Indigo Tech',
          onclick: () => { config.colorTone = 'indigo'; renderChart(); renderControls(); }
        })
      ])
    ]);
    controlsStage.appendChild(toneSection);

    // Display Feature Toggles
    if (config.type === 'area') {
      const toggleSection = el('div', { className: 'controls-section' }, [
        el('h4', { className: 'section-title', textContent: 'Curve & Projection Options' }),
        createToggleSwitch('Smooth Spline Curve', config.curved, (v) => { config.curved = v; renderChart(); }),
        createToggleSwitch('Show Horizontal Grid', config.showGrid, (v) => { config.showGrid = v; renderChart(); }),
        createToggleSwitch('Compare Previous Period', config.showSecondary, (v) => { config.showSecondary = v; renderChart(); })
      ]);
      controlsStage.appendChild(toggleSection);
    }
  }

  function createToggleSwitch(label, initialVal, onChange) {
    const row = el('div', { className: 'control-group', style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } });
    const lbl = el('span', { style: { fontSize: '0.8rem', color: 'var(--text-muted)' }, textContent: label });
    const switchBox = el('label', { className: 'switch' });
    const input = el('input', { type: 'checkbox', checked: initialVal });
    const slider = el('span', { className: 'slider-toggle' });

    input.addEventListener('change', (e) => {
      onChange(e.target.checked);
    });

    switchBox.appendChild(input);
    switchBox.appendChild(slider);
    row.appendChild(lbl);
    row.appendChild(switchBox);
    return row;
  }

  function emitCode() {
    const data = CHART_DATA[config.timeframe] || CHART_DATA['7d'];
    const totalRev = data.reduce((acc, d) => acc + d.val, 0);

    const cssSnippet = `/* Production Interactive Chart Tokens */
:root {
  --chart-line: var(--text-primary);
  --chart-fill-start: rgba(244, 244, 245, 0.2);
  --chart-fill-end: rgba(244, 244, 245, 0);
  --chart-grid: rgba(63, 63, 70, 0.5);
  --chart-tooltip-bg: var(--surface-2);
  --chart-tooltip-border: var(--border-strong);
}

.chart-card {
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-md);
}

.chart-bar {
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

.chart-bar:hover {
  transform: scaleY(1.03);
}

.donut-slice {
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: center;
}

.donut-slice:hover {
  transform: scale(1.06);
}`;

    const tailwindSnippet = `<!-- Interactive Chart Card (shadcn / HeroUI Standard) -->
<div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-xl backdrop-blur-xl">
  <div class="flex items-center justify-between pb-4">
    <div>
      <span class="text-xs font-semibold uppercase tracking-wider text-zinc-500">Gross Velocity</span>
      <h3 class="text-3xl font-bold tracking-tight text-zinc-50 mt-1">${formatCurrency(totalRev)}</h3>
    </div>
    <span class="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
      +24.8% vs last month
    </span>
  </div>
  
  <!-- SVG Viewport -->
  <svg viewBox="0 0 620 200" class="w-full h-48 overflow-visible">
    <defs>
      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="currentColor" stop-opacity="0.25" />
        <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
      </linearGradient>
    </defs>
    <!-- Mathematical Catmull-Rom Path Generated with Huragon -->
    <path d="M 40.0,165.0 C 78.8,142.0 117.5,158.0 156.2,148.0 ..." class="fill-zinc-400/20 stroke-zinc-100" stroke-width="2.5" />
  </svg>
</div>`;

    const reactSnippet = `import React, { useState } from 'react';

export default function InteractiveChart() {
  const [activeIdx, setActiveIdx] = useState(null);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-100 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-zinc-400">Total Volume</span>
          <div className="text-3xl font-bold mt-1">${formatCurrency(totalRev)}</div>
        </div>
      </div>
      <svg viewBox="0 0 620 200" className="w-full h-48">
        {/* Render Catmull-Rom spline curves with crosshairs */}
      </svg>
    </div>
  );
}`;

    const tokensSnippet = JSON.stringify({
      "$schema": "https://design-tokens.github.io/community-group/format/v1/schema.json",
      "chart": {
        "metric": { "value": totalRev, "type": "number" },
        "timeframe": { "value": config.timeframe, "type": "string" },
        "type": { "value": config.type, "type": "string" },
        "lineColor": { "value": "var(--text-primary)", "type": "color" }
      }
    }, null, 2);

    onCodeChange({
      css: cssSnippet,
      tailwind: tailwindSnippet,
      react: reactSnippet,
      tokens: tokensSnippet
    });
  }
}
