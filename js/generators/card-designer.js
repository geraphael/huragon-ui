// Tool 9: Card Designer Generator
import { el, qs } from '../utils/dom.js';

export const meta = {
  id: 'card-designer',
  name: 'Card Designer'
};

let config = {
  title: 'Analytics Dashboard',
  badge: 'Production',
  description: 'Real-time telemetry and resource performance indicators across active nodes.',
  radius: 12,
  padding: 24,
  borderWidth: 1,
  hoverLift: true
};

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px'
    }
  });

  const card = el('div', {
    id: 'designer-card-el',
    style: {
      width: '340px',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: `${config.radius}px`,
      padding: `${config.padding}px`,
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      color: 'var(--text-main)',
      transition: 'all 0.18s ease'
    }
  });

  renderCardContent(card);
  centerStage.appendChild(card);
  previewStage.appendChild(centerStage);

  function renderCardContent(target) {
    target.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:0.7rem; font-weight:500; color:var(--text-dim); text-transform:uppercase; letter-spacing:0.04em;">System Status</span>
        <span style="font-size:0.68rem; padding:2px 7px; border-radius:999px; background:var(--bg-input); border:1px solid var(--border); color:var(--text-muted); font-weight:500;">${config.badge}</span>
      </div>
      <div>
        <h3 style="font-size:1.1rem; font-weight:600; margin-bottom:6px; letter-spacing:-0.01em;">${config.title}</h3>
        <p style="font-size:0.8rem; color:var(--text-muted); line-height:1.5; margin:0;">${config.description}</p>
      </div>
      <div style="display:flex; gap:8px; margin-top:6px;">
        <button class="btn btn-primary" style="flex:1;">View Metrics</button>
        <button class="btn btn-outline" style="flex:1;">Settings</button>
      </div>
    `;

    if (config.hoverLift) {
      target.onmouseenter = () => {
        target.style.transform = 'translateY(-3px)';
        target.style.borderColor = 'var(--border-strong)';
        target.style.boxShadow = 'var(--shadow-md)';
      };
      target.onmouseleave = () => {
        target.style.transform = 'translateY(0)';
        target.style.borderColor = 'var(--border)';
        target.style.boxShadow = 'none';
      };
    } else {
      target.onmouseenter = null;
      target.onmouseleave = null;
    }

    updateCode();
  }

  function updateCode() {
    const css = `/* Huragon/ui — Clean Card */
.ui-card {
  background: var(--bg-card);
  border: ${config.borderWidth}px solid var(--border);
  border-radius: ${config.radius}px;
  padding: ${config.padding}px;
  transition: all 0.18s ease;
}

${config.hoverLift ? `.ui-card:hover {
  transform: translateY(-3px);
  border-color: var(--border-strong);
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.45);
}` : ''}`;

    const tailwind = `<div class="bg-zinc-900 border border-zinc-800 rounded-[${config.radius}px] p-[${config.padding}px] ${config.hoverLift ? 'transition-all hover:-translate-y-1 hover:border-zinc-700 hover:shadow-lg' : ''}">
  <h3 class="text-base font-semibold text-zinc-100">${config.title}</h3>
  <p class="text-sm text-zinc-400 mt-1">${config.description}</p>
</div>`;

    onCodeChange({ css, tailwind });
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const sec = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', textContent: 'Card Properties' }),

      createSlider('Border Radius', config.radius, 0, 28, (v) => { config.radius = v; card.style.borderRadius = `${v}px`; updateCode(); }, 'px'),
      createSlider('Internal Padding', config.padding, 12, 40, (v) => { config.padding = v; card.style.padding = `${v}px`; updateCode(); }, 'px'),

      el('div', { className: 'switch-container', style: { marginTop: '14px' } }, [
        el('span', { style: { fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-muted)' }, textContent: 'Hover Lift Effect' }),
        el('label', { className: 'switch' }, [
          el('input', {
            type: 'checkbox',
            checked: config.hoverLift,
            onchange: (e) => {
              config.hoverLift = e.target.checked;
              renderCardContent(card);
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
  updateCode();
}
