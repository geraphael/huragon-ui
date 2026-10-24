// Tool 8: Linear & Radial Gradient Builder
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';
import { randomHex } from '../utils/color.js';

export const meta = {
  id: 'gradient-builder',
  name: 'Linear & Radial Gradient'
};

let config = {
  type: 'linear', // linear, radial, conic
  angle: 135,
  stops: [
    { color: '#18181b', pos: 0 },
    { color: '#3f3f46', pos: 50 },
    { color: '#71717a', pos: 100 }
  ]
};

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    id: 'gradient-preview-box',
    style: {
      width: '100%',
      height: '100%',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border)',
      transition: 'background 0.15s ease'
    }
  });

  previewStage.appendChild(centerStage);

  function applyGradient() {
    const stopsStr = config.stops.map(s => `${s.color} ${s.pos}%`).join(', ');
    let cssGrad = '';

    if (config.type === 'linear') {
      cssGrad = `linear-gradient(${config.angle}deg, ${stopsStr})`;
    } else if (config.type === 'radial') {
      cssGrad = `radial-gradient(circle at center, ${stopsStr})`;
    } else if (config.type === 'conic') {
      cssGrad = `conic-gradient(from ${config.angle}deg at 50% 50%, ${stopsStr})`;
    }

    centerStage.style.background = cssGrad;

    const css = `/* Huragon/ui — ${config.type.charAt(0).toUpperCase() + config.type.slice(1)} Gradient */
.custom-gradient {
  background: ${cssGrad};
}`;

    const tailwind = `<div class="bg-[${cssGrad.replace(/\s+/g, '_')}]">
  <!-- Content -->
</div>`;

    onCodeChange({ css, tailwind });
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const secType = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', textContent: 'Gradient Type' }),
      el('div', { style: { display: 'flex', gap: '6px' } }, [
        'linear', 'radial', 'conic'
      ].map(t => el('button', {
        className: `btn ${config.type === t ? 'btn-primary' : 'btn-outline'}`,
        style: { flex: '1', fontSize: '0.75rem', textTransform: 'capitalize' },
        textContent: t,
        onclick: () => {
          config.type = t;
          renderControls();
          applyGradient();
        }
      })))
    ]);
    controlsStage.appendChild(secType);

    if (config.type !== 'radial') {
      const secAngle = el('div', { className: 'controls-section' }, [
        el('div', { className: 'control-group' }, [
          el('div', { className: 'control-label-row' }, [
            el('span', { className: 'control-label', textContent: 'Angle' }),
            el('span', { className: 'control-value', id: 'angle-val', textContent: `${config.angle}deg` })
          ]),
          el('input', {
            type: 'range',
            min: 0,
            max: 360,
            value: config.angle,
            oninput: (e) => {
              config.angle = parseInt(e.target.value, 10);
              qs('#angle-val').textContent = `${config.angle}deg`;
              applyGradient();
            }
          })
        ])
      ]);
      controlsStage.appendChild(secAngle);
    }

    const secStops = el('div', { className: 'controls-section' }, [
      el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' } }, [
        el('div', { className: 'section-title', style: { marginBottom: 0 }, textContent: 'Color Stops' }),
        config.stops.length < 5 ? el('button', {
          className: 'btn btn-outline',
          style: { padding: '3px 8px', fontSize: '0.7rem' },
          innerHTML: `${ICONS.plus} <span>Add</span>`,
          onclick: () => {
            config.stops.push({ color: randomHex(), pos: 75 });
            renderControls();
            applyGradient();
          }
        }) : null
      ])
    ]);

    config.stops.forEach((st, idx) => {
      const row = el('div', {
        className: 'glass-card',
        style: { padding: '10px', marginBottom: '8px' }
      }, [
        el('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' } }, [
          el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
            el('input', {
              type: 'color',
              value: st.color,
              oninput: (e) => {
                st.color = e.target.value;
                applyGradient();
              }
            }),
            el('span', { style: { fontSize: '0.75rem', fontFamily: 'monospace' }, textContent: st.color })
          ]),
          config.stops.length > 2 ? el('button', {
            className: 'btn btn-ghost btn-icon',
            innerHTML: ICONS.close,
            onclick: () => {
              config.stops.splice(idx, 1);
              renderControls();
              applyGradient();
            }
          }) : null
        ]),
        el('div', { className: 'control-group', style: { marginBottom: 0 } }, [
          el('div', { className: 'control-label-row' }, [
            el('span', { className: 'control-label', textContent: 'Position' }),
            el('span', { className: 'control-value', textContent: `${st.pos}%` })
          ]),
          el('input', {
            type: 'range',
            min: 0,
            max: 100,
            value: st.pos,
            oninput: (e) => {
              st.pos = parseInt(e.target.value, 10);
              renderControls();
              applyGradient();
            }
          })
        ])
      ]);
      secStops.appendChild(row);
    });

    controlsStage.appendChild(secStops);
  }

  renderControls();
  applyGradient();
}
