// Tool: Aurora Borealis Glow & Ambient Gradient
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';

export const meta = {
  id: 'aurora-gradient',
  name: 'Aurora Borealis Glow'
};

let config = {
  preset: 'northern-lights', // 'northern-lights', 'nebula', 'sunset'
  blur: 64,
  opacity: 0.6,
  speed: 12,
  color1: '#10b981',
  color2: '#06b6d4',
  color3: '#6366f1'
};

const PRESETS = [
  { name: 'Northern Lights', c1: '#10b981', c2: '#06b6d4', c3: '#6366f1', id: 'northern-lights' },
  { name: 'Deep Nebula', c1: '#6366f1', c2: '#a855f7', c3: '#ec4899', id: 'nebula' },
  { name: 'Midnight Sunset', c1: '#f43f5e', c2: '#f59e0b', c3: '#8b5cf6', id: 'sunset' }
];

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    id: 'aurora-preview-container',
    style: {
      width: '100%',
      height: '100%',
      position: 'relative',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid var(--border)',
      background: '#09090b',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  });

  previewStage.appendChild(centerStage);

  // Controls
  controlsStage.innerHTML = '';

  const section = el('div', { className: 'control-section' }, [
    el('div', { className: 'control-section-header' }, [
      el('h4', { className: 'control-section-title', textContent: 'Curated Atmospheres' })
    ]),
    el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '16px' } },
      PRESETS.map(p => el('button', {
        className: `btn btn-outline ${config.preset === p.id ? 'active' : ''}`,
        style: { fontSize: '0.75rem', padding: '6px' },
        textContent: p.name.split(' ')[0],
        onclick: (e) => {
          config.preset = p.id;
          config.color1 = p.c1;
          config.color2 = p.c2;
          config.color3 = p.c3;
          controlsStage.querySelectorAll('.btn-outline').forEach(b => b.classList.remove('active'));
          e.currentTarget.classList.add('active');
          update();
        }
      }))
    ),

    el('div', { className: 'control-section-header' }, [
      el('h4', { className: 'control-section-title', textContent: 'Aurora Physics' })
    ]),
    createSlider('Blur Dispersion', 20, 100, 4, config.blur, 'px', (v) => {
      config.blur = v;
      update();
    }),
    createSlider('Glow Intensity', 0.2, 1.0, 0.05, config.opacity, '', (v) => {
      config.opacity = v;
      update();
    }),
    createSlider('Drift Speed', 4, 24, 1, config.speed, 's', (v) => {
      config.speed = v;
      update();
    }),

    el('div', { className: 'control-section-header', style: { marginTop: '16px' } }, [
      el('h4', { className: 'control-section-title', textContent: 'Aura Colors' })
    ]),
    el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' } }, [
      createColorControl('Beam 1', config.color1, (v) => {
        config.color1 = v;
        update();
      }),
      createColorControl('Beam 2', config.color2, (v) => {
        config.color2 = v;
        update();
      }),
      createColorControl('Beam 3', config.color3, (v) => {
        config.color3 = v;
        update();
      })
    ])
  ]);

  controlsStage.appendChild(section);

  function update() {
    renderAurora(centerStage);
    generateCode();
  }

  function renderAurora(target) {
    let animCss = `
      @keyframes huragon-aurora-drift {
        0%, 100% {
          transform: translateY(0px) scale(1);
        }
        50% {
          transform: translateY(-25px) scale(1.15) rotate(4deg);
        }
      }
      .huragon-aurora-layer {
        position: absolute;
        inset: -20px;
        filter: blur(${config.blur}px);
        opacity: ${config.opacity};
        animation: huragon-aurora-drift ${config.speed}s ease-in-out infinite alternate;
        pointer-events: none;
      }
    `;

    let styleEl = qs('#aurora-live-style');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'aurora-live-style';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = animCss;

    const bgGradient = `
      radial-gradient(ellipse at 20% 30%, ${config.color1} 0%, transparent 50%),
      radial-gradient(ellipse at 80% 20%, ${config.color2} 0%, transparent 50%),
      radial-gradient(ellipse at 50% 80%, ${config.color3} 0%, transparent 50%)
    `;

    target.innerHTML = `
      <div class="huragon-aurora-layer" style="background:${bgGradient};"></div>
      <div style="position:relative; z-index:2; text-align:center; padding:28px 36px; background:rgba(9, 9, 11, 0.65); backdrop-filter:blur(16px); border:1px solid rgba(255, 255, 255, 0.12); border-radius:var(--radius-lg); box-shadow:0 20px 40px rgba(0,0,0,0.5); max-width:380px;">
        <span style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-muted); font-weight:600;">Aurora Glow</span>
        <h3 style="font-size:1.3rem; font-weight:700; color:#ffffff; margin:6px 0; letter-spacing:-0.02em;">Ambient Lighting</h3>
        <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.5;">Multi-beam radial dispersion with continuous fluid drift physics.</p>
      </div>
    `;
  }

  function generateCode() {
    const bgGradient = `radial-gradient(ellipse at 20% 30%, ${config.color1} 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, ${config.color2} 0%, transparent 50%),
    radial-gradient(ellipse at 50% 80%, ${config.color3} 0%, transparent 50%)`;

    const css = `/* Aurora Borealis Ambient Glow */
.aurora-container {
  position: relative;
  background-color: #09090b;
  overflow: hidden;
}

.aurora-container::before {
  content: "";
  position: absolute;
  inset: -20px;
  background:
    ${bgGradient};
  filter: blur(${config.blur}px);
  opacity: ${config.opacity};
  animation: auroraDrift ${config.speed}s ease-in-out infinite alternate;
  pointer-events: none;
}

@keyframes auroraDrift {
  0%, 100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-25px) scale(1.15) rotate(4deg);
  }
}`;

    const tailwind = `<!-- Tailwind Aurora Background Container -->
<div class="relative bg-zinc-950 overflow-hidden p-12">
  <div class="absolute inset-[-20px] filter blur-[${config.blur}px] opacity-[${config.opacity}] pointer-events-none animate-pulse"></div>
  <div class="relative z-10 text-white">Your Card Content</div>
</div>`;

    onCodeChange({ css, tailwind });
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

  function createColorControl(label, initial, onChange) {
    const wrapper = el('div', { className: 'control-item' });
    const row = el('div', { className: 'control-label-row' }, [
      el('label', { className: 'control-label', textContent: label })
    ]);
    const picker = el('input', {
      type: 'color',
      value: initial,
      style: { width: '100%', height: '34px', padding: '0', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: 'transparent' },
      oninput: (e) => onChange(e.target.value)
    });

    wrapper.appendChild(row);
    wrapper.appendChild(picker);
    return wrapper;
  }

  update();
}
