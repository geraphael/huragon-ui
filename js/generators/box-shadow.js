// Tool 3: Box Shadow Layers Generator
import { el, qs } from '../utils/dom.js';

export const meta = {
  id: 'box-shadow',
  name: 'Box Shadow Layers',
  icon: '🟦'
};

const defaultLayers = [
  { x: 0, y: 4, blur: 6, spread: -1, color: '#000000', opacity: 0.1, inset: false },
  { x: 0, y: 10, blur: 15, spread: -3, color: '#000000', opacity: 0.15, inset: false },
  { x: 0, y: 20, blur: 25, spread: -5, color: '#8b5cf6', opacity: 0.2, inset: false }
];

let layers = JSON.parse(JSON.stringify(defaultLayers));
let cardBg = '#16162a';
let cardRadius = 18;

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
      width: '320px',
      height: '240px',
      background: cardBg,
      borderRadius: `${cardRadius}px`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid var(--border)',
      transition: 'all 0.15s ease',
      color: '#fff',
      padding: '20px',
      textAlign: 'center'
    },
    innerHTML: `
      <div style="width:48px; height:48px; border-radius:14px; background:linear-gradient(135deg, var(--accent), var(--secondary)); display:flex; align-items:center; justify-content:center; font-size:1.4rem; margin-bottom:12px;">🟦</div>
      <h3 style="margin:0 0 6px 0; font-size:1.1rem; font-weight:700;">Multi-Layer Depth</h3>
      <p style="margin:0; font-size:0.8rem; color:var(--text-muted);">Stacked shadows yield realistic, smooth optical elevation without hard pixel boundaries.</p>
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
      el('div', { className: 'section-title', innerHTML: '<span>⚙️</span> Card & Shadow Stack' }),
      el('div', { style: { display: 'flex', gap: '8px' } }, [
        el('button', {
          className: 'btn btn-primary',
          innerHTML: '➕ Add Layer',
          disabled: layers.length >= 8,
          onclick: () => {
            if (layers.length < 8) {
              layers.push({ x: 0, y: 15, blur: 20, spread: 0, color: '#8b5cf6', opacity: 0.25, inset: false });
              renderControls();
              applyShadow();
            }
          }
        }),
        el('button', {
          className: 'btn btn-outline',
          innerHTML: '🔄 Reset',
          onclick: () => {
            layers = JSON.parse(JSON.stringify(defaultLayers));
            renderControls();
            applyShadow();
          }
        })
      ])
    ]);
    controlsStage.appendChild(secTop);

    // Render layers
    layers.forEach((l, idx) => {
      const layerBox = el('div', {
        className: 'glass-card',
        style: { padding: '14px', marginBottom: '14px' }
      }, [
        el('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' } }, [
          el('span', { style: { fontWeight: '700', fontSize: '0.85rem' }, textContent: `Layer #${idx + 1}` }),
          el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
            el('label', { style: { fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' } }, [
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
              innerHTML: '✕',
              onclick: () => {
                layers.splice(idx, 1);
                renderControls();
                applyShadow();
              }
            }) : null
          ])
        ]),

        // Sliders X & Y
        renderSlider('X Offset', l.x, -50, 50, (val) => { l.x = val; applyShadow(); }, 'px'),
        renderSlider('Y Offset', l.y, -50, 50, (val) => { l.y = val; applyShadow(); }, 'px'),
        renderSlider('Blur', l.blur, 0, 100, (val) => { l.blur = val; applyShadow(); }, 'px'),
        renderSlider('Spread', l.spread, -30, 50, (val) => { l.spread = val; applyShadow(); }, 'px'),
        renderSlider('Opacity', l.opacity, 0, 1, (val) => { l.opacity = val; applyShadow(); }, '', 0.05)
      ]);
      controlsStage.appendChild(layerBox);
    });
  }

  function renderSlider(label, currentVal, min, max, onChange, unit = '', step = 1) {
    const valSpan = el('span', { className: 'control-value', textContent: `${currentVal}${unit}` });
    return el('div', { className: 'control-group', style: { marginBottom: '8px' } }, [
      el('div', { className: 'control-label-row' }, [
        el('span', { className: 'control-label', style: { fontSize: '0.75rem' }, textContent: label }),
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
