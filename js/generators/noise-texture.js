// Tool: SVG Noise & Film Grain Generator
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';

export const meta = {
  id: 'noise-texture',
  name: 'SVG Noise & Grain'
};

let config = {
  baseFrequency: 0.65,
  numOctaves: 3,
  noiseType: 'fractalNoise', // 'fractalNoise', 'turbulence'
  opacity: 0.25,
  blendMode: 'overlay',
  bgColor: '#18181b'
};

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    id: 'noise-preview-container',
    style: {
      width: '100%',
      maxWidth: '560px',
      height: '360px',
      position: 'relative',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-md)',
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
      el('h4', { className: 'control-section-title', textContent: 'Noise Algorithm' })
    ]),
    el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' } }, [
      createTypeBtn('Fractal Noise (Film Grain)', 'fractalNoise'),
      createTypeBtn('Turbulence (Clouds)', 'turbulence')
    ]),

    el('div', { className: 'control-section-header' }, [
      el('h4', { className: 'control-section-title', textContent: 'Parameters' })
    ]),
    createSlider('Grain Frequency', 0.1, 1.5, 0.05, config.baseFrequency, '', (v) => {
      config.baseFrequency = v;
      update();
    }),
    createSlider('Octaves (Detail)', 1, 5, 1, config.numOctaves, '', (v) => {
      config.numOctaves = v;
      update();
    }),
    createSlider('Grain Opacity', 0.05, 0.8, 0.05, config.opacity, '', (v) => {
      config.opacity = v;
      update();
    }),

    el('div', { className: 'control-section-header', style: { marginTop: '16px' } }, [
      el('h4', { className: 'control-section-title', textContent: 'Base Surface' })
    ]),
    createColorControl('Surface Color', config.bgColor, (v) => {
      config.bgColor = v;
      update();
    }),

    el('div', { style: { marginTop: '20px' } }, [
      el('button', {
        className: 'btn btn-outline',
        style: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' },
        innerHTML: `${ICONS.refresh} Reset Defaults`,
        onclick: () => {
          config = {
            baseFrequency: 0.65,
            numOctaves: 3,
            noiseType: 'fractalNoise',
            opacity: 0.25,
            blendMode: 'overlay',
            bgColor: '#18181b'
          };
          mount(container, onCodeChange);
        }
      })
    ])
  ]);

  controlsStage.appendChild(section);

  function createTypeBtn(label, t) {
    return el('button', {
      className: `btn btn-outline ${config.noiseType === t ? 'active' : ''}`,
      style: { fontSize: '0.75rem', padding: '6px 8px' },
      textContent: label,
      onclick: (e) => {
        config.noiseType = t;
        controlsStage.querySelectorAll('.btn-outline').forEach(b => {
          if (b.textContent.includes('Noise') || b.textContent.includes('Turbulence')) {
            b.classList.remove('active');
          }
        });
        e.currentTarget.classList.add('active');
        update();
      }
    });
  }

  function update() {
    renderNoise(centerStage);
    generateCode();
  }

  function renderNoise(target) {
    const svgNoise = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="${config.noiseType}" baseFrequency="${config.baseFrequency}" numOctaves="${config.numOctaves}" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#noiseFilter)" opacity="${config.opacity}"/></svg>`;
    const dataUri = `data:image/svg+xml,${encodeURIComponent(svgNoise)}`;

    target.style.backgroundColor = config.bgColor;
    target.innerHTML = `
      <div style="position:absolute; inset:0; background-image:url('${dataUri}'); mix-blend-mode:${config.blendMode}; pointer-events:none;"></div>
      <div style="position:relative; z-index:2; text-align:center; padding:24px; background:rgba(9, 9, 11, 0.7); backdrop-filter:blur(8px); border:1px solid rgba(255, 255, 255, 0.1); border-radius:var(--radius-md); max-width:320px;">
        <span style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-muted); font-weight:600;">Subtle Film Grain</span>
        <h3 style="font-size:1.1rem; font-weight:600; color:#ffffff; margin:6px 0;">Tactile Texture</h3>
        <p style="font-size:0.8rem; color:var(--text-muted); line-height:1.5;">Pure procedural SVG feTurbulence overlay without external image assets.</p>
      </div>
    `;
  }

  function generateCode() {
    const svgNoise = `<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='noise'><feTurbulence type='${config.noiseType}' baseFrequency='${config.baseFrequency}' numOctaves='${config.numOctaves}' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#noise)' opacity='${config.opacity}'/></svg>`;
    const encoded = encodeURIComponent(svgNoise);

    const css = `/* Procedural SVG Noise Texture */
.grain-overlay {
  background-color: ${config.bgColor};
  position: relative;
}

.grain-overlay::before {
  content: "";
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,${encoded}");
  mix-blend-mode: ${config.blendMode};
  pointer-events: none;
}`;

    const tailwind = `<!-- Tailwind Grain Surface -->
<div class="relative bg-zinc-900 overflow-hidden">
  <div class="absolute inset-0 pointer-events-none opacity-[${config.opacity}] [background-image:url('data:image/svg+xml,...')] mix-blend-overlay"></div>
  <div class="relative z-10 p-8 text-white">Content with tactile texture</div>
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
