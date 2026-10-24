// Tool: Visual Keyframe Animation Timeline Builder
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';

export const meta = {
  id: 'keyframe-animator',
  name: 'Keyframe Timeline'
};

let config = {
  preset: 'float', // 'float', 'pulse-bounce', 'swing', 'rubber-band'
  duration: 2.0,
  iteration: 'infinite',
  timing: 'ease-in-out',
  direction: 'alternate'
};

const PRESETS = [
  { name: 'Floating Levitation', id: 'float' },
  { name: 'Pulse & Bounce', id: 'pulse-bounce' },
  { name: 'Pendulum Swing', id: 'swing' },
  { name: 'Rubber Band', id: 'rubber-band' }
];

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    id: 'keyframe-preview-container',
    style: {
      width: '100%',
      maxWidth: '560px',
      minHeight: '340px',
      padding: '40px',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-md)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }
  });

  previewStage.appendChild(centerStage);

  // Controls
  controlsStage.innerHTML = '';

  const section = el('div', { className: 'control-section' }, [
    el('div', { className: 'control-section-header' }, [
      el('h4', { className: 'control-section-title', textContent: 'Motion Presets' })
    ]),
    el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '16px' } },
      PRESETS.map(p => el('button', {
        className: `btn btn-outline ${config.preset === p.id ? 'active' : ''}`,
        style: { fontSize: '0.75rem', padding: '6px 8px' },
        textContent: p.name,
        onclick: (e) => {
          config.preset = p.id;
          controlsStage.querySelectorAll('.btn-outline').forEach(b => {
            if (PRESETS.some(pr => pr.name === b.textContent.trim())) {
              b.classList.remove('active');
            }
          });
          e.currentTarget.classList.add('active');
          update();
        }
      }))
    ),

    el('div', { className: 'control-section-header' }, [
      el('h4', { className: 'control-section-title', textContent: 'Animation Dynamics' })
    ]),
    createSlider('Cycle Duration', 0.5, 5.0, 0.1, config.duration, 's', (v) => {
      config.duration = v;
      update();
    }),
    createToggle('Infinite Loop', config.iteration === 'infinite', (v) => {
      config.iteration = v ? 'infinite' : '1';
      update();
    }),
    createToggle('Alternate Direction', config.direction === 'alternate', (v) => {
      config.direction = v ? 'alternate' : 'normal';
      update();
    })
  ]);

  controlsStage.appendChild(section);

  function update() {
    renderAnimation(centerStage);
    generateCode();
  }

  function renderAnimation(target) {
    let keyframeCss = '';

    if (config.preset === 'float') {
      keyframeCss = `
        @keyframes huragon-custom-kf {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-16px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `;
    } else if (config.preset === 'pulse-bounce') {
      keyframeCss = `
        @keyframes huragon-custom-kf {
          0% { transform: scale(1); }
          30% { transform: scale(1.12) translateY(-8px); }
          50% { transform: scale(0.95) translateY(2px); }
          70% { transform: scale(1.04) translateY(-3px); }
          100% { transform: scale(1); }
        }
      `;
    } else if (config.preset === 'swing') {
      keyframeCss = `
        @keyframes huragon-custom-kf {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(12deg); }
          75% { transform: rotate(-12deg); }
          100% { transform: rotate(0deg); }
        }
      `;
    } else {
      // Rubber Band
      keyframeCss = `
        @keyframes huragon-custom-kf {
          0% { transform: scale3d(1, 1, 1); }
          30% { transform: scale3d(1.25, 0.75, 1); }
          40% { transform: scale3d(0.75, 1.25, 1); }
          50% { transform: scale3d(1.15, 0.85, 1); }
          65% { transform: scale3d(0.95, 1.05, 1); }
          75% { transform: scale3d(1.05, 0.95, 1); }
          100% { transform: scale3d(1, 1, 1); }
        }
      `;
    }

    let styleEl = qs('#keyframe-live-style');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'keyframe-live-style';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `
      ${keyframeCss}
      #animated-target-box {
        animation: huragon-custom-kf ${config.duration}s ${config.timing} ${config.iteration} ${config.direction};
      }
    `;

    target.innerHTML = `
      <div id="animated-target-box" style="width:110px; height:110px; background:var(--bg-main); border:1px solid var(--border); border-radius:24px; box-shadow:var(--shadow-md); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px;">
        <div style="color:var(--text-main);">${ICONS.sparkles}</div>
        <span style="font-size:0.75rem; font-weight:600; color:var(--text-main); font-family:var(--font-mono);">huragon</span>
      </div>
      <div style="position:absolute; bottom:14px; font-size:0.75rem; color:var(--text-dim); font-family:var(--font-mono);">
        timeline: 0% → 50% → 100%
      </div>
    `;
  }

  function generateCode() {
    let kfBlock = '';

    if (config.preset === 'float') {
      kfBlock = `@keyframes float {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-16px) rotate(2deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}`;
    } else if (config.preset === 'pulse-bounce') {
      kfBlock = `@keyframes pulseBounce {
  0% { transform: scale(1); }
  30% { transform: scale(1.12) translateY(-8px); }
  50% { transform: scale(0.95) translateY(2px); }
  70% { transform: scale(1.04) translateY(-3px); }
  100% { transform: scale(1); }
}`;
    } else if (config.preset === 'swing') {
      kfBlock = `@keyframes pendulumSwing {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(12deg); }
  75% { transform: rotate(-12deg); }
  100% { transform: rotate(0deg); }
}`;
    } else {
      kfBlock = `@keyframes rubberBand {
  0% { transform: scale3d(1, 1, 1); }
  30% { transform: scale3d(1.25, 0.75, 1); }
  40% { transform: scale3d(0.75, 1.25, 1); }
  50% { transform: scale3d(1.15, 0.85, 1); }
  65% { transform: scale3d(0.95, 1.05, 1); }
  75% { transform: scale3d(1.05, 0.95, 1); }
  100% { transform: scale3d(1, 1, 1); }
}`;
    }

    const css = `/* Huragon/ui Multi-Step Keyframe Animation */
.animated-element {
  animation: ${config.preset} ${config.duration}s ${config.timing} ${config.iteration} ${config.direction};
}

${kfBlock}`;

    const tailwind = `<!-- Tailwind Custom Keyframe -->
<div class="animate-bounce duration-[${Math.round(config.duration * 1000)}ms]">
  ...
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

  function createToggle(label, initial, onChange) {
    const wrapper = el('div', { className: 'control-item', style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' } });
    const lbl = el('label', { className: 'control-label', textContent: label });
    const chk = el('input', {
      type: 'checkbox',
      checked: initial,
      style: { cursor: 'pointer', width: '16px', height: '16px', accentColor: '#ffffff' },
      onchange: (e) => onChange(e.target.checked)
    });

    wrapper.appendChild(lbl);
    wrapper.appendChild(chk);
    return wrapper;
  }

  update();
}
