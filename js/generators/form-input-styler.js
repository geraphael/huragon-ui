// Tool 25: Form Input & Field Styler (Interactive Notched Labels, Password Eye Reveal & Multi-Step Wizard)
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';

export const meta = {
  id: 'form-input-styler',
  name: 'Input & Form Controls'
};

let config = {
  preset: 'notched', // notched, password, stepper, search
  radius: 8,
  focusRing: true,
  currentStep: 1
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
      padding: '40px',
      gap: '20px'
    }
  });

  const formBox = el('div', {
    id: 'input-interactive-box',
    style: {
      width: '100%',
      maxWidth: config.preset === 'stepper' ? '460px' : '360px',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: `${config.radius + 4}px`,
      padding: '24px',
      transition: 'all 0.2s ease'
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
    innerHTML: `${ICONS.sparkles} <span>Type, focus, and interact directly with form elements above</span>`
  });
  centerStage.appendChild(interactiveHint);

  previewStage.appendChild(centerStage);

  renderFormPreset();

  function renderFormPreset() {
    formBox.innerHTML = '';
    formBox.style.maxWidth = config.preset === 'stepper' ? '460px' : '360px';

    if (config.preset === 'notched') {
      renderNotchedLabel(formBox);
    } else if (config.preset === 'password') {
      renderPasswordReveal(formBox);
    } else if (config.preset === 'stepper') {
      renderStepperWizard(formBox);
    } else if (config.preset === 'search') {
      renderSearchPill(formBox);
    }

    updateCode();
  }

  // 1. Notched Floating Label (from Screenshot_20261024-192535.jpg)
  function renderNotchedLabel(target) {
    target.innerHTML = `
      <div style="margin-bottom:16px;">
        <h3 style="font-size:1rem; font-weight:600; color:var(--text-main); margin:0 0 4px;">Account Registration</h3>
        <p style="font-size:0.75rem; color:var(--text-muted); margin:0;">Floating label animates into the top border notch</p>
      </div>

      <div style="display:flex; flex-direction:column; gap:16px;">
        <div class="notched-input-box">
          <input type="text" class="notched-input-field" id="name-input" placeholder=" " style="border-radius:${config.radius}px;" value="Sarah Connor" />
          <label class="notched-input-label" for="name-input">Full Name</label>
        </div>

        <div class="notched-input-box">
          <input type="email" class="notched-input-field" id="email-input" placeholder=" " style="border-radius:${config.radius}px;" />
          <label class="notched-input-label" for="email-input">Work Email Address</label>
        </div>

        <button class="btn btn-primary" style="margin-top:6px; padding:8px 14px; border-radius:${config.radius}px;">
          <span>Continue</span>
        </button>
      </div>
    `;
  }

  // 2. Password with interactive Eye reveal toggle
  function renderPasswordReveal(target) {
    target.innerHTML = `
      <div style="margin-bottom:16px;">
        <h3 style="font-size:1rem; font-weight:600; color:var(--text-main); margin:0 0 4px;">Security Authentication</h3>
        <p style="font-size:0.75rem; color:var(--text-muted); margin:0;">Click the eye icon to toggle visibility & check strength</p>
      </div>

      <div style="display:flex; flex-direction:column; gap:14px;">
        <div style="display:flex; flex-direction:column; gap:6px;">
          <label style="font-size:0.75rem; font-weight:500; color:var(--text-muted);">Password</label>
          <div style="position:relative; display:flex; align-items:center;">
            <input type="password" id="pw-field" value="huragonSuperSecret#2026" style="width:100%; padding:9px 36px 9px 12px; background:var(--bg-input); border:1px solid var(--border); border-radius:${config.radius}px; color:var(--text-main); font-size:0.85rem; outline:none;" />
            <button id="pw-toggle-btn" class="btn-ghost" style="position:absolute; right:8px; display:flex; align-items:center; justify-content:center; padding:4px; border:none; background:none; color:var(--text-muted); cursor:pointer;" title="Toggle password visibility">
              ${ICONS.eye}
            </button>
          </div>
        </div>

        <!-- Live Password Strength Meter -->
        <div>
          <div style="display:flex; justify-content:space-between; font-size:0.7rem; color:var(--text-dim); margin-bottom:4px;">
            <span>Password Strength</span>
            <span id="pw-strength-label" style="color:#10b981; font-weight:600;">Strong</span>
          </div>
          <div style="height:4px; width:100%; background:var(--bg-input); border-radius:999px; overflow:hidden;">
            <div id="pw-meter-bar" style="width:85%; height:100%; background:#10b981; transition:all 0.2s ease;"></div>
          </div>
        </div>

        <button class="btn btn-primary" style="margin-top:4px; padding:8px 14px; border-radius:${config.radius}px;">
          <span>Update Credentials</span>
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
          meterBar.style.background = '#ef4444';
          strengthLabel.textContent = 'Weak';
          strengthLabel.style.color = '#ef4444';
        } else if (len < 10) {
          meterBar.style.width = '60%';
          meterBar.style.background = '#eab308';
          strengthLabel.textContent = 'Moderate';
          strengthLabel.style.color = '#eab308';
        } else {
          meterBar.style.width = '100%';
          meterBar.style.background = '#10b981';
          strengthLabel.textContent = 'Strong';
          strengthLabel.style.color = '#10b981';
        }
      };
    }
  }

  // 3. Multi-Step Form Stepper (from Screenshot_20261024-192535.jpg)
  function renderStepperWizard(target) {
    const step = config.currentStep;

    target.innerHTML = `
      <!-- Stepper Header -->
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; position:relative;">
        <div style="display:flex; flex-direction:column; align-items:center; gap:4px; z-index:2;">
          <div style="width:26px; height:26px; border-radius:50%; background:${step >= 1 ? 'var(--text-main)' : 'var(--bg-input)'}; color:${step >= 1 ? 'var(--bg-app)' : 'var(--text-dim)'}; border:1px solid ${step >= 1 ? 'var(--text-main)' : 'var(--border)'}; font-size:0.75rem; font-weight:700; display:flex; align-items:center; justify-content:center;">
            ${step > 1 ? ICONS.check : '1'}
          </div>
          <span style="font-size:0.68rem; color:${step === 1 ? 'var(--text-main)' : 'var(--text-dim)'}; font-weight:500;">Account</span>
        </div>

        <div style="flex:1; height:2px; background:${step >= 2 ? 'var(--text-main)' : 'var(--border)'}; margin:0 8px; margin-bottom:14px; transition:background 0.2s ease;"></div>

        <div style="display:flex; flex-direction:column; align-items:center; gap:4px; z-index:2;">
          <div style="width:26px; height:26px; border-radius:50%; background:${step >= 2 ? 'var(--text-main)' : 'var(--bg-input)'}; color:${step >= 2 ? 'var(--bg-app)' : 'var(--text-dim)'}; border:1px solid ${step >= 2 ? 'var(--text-main)' : 'var(--border)'}; font-size:0.75rem; font-weight:700; display:flex; align-items:center; justify-content:center;">
            ${step > 2 ? ICONS.check : '2'}
          </div>
          <span style="font-size:0.68rem; color:${step === 2 ? 'var(--text-main)' : 'var(--text-dim)'}; font-weight:500;">Security</span>
        </div>

        <div style="flex:1; height:2px; background:${step >= 3 ? 'var(--text-main)' : 'var(--border)'}; margin:0 8px; margin-bottom:14px; transition:background 0.2s ease;"></div>

        <div style="display:flex; flex-direction:column; align-items:center; gap:4px; z-index:2;">
          <div style="width:26px; height:26px; border-radius:50%; background:${step >= 3 ? 'var(--text-main)' : 'var(--bg-input)'}; color:${step >= 3 ? 'var(--bg-app)' : 'var(--text-dim)'}; border:1px solid ${step >= 3 ? 'var(--text-main)' : 'var(--border)'}; font-size:0.75rem; font-weight:700; display:flex; align-items:center; justify-content:center;">
            3
          </div>
          <span style="font-size:0.68rem; color:${step === 3 ? 'var(--text-main)' : 'var(--text-dim)'}; font-weight:500;">Review</span>
        </div>
      </div>

      <!-- Step Content -->
      <div style="min-height:130px; margin-bottom:20px;">
        ${step === 1 ? `
          <div style="display:flex; flex-direction:column; gap:10px;">
            <label style="font-size:0.75rem; color:var(--text-muted); font-weight:500;">Organization Workspace Name</label>
            <input type="text" value="Acme Studio Labs" style="width:100%; padding:8px 12px; background:var(--bg-input); border:1px solid var(--border); border-radius:${config.radius}px; color:var(--text-main); font-size:0.85rem;" />
            <span style="font-size:0.7rem; color:var(--text-dim);">Your custom subdomain: acme-studio.huragon.app</span>
          </div>
        ` : step === 2 ? `
          <div style="display:flex; flex-direction:column; gap:10px;">
            <label style="font-size:0.75rem; color:var(--text-muted); font-weight:500;">Two-Factor Authentication Setup</label>
            <div style="padding:10px; background:var(--bg-input); border:1px solid var(--border); border-radius:${config.radius}px; font-size:0.78rem; color:var(--text-muted);">
              Authenticator app is configured for this workspace domain.
            </div>
          </div>
        ` : `
          <div style="text-align:center; padding:10px 0;">
            <div style="width:36px; height:36px; border-radius:50%; background:rgba(16, 185, 129, 0.12); color:#10b981; display:flex; align-items:center; justify-content:center; margin:0 auto 10px;">
              ${ICONS.checkCircle}
            </div>
            <h4 style="font-size:0.95rem; font-weight:600; color:var(--text-main); margin:0 0 4px;">Ready to Provision</h4>
            <p style="font-size:0.75rem; color:var(--text-dim); margin:0;">All requirements validated successfully.</p>
          </div>
        `}
      </div>

      <!-- Stepper Action Buttons -->
      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border); padding-top:14px;">
        <button class="btn btn-outline" id="stepper-back-btn" ${step === 1 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}>
          ${ICONS.chevronLeft} <span>Back</span>
        </button>
        <button class="btn btn-primary" id="stepper-next-btn">
          <span>${step === 3 ? 'Deploy Now' : 'Next Step'}</span> ${ICONS.chevronRight}
        </button>
      </div>
    `;

    const backBtn = target.querySelector('#stepper-back-btn');
    const nextBtn = target.querySelector('#stepper-next-btn');

    if (backBtn && step > 1) {
      backBtn.onclick = () => {
        config.currentStep--;
        renderStepperWizard(target);
        updateCode();
      };
    }

    if (nextBtn) {
      nextBtn.onclick = () => {
        if (config.currentStep < 3) {
          config.currentStep++;
        } else {
          config.currentStep = 1;
        }
        renderStepperWizard(target);
        updateCode();
      };
    }
  }

  // 4. Search input pill with shortcut
  function renderSearchPill(target) {
    target.innerHTML = `
      <div style="margin-bottom:14px;">
        <h3 style="font-size:1rem; font-weight:600; color:var(--text-main); margin:0 0 4px;">Global Command Search</h3>
        <p style="font-size:0.75rem; color:var(--text-muted); margin:0;">Compact pill with keyboard trigger badge</p>
      </div>

      <div style="position:relative; display:flex; align-items:center;">
        <span style="position:absolute; left:10px; color:var(--text-dim); display:flex; align-items:center;">${ICONS.search}</span>
        <input type="text" id="pill-search-input" placeholder="Search resources, tokens, tools..." style="width:100%; padding:8px 60px 8px 32px; background:var(--bg-input); border:1px solid var(--border); border-radius:999px; color:var(--text-main); font-size:0.8rem; outline:none;" />
        <span style="position:absolute; right:8px; font-size:0.65rem; background:var(--bg-card); padding:1px 6px; border-radius:4px; border:1px solid var(--border); color:var(--text-dim); font-family:var(--font-mono);">Ctrl+K</span>
      </div>
    `;
  }

  function updateCode() {
    let css = '';
    let tailwind = '';

    if (config.preset === 'notched') {
      css = `/* Huragon/ui — Notched Floating Label Input */
.notched-input-box {
  position: relative;
  width: 100%;
}

.notched-input-field {
  width: 100%;
  padding: 12px 14px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: ${config.radius}px;
  color: var(--text-main);
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.notched-input-field:focus {
  border-color: var(--text-main);
  box-shadow: 0 0 0 2px var(--accent-subtle);
}

.notched-input-label {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  color: var(--text-dim);
  font-size: 0.85rem;
  pointer-events: none;
  transition: all 0.16s cubic-bezier(0.16, 1, 0.3, 1);
  padding: 0 4px;
}

.notched-input-field:focus ~ .notched-input-label,
.notched-input-field:not(:placeholder-shown) ~ .notched-input-label {
  top: 0;
  font-size: 0.7rem;
  color: var(--text-main);
  background: var(--bg-card);
  font-weight: 500;
}`;
      tailwind = `<div class="relative w-full">
  <input type="text" placeholder=" " class="peer w-full px-3.5 py-3 bg-zinc-900 border border-zinc-800 rounded-[${config.radius}px] text-zinc-100 text-sm focus:border-zinc-100 focus:outline-none" />
  <label class="absolute left-3 top-1/2 -translate-y-1/2 px-1 text-zinc-500 text-sm transition-all peer-focus:top-0 peer-focus:text-xs peer-focus:text-zinc-100 peer-focus:bg-zinc-900 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs">
    Full Name
  </label>
</div>`;
    } else if (config.preset === 'password') {
      css = `/* Huragon/ui — Password with Visibility Toggle */
.password-box {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input {
  width: 100%;
  padding: 9px 36px 9px 12px;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: ${config.radius}px;
  color: var(--text-main);
}

.password-toggle-btn {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
}`;
      tailwind = `<div class="relative flex items-center">
  <input type="password" class="w-full pl-3 pr-10 py-2 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-100" />
  <button class="absolute right-2 text-zinc-400 hover:text-zinc-100"></button>
</div>`;
    } else {
      css = `/* Huragon/ui — Form Control Preset (${config.preset}) */
.ui-form-wizard {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: ${config.radius}px;
  padding: 24px;
}`;
      tailwind = `<div class="bg-zinc-900 border border-zinc-800 rounded-[${config.radius}px] p-6 text-zinc-100">
  <!-- Stepper Form -->
</div>`;
    }

    onCodeChange({ css, tailwind });
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const sec = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', textContent: 'Form Control Preset' }),

      el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', marginBottom: '16px' } }, [
        { id: 'notched', name: 'Notched Label' },
        { id: 'password', name: 'Password Eye' },
        { id: 'stepper', name: 'Multi-Step Wizard' },
        { id: 'search', name: 'Command Search' }
      ].map(p => el('button', {
        className: `btn ${config.preset === p.id ? 'btn-primary' : 'btn-outline'}`,
        style: { padding: '6px 8px', fontSize: '0.72rem' },
        textContent: p.name,
        onclick: () => {
          config.preset = p.id;
          renderControls();
          renderFormPreset();
        }
      }))),

      el('div', { className: 'section-title', textContent: 'Dimensions' }),
      createSlider('Border Radius', config.radius, 0, 20, (v) => { config.radius = v; renderFormPreset(); }, 'px')
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
