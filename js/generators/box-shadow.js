// Tool 3: Box Shadow Layers Generator
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';

export const meta = {
  id: 'box-shadow',
  name: 'Box Shadow Layers'
};

const defaultLayers = [
  { x: 0, y: 1, blur: 2, spread: 0, color: '#000000', opacity: 0.12, inset: false },
  { x: 0, y: 4, blur: 8, spread: -2, color: '#000000', opacity: 0.2, inset: false },
  { x: 0, y: 12, blur: 24, spread: -4, color: '#000000', opacity: 0.25, inset: false }
];

let layers = JSON.parse(JSON.stringify(defaultLayers));
let cardBg = '#18181b';
let cardRadius = 12;

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
    id: 'shadow-target-card',
    style: {
      width: '300px',
      height: '200px',
      background: cardBg,
      borderRadius: `${cardRadius}px`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid var(--border)',
      transition: 'all 0.15s ease',
      color: '#fff',
      padding: '24px',
      textAlign: 'center'
    },
    innerHTML: `
      <div style="font-size:0.95rem; font-weight:600; margin-bottom:6px;">Multi-Layer Elevation</div>
      <p style="margin:0; font-size:0.775rem; color:var(--text-muted); line-height:1.5;">Stacked shadow diffusion simulates ambient occlusion and natural lighting.</p>
    `
  });

  centerStage.appendChild(card);
  previewStage.appendChild(centerStage);

  function applyShadow() {
    const shadowString = layers.map(l => {
      const hex = l.color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16) || 0;
      const g = parseInt(hex.substring(2, 4), 16) || 0;
      const b = parseInt(hex.substring(4, 6), 16) || 0;
      const insetStr = l.inset ? 'inset ' : '';
      return `${insetStr}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px rgba(${r}, ${g}, ${b}, ${l.opacity})`;
    }).join(',\n    ');

    card.style.boxShadow = shadowString;
    card.style.background = cardBg;
    card.style.borderRadius = `${cardRadius}px`;

    const css = `/* Huragon/ui — Box Shadow Layers */
.shadow-elevation {
  box-shadow:
    ${shadowString};
  border-radius: ${cardRadius}px;
  background-color: ${cardBg};
}`;

    onCodeChange({ css });
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const secTop = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', textContent: 'Shadow Stack' }),
      el('div', { style: { display: 'flex', gap: '8px' } }, [
        el('button', {
          className: 'btn btn-primary',
          style: { flex: '1' },
          innerHTML: `${ICONS.plus} <span>Add Layer</span>`,
          disabled: layers.length >= 6,
          onclick: () => {
            if (layers.length < 6) {
              layers.push({ x: 0, y: 10, blur: 18, spread: -2, color: '#000000', opacity: 0.2, inset: false });
              renderControls();
              applyShadow();
            }
          }
        }),
        el('button', {
          className: 'btn btn-outline',
          style: { flex: '1' },
          innerHTML: `${ICONS.refresh} <span>Reset</span>`,
          onclick: () => {
            layers = JSON.parse(JSON.stringify(defaultLayers));
            renderControls();
            applyShadow();
          }
        })
      ])
    ]);
    controlsStage.appendChild(secTop);

    layers.forEach((l, idx) => {
      const layerBox = el('div', {
        className: 'glass-card',
        style: { padding: '12px', marginBottom: '10px' }
      }, [
        el('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' } }, [
          el('span', { style: { fontWeight: '600', fontSize: '0.8rem', color: 'var(--text-main)' }, textContent: `Layer ${idx + 1}` }),
          el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
            el('label', { style: { fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: 'var(--text-muted)' } }, [
              el('input', {
                type: 'checkbox',
                checked: l.inset,
                onchange: (e) => {
                  l.inset = e.target.checked;
                  applyShadow();
                }
              }),
              'Inset'
            ]),
            layers.length > 1 ? el('button', {
              className: 'btn btn-ghost btn-icon',
              innerHTML: ICONS.close,
              title: 'Remove layer',
              onclick: () => {
                layers.splice(idx, 1);
                renderControls();
                applyShadow();
              }
            }) : null
          ])
        ]),

        renderSlider('X Offset', l.x, -50, 50, (val) => { l.x = val; applyShadow(); }, 'px'),
        renderSlider('Y Offset', l.y, -50, 50, (val) => { l.y = val; applyShadow(); }, 'px'),
        renderSlider('Blur', l.blur, 0, 80, (val) => { l.blur = val; applyShadow(); }, 'px'),
        renderSlider('Spread', l.spread, -30, 40, (val) => { l.spread = val; applyShadow(); }, 'px'),
        renderSlider('Opacity', l.opacity, 0, 1, (val) => { l.opacity = val; applyShadow(); }, '', 0.05)
      ]);
      controlsStage.appendChild(layerBox);
    });
  }

  function renderSlider(label, currentVal, min, max, onChange, unit = '', step = 1) {
    const valSpan = el('span', { className: 'control-value', textContent: `${currentVal}${unit}` });
    return el('div', { className: 'control-group', style: { marginBottom: '8px' } }, [
      el('div', { className: 'control-label-row' }, [
        el('span', { className: 'control-label', style: { fontSize: '0.72rem' }, textContent: label }),
        valSpan
      ]),
      el('input', {
        type: 'range',
        min,
        max,
        step,
        value: currentVal,
        oninput: (e) => {
          const v = parseFloat(e.target.value);
          valSpan.textContent = `${v}${unit}`;
          onChange(v);
        }
      })
    ]);
  }

  renderControls();
  applyShadow();
}
