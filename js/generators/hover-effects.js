// Tool: Hover Effects Library
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';

export const meta = {
  id: 'hover-effects',
  name: 'Hover Effects Library'
};

let config = {
  effect: 'lift', // 'lift', 'scale', 'glow', 'border-draw', 'skew'
  duration: 0.25,
  easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
  liftDistance: 6,
  scaleFactor: 1.03,
  glowColor: '#3f3f46',
  borderColor: '#52525b'
};

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    id: 'hover-preview-container',
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
      width: '100%'
    }
  });

  previewStage.appendChild(centerStage);

  // Render controls
  controlsStage.innerHTML = '';

  const section = el('div', { className: 'control-section' }, [
    el('div', { className: 'control-section-header' }, [
      el('h4', { className: 'control-section-title', textContent: 'Hover Micro-Interaction' })
    ]),
    el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '16px' } }, [
      createEffectBtn('Elevation Lift', 'lift'),
      createEffectBtn('Scale Zoom', 'scale'),
      createEffectBtn('Glow Bloom', 'glow'),
      createEffectBtn('Border Stroke', 'border-draw'),
      createEffectBtn('Perspective Skew', 'skew')
    ]),

    el('div', { className: 'control-section-header' }, [
      el('h4', { className: 'control-section-title', textContent: 'Physics & Parameters' })
    ]),
    createSlider('Transition Speed', 0.1, 0.6, 0.05, config.duration, 's', (v) => {
      config.duration = v;
      update();
    }),
    createSlider('Lift Offset', 0, 16, 1, config.liftDistance, 'px', (v) => {
      config.liftDistance = v;
      update();
    }),
    createSlider('Scale Factor', 1.0, 1.15, 0.01, config.scaleFactor, 'x', (v) => {
      config.scaleFactor = v;
      update();
    }),

    el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' } }, [
      createColorControl('Glow Tint', config.glowColor, (v) => {
        config.glowColor = v;
        update();
      }),
      createColorControl('Border Accent', config.borderColor, (v) => {
        config.borderColor = v;
        update();
      })
    ]),

    el('div', { style: { marginTop: '20px' } }, [
      el('button', {
        className: 'btn btn-outline',
        style: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' },
        innerHTML: `${ICONS.refresh} Reset Defaults`,
        onclick: () => {
          config = {
            effect: 'lift',
            duration: 0.25,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            liftDistance: 6,
            scaleFactor: 1.03,
            glowColor: '#3f3f46',
            borderColor: '#52525b'
          };
          mount(container, onCodeChange);
        }
      })
    ])
  ]);

  controlsStage.appendChild(section);

  function createEffectBtn(label, eff) {
    const btn = el('button', {
      className: `btn btn-outline ${config.effect === eff ? 'active' : ''}`,
      style: { fontSize: '0.8rem', padding: '8px 10px' },
      textContent: label,
      onclick: (e) => {
        config.effect = eff;
        controlsStage.querySelectorAll('.btn-outline').forEach(b => {
          if (['Elevation Lift', 'Scale Zoom', 'Glow Bloom', 'Border Stroke', 'Perspective Skew'].includes(b.textContent.trim())) {
            b.classList.remove('active');
          }
        });
        e.currentTarget.classList.add('active');
        update();
      }
    });
    return btn;
  }

  function update() {
    renderCard(centerStage);
    generateCode();
  }

  function renderCard(target) {
    target.innerHTML = '';

    let hoverStyle = '';
    let baseTransform = 'transform: none;';
    let baseShadow = 'box-shadow: 0 1px 3px rgba(0,0,0,0.1);';
    let baseBorder = 'border: 1px solid var(--border);';

    if (config.effect === 'lift') {
      hoverStyle = `
        #interactive-hover-target:hover {
          transform: translateY(-${config.liftDistance}px);
          box-shadow: 0 ${config.liftDistance * 2}px ${config.liftDistance * 4}px -4px rgba(0,0,0,0.35);
        }
      `;
    } else if (config.effect === 'scale') {
      hoverStyle = `
        #interactive-hover-target:hover {
          transform: scale(${config.scaleFactor});
        }
      `;
    } else if (config.effect === 'glow') {
      hoverStyle = `
        #interactive-hover-target:hover {
          box-shadow: 0 0 24px -2px ${config.glowColor};
          border-color: ${config.glowColor};
        }
      `;
    } else if (config.effect === 'border-draw') {
      hoverStyle = `
        #interactive-hover-target:hover {
          border-color: ${config.borderColor};
          box-shadow: inset 0 0 0 1px ${config.borderColor};
        }
      `;
    } else if (config.effect === 'skew') {
      hoverStyle = `
        #interactive-hover-target:hover {
          transform: skewX(-2deg) scale(${config.scaleFactor});
        }
      `;
    }

    let liveStyle = qs('#hover-effect-style');
    if (!liveStyle) {
      liveStyle = document.createElement('style');
      liveStyle.id = 'hover-effect-style';
      document.head.appendChild(liveStyle);
    }
    liveStyle.textContent = hoverStyle;

    const card = el('div', {
      id: 'interactive-hover-target',
      style: {
        width: '320px',
        padding: '24px',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        cursor: 'pointer',
        transition: `all ${config.duration}s ${config.easing}`,
        userSelect: 'none'
      },
      innerHTML: `
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;">
          <div style="width:36px; height:36px; border-radius:8px; background:var(--bg-card-hover); border:1px solid var(--border); display:flex; align-items:center; justify-content:center;">
            ${ICONS.sparkles}
          </div>
          <span style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono);">hover me</span>
        </div>
        <h4 style="font-size:1.05rem; font-weight:600; color:var(--text-main); margin-bottom:6px;">Interactive Card</h4>
        <p style="font-size:0.825rem; color:var(--text-muted); line-height:1.5;">
          Move your cursor over this card to preview the physics and transition dynamics in real time.
        </p>
      `
    });

    target.appendChild(card);
  }

  function generateCode() {
    let css = '';
    let tailwind = '';

    if (config.effect === 'lift') {
      css = `/* Smooth Elevation Lift */
.card-hover {
  transition: transform ${config.duration}s ${config.easing},
              box-shadow ${config.duration}s ${config.easing};
}

.card-hover:hover {
  transform: translateY(-${config.liftDistance}px);
  box-shadow: 0 ${config.liftDistance * 2}px ${config.liftDistance * 4}px -4px rgba(0, 0, 0, 0.35);
}`;
      tailwind = `<!-- Tailwind Elevation Lift -->
<div class="transition-all duration-200 hover:-translate-y-1.5 hover:shadow-xl">...</div>`;
    } else if (config.effect === 'scale') {
      css = `/* Smooth Scale Zoom */
.scale-hover {
  transition: transform ${config.duration}s ${config.easing};
}

.scale-hover:hover {
  transform: scale(${config.scaleFactor});
}`;
      tailwind = `<!-- Tailwind Scale Zoom -->
<div class="transition-transform duration-200 hover:scale-[${config.scaleFactor}]">...</div>`;
    } else if (config.effect === 'glow') {
      css = `/* Soft Ambient Glow */
.glow-hover {
  transition: box-shadow ${config.duration}s ${config.easing},
              border-color ${config.duration}s ${config.easing};
}

.glow-hover:hover {
  border-color: ${config.glowColor};
  box-shadow: 0 0 24px -2px ${config.glowColor};
}`;
      tailwind = `<!-- Tailwind Glow -->
<div class="transition-all duration-200 hover:border-zinc-500 hover:shadow-[0_0_24px_rgba(255,255,255,0.15)]">...</div>`;
    } else if (config.effect === 'border-draw') {
      css = `/* Inset Border Draw */
.border-hover {
  border: 1px solid var(--border);
  transition: border-color ${config.duration}s ${config.easing},
              box-shadow ${config.duration}s ${config.easing};
}

.border-hover:hover {
  border-color: ${config.borderColor};
  box-shadow: inset 0 0 0 1px ${config.borderColor};
}`;
      tailwind = `<!-- Tailwind Ring Inset -->
<div class="border border-zinc-800 transition-all duration-200 hover:border-zinc-600 hover:ring-1 hover:ring-zinc-600">...</div>`;
    } else {
      css = `/* Perspective Skew */
.skew-hover {
  transition: transform ${config.duration}s ${config.easing};
}

.skew-hover:hover {
  transform: skewX(-2deg) scale(${config.scaleFactor});
}`;
      tailwind = `<!-- Tailwind Skew -->
<div class="transition-transform duration-200 hover:-skew-x-2 hover:scale-[${config.scaleFactor}]">...</div>`;
    }

    onCodeChange({ css, tailwind });
  }

  update();
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
