// Tool: HeroUI & shadcn/ui Interactive Modal & Dialog Studio
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';

export const meta = {
  id: 'modal-dialog',
  name: 'Modal & Dialog Studio'
};

let config = {
  preset: 'checkout', // 'checkout', 'settings', 'alert', 'sheet'
  blur: 8,
  radius: 12,
  size: 'md', // 'sm' (400px), 'md' (520px), 'lg' (640px)
  isOpen: true // default preview open so user can inspect directly
};

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    id: 'modal-stage-wrapper',
    style: {
      width: '100%',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      padding: '24px'
    }
  });

  previewStage.appendChild(centerStage);

  renderModalStage();

  function renderModalStage() {
    centerStage.innerHTML = '';

    // Stage Background Mockup (shows simulated background page that gets blurred)
    const backgroundMock = el('div', {
      style: {
        width: '100%',
        maxWidth: '680px',
        padding: '28px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        opacity: config.isOpen ? '0.35' : '1',
        filter: config.isOpen ? `blur(${Math.min(config.blur, 4)}px)` : 'none',
        transition: 'all 0.25s ease',
        pointerEvents: config.isOpen ? 'none' : 'auto'
      }
    }, [
      el('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '16px' } }, [
        el('div', { style: { height: '18px', width: '140px', background: 'var(--border-strong)', borderRadius: '4px' } }),
        el('div', { style: { height: '28px', width: '80px', background: 'var(--border)', borderRadius: '4px' } })
      ]),
      el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' } }, [
        el('div', { style: { height: '64px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '6px' } }),
        el('div', { style: { height: '64px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '6px' } }),
        el('div', { style: { height: '64px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '6px' } })
      ]),
      el('div', { style: { height: '120px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '6px' } })
    ]);

    // Live trigger button when modal is closed
    const triggerContainer = el('div', {
      style: {
        position: 'absolute',
        zIndex: 10,
        display: config.isOpen ? 'none' : 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px'
      }
    }, [
      el('button', {
        className: 'btn btn-primary',
        style: { padding: '10px 22px', fontSize: '0.875rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)' },
        textContent: 'Open Interactive Modal →',
        onclick: () => {
          config.isOpen = true;
          renderModalStage();
        }
      }),
      el('span', { style: { fontSize: '0.72rem', color: 'var(--text-dim)' }, textContent: 'Press ESC or click backdrop to close' })
    ]);

    centerStage.appendChild(backgroundMock);
    centerStage.appendChild(triggerContainer);

    // If Open, render the modal card over the center stage
    if (config.isOpen) {
      const modalBackdrop = el('div', {
        id: 'modal-live-backdrop',
        style: {
          position: 'absolute',
          inset: '0',
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: `blur(${config.blur}px)`,
          WebkitBackdropFilter: `blur(${config.blur}px)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: config.preset === 'sheet' ? 'flex-end' : 'center',
          padding: config.preset === 'sheet' ? '0' : '20px',
          zIndex: 50,
          animation: 'fadeIn 0.18s ease'
        }
      });

      const modalWidth = config.preset === 'sheet'
        ? '380px'
        : config.size === 'sm' ? '400px' : config.size === 'lg' ? '640px' : '520px';

      const modalHeight = config.preset === 'sheet' ? '100%' : 'auto';
      const modalRadius = config.preset === 'sheet' ? '0' : `${config.radius}px`;

      const modalBox = el('div', {
        id: 'modal-live-box',
        style: {
          width: '100%',
          maxWidth: modalWidth,
          height: modalHeight,
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-strong)',
          borderRadius: modalRadius,
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: config.preset === 'sheet' ? 'slideLeft 0.22s ease-out' : 'modalScaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }
      });

      modalBox.innerHTML = getPresetContent(config.preset);

      // Dismiss logic
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
          config.isOpen = false;
          renderModalStage();
        }
      });

      const closeBtn = modalBox.querySelector('#modal-close-icon-btn');
      if (closeBtn) {
        closeBtn.onclick = () => {
          config.isOpen = false;
          renderModalStage();
        };
      }

      const cancelBtn = modalBox.querySelector('#modal-cancel-btn');
      if (cancelBtn) {
        cancelBtn.onclick = () => {
          config.isOpen = false;
          renderModalStage();
        };
      }

      const confirmBtn = modalBox.querySelector('#modal-confirm-btn');
      if (confirmBtn) {
        confirmBtn.onclick = () => {
          confirmBtn.innerHTML = `${ICONS.check} Done`;
          setTimeout(() => {
            config.isOpen = false;
            renderModalStage();
          }, 450);
        };
      }

      modalBackdrop.appendChild(modalBox);
      centerStage.appendChild(modalBackdrop);
    }

    updateCode();
  }

  function getPresetContent(preset) {
    if (preset === 'checkout') {
      return `
        <div style="padding:16px 20px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h3 style="font-size:1.05rem; font-weight:600; color:var(--text-main); margin:0;">Complete Purchase</h3>
            <p style="font-size:0.75rem; color:var(--text-dim); margin:2px 0 0;">Huragon Studio Commercial License</p>
          </div>
          <button id="modal-close-icon-btn" class="btn btn-ghost btn-icon" style="width:28px; height:28px;">${ICONS.close}</button>
        </div>

        <div style="padding:20px; display:flex; flex-direction:column; gap:14px;">
          <div style="padding:12px; background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-sm); display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-weight:600; font-size:0.85rem; color:var(--text-main);">Pro Unlimited Plan</div>
              <div style="font-size:0.72rem; color:var(--text-dim);">Single-seat seat perpetual access</div>
            </div>
            <div style="font-size:1.15rem; font-weight:700; color:var(--text-main); font-family:var(--font-mono);">$99.00</div>
          </div>

          <div>
            <label style="display:block; font-size:0.75rem; font-weight:500; color:var(--text-muted); margin-bottom:5px;">Email Receipt</label>
            <input type="email" value="alex@developer.io" style="width:100%; padding:8px 12px; background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-sm); color:var(--text-main); font-size:0.825rem;" />
          </div>

          <div>
            <label style="display:block; font-size:0.75rem; font-weight:500; color:var(--text-muted); margin-bottom:5px;">Card Information</label>
            <div style="display:flex; gap:8px;">
              <input type="text" placeholder="•••• •••• •••• 4242" style="flex:2; padding:8px 12px; background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-sm); color:var(--text-main); font-size:0.825rem; font-family:var(--font-mono);" />
              <input type="text" placeholder="MM/YY" style="flex:1; padding:8px 12px; background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-sm); color:var(--text-main); font-size:0.825rem; text-align:center; font-family:var(--font-mono);" />
              <input type="text" placeholder="CVC" style="flex:1; padding:8px 12px; background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-sm); color:var(--text-main); font-size:0.825rem; text-align:center; font-family:var(--font-mono);" />
            </div>
          </div>
        </div>

        <div style="padding:14px 20px; border-top:1px solid var(--border); background:var(--bg-card); display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:0.72rem; color:var(--text-dim); display:flex; align-items:center; gap:4px;">
            ${ICONS.checkCircle} 256-bit TLS Encrypted
          </span>
          <div style="display:flex; gap:8px;">
            <button id="modal-cancel-btn" class="btn btn-outline" style="font-size:0.78rem;">Cancel</button>
            <button id="modal-confirm-btn" class="btn btn-primary" style="font-size:0.78rem;">Pay $99.00</button>
          </div>
        </div>
      `;
    } else if (preset === 'settings') {
      return `
        <div style="padding:16px 20px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
          <h3 style="font-size:1.05rem; font-weight:600; color:var(--text-main); margin:0;">Edit Workspace Settings</h3>
          <button id="modal-close-icon-btn" class="btn btn-ghost btn-icon" style="width:28px; height:28px;">${ICONS.close}</button>
        </div>

        <div style="padding:20px; display:flex; flex-direction:column; gap:14px;">
          <div>
            <label style="display:block; font-size:0.75rem; font-weight:500; color:var(--text-muted); margin-bottom:5px;">Workspace Name</label>
            <input type="text" value="Acme Design Systems" style="width:100%; padding:8px 12px; background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-sm); color:var(--text-main); font-size:0.825rem;" />
          </div>
          <div>
            <label style="display:block; font-size:0.75rem; font-weight:500; color:var(--text-muted); margin-bottom:5px;">Custom Domain</label>
            <input type="text" value="design.acme.corp" style="width:100%; padding:8px 12px; background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-sm); color:var(--text-main); font-size:0.825rem; font-family:var(--font-mono);" />
          </div>
        </div>

        <div style="padding:14px 20px; border-top:1px solid var(--border); background:var(--bg-card); display:flex; justify-content:flex-end; gap:8px;">
          <button id="modal-cancel-btn" class="btn btn-outline" style="font-size:0.78rem;">Cancel</button>
          <button id="modal-confirm-btn" class="btn btn-primary" style="font-size:0.78rem;">Save Changes</button>
        </div>
      `;
    } else if (preset === 'alert') {
      return `
        <div style="padding:24px 20px 16px; display:flex; gap:16px;">
          <div style="width:40px; height:40px; border-radius:50%; background:rgba(239, 68, 68, 0.12); color:#ef4444; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
            ${ICONS.alertTriangle}
          </div>
          <div>
            <h3 style="font-size:1.05rem; font-weight:600; color:var(--text-main); margin:0 0 6px;">Delete Project Environment?</h3>
            <p style="font-size:0.825rem; color:var(--text-muted); line-height:1.5; margin:0;">
              This will permanently delete the deployment cluster and remove all provisioned SSL secrets. This operation cannot be rolled back.
            </p>
          </div>
        </div>

        <div style="padding:14px 20px; border-top:1px solid var(--border); background:var(--bg-card); display:flex; justify-content:flex-end; gap:8px;">
          <button id="modal-cancel-btn" class="btn btn-outline" style="font-size:0.78rem;">Cancel</button>
          <button id="modal-confirm-btn" class="btn" style="background:#ef4444; color:#ffffff; border:1px solid #ef4444; font-size:0.78rem; font-weight:600;">
            Delete Cluster
          </button>
        </div>
      `;
    } else {
      // Sheet / Drawer
      return `
        <div style="padding:16px 20px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
          <h3 style="font-size:1rem; font-weight:600; color:var(--text-main); margin:0;">Slide-in Navigation Sheet</h3>
          <button id="modal-close-icon-btn" class="btn btn-ghost btn-icon" style="width:28px; height:28px;">${ICONS.close}</button>
        </div>
        <div style="padding:20px; flex:1; display:flex; flex-direction:column; gap:8px;">
          ${['Dashboard', 'Analytics', 'Components', 'Design Tokens', 'Settings'].map((item, i) => `
            <div style="padding:10px 14px; border-radius:var(--radius-sm); font-size:0.85rem; color:var(--text-main); cursor:pointer; background:${i === 0 ? 'var(--bg-hover)' : 'transparent'}; font-weight:${i === 0 ? '600' : '400'};">
              ${item}
            </div>
          `).join('')}
        </div>
        <div style="padding:14px 20px; border-top:1px solid var(--border); background:var(--bg-card);">
          <button id="modal-cancel-btn" class="btn btn-outline" style="width:100%; font-size:0.78rem;">Close Drawer</button>
        </div>
      `;
    }
  }

  function updateCode() {
    const css = `/* HeroUI / shadcn/ui — Modal & Dialog Backdrop */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(${config.blur}px);
  -webkit-backdrop-filter: blur(${config.blur}px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 20px;
}

.modal-card {
  width: 100%;
  max-width: ${config.size === 'sm' ? '400px' : config.size === 'lg' ? '640px' : '520px'};
  background: var(--bg-panel);
  border: 1px solid var(--border-strong);
  border-radius: ${config.radius}px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6);
  animation: modalEnter 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalEnter {
  from { opacity: 0; transform: scale(0.96) translateY(8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}`;

    const tailwind = `<!-- HeroUI / shadcn/ui Modal Component -->
<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[${config.blur}px] p-4">
  <div class="w-full max-w-lg rounded-[${config.radius}px] border border-zinc-800 bg-zinc-900 shadow-2xl animate-in fade-in zoom-in-95">
    <div class="flex items-center justify-between border-b border-zinc-800 p-4">
      <h3 class="text-base font-semibold text-zinc-100">Modal Header</h3>
    </div>
    <div class="p-5 text-sm text-zinc-400">
      Modal content goes here...
    </div>
  </div>
</div>`;

    onCodeChange({ css, tailwind });
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const sec = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', textContent: 'Modal Preset' }),
      el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', marginBottom: '16px' } }, [
        { id: 'checkout', name: 'Checkout / Pay' },
        { id: 'settings', name: 'Form Settings' },
        { id: 'alert', name: 'Alert Confirm' },
        { id: 'sheet', name: 'Side Sheet' }
      ].map(p => el('button', {
        className: `btn ${config.preset === p.id ? 'btn-primary' : 'btn-outline'}`,
        style: { fontSize: '0.75rem', padding: '6px' },
        textContent: p.name,
        onclick: () => {
          config.preset = p.id;
          config.isOpen = true;
          renderControls();
          renderModalStage();
        }
      }))),

      el('div', { className: 'section-title', textContent: 'Backdrop & Geometry' }),
      createSlider('Backdrop Blur', config.blur, 0, 20, (v) => {
        config.blur = v;
        renderModalStage();
      }, 'px'),
      createSlider('Border Radius', config.radius, 0, 24, (v) => {
        config.radius = v;
        renderModalStage();
      }, 'px'),

      el('div', { className: 'section-title', textContent: 'Modal Width' }),
      el('div', { style: { display: 'flex', gap: '6px' } }, [
        { id: 'sm', name: 'Compact 400px' },
        { id: 'md', name: 'Standard 520px' },
        { id: 'lg', name: 'Wide 640px' }
      ].map(s => el('button', {
        className: `btn ${config.size === s.id ? 'btn-primary' : 'btn-outline'}`,
        style: { flex: '1', fontSize: '0.72rem', padding: '5px' },
        textContent: s.name,
        onclick: () => {
          config.size = s.id;
          renderControls();
          renderModalStage();
        }
      })))
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
          const v = parseInt(e.target.value, 10);
          valSpan.textContent = `${v}${unit}`;
          onChange(v);
        }
      })
    ]);
  }

  renderControls();
}
