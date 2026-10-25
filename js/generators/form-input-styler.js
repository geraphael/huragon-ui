// Tool: HeroUI & shadcn Form Input & Field Controls
// Bordered, Flat, Underline, and Faded input variants with interactive validation, password eye reveal, and multi-step stepper
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';
import { copyToClipboard } from '../clipboard.js';

export const meta = {
  id: 'form-input-styler',
  name: 'Input & Form Controls'
};

let config = {
  variant: 'bordered', // bordered, flat, underlined, faded
  preset: 'catalog',   // catalog, validation, password, stepper, search
  radius: 8,
  hasError: false,
  currentStep: 1
};

const VARIANTS = [
  { id: 'bordered',   name: 'Bordered',   desc: 'Clean 1px outline with focus ring' },
  { id: 'flat',       name: 'Flat',       desc: 'Subtle filled background' },
  { id: 'underlined', name: 'Underlined', desc: 'Minimal bottom border line' },
  { id: 'faded',      name: 'Faded',      desc: 'Light border + muted background' }
];

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    id: 'form-input-preview-stage',
    style: {
      width: '100%',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '30px 20px 60px',
      gap: '24px'
    }
  });

  const formBox = el('div', {
    id: 'input-interactive-box',
    style: {
      width: '100%',
      maxWidth: config.preset === 'stepper' ? '480px' : '420px',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: `${config.radius + 6}px`,
      padding: '28px',
      boxShadow: 'var(--shadow-md)',
      transition: 'all 0.22s ease'
    }
  });

  centerStage.appendChild(formBox);

  const interactiveHint = el('div', {
    style: {
      fontSize: '0.75rem',
      color: 'var(--text-dim)',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    innerHTML: `<span>Type, toggle, and interact with the input fields above</span>`
  });
  centerStage.appendChild(interactiveHint);
  previewStage.appendChild(centerStage);

  renderControls();
  renderForm();

  function renderControls() {
    controlsStage.innerHTML = '';

    const section = el('div', { className: 'control-section' }, [
      el('div', { className: 'control-section-header' }, [
        el('h4', { className: 'control-section-title', textContent: 'HeroUI Input Variants' })
      ]),
      el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '18px' } },
        VARIANTS.map(v => el('button', {
          className: `btn btn-outline ${config.variant === v.id ? 'active' : ''}`,
          style: { fontSize: '0.75rem', padding: '8px 10px', textAlign: 'left' },
          innerHTML: `<div style="font-weight:600;">${v.name}</div><div style="font-size:0.65rem; color:var(--text-dim); margin-top:2px;">${v.desc}</div>`,
          onclick: () => {
            config.variant = v.id;
            renderControls();
            renderForm();
          }
        }))
      ),

      el('div', { className: 'control-section-header' }, [
        el('h4', { className: 'control-section-title', textContent: 'Form Presets' })
      ]),
      el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', marginBottom: '16px' } }, [
        createPresetBtn('Field Gallery', 'catalog'),
        createPresetBtn('Error Validation', 'validation'),
        createPresetBtn('Password Reveal', 'password'),
        createPresetBtn('Step Wizard', 'stepper'),
        createPresetBtn('Search Pill', 'search')
      ]),

      el('div', { className: 'control-section-header' }, [
        el('h4', { className: 'control-section-title', textContent: 'Dimensions & Radius' })
      ]),
      createSlider('Corner Radius', 0, 24, 2, config.radius, 'px', (v) => {
        config.radius = v;
        formBox.style.borderRadius = `${config.radius + 6}px`;
        renderForm();
      })
    ]);

    controlsStage.appendChild(section);
  }

  function createPresetBtn(label, pKey) {
    return el('button', {
      className: `btn btn-outline ${config.preset === pKey ? 'active' : ''}`,
      style: { fontSize: '0.75rem', padding: '6px 8px' },
      textContent: label,
      onclick: () => {
        config.preset = pKey;
        renderControls();
        renderForm();
      }
    });
  }

  function getInputVariantStyles() {
    const r = `${config.radius}px`;
    if (config.variant === 'flat') {
      return `background: var(--bg-input); border: 1px solid transparent; border-radius: ${r}; padding: 10px 12px;`;
    }
    if (config.variant === 'underlined') {
      return `background: transparent; border: none; border-bottom: 2px solid var(--border); border-radius: 0; padding: 8px 2px;`;
    }
    if (config.variant === 'faded') {
      return `background: var(--bg-input); border: 1px solid var(--border); border-radius: ${r}; padding: 10px 12px;`;
    }
    // Default: bordered
    return `background: var(--bg-card); border: 1px solid var(--border-strong); border-radius: ${r}; padding: 10px 12px;`;
  }

  function renderForm() {
    formBox.innerHTML = '';
    formBox.style.maxWidth = config.preset === 'stepper' ? '480px' : '420px';

    if (config.preset === 'catalog') {
      renderCatalog(formBox);
    } else if (config.preset === 'validation') {
      renderValidation(formBox);
    } else if (config.preset === 'password') {
      renderPassword(formBox);
    } else if (config.preset === 'stepper') {
      renderStepper(formBox);
    } else if (config.preset === 'search') {
      renderSearch(formBox);
    }

    generateCode();
  }

  // 1. INPUT FIELD GALLERY
  function renderCatalog(target) {
    const inputStyle = getInputVariantStyles();

    target.innerHTML = `
      <div style="margin-bottom:18px;">
        <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-main); margin:0 0 4px; letter-spacing:-0.02em;">HeroUI Input Components</h3>
        <p style="font-size:0.75rem; color:var(--text-muted); margin:0;">Active variant: <strong style="color:var(--text-main); text-transform:capitalize;">${config.variant}</strong></p>
      </div>

      <div style="display:flex; flex-direction:column; gap:16px;">
        <!-- Email with Clear Button -->
        <div style="display:flex; flex-direction:column; gap:6px;">
          <label style="font-size:0.75rem; font-weight:600; color:var(--text-main);">Email Address</label>
          <div style="position:relative; display:flex; align-items:center;">
            <input type="email" id="catalog-email" value="alex.rivera@acme.dev" placeholder="Enter your email" style="width:100%; ${inputStyle} color:var(--text-main); font-size:0.85rem; outline:none; transition:border-color 0.15s ease;" />
            <button id="email-clear-btn" style="position:absolute; right:10px; background:none; border:none; color:var(--text-dim); cursor:pointer; padding:4px; display:flex; align-items:center; justify-content:center; border-radius:50%;" title="Clear input">
              ${ICONS.close || '×'}
            </button>
          </div>
          <span style="font-size:0.7rem; color:var(--text-dim);">We will never share your personal information.</span>
        </div>

        <!-- Currency Input with Prefix & Suffix -->
        <div style="display:flex; flex-direction:column; gap:6px;">
          <label style="font-size:0.75rem; font-weight:600; color:var(--text-main);">Project Budget ($ USD)</label>
          <div style="position:relative; display:flex; align-items:center;">
            <span style="position:absolute; left:12px; font-size:0.85rem; font-weight:600; color:var(--text-dim); pointer-events:none;">$</span>
            <input type="text" value="2,450.00" style="width:100%; ${inputStyle} padding-left:26px; padding-right:54px; color:var(--text-main); font-size:0.85rem; outline:none; font-family:var(--font-mono);" />
            <span style="position:absolute; right:12px; font-size:0.7rem; font-weight:600; color:var(--text-dim); background:var(--bg-input); padding:2px 6px; border-radius:4px; border:1px solid var(--border);">USD</span>
          </div>
        </div>

        <!-- Subdomain with URL Prefix -->
        <div style="display:flex; flex-direction:column; gap:6px;">
          <label style="font-size:0.75rem; font-weight:600; color:var(--text-main);">Custom Subdomain</label>
          <div style="display:flex; align-items:center;">
            <span style="padding:10px 12px; background:var(--bg-input); border:1px solid var(--border); border-right:none; border-radius:${config.radius}px 0 0 ${config.radius}px; font-size:0.75rem; color:var(--text-dim); font-family:var(--font-mono);">https://</span>
            <input type="text" value="acme-production" style="flex:1; ${inputStyle} border-radius:0 ${config.radius}px ${config.radius}px 0; color:var(--text-main); font-size:0.85rem; outline:none;" />
          </div>
        </div>

        <button class="btn btn-primary" style="margin-top:6px; padding:9px 16px; border-radius:${config.radius}px; font-weight:600; justify-content:center;">
          <span>Save Changes</span>
        </button>
      </div>
    `;

    const clearBtn = target.querySelector('#email-clear-btn');
    const emailInput = target.querySelector('#catalog-email');
    if (clearBtn && emailInput) {
      clearBtn.onclick = () => {
        emailInput.value = '';
        emailInput.focus();
      };
    }
  }

  // 2. ERROR & VALIDATION STATE
  function renderValidation(target) {
    const inputStyle = getInputVariantStyles();

    target.innerHTML = `
      <div style="margin-bottom:18px;">
        <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-main); margin:0 0 4px; letter-spacing:-0.02em;">Validation & Error States</h3>
        <p style="font-size:0.75rem; color:var(--text-muted); margin:0;">Real-time interactive input constraint validation</p>
      </div>

      <div style="display:flex; flex-direction:column; gap:16px;">
        <!-- Error State Input -->
        <div style="display:flex; flex-direction:column; gap:6px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <label style="font-size:0.75rem; font-weight:600; color:var(--error);">Company Work Email</label>
            <span style="font-size:0.7rem; color:var(--error); font-weight:500;">Invalid Format</span>
          </div>
          <div style="position:relative; display:flex; align-items:center;">
            <input type="email" id="invalid-email-input" value="alex.rivera@invalid" style="width:100%; ${inputStyle} border-color:var(--error) !important; color:var(--text-main); font-size:0.85rem; outline:none;" />
            <span style="position:absolute; right:10px; color:var(--error); display:flex; align-items:center;">
              ${ICONS.alertCircle}
            </span>
          </div>
          <span style="font-size:0.72rem; color:var(--error); display:flex; align-items:center; gap:4px;">
            Please enter a valid company work email address ending with .com or .org.
          </span>
        </div>

        <!-- Valid State Input -->
        <div style="display:flex; flex-direction:column; gap:6px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <label style="font-size:0.75rem; font-weight:600; color:var(--text-main);">Workspace Subdomain</label>
            <span style="font-size:0.7rem; color:var(--success); font-weight:600;">Available</span>
          </div>
          <div style="position:relative; display:flex; align-items:center;">
            <input type="text" value="huragon-cloud" style="width:100%; ${inputStyle} border-color:var(--success) !important; color:var(--text-main); font-size:0.85rem; outline:none;" />
            <span style="position:absolute; right:10px; color:var(--success); display:flex; align-items:center;">
              ${ICONS.check}
            </span>
          </div>
          <span style="font-size:0.72rem; color:var(--text-dim);">
            Domain is claimed and ready for instant deployment.
          </span>
        </div>

        <button class="btn btn-primary" style="margin-top:6px; padding:9px 16px; border-radius:${config.radius}px; font-weight:600; justify-content:center;">
          <span>Submit Verification</span>
        </button>
      </div>
    `;
  }

  // 3. PASSWORD EYE REVEAL
  function renderPassword(target) {
    const inputStyle = getInputVariantStyles();

    target.innerHTML = `
      <div style="margin-bottom:18px;">
        <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-main); margin:0 0 4px; letter-spacing:-0.02em;">Password & Secret Token</h3>
        <p style="font-size:0.75rem; color:var(--text-muted); margin:0;">Toggle visibility & live entropy strength analyzer</p>
      </div>

      <div style="display:flex; flex-direction:column; gap:16px;">
        <div style="display:flex; flex-direction:column; gap:6px;">
          <label style="font-size:0.75rem; font-weight:600; color:var(--text-main);">Master Password</label>
          <div style="position:relative; display:flex; align-items:center;">
            <input type="password" id="pw-field" value="huragonSuperSecret#2026" style="width:100%; ${inputStyle} padding-right:38px; color:var(--text-main); font-size:0.85rem; outline:none;" />
            <button id="pw-toggle-btn" class="btn-ghost" style="position:absolute; right:8px; display:flex; align-items:center; justify-content:center; padding:4px; border:none; background:none; color:var(--text-muted); cursor:pointer;" title="Toggle password visibility">
              ${ICONS.eye}
            </button>
          </div>
        </div>

        <!-- Password Strength Meter -->
        <div>
          <div style="display:flex; justify-content:space-between; font-size:0.7rem; color:var(--text-dim); margin-bottom:4px;">
            <span>Password Complexity</span>
            <span id="pw-strength-label" style="color:var(--success); font-weight:600;">Strong (85/100)</span>
          </div>
          <div style="height:5px; width:100%; background:var(--bg-input); border-radius:999px; overflow:hidden;">
            <div id="pw-meter-bar" style="width:85%; height:100%; background:var(--success); transition:all 0.2s ease;"></div>
          </div>
        </div>

        <button class="btn btn-primary" style="margin-top:6px; padding:9px 16px; border-radius:${config.radius}px; font-weight:600; justify-content:center;">
          <span>Update Password</span>
        </button>
      </div>
    `;

    const pwField = target.querySelector('#pw-field');
    const toggleBtn = target.querySelector('#pw-toggle-btn');
    const meterBar = target.querySelector('#pw-meter-bar');
    const strengthLabel = target.querySelector('#pw-strength-label');

    if (toggleBtn && pwField) {
      let isVisible = false;
      toggleBtn.onclick = () => {
        isVisible = !isVisible;
        pwField.type = isVisible ? 'text' : 'password';
        toggleBtn.innerHTML = isVisible ? ICONS.eyeOff : ICONS.eye;
      };
    }

    if (pwField && meterBar && strengthLabel) {
      pwField.oninput = (e) => {
        const len = e.target.value.length;
        if (len === 0) {
          meterBar.style.width = '0%';
          strengthLabel.textContent = 'Empty';
          strengthLabel.style.color = 'var(--text-dim)';
        } else if (len < 6) {
          meterBar.style.width = '25%';
          meterBar.style.background = 'var(--error)';
          strengthLabel.textContent = 'Weak';
          strengthLabel.style.color = 'var(--error)';
        } else if (len < 10) {
          meterBar.style.width = '60%';
          meterBar.style.background = 'var(--warning)';
          strengthLabel.textContent = 'Moderate';
          strengthLabel.style.color = 'var(--warning)';
        } else {
          meterBar.style.width = '100%';
          meterBar.style.background = 'var(--success)';
          strengthLabel.textContent = 'Strong (85/100)';
          strengthLabel.style.color = 'var(--success)';
        }
      };
    }
  }

  // 4. STEPPER WIZARD
  function renderStepper(target) {
    const step = config.currentStep;
    const inputStyle = getInputVariantStyles();

    target.innerHTML = `
      <!-- Stepper Header -->
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; position:relative;">
        <div style="display:flex; flex-direction:column; align-items:center; gap:4px; z-index:2;">
          <div style="width:28px; height:28px; border-radius:50%; background:${step >= 1 ? 'var(--text-main)' : 'var(--bg-input)'}; color:${step >= 1 ? 'var(--bg-app)' : 'var(--text-dim)'}; border:1px solid ${step >= 1 ? 'var(--text-main)' : 'var(--border)'}; font-size:0.75rem; font-weight:700; display:flex; align-items:center; justify-content:center;">
            ${step > 1 ? ICONS.check : '1'}
          </div>
          <span style="font-size:0.7rem; color:${step === 1 ? 'var(--text-main)' : 'var(--text-dim)'}; font-weight:600;">Workspace</span>
        </div>

        <div style="flex:1; height:2px; background:${step >= 2 ? 'var(--text-main)' : 'var(--border)'}; margin:0 8px; margin-bottom:14px; transition:background 0.2s ease;"></div>

        <div style="display:flex; flex-direction:column; align-items:center; gap:4px; z-index:2;">
          <div style="width:28px; height:28px; border-radius:50%; background:${step >= 2 ? 'var(--text-main)' : 'var(--bg-input)'}; color:${step >= 2 ? 'var(--bg-app)' : 'var(--text-dim)'}; border:1px solid ${step >= 2 ? 'var(--text-main)' : 'var(--border)'}; font-size:0.75rem; font-weight:700; display:flex; align-items:center; justify-content:center;">
            ${step > 2 ? ICONS.check : '2'}
          </div>
          <span style="font-size:0.7rem; color:${step === 2 ? 'var(--text-main)' : 'var(--text-dim)'}; font-weight:600;">Security</span>
        </div>

        <div style="flex:1; height:2px; background:${step >= 3 ? 'var(--text-main)' : 'var(--border)'}; margin:0 8px; margin-bottom:14px; transition:background 0.2s ease;"></div>

        <div style="display:flex; flex-direction:column; align-items:center; gap:4px; z-index:2;">
          <div style="width:28px; height:28px; border-radius:50%; background:${step >= 3 ? 'var(--text-main)' : 'var(--bg-input)'}; color:${step >= 3 ? 'var(--bg-app)' : 'var(--text-dim)'}; border:1px solid ${step >= 3 ? 'var(--text-main)' : 'var(--border)'}; font-size:0.75rem; font-weight:700; display:flex; align-items:center; justify-content:center;">
            3
          </div>
          <span style="font-size:0.7rem; color:${step === 3 ? 'var(--text-main)' : 'var(--text-dim)'}; font-weight:600;">Review</span>
        </div>
      </div>

      <!-- Step Body -->
      <div style="min-height:140px; margin-bottom:20px;">
        ${step === 1 ? `
          <div style="display:flex; flex-direction:column; gap:12px;">
            <label style="font-size:0.75rem; color:var(--text-main); font-weight:600;">Organization Workspace Name</label>
            <input type="text" value="Acme Design Labs" style="width:100%; ${inputStyle} color:var(--text-main); font-size:0.85rem; outline:none;" />
            <span style="font-size:0.7rem; color:var(--text-dim);">Your custom subdomain: acme-design.huragon.app</span>
          </div>
        ` : step === 2 ? `
          <div style="display:flex; flex-direction:column; gap:12px;">
            <label style="font-size:0.75rem; color:var(--text-main); font-weight:600;">Two-Factor Authentication Setup</label>
            <div style="padding:12px; background:var(--bg-input); border:1px solid var(--border); border-radius:${config.radius}px; font-size:0.8rem; color:var(--text-muted); line-height:1.4;">
              Authenticator app is configured for this domain. Hardware security keys (WebAuthn/FIDO2) are supported.
            </div>
          </div>
        ` : `
          <div style="text-align:center; padding:12px 0;">
            <div style="width:40px; height:40px; border-radius:50%; background:var(--success-muted); color:var(--success); border:1px solid var(--success-border); display:flex; align-items:center; justify-content:center; margin:0 auto 10px;">
              ${ICONS.checkCircle}
            </div>
            <h4 style="font-size:1rem; font-weight:700; color:var(--text-main); margin:0 0 4px;">Ready to Provision</h4>
            <p style="font-size:0.75rem; color:var(--text-dim); margin:0;">All workspace configurations and domain DNS validated.</p>
          </div>
        `}
      </div>

      <!-- Action Buttons -->
      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border); padding-top:16px;">
        <button class="btn btn-outline" id="stepper-back-btn" ${step === 1 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}>
          ${ICONS.chevronLeft} <span>Back</span>
        </button>
        <button class="btn btn-primary" id="stepper-next-btn">
          <span>${step === 3 ? 'Launch Workspace' : 'Continue'}</span> ${step < 3 ? ICONS.chevronRight : ''}
        </button>
      </div>
    `;

    const backBtn = target.querySelector('#stepper-back-btn');
    const nextBtn = target.querySelector('#stepper-next-btn');

    if (backBtn && step > 1) {
      backBtn.onclick = () => {
        config.currentStep--;
        renderStepper(target);
      };
    }
    if (nextBtn) {
      nextBtn.onclick = () => {
        if (config.currentStep < 3) {
          config.currentStep++;
          renderStepper(target);
        } else {
          config.currentStep = 1;
          renderStepper(target);
        }
      };
    }
  }

  // 5. SEARCH PILL WITH ⌘K
  function renderSearch(target) {
    target.innerHTML = `
      <div style="margin-bottom:18px;">
        <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-main); margin:0 0 4px; letter-spacing:-0.02em;">Search Bar & Command Pill</h3>
        <p style="font-size:0.75rem; color:var(--text-muted); margin:0;">Global search trigger with keyboard shortcut indicator</p>
      </div>

      <div style="display:flex; flex-direction:column; gap:16px;">
        <div style="position:relative; display:flex; align-items:center;">
          <span style="position:absolute; left:12px; color:var(--text-dim); display:flex; align-items:center; pointer-events:none;">
            ${ICONS.search}
          </span>
          <input type="text" placeholder="Search documentation, components, or files..." style="width:100%; padding:10px 48px 10px 38px; background:var(--bg-input); border:1px solid var(--border-strong); border-radius:999px; color:var(--text-main); font-size:0.85rem; outline:none;" />
          <kbd style="position:absolute; right:12px; font-size:0.7rem; font-family:var(--font-mono); color:var(--text-dim); background:var(--bg-card); border:1px solid var(--border); padding:2px 6px; border-radius:4px; pointer-events:none;">⌘K</kbd>
        </div>

        <div style="background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-md); padding:12px;">
          <div style="font-size:0.7rem; font-weight:600; text-transform:uppercase; letter-spacing:0.04em; color:var(--text-dim); margin-bottom:8px;">Recent Searches</div>
          <div style="display:flex; flex-direction:column; gap:6px;">
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.78rem; color:var(--text-main); padding:4px 6px; border-radius:4px; cursor:pointer;">
              <span>Navbar Builder</span>
              <span style="font-size:0.7rem; color:var(--text-dim);">Jump to tool</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.78rem; color:var(--text-main); padding:4px 6px; border-radius:4px; cursor:pointer;">
              <span>Data Table Studio</span>
              <span style="font-size:0.7rem; color:var(--text-dim);">Jump to tool</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function generateCode() {
    const css = `/* HeroUI ${config.variant.toUpperCase()} Input */
.ui-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.ui-input {
  width: 100%;
  padding: 10px 12px;
  background: var(--bg-${config.variant === 'bordered' ? 'card' : 'input'});
  border: ${config.variant === 'underlined' ? 'none' : '1px solid var(--border)'};
  ${config.variant === 'underlined' ? 'border-bottom: 2px solid var(--border);' : ''}
  border-radius: ${config.variant === 'underlined' ? '0' : `${config.radius}px`};
  color: var(--text-main);
  font-size: 0.875rem;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.ui-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.08);
}`;

    const tailwind = `<!-- HeroUI ${config.variant} Input -->
<div class="relative flex w-full flex-col gap-1.5">
  <label class="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Work Email</label>
  <div class="relative flex items-center">
    <input
      type="email"
      placeholder="name@company.com"
      class="w-full rounded-${config.radius >= 12 ? 'xl' : 'lg'} border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-100"
    />
  </div>
  <p class="text-xs text-zinc-500">We'll never share your email with anyone else.</p>
</div>`;

    const react = `// React / HeroUI Input Component
import React, { useState } from 'react';

export function ModernInput({ label, helperText, placeholder = 'Enter value...' }) {
  const [value, setValue] = useState('');

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{label}</label>}
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2.5 text-sm outline-none transition focus:border-zinc-900 dark:focus:border-zinc-100"
      />
      {helperText && <p className="text-xs text-zinc-500">{helperText}</p>}
    </div>
  );
}`;

    onCodeChange({ css, tailwind, react });
  }

  function createSlider(label, min, max, step, initial, unit, onChange) {
    const wrapper = el('div', { className: 'control-item' });
    const row = el('div', { className: 'control-label-row' }, [
      el('label', { className: 'control-label', textContent: label }),
      el('span', { className: 'control-value', textContent: `${initial}${unit}` })
    ]);
    const valSpan = row.querySelector('.control-value');
    const slider = el('input', {
      type: 'range',
      min,
      max,
      step,
      value: initial,
      oninput: (e) => {
        const v = parseFloat(e.target.value);
        valSpan.textContent = `${v}${unit}`;
        onChange(v);
      }
    });

    wrapper.appendChild(row);
    wrapper.appendChild(slider);
    return wrapper;
  }
}
