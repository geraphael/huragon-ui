// Tool: HeroUI & shadcn/ui Interactive Charts Studio
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';

export const meta = {
  id: 'charts-studio',
  name: 'Charts & Graphs Studio'
};

const CHART_DATA = {
  days7: [
    { label: 'Mon', val: 320, orders: 14 },
    { label: 'Tue', val: 540, orders: 22 },
    { label: 'Wed', val: 410, orders: 18 },
    { label: 'Thu', val: 680, orders: 31 },
    { label: 'Fri', val: 920, orders: 45 },
    { label: 'Sat', val: 780, orders: 38 },
    { label: 'Sun', val: 860, orders: 40 }
  ],
  days30: [
    { label: 'W1', val: 2400, orders: 110 },
    { label: 'W2', val: 3100, orders: 145 },
    { label: 'W3', val: 4500, orders: 198 },
    { label: 'W4', val: 5200, orders: 230 }
  ]
};

const DONUT_DATA = [
  { label: 'Direct Commerce', percent: 45, val: '$14,850', color: '#f4f4f5' },
  { label: 'Affiliates', percent: 30, val: '$9,900', color: '#a1a1aa' },
  { label: 'Organic Search', percent: 15, val: '$4,950', color: '#71717a' },
  { label: 'Referral & Social', percent: 10, val: '$3,300', color: '#3f3f46' }
];

let config = {
  type: 'area', // 'area', 'bar', 'donut'
  timeframe: '7d', // '7d' or '30d'
  curved: true,
  showGrid: true,
  colorTone: 'zinc' // 'zinc', 'emerald', 'indigo'
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
      padding: '24px',
      gap: '20px'
    }
  });

  const chartCard = el('div', {
    id: 'interactive-chart-card',
    style: {
      width: '100%',
      maxWidth: '640px',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      boxShadow: 'var(--shadow-md)',
      transition: 'all 0.2s ease',
      position: 'relative'
    }
  });

  centerStage.appendChild(chartCard);
  previewStage.appendChild(centerStage);

  renderChart();

  function renderChart() {
    const data = config.timeframe === '7d' ? CHART_DATA.days7 : CHART_DATA.days30;
    const totalRev = data.reduce((acc, d) => acc + d.val, 0);

    let chartBody = '';

    if (config.type === 'area') {
      chartBody = renderAreaChart(data);
    } else if (config.type === 'bar') {
      chartBody = renderBarChart(data);
    } else if (config.type === 'donut') {
      chartBody = renderDonutChart();
    }

    chartCard.innerHTML = `
      <!-- Card Header with KPI & Timeframe Segmented Switcher -->
      <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:flex-start; gap:12px; margin-bottom:20px;">
        <div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:0.75rem; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-dim);">Total Revenue</span>
            <span style="display:inline-flex; align-items:center; gap:3px; font-size:0.7rem; padding:2px 7px; border-radius:999px; background:rgba(34, 197, 94, 0.12); color:#22c55e; border:1px solid rgba(34, 197, 94, 0.25); font-weight:600;">
              +24.8%
            </span>
          </div>
          <div style="font-size:1.85rem; font-weight:700; color:var(--text-main); margin-top:2px; letter-spacing:-0.03em;">
            $${totalRev.toLocaleString()}
          </div>
          <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">Showing real-time converted volume</div>
        </div>

        <!-- HeroUI Segmented Pill Switcher -->
        <div style="display:inline-flex; align-items:center; background:var(--bg-input); padding:3px; border-radius:var(--radius-sm); border:1px solid var(--border);">
          <button class="timeframe-btn ${config.timeframe === '7d' ? 'active' : ''}" data-tf="7d" style="padding:4px 10px; font-size:0.75rem; border:none; background:${config.timeframe === '7d' ? 'var(--bg-card)' : 'transparent'}; color:${config.timeframe === '7d' ? 'var(--text-main)' : 'var(--text-dim)'}; border-radius:var(--radius-xs); cursor:pointer; font-weight:500; transition:all 0.15s ease;">
            7 Days
          </button>
          <button class="timeframe-btn ${config.timeframe === '30d' ? 'active' : ''}" data-tf="30d" style="padding:4px 10px; font-size:0.75rem; border:none; background:${config.timeframe === '30d' ? 'var(--bg-card)' : 'transparent'}; color:${config.timeframe === '30d' ? 'var(--text-main)' : 'var(--text-dim)'}; border-radius:var(--radius-xs); cursor:pointer; font-weight:500; transition:all 0.15s ease;">
            4 Weeks
          </button>
        </div>
      </div>

      <!-- Rendered Chart Body -->
      ${chartBody}

      <!-- Interactive Hover Output Bubble -->
      <div id="chart-hover-info" style="margin-top:16px; padding:8px 12px; background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-sm); display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; color:var(--text-muted);">
        <span>Hover cursor over graph points to inspect exact figures</span>
        <span style="font-family:var(--font-mono); color:var(--text-dim);">Live SVG Renderer</span>
      </div>
    `;

    bindChartEvents();
    updateCode();
  }

  function renderAreaChart(data) {
    const w = 560;
    const h = 180;
    const maxVal = Math.max(...data.map(d => d.val)) * 1.15;
    const stepX = w / (data.length - 1);

    const points = data.map((d, i) => {
      const x = i * stepX;
      const y = h - (d.val / maxVal) * (h - 20);
      return { x, y, ...d };
    });

    // Generate smooth SVG curve path (Catmull-Rom or Bezier)
    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const mx = (p0.x + p1.x) / 2;
      pathD += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
    }

    const areaD = `${pathD} L ${points[points.length - 1].x} ${h} L ${points[0].x} ${h} Z`;

    return `
      <div style="position:relative; width:100%; height:${h + 30}px; overflow:hidden;">
        <svg viewBox="0 0 ${w} ${h}" style="width:100%; height:${h}px; overflow:visible;">
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="var(--text-main)" stop-opacity="0.25"/>
              <stop offset="100%" stop-color="var(--text-main)" stop-opacity="0.0"/>
            </linearGradient>
          </defs>
          ${config.showGrid ? `
            <line x1="0" y1="${h * 0.25}" x2="${w}" y2="${h * 0.25}" stroke="var(--border)" stroke-dasharray="3 3" />
            <line x1="0" y1="${h * 0.5}" x2="${w}" y2="${h * 0.5}" stroke="var(--border)" stroke-dasharray="3 3" />
            <line x1="0" y1="${h * 0.75}" x2="${w}" y2="${h * 0.75}" stroke="var(--border)" stroke-dasharray="3 3" />
            <line x1="0" y1="${h}" x2="${w}" y2="${h}" stroke="var(--border)" />
          ` : ''}
          <path d="${areaD}" fill="url(#areaGradient)" />
          <path d="${pathD}" fill="none" stroke="var(--text-main)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          
          ${points.map((p, idx) => `
            <circle class="chart-point" data-idx="${idx}" cx="${p.x}" cy="${p.y}" r="4.5" fill="var(--bg-card)" stroke="var(--text-main)" stroke-width="2" style="cursor:pointer; transition:transform 0.15s ease;" />
          `).join('')}
        </svg>

        <!-- X-axis Labels -->
        <div style="display:flex; justify-content:space-between; margin-top:8px; font-size:0.72rem; color:var(--text-dim); font-family:var(--font-mono);">
          ${data.map(d => `<span>${d.label}</span>`).join('')}
        </div>
      </div>
    `;
  }

  function renderBarChart(data) {
    const maxVal = Math.max(...data.map(d => d.val)) * 1.15;
    return `
      <div style="height:190px; display:flex; flex-direction:column; justify-content:flex-end;">
        <div style="flex:1; display:flex; align-items:flex-end; gap:12px; border-bottom:1px solid var(--border); padding-bottom:8px;">
          ${data.map((d, idx) => {
            const pct = Math.round((d.val / maxVal) * 100);
            return `
              <div class="chart-bar-col" data-idx="${idx}" style="flex:1; display:flex; flex-direction:column; align-items:center; height:100%; justify-content:flex-end; cursor:pointer;">
                <div class="bar-fill" style="width:100%; max-width:44px; height:${pct}%; background:var(--text-muted); border-radius:6px 6px 0 0; transition:all 0.15s ease;"></div>
              </div>
            `;
          }).join('')}
        </div>
        <div style="display:flex; justify-content:space-between; padding-top:8px; font-size:0.72rem; color:var(--text-dim); font-family:var(--font-mono);">
          ${data.map(d => `<span style="flex:1; text-align:center;">${d.label}</span>`).join('')}
        </div>
      </div>
    `;
  }

  function renderDonutChart() {
    return `
      <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:center; gap:28px; padding:12px 0;">
        <div style="position:relative; width:160px; height:160px; flex-shrink:0;">
          <svg viewBox="0 0 100 100" style="transform:rotate(-90deg); width:100%; height:100%;">
            <circle cx="50" cy="50" r="38" fill="none" stroke="var(--border)" stroke-width="12" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#f4f4f5" stroke-width="12" stroke-dasharray="107.4 238.8" stroke-dashoffset="0" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#a1a1aa" stroke-width="12" stroke-dasharray="71.6 238.8" stroke-dashoffset="-107.4" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#71717a" stroke-width="12" stroke-dasharray="35.8 238.8" stroke-dashoffset="-179" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#3f3f46" stroke-width="12" stroke-dasharray="23.9 238.8" stroke-dashoffset="-214.8" />
          </svg>
          <div style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;">
            <span style="font-size:0.68rem; color:var(--text-dim); text-transform:uppercase;">Channels</span>
            <span style="font-size:1.15rem; font-weight:700; color:var(--text-main);">$33k</span>
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:10px; flex:1; min-width:200px;">
          ${DONUT_DATA.map((item, idx) => `
            <div class="donut-legend-row" data-idx="${idx}" style="display:flex; align-items:center; justify-content:space-between; font-size:0.78rem; padding:4px 8px; border-radius:var(--radius-xs); cursor:pointer; transition:background 0.12s ease;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="width:8px; height:8px; border-radius:50%; background:${item.color};"></span>
                <span style="color:var(--text-main); font-weight:500;">${item.label}</span>
              </div>
              <div style="display:flex; align-items:center; gap:10px;">
                <span style="font-family:var(--font-mono); color:var(--text-dim);">${item.percent}%</span>
                <span style="font-weight:600; color:var(--text-main); font-family:var(--font-mono);">${item.val}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function bindChartEvents() {
    const data = config.timeframe === '7d' ? CHART_DATA.days7 : CHART_DATA.days30;
    const infoBox = chartCard.querySelector('#chart-hover-info');

    // Timeframe toggle
    chartCard.querySelectorAll('.timeframe-btn').forEach(btn => {
      btn.onclick = () => {
        config.timeframe = btn.dataset.tf;
        renderChart();
      };
    });

    // Area points hover
    chartCard.querySelectorAll('.chart-point').forEach(p => {
      p.onmouseenter = () => {
        const idx = parseInt(p.dataset.idx, 10);
        const item = data[idx];
        p.setAttribute('r', '7');
        p.setAttribute('fill', 'var(--text-main)');
        if (infoBox) {
          infoBox.innerHTML = `
            <span style="font-weight:600; color:var(--text-main);">${item.label}: $${item.val.toLocaleString()}</span>
            <span style="color:var(--text-dim); font-family:var(--font-mono);">${item.orders} recorded checkout conversions</span>
          `;
        }
      };
      p.onmouseleave = () => {
        p.setAttribute('r', '4.5');
        p.setAttribute('fill', 'var(--bg-card)');
        if (infoBox) {
          infoBox.innerHTML = `
            <span>Hover cursor over graph points to inspect exact figures</span>
            <span style="font-family:var(--font-mono); color:var(--text-dim);">Live SVG Renderer</span>
          `;
        }
      };
    });

    // Bar hover
    chartCard.querySelectorAll('.chart-bar-col').forEach(col => {
      col.onmouseenter = () => {
        const idx = parseInt(col.dataset.idx, 10);
        const item = data[idx];
        const barFill = col.querySelector('.bar-fill');
        if (barFill) barFill.style.background = 'var(--text-main)';
        if (infoBox) {
          infoBox.innerHTML = `
            <span style="font-weight:600; color:var(--text-main);">${item.label}: $${item.val.toLocaleString()}</span>
            <span style="color:var(--text-dim); font-family:var(--font-mono);">${item.orders} transactions</span>
          `;
        }
      };
      col.onmouseleave = () => {
        const barFill = col.querySelector('.bar-fill');
        if (barFill) barFill.style.background = 'var(--text-muted)';
        if (infoBox) {
          infoBox.innerHTML = `
            <span>Hover cursor over graph points to inspect exact figures</span>
            <span style="font-family:var(--font-mono); color:var(--text-dim);">Live SVG Renderer</span>
          `;
        }
      };
    });

    // Donut hover
    chartCard.querySelectorAll('.donut-legend-row').forEach(row => {
      row.onmouseenter = () => {
        row.style.background = 'var(--bg-hover)';
        const idx = parseInt(row.dataset.idx, 10);
        const item = DONUT_DATA[idx];
        if (infoBox) {
          infoBox.innerHTML = `
            <span style="font-weight:600; color:var(--text-main);">${item.label}: ${item.val}</span>
            <span style="color:var(--text-dim); font-family:var(--font-mono);">${item.percent}% of gross catalog sales</span>
          `;
        }
      };
      row.onmouseleave = () => {
        row.style.background = 'transparent';
        if (infoBox) {
          infoBox.innerHTML = `
            <span>Hover cursor over graph points to inspect exact figures</span>
            <span style="font-family:var(--font-mono); color:var(--text-dim);">Live SVG Renderer</span>
          `;
        }
      };
    });
  }

  function updateCode() {
    const css = `/* HeroUI / shadcn/ui — Interactive Area & Bar Chart Card */
.chart-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.45);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.chart-metric-value {
  font-size: 1.85rem;
  font-weight: 700;
  color: var(--text-main);
  letter-spacing: -0.03em;
}

.chart-area-path {
  fill: url(#areaGradient);
}

.chart-line-stroke {
  fill: none;
  stroke: var(--text-main);
  stroke-width: 2.5px;
  stroke-linecap: round;
}`;

    const tailwind = `<!-- HeroUI / shadcn/ui Interactive Chart Block -->
<div class="w-full max-w-xl rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg">
  <div class="flex items-start justify-between">
    <div>
      <p class="text-xs font-semibold uppercase tracking-wider text-zinc-500">Total Revenue</p>
      <h3 class="mt-1 text-3xl font-bold tracking-tight text-zinc-100">$4,510</h3>
    </div>
    <span class="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
      +24.8%
    </span>
  </div>
  <!-- SVG / Canvas Area or Bar Chart -->
</div>`;

    onCodeChange({ css, tailwind });
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const sec = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', textContent: 'Chart Archetype' }),
      el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '16px' } }, [
        { id: 'area', name: 'Area Trend' },
        { id: 'bar', name: 'Bar Chart' },
        { id: 'donut', name: 'Donut Break' }
      ].map(c => el('button', {
        className: `btn ${config.type === c.id ? 'btn-primary' : 'btn-outline'}`,
        style: { fontSize: '0.75rem', padding: '6px' },
        textContent: c.name,
        onclick: () => {
          config.type = c.id;
          renderControls();
          renderChart();
        }
      }))),

      el('div', { className: 'section-title', textContent: 'Display Options' }),
      el('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } }, [
        el('label', { style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer' } }, [
          el('input', {
            type: 'checkbox',
            checked: config.showGrid,
            onchange: (e) => {
              config.showGrid = e.target.checked;
              renderChart();
            }
          }),
          el('span', { textContent: 'Show Wireframe Grid Lines' })
        ])
      ])
    ]);

    controlsStage.appendChild(sec);
  }

  renderControls();
}
