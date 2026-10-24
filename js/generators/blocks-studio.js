// Tool: shadcn/ui & HeroUI Blocks Studio
// Production-ready application blocks: Analytics Dashboard, Auth Card, Settings Profile, Pricing Comparison, and Feature Grid
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';
import { copyToClipboard } from '../clipboard.js';

export const meta = {
  id: 'blocks-studio',
  name: 'Page Blocks Studio'
};

let config = {
  block: 'dashboard', // dashboard, auth, settings, pricing, features
  viewport: '100%',   // 100%, 768px, 390px
  billingCycle: 'monthly' // monthly, annual
};

const BLOCKS = [
  { id: 'dashboard', name: 'Analytics Dashboard', icon: 'barChart', desc: 'KPI metrics, revenue area chart, and recent orders table' },
  { id: 'auth',      name: 'Authentication Card', icon: 'shield',   desc: 'Social login, credentials form, and terms agreement' },
  { id: 'settings',  name: 'Settings & Profile',  icon: 'settings', desc: 'Sidebar sub-nav, profile form, and workspace controls' },
  { id: 'pricing',   name: 'Pricing Comparison',  icon: 'dollar',   desc: 'Billing toggle, 3-tier cards with checkmarks and CTA' },
  { id: 'features',  name: 'Feature Grid',        icon: 'grid',     desc: 'HeroUI 3-column feature cards with glow and micro-links' }
];

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    id: 'blocks-studio-stage',
    style: {
      width: '100%',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '24px 20px 60px 20px',
      gap: '20px'
    }
  });

  // Top viewport toolbar for the block
  const viewportBar = el('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      maxWidth: '1080px',
      padding: '8px 14px',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)'
    }
  });

  viewportBar.innerHTML = `
    <div style="display:flex; align-items:center; gap:8px;">
      <span style="font-size:0.75rem; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.04em;">Viewport Simulator</span>
      <span style="font-size:0.7rem; font-family:var(--font-mono); color:var(--text-dim); background:var(--bg-main); padding:2px 6px; border-radius:4px; border:1px solid var(--border);" id="viewport-indicator">Desktop (100%)</span>
    </div>
    <div style="display:flex; align-items:center; gap:6px;">
      <button class="btn btn-ghost viewport-btn active" data-vp="100%" style="padding:4px 8px; font-size:0.75rem;">Desktop</button>
      <button class="btn btn-ghost viewport-btn" data-vp="768px" style="padding:4px 8px; font-size:0.75rem;">Tablet</button>
      <button class="btn btn-ghost viewport-btn" data-vp="390px" style="padding:4px 8px; font-size:0.75rem;">Mobile</button>
    </div>
  `;

  centerStage.appendChild(viewportBar);

  const blockFrame = el('div', {
    id: 'block-render-container',
    style: {
      width: config.viewport,
      maxWidth: '1080px',
      background: 'var(--bg-app)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-md)',
      transition: 'width 0.26s cubic-bezier(0.16, 1, 0.3, 1)'
    }
  });

  centerStage.appendChild(blockFrame);
  previewStage.appendChild(centerStage);

  viewportBar.querySelectorAll('.viewport-btn').forEach(btn => {
    btn.onclick = () => {
      viewportBar.querySelectorAll('.viewport-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      config.viewport = btn.dataset.vp;
      blockFrame.style.width = config.viewport;
      const vpInd = viewportBar.querySelector('#viewport-indicator');
      if (vpInd) {
        vpInd.textContent = config.viewport === '100%' ? 'Desktop (100%)' : config.viewport === '768px' ? 'Tablet (768px)' : 'Mobile (390px)';
      }
    };
  });

  // Controls in sidebar
  renderControls();
  renderActiveBlock();

  function renderControls() {
    controlsStage.innerHTML = '';

    const section = el('div', { className: 'control-section' }, [
      el('div', { className: 'control-section-header' }, [
        el('h4', { className: 'control-section-title', textContent: 'Application Blocks' })
      ]),
      el('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' } },
        BLOCKS.map(b => el('button', {
          className: `btn btn-outline ${config.block === b.id ? 'active' : ''}`,
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '10px',
            padding: '10px 12px',
            textAlign: 'left'
          },
          innerHTML: `
            <div style="flex:1;">
              <div style="font-weight:600; font-size:0.8rem; color:var(--text-main);">${b.name}</div>
              <div style="font-size:0.7rem; color:var(--text-dim); margin-top:2px;">${b.desc}</div>
            </div>
          `,
          onclick: () => {
            config.block = b.id;
            renderControls();
            renderActiveBlock();
          }
        }))
      )
    ]);

    controlsStage.appendChild(section);
  }

  function renderActiveBlock() {
    blockFrame.innerHTML = '';

    if (config.block === 'dashboard') {
      renderDashboardBlock(blockFrame);
    } else if (config.block === 'auth') {
      renderAuthBlock(blockFrame);
    } else if (config.block === 'settings') {
      renderSettingsBlock(blockFrame);
    } else if (config.block === 'pricing') {
      renderPricingBlock(blockFrame);
    } else if (config.block === 'features') {
      renderFeaturesBlock(blockFrame);
    }

    generateCode();
  }

  // 1. ANALYTICS DASHBOARD BLOCK
  function renderDashboardBlock(target) {
    target.innerHTML = `
      <div style="padding:24px; display:flex; flex-direction:column; gap:20px;">
        <!-- Header -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <h2 style="font-size:1.35rem; font-weight:700; color:var(--text-main); margin:0 0 4px; letter-spacing:-0.02em;">Analytics Overview</h2>
            <p style="font-size:0.78rem; color:var(--text-muted); margin:0;">Real-time performance metrics and recent transaction activity.</p>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <button class="btn btn-outline" style="font-size:0.75rem; padding:6px 12px;">
              ${ICONS.download} <span>Export CSV</span>
            </button>
            <button class="btn btn-primary" style="font-size:0.75rem; padding:6px 12px;">
              <span>Add Widget</span>
            </button>
          </div>
        </div>

        <!-- 4 KPI Summary Cards -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr)); gap:14px;">
          <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-md); padding:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-size:0.75rem; font-weight:500; color:var(--text-muted);">Total Revenue</span>
              <span style="font-size:0.7rem; color:var(--text-dim);">$ USD</span>
            </div>
            <div style="font-size:1.5rem; font-weight:700; color:var(--text-main); letter-spacing:-0.03em;">$45,231.89</div>
            <div style="display:flex; align-items:center; gap:4px; font-size:0.72rem; color:#22c55e; margin-top:6px; font-weight:500;">
              <span>+20.1%</span>
              <span style="color:var(--text-dim);">from last month</span>
            </div>
          </div>

          <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-md); padding:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-size:0.75rem; font-weight:500; color:var(--text-muted);">Subscriptions</span>
              <span style="font-size:0.7rem; color:var(--text-dim);">Active</span>
            </div>
            <div style="font-size:1.5rem; font-weight:700; color:var(--text-main); letter-spacing:-0.03em;">+2,350</div>
            <div style="display:flex; align-items:center; gap:4px; font-size:0.72rem; color:#22c55e; margin-top:6px; font-weight:500;">
              <span>+180.1%</span>
              <span style="color:var(--text-dim);">from last month</span>
            </div>
          </div>

          <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-md); padding:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-size:0.75rem; font-weight:500; color:var(--text-muted);">Sales Volume</span>
              <span style="font-size:0.7rem; color:var(--text-dim);">Units</span>
            </div>
            <div style="font-size:1.5rem; font-weight:700; color:var(--text-main); letter-spacing:-0.03em;">+12,234</div>
            <div style="display:flex; align-items:center; gap:4px; font-size:0.72rem; color:#22c55e; margin-top:6px; font-weight:500;">
              <span>+19%</span>
              <span style="color:var(--text-dim);">from last month</span>
            </div>
          </div>

          <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-md); padding:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-size:0.75rem; font-weight:500; color:var(--text-muted);">Active Now</span>
              <span style="width:6px; height:6px; border-radius:50%; background:#22c55e; display:inline-block;"></span>
            </div>
            <div style="font-size:1.5rem; font-weight:700; color:var(--text-main); letter-spacing:-0.03em;">+573</div>
            <div style="display:flex; align-items:center; gap:4px; font-size:0.72rem; color:var(--text-dim); margin-top:6px;">
              <span>+201 since last hour</span>
            </div>
          </div>
        </div>

        <!-- 2-Column Grid: Revenue SVG Chart & Recent Orders -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:16px;">
          <!-- Chart Card -->
          <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-md); padding:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
              <div>
                <h4 style="font-size:0.9rem; font-weight:600; color:var(--text-main); margin:0 0 2px;">Revenue Velocity</h4>
                <p style="font-size:0.72rem; color:var(--text-dim); margin:0;">Daily gross volume trend over 7 days</p>
              </div>
              <span style="font-size:0.7rem; font-family:var(--font-mono); color:#22c55e; background:rgba(34, 197, 94, 0.1); padding:2px 8px; border-radius:999px;">
                Avg $6,461/day
              </span>
            </div>

            <!-- SVG Chart with gradient fill -->
            <div style="width:100%; height:160px; position:relative;">
              <svg viewBox="0 0 500 160" preserveAspectRatio="none" style="width:100%; height:100%; overflow:visible;">
                <defs>
                  <linearGradient id="db-chart-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.32" />
                    <stop offset="100%" stop-color="var(--accent)" stop-opacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M 0 130 C 70 120, 100 80, 160 90 C 220 100, 260 40, 340 60 C 400 80, 440 20, 500 30 L 500 160 L 0 160 Z" fill="url(#db-chart-grad)" />
                <path d="M 0 130 C 70 120, 100 80, 160 90 C 220 100, 260 40, 340 60 C 400 80, 440 20, 500 30" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" />
                <circle cx="500" cy="30" r="4.5" fill="var(--text-main)" stroke="var(--bg-card)" stroke-width="2" />
              </svg>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:0.7rem; font-family:var(--font-mono); color:var(--text-dim); margin-top:8px;">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>

          <!-- Recent Orders Card -->
          <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-md); padding:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
              <div>
                <h4 style="font-size:0.9rem; font-weight:600; color:var(--text-main); margin:0 0 2px;">Recent Transactions</h4>
                <p style="font-size:0.72rem; color:var(--text-dim); margin:0;">You made 265 sales this month.</p>
              </div>
              <button class="btn btn-ghost" style="font-size:0.72rem; padding:4px 8px;">View all</button>
            </div>

            <div style="display:flex; flex-direction:column; gap:12px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="display:flex; align-items:center; gap:10px;">
                  <div style="width:32px; height:32px; border-radius:50%; background:var(--bg-input); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:600; color:var(--text-main);">OM</div>
                  <div>
                    <div style="font-size:0.8rem; font-weight:600; color:var(--text-main);">Olivia Martin</div>
                    <div style="font-size:0.7rem; color:var(--text-dim);">olivia.martin@email.com</div>
                  </div>
                </div>
                <div style="font-size:0.85rem; font-weight:600; color:var(--text-main); font-family:var(--font-mono);">+$1,999.00</div>
              </div>

              <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="display:flex; align-items:center; gap:10px;">
                  <div style="width:32px; height:32px; border-radius:50%; background:var(--bg-input); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:600; color:var(--text-main);">JL</div>
                  <div>
                    <div style="font-size:0.8rem; font-weight:600; color:var(--text-main);">Jackson Lee</div>
                    <div style="font-size:0.7rem; color:var(--text-dim);">jackson.lee@email.com</div>
                  </div>
                </div>
                <div style="font-size:0.85rem; font-weight:600; color:var(--text-main); font-family:var(--font-mono);">+$39.00</div>
              </div>

              <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="display:flex; align-items:center; gap:10px;">
                  <div style="width:32px; height:32px; border-radius:50%; background:var(--bg-input); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:600; color:var(--text-main);">IN</div>
                  <div>
                    <div style="font-size:0.8rem; font-weight:600; color:var(--text-main);">Isabella Nguyen</div>
                    <div style="font-size:0.7rem; color:var(--text-dim);">isabella.nguyen@email.com</div>
                  </div>
                </div>
                <div style="font-size:0.85rem; font-weight:600; color:var(--text-main); font-family:var(--font-mono);">+$299.00</div>
              </div>

              <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="display:flex; align-items:center; gap:10px;">
                  <div style="width:32px; height:32px; border-radius:50%; background:var(--bg-input); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:600; color:var(--text-main);">WK</div>
                  <div>
                    <div style="font-size:0.8rem; font-weight:600; color:var(--text-main);">William Kim</div>
                    <div style="font-size:0.7rem; color:var(--text-dim);">will@email.com</div>
                  </div>
                </div>
                <div style="font-size:0.85rem; font-weight:600; color:var(--text-main); font-family:var(--font-mono);">+$99.00</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 2. AUTHENTICATION CARD BLOCK
  function renderAuthBlock(target) {
    target.innerHTML = `
      <div style="padding:48px 20px; display:flex; justify-content:center; align-items:center;">
        <div style="width:100%; maxWidth:400px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:32px; box-shadow:var(--shadow-md);">
          <!-- Heading -->
          <div style="text-align:center; margin-bottom:24px;">
            <div style="display:inline-flex; align-items:center; justify-content:center; width:36px; height:36px; border-radius:var(--radius-md); background:var(--bg-input); border:1px solid var(--border); margin-bottom:12px; color:var(--text-main);">
              ${ICONS.lock || ICONS.shield}
            </div>
            <h3 style="font-size:1.25rem; font-weight:700; color:var(--text-main); margin:0 0 6px; letter-spacing:-0.02em;">Welcome back</h3>
            <p style="font-size:0.78rem; color:var(--text-muted); margin:0;">Enter your credentials to access your account workspace</p>
          </div>

          <!-- Social Login Buttons -->
          <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:18px;">
            <button class="btn btn-outline" style="width:100%; justify-content:center; font-size:0.8rem; padding:8px 12px; gap:8px;">
              ${ICONS.github} <span>Continue with GitHub</span>
            </button>
            <button class="btn btn-outline" style="width:100%; justify-content:center; font-size:0.8rem; padding:8px 12px; gap:8px;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <!-- Divider -->
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:18px;">
            <div style="flex:1; height:1px; background:var(--border);"></div>
            <span style="font-size:0.68rem; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-dim);">Or continue with</span>
            <div style="flex:1; height:1px; background:var(--border);"></div>
          </div>

          <!-- Form Fields -->
          <div style="display:flex; flex-direction:column; gap:14px;">
            <div>
              <label style="display:block; font-size:0.75rem; font-weight:500; color:var(--text-main); margin-bottom:6px;">Email address</label>
              <input type="email" value="alex@example.com" placeholder="name@company.com" style="width:100%; padding:9px 12px; background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-md); color:var(--text-main); font-size:0.85rem; outline:none;" />
            </div>

            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <label style="font-size:0.75rem; font-weight:500; color:var(--text-main);">Password</label>
                <a href="#" style="font-size:0.72rem; color:var(--text-muted); text-decoration:none;" onclick="event.preventDefault()">Forgot password?</a>
              </div>
              <input type="password" value="secretpassword123" placeholder="Enter password" style="width:100%; padding:9px 12px; background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-md); color:var(--text-main); font-size:0.85rem; outline:none;" />
            </div>

            <button class="btn btn-primary" style="width:100%; justify-content:center; padding:10px 14px; margin-top:6px; font-weight:600; font-size:0.85rem;">
              <span>Sign in with Email</span>
            </button>
          </div>

          <!-- Terms footnote -->
          <p style="font-size:0.7rem; color:var(--text-dim); text-align:center; margin:20px 0 0; line-height:1.4;">
            By continuing, you agree to our <a href="#" style="color:var(--text-muted); text-decoration:underline;">Terms of Service</a> and <a href="#" style="color:var(--text-muted); text-decoration:underline;">Privacy Policy</a>.
          </p>
        </div>
      </div>
    `;
  }

  // 3. SETTINGS & PROFILE BLOCK
  function renderSettingsBlock(target) {
    target.innerHTML = `
      <div style="padding:28px 24px; display:flex; flex-direction:column; gap:20px;">
        <div style="border-bottom:1px solid var(--border); padding-bottom:16px;">
          <h2 style="font-size:1.35rem; font-weight:700; color:var(--text-main); margin:0 0 4px; letter-spacing:-0.02em;">Settings</h2>
          <p style="font-size:0.78rem; color:var(--text-muted); margin:0;">Manage your account preferences, billing, and team workspaces.</p>
        </div>

        <div style="display:grid; grid-template-columns:180px 1fr; gap:28px;">
          <!-- Sub-Nav Sidebar -->
          <div style="display:flex; flex-direction:column; gap:4px;">
            <button class="btn btn-ghost active" style="justify-content:flex-start; font-size:0.78rem; padding:7px 10px; font-weight:500;">General</button>
            <button class="btn btn-ghost" style="justify-content:flex-start; font-size:0.78rem; padding:7px 10px; font-weight:500;">Account Profile</button>
            <button class="btn btn-ghost" style="justify-content:flex-start; font-size:0.78rem; padding:7px 10px; font-weight:500;">Billing & Plans</button>
            <button class="btn btn-ghost" style="justify-content:flex-start; font-size:0.78rem; padding:7px 10px; font-weight:500;">Notifications</button>
            <button class="btn btn-ghost" style="justify-content:flex-start; font-size:0.78rem; padding:7px 10px; font-weight:500;">API Tokens</button>
          </div>

          <!-- Main Settings Form -->
          <div style="display:flex; flex-direction:column; gap:20px; max-width:540px;">
            <!-- Profile Avatar Row -->
            <div style="display:flex; align-items:center; gap:16px;">
              <div style="width:54px; height:54px; border-radius:50%; background:var(--bg-input); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; font-weight:700; color:var(--text-main); font-size:1.1rem;">
                JD
              </div>
              <div>
                <button class="btn btn-outline" style="font-size:0.75rem; padding:6px 12px;">Change Avatar</button>
                <div style="font-size:0.68rem; color:var(--text-dim); margin-top:4px;">JPG, GIF or PNG. Max size 2MB.</div>
              </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:6px;">
              <label style="font-size:0.75rem; font-weight:600; color:var(--text-main);">Display Name</label>
              <input type="text" value="Jane Doe" style="padding:8px 12px; background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-md); color:var(--text-main); font-size:0.85rem;" />
              <span style="font-size:0.7rem; color:var(--text-dim);">This is your public display name on workspace projects.</span>
            </div>

            <div style="display:flex; flex-direction:column; gap:6px;">
              <label style="font-size:0.75rem; font-weight:600; color:var(--text-main);">Email Address</label>
              <input type="email" value="jane.doe@acme.dev" style="padding:8px 12px; background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-md); color:var(--text-main); font-size:0.85rem;" />
              <span style="font-size:0.7rem; color:var(--text-dim);">Notifications and security alerts will be sent here.</span>
            </div>

            <div style="display:flex; flex-direction:column; gap:6px;">
              <label style="font-size:0.75rem; font-weight:600; color:var(--text-main);">Bio</label>
              <textarea rows="3" style="padding:8px 12px; background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-md); color:var(--text-main); font-size:0.85rem; font-family:inherit; resize:vertical;">Staff Product Engineer at Acme. Building open-source web design infrastructure.</textarea>
            </div>

            <div style="display:flex; align-items:center; justify-content:flex-end; gap:10px; border-top:1px solid var(--border); padding-top:16px;">
              <button class="btn btn-ghost" style="font-size:0.78rem;">Discard</button>
              <button class="btn btn-primary" style="font-size:0.78rem; padding:8px 16px;">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 4. PRICING COMPARISON BLOCK
  function renderPricingBlock(target) {
    const isAnnual = config.billingCycle === 'annual';

    target.innerHTML = `
      <div style="padding:36px 20px; display:flex; flex-direction:column; align-items:center; gap:24px;">
        <div style="text-align:center; max-width:540px;">
          <div style="display:inline-flex; align-items:center; gap:6px; font-size:0.72rem; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--accent); background:rgba(255, 255, 255, 0.04); padding:3px 10px; border-radius:999px; border:1px solid var(--border); margin-bottom:12px;">
            Flexible Plans
          </div>
          <h2 style="font-size:1.75rem; font-weight:800; color:var(--text-main); margin:0 0 8px; letter-spacing:-0.03em;">Simple, transparent pricing</h2>
          <p style="font-size:0.85rem; color:var(--text-muted); margin:0;">Deploy in minutes. Upgrade or downgrade anytime without lock-in.</p>
        </div>

        <!-- Billing Toggle Pill -->
        <div style="display:inline-flex; align-items:center; background:var(--bg-card); padding:3px; border-radius:999px; border:1px solid var(--border);">
          <button id="bill-monthly-btn" class="btn btn-ghost ${!isAnnual ? 'active' : ''}" style="font-size:0.75rem; padding:5px 14px; border-radius:999px;">Monthly</button>
          <button id="bill-annual-btn" class="btn btn-ghost ${isAnnual ? 'active' : ''}" style="font-size:0.75rem; padding:5px 14px; border-radius:999px; display:flex; align-items:center; gap:6px;">
            <span>Annually</span>
            <span style="font-size:0.65rem; background:#22c55e; color:#000; font-weight:700; padding:1px 6px; border-radius:999px;">Save 20%</span>
          </button>
        </div>

        <!-- 3 Tier Cards -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:16px; width:100%; max-width:960px;">
          <!-- Starter Tier -->
          <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:24px; display:flex; flex-direction:column;">
            <div style="font-size:1rem; font-weight:700; color:var(--text-main); margin-bottom:4px;">Starter</div>
            <div style="font-size:0.75rem; color:var(--text-muted); min-height:36px;">For hobbyists and independent side-project developers.</div>
            <div style="margin:16px 0; display:flex; align-items:baseline; gap:4px;">
              <span style="font-size:2rem; font-weight:800; color:var(--text-main);">$0</span>
              <span style="font-size:0.78rem; color:var(--text-dim);">/ month</span>
            </div>
            <button class="btn btn-outline" style="width:100%; justify-content:center; padding:8px 0; margin-bottom:20px; font-size:0.8rem;">Get Started Free</button>
            <div style="display:flex; flex-direction:column; gap:10px; font-size:0.78rem; color:var(--text-muted); flex:1;">
              <div style="display:flex; align-items:center; gap:8px;">${ICONS.check} <span>Up to 3 team projects</span></div>
              <div style="display:flex; align-items:center; gap:8px;">${ICONS.check} <span>Community support</span></div>
              <div style="display:flex; align-items:center; gap:8px;">${ICONS.check} <span>1GB Cloud storage</span></div>
            </div>
          </div>

          <!-- Pro Tier (Highlighted) -->
          <div style="background:var(--bg-card); border:1.5px solid var(--accent); border-radius:var(--radius-lg); padding:24px; display:flex; flex-direction:column; position:relative; box-shadow:0 8px 24px rgba(0,0,0,0.3);">
            <div style="position:absolute; top:-10px; right:20px; background:var(--accent); color:var(--bg-app); font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; padding:2px 8px; border-radius:999px;">
              Most Popular
            </div>
            <div style="font-size:1rem; font-weight:700; color:var(--text-main); margin-bottom:4px;">Pro Team</div>
            <div style="font-size:0.75rem; color:var(--text-muted); min-height:36px;">For growing teams and fast-scaling production apps.</div>
            <div style="margin:16px 0; display:flex; align-items:baseline; gap:4px;">
              <span style="font-size:2rem; font-weight:800; color:var(--text-main);">${isAnnual ? '$24' : '$29'}</span>
              <span style="font-size:0.78rem; color:var(--text-dim);">/ month</span>
            </div>
            <button class="btn btn-primary" style="width:100%; justify-content:center; padding:8px 0; margin-bottom:20px; font-size:0.8rem; font-weight:600;">Upgrade to Pro</button>
            <div style="display:flex; flex-direction:column; gap:10px; font-size:0.78rem; color:var(--text-muted); flex:1;">
              <div style="display:flex; align-items:center; gap:8px;">${ICONS.check} <span>Unlimited team projects</span></div>
              <div style="display:flex; align-items:center; gap:8px;">${ICONS.check} <span>Priority 24/7 SLA</span></div>
              <div style="display:flex; align-items:center; gap:8px;">${ICONS.check} <span>100GB Cloud storage</span></div>
              <div style="display:flex; align-items:center; gap:8px;">${ICONS.check} <span>Advanced analytics studio</span></div>
            </div>
          </div>

          <!-- Enterprise Tier -->
          <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:24px; display:flex; flex-direction:column;">
            <div style="font-size:1rem; font-weight:700; color:var(--text-main); margin-bottom:4px;">Enterprise</div>
            <div style="font-size:0.75rem; color:var(--text-muted); min-height:36px;">Dedicated cloud tenancy with bespoke security controls.</div>
            <div style="margin:16px 0; display:flex; align-items:baseline; gap:4px;">
              <span style="font-size:2rem; font-weight:800; color:var(--text-main);">${isAnnual ? '$79' : '$99'}</span>
              <span style="font-size:0.78rem; color:var(--text-dim);">/ month</span>
            </div>
            <button class="btn btn-outline" style="width:100%; justify-content:center; padding:8px 0; margin-bottom:20px; font-size:0.8rem;">Contact Sales</button>
            <div style="display:flex; flex-direction:column; gap:10px; font-size:0.78rem; color:var(--text-muted); flex:1;">
              <div style="display:flex; align-items:center; gap:8px;">${ICONS.check} <span>Single Sign-On (SAML/Okta)</span></div>
              <div style="display:flex; align-items:center; gap:8px;">${ICONS.check} <span>Custom VPC isolation</span></div>
              <div style="display:flex; align-items:center; gap:8px;">${ICONS.check} <span>Dedicated account architect</span></div>
            </div>
          </div>
        </div>
      </div>
    `;

    const monthlyBtn = target.querySelector('#bill-monthly-btn');
    const annualBtn = target.querySelector('#bill-annual-btn');
    if (monthlyBtn && annualBtn) {
      monthlyBtn.onclick = () => {
        config.billingCycle = 'monthly';
        renderPricingBlock(target);
      };
      annualBtn.onclick = () => {
        config.billingCycle = 'annual';
        renderPricingBlock(target);
      };
    }
  }

  // 5. FEATURE SHOWCASE GRID
  function renderFeaturesBlock(target) {
    target.innerHTML = `
      <div style="padding:40px 24px; display:flex; flex-direction:column; align-items:center; gap:32px;">
        <div style="text-align:center; max-width:540px;">
          <h2 style="font-size:1.75rem; font-weight:800; color:var(--text-main); margin:0 0 8px; letter-spacing:-0.03em;">Engineered for modern developer workflows</h2>
          <p style="font-size:0.85rem; color:var(--text-muted); margin:0;">Composable, accessible, and themeable blocks built for web applications.</p>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:18px; width:100%; max-width:960px;">
          <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:24px; display:flex; flex-direction:column; gap:12px;">
            <div style="width:36px; height:36px; border-radius:var(--radius-md); background:var(--bg-input); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; color:var(--text-main);">
              ${ICONS.zap}
            </div>
            <h3 style="font-size:1rem; font-weight:700; color:var(--text-main); margin:0;">Zero Build Overhead</h3>
            <p style="font-size:0.78rem; color:var(--text-muted); margin:0; line-height:1.5;">Native ES Modules and standard CSS variables allow instant copy-paste without configuring complex bundlers.</p>
            <a href="#" style="font-size:0.75rem; color:var(--text-main); font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:4px; margin-top:4px;" onclick="event.preventDefault()">
              <span>Explore Architecture</span> ${ICONS.chevronRight}
            </a>
          </div>

          <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:24px; display:flex; flex-direction:column; gap:12px;">
            <div style="width:36px; height:36px; border-radius:var(--radius-md); background:var(--bg-input); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; color:var(--text-main);">
              ${ICONS.contrast}
            </div>
            <h3 style="font-size:1rem; font-weight:700; color:var(--text-main); margin:0;">Hardware-Accelerated Dark Mode</h3>
            <p style="font-size:0.78rem; color:var(--text-muted); margin:0; line-height:1.5;">Fluid cubic-bezier color transitions across all surfaces with zero render-blocking paint delays.</p>
            <a href="#" style="font-size:0.75rem; color:var(--text-main); font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:4px; margin-top:4px;" onclick="event.preventDefault()">
              <span>Theme Spec</span> ${ICONS.chevronRight}
            </a>
          </div>

          <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:24px; display:flex; flex-direction:column; gap:12px;">
            <div style="width:36px; height:36px; border-radius:var(--radius-md); background:var(--bg-input); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; color:var(--text-main);">
              ${ICONS.layers}
            </div>
            <h3 style="font-size:1rem; font-weight:700; color:var(--text-main); margin:0;">WCAG 2.2 Compliant</h3>
            <p style="font-size:0.78rem; color:var(--text-muted); margin:0; line-height:1.5;">Full keyboard navigation, focus indicators, ARIA accessibility semantics, and compliant contrast ratios.</p>
            <a href="#" style="font-size:0.75rem; color:var(--text-main); font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:4px; margin-top:4px;" onclick="event.preventDefault()">
              <span>Accessibility Report</span> ${ICONS.chevronRight}
            </a>
          </div>
        </div>
      </div>
    `;
  }

  function generateCode() {
    const bName = BLOCKS.find(b => b.id === config.block)?.name || 'Block';

    const css = `/* shadcn / HeroUI ${bName} Block */
.block-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-sm);
}

.kpi-title {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-muted);
}

.kpi-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-main);
  letter-spacing: -0.03em;
}`;

    const tailwind = `<!-- shadcn/ui Block: ${bName} -->
<div class="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
  <div class="flex items-center justify-between pb-2">
    <h3 class="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Revenue</h3>
    <span class="text-xs text-zinc-400">$ USD</span>
  </div>
  <div class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">$45,231.89</div>
  <p class="text-xs text-emerald-500 mt-1">+20.1% from last month</p>
</div>`;

    const react = `// React / Next.js shadcn Block: ${bName}
import React from 'react';

export function ${bName.replace(/[^a-zA-Z]/g, '')}Block() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between pb-2">
        <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Revenue</h3>
        <span className="text-xs text-zinc-400">$ USD</span>
      </div>
      <div className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">$45,231.89</div>
      <p className="text-xs text-emerald-500 mt-1">+20.1% from last month</p>
    </div>
  );
}`;

    onCodeChange({ css, tailwind, react });
  }
}
