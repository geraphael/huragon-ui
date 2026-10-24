// Tool: Aspect Ratio Calculator & Container Styler
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';

export const meta = {
  id: 'aspect-ratio',
  name: 'Aspect Ratio Calculator'
};

let config = {
  ratioW: 16,
  ratioH: 9,
  objectFit: 'cover',
  borderRadius: 10,
  preset: '16:9'
};

const PRESETS = [
  { label: '16:9 (Widescreen)', w: 16, h: 9, id: '16:9' },
  { label: '4:3 (Standard)', w: 4, h: 3, id: '4:3' },
  { label: '1:1 (Square)', w: 1, h: 1, id: '1:1' },
  { label: '9:16 (Vertical Story)', w: 9, h: 16, id: '9:16' },
  { label: '21:9 (Ultrawide)', w: 21, h: 9, id: '21:9' },
  { label: '3:2 (Photography)', w: 3, h: 2, id: '3:2' }
];

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    id: 'aspect-preview-container',
    style: {
      width: '100%',
      maxWidth: '560px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px'
    }
  });

  previewStage.appendChild(centerStage);

  // Controls
  controlsStage.innerHTML = '';

  const section = el('div', { className: 'control-section' }, [
    el('div', { className: 'control-section-header' }, [
      el('h4', { className: 'control-section-title', textContent: 'Ratio Presets' })
    ]),
    el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '16px' } },
      PRESETS.map(p => el('button', {
        className: `btn btn-outline ${config.preset === p.id ? 'active' : ''}`,
        style: { fontSize: '0.75rem', padding: '6px 8px' },
        textContent: p.label,
        onclick: (e) => {
          config.preset = p.id;
          config.ratioW = p.w;
          config.ratioH = p.h;
          controlsStage.querySelectorAll('.btn-outline').forEach(b => b.classList.remove('active'));
          e.currentTarget.classList.add('active');
          update();
        }
      }))
    ),

    el('div', { className: 'control-section-header' }, [
      el('h4', { className: 'control-section-title', textContent: 'Custom Dimensions' })
    ]),
    createSlider('Ratio Width (X)', 1, 32, 1, config.ratioW, '', (v) => {
      config.ratioW = v;
      config.preset = 'custom';
      update();
    }),
    createSlider('Ratio Height (Y)', 1, 32, 1, config.ratioH, '', (v) => {
      config.ratioH = v;
      config.preset = 'custom';
      update();
    }),
    createSlider('Border Radius', 0, 24, 2, config.borderRadius, 'px', (v) => {
      config.borderRadius = v;
      update();
    })
  ]);

  controlsStage.appendChild(section);

  function update() {
    renderBox(centerStage);
    generateCode();
  }

  function renderBox(target) {
    const paddingPercent = ((config.ratioH / config.ratioW) * 100).toFixed(2);
    const isVertical = config.ratioH > config.ratioW;
    const maxBoxWidth = isVertical ? '240px' : '100%';

    target.innerHTML = `
      <div style="width:100%; max-width:${maxBoxWidth}; aspect-ratio:${config.ratioW} / ${config.ratioH}; background:var(--bg-card); border:1px solid var(--border); border-radius:${config.borderRadius}px; overflow:hidden; position:relative; display:flex; align-items:center; justify-content:center; box-shadow:var(--shadow-md);">
        <!-- Backdrop Graphic -->
        <div style="position:absolute; inset:0; background:linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%);"></div>
        
        <!-- Center Info -->
        <div style="position:relative; z-index:2; text-align:center; padding:16px;">
          <div style="font-size:1.6rem; font-weight:700; color:var(--text-main); font-family:var(--font-mono); letter-spacing:-0.03em;">
            ${config.ratioW}:${config.ratioH}
          </div>
          <div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px; font-family:var(--font-mono);">
            padding-top: ${paddingPercent}%
          </div>
        </div>

        <!-- Corner Aspect Tag -->
        <div style="position:absolute; top:10px; right:10px; font-size:0.65rem; font-family:var(--font-mono); color:var(--text-dim); background:var(--bg-main); padding:2px 6px; border-radius:4px; border:1px solid var(--border);">
          aspect-ratio
        </div>
      </div>
    `;
  }

  function generateCode() {
    const paddingPercent = ((config.ratioH / config.ratioW) * 100).toFixed(2);

    const css = `/* Modern CSS aspect-ratio */
.media-container {
  aspect-ratio: ${config.ratioW} / ${config.ratioH};
  width: 100%;
  border-radius: ${config.borderRadius}px;
  overflow: hidden;
}

/* Fallback for legacy browsers (Padding-top hack) */
.media-container-fallback {
  position: relative;
  width: 100%;
  padding-top: ${paddingPercent}%; /* (${config.ratioH} / ${config.ratioW}) * 100% */
}

.media-container-fallback > * {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: ${config.objectFit};
}`;

    let twClass = `aspect-[${config.ratioW}/${config.ratioH}]`;
    if (config.ratioW === 16 && config.ratioH === 9) twClass = 'aspect-video';
    if (config.ratioW === 1 && config.ratioH === 1) twClass = 'aspect-square';

    const tailwind = `<!-- Tailwind Aspect Ratio -->
<div class="${twClass} w-full overflow-hidden rounded-[${config.borderRadius}px] bg-zinc-900 border border-zinc-800">
  <img src="poster.jpg" alt="Media" class="w-full h-full object-${config.objectFit}" />
</div>`;

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
