// Tool 2: Glassmorphism UI Generator
import { el, qs } from '../utils/dom.js';

export const meta = {
  id: 'glassmorphism',
  name: 'Glassmorphism'
};

let config = {
  blur: 16,
  opacity: 0.12,
  saturation: 130,
  borderOpacity: 0.18,
  borderRadius: 16,
  shadowBlur: 24,
  shadowOpacity: 0.35,
  glassColor: '#ffffff',
  borderColor: '#ffffff'
};

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';
  
  const backdrop = el('div', {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-md)',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #3f3f46 100%)',
      padding: '24px'
    }
  });

  // Soft subtle geometric spheres
  const shape1 = el('div', {
    style: {
      position: 'absolute',
      width: '200px',
      height: '200px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #52525b, #71717a)',
      top: '20%',
      left: '20%',
      opacity: '0.6',
      filter: 'blur(30px)'
    }
  });
  const shape2 = el('div', {
    style: {
      position: 'absolute',
      width: '240px',
      height: '240px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #3f3f46, #27272a)',
      bottom: '15%',
      right: '20%',
      opacity: '0.8',
      filter: 'blur(40px)'
    }
  });
  backdrop.appendChild(shape1);
  backdrop.appendChild(shape2);

  const glassCard = el('div', {
    id: 'interactive-glass-card',
    style: {
      width: '320px',
      maxWidth: '100%',
      padding: '24px',
      position: 'relative',
      zIndex: '5',
      color: '#ffffff'
    }
  });

  renderCardContent(glassCard);
  backdrop.appendChild(glassCard);
  previewStage.appendChild(backdrop);

  function applyGlassStyles() {
    const hex = config.glassColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) || 255;
    const g = parseInt(hex.substring(2, 4), 16) || 255;
    const b = parseInt(hex.substring(4, 6), 16) || 255;

    const bHex = config.borderColor.replace('#', '');
    const br = parseInt(bHex.substring(0, 2), 16) || 255;
    const bg = parseInt(bHex.substring(2, 4), 16) || 255;
    const bb = parseInt(bHex.substring(4, 6), 16) || 255;

    glassCard.style.background = `rgba(${r}, ${g}, ${b}, ${config.opacity})`;
    glassCard.style.backdropFilter = `blur(${config.blur}px) saturate(${config.saturation}%)`;
    glassCard.style.webkitBackdropFilter = `blur(${config.blur}px) saturate(${config.saturation}%)`;
    glassCard.style.border = `1px solid rgba(${br}, ${bg}, ${bb}, ${config.borderOpacity})`;
    glassCard.style.borderRadius = `${config.borderRadius}px`;
    glassCard.style.boxShadow = `0 8px ${config.shadowBlur}px 0 rgba(0, 0, 0, ${config.shadowOpacity})`;

    updateCode(r, g, b, br, bg, bb);
  }

  function renderCardContent(target) {
    target.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
        <div>
          <h4 style="margin:0; font-size:1.05rem; font-weight:600; color:#fff;">Glass Surface</h4>
          <p style="margin:0; font-size:0.75rem; color:#a1a1aa;">Component Preview</p>
        </div>
        <span style="font-size:0.7rem; padding:2px 8px; border-radius:999px; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.15); color:#fff;">Active</span>
      </div>
      <p style="font-size:0.825rem; line-height:1.5; margin-bottom:20px; color:#d4d4d8;">
        Subtle blur and specular lighting yield refined optical elevation without visual clutter.
      </p>
      <div style="display:flex; gap:8px;">
        <button style="flex:1; padding:8px 12px; border-radius:8px; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.15); color:#fff; font-weight:500; font-size:0.8rem; cursor:pointer;">Cancel</button>
        <button style="flex:1; padding:8px 12px; border-radius:8px; background:#fff; color:#09090b; border:none; font-weight:500; font-size:0.8rem; cursor:pointer;">Confirm</button>
      </div>
    `;
  }

  function updateCode(r, g, b, br, bg, bb) {
    const css = `/* Huragon/ui — Glassmorphism */
.glass-surface {
  background: rgba(${r}, ${g}, ${b}, ${config.opacity});
  backdrop-filter: blur(${config.blur}px) saturate(${config.saturation}%);
  -webkit-backdrop-filter: blur(${config.blur}px) saturate(${config.saturation}%);
  border: 1px solid rgba(${br}, ${bg}, ${bb}, ${config.borderOpacity});
  border-radius: ${config.borderRadius}px;
  box-shadow: 0 8px ${config.shadowBlur}px 0 rgba(0, 0, 0, ${config.shadowOpacity});
}`;

    const tailwind = `<div class="backdrop-blur-[${config.blur}px] bg-white/[${config.opacity}] border border-white/[${config.borderOpacity}] rounded-[${config.borderRadius}px] shadow-lg">
  <!-- Content -->
</div>`;

    onCodeChange({ css, tailwind });
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const controlsData = [
      { key: 'blur', label: 'Blur', min: 0, max: 40, unit: 'px' },
      { key: 'opacity', label: 'Surface Opacity', min: 0, max: 1, step: 0.02, unit: '' },
      { key: 'saturation', label: 'Saturation', min: 100, max: 200, unit: '%' },
      { key: 'borderOpacity', label: 'Border Opacity', min: 0, max: 1, step: 0.02, unit: '' },
      { key: 'borderRadius', label: 'Radius', min: 0, max: 40, unit: 'px' },
      { key: 'shadowBlur', label: 'Shadow Blur', min: 0, max: 60, unit: 'px' },
      { key: 'shadowOpacity', label: 'Shadow Opacity', min: 0, max: 1, step: 0.05, unit: '' }
    ];

    const secSliders = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', textContent: 'Glass Parameters' })
    ]);

    controlsData.forEach(item => {
      const row = el('div', { className: 'control-group' }, [
        el('div', { className: 'control-label-row' }, [
          el('span', { className: 'control-label', textContent: item.label }),
          el('span', { className: 'control-value', id: `val-${item.key}`, textContent: `${config[item.key]}${item.unit}` })
        ]),
        el('input', {
          type: 'range',
          min: item.min,
          max: item.max,
          step: item.step || 1,
          value: config[item.key],
          oninput: (e) => {
            config[item.key] = parseFloat(e.target.value);
            qs(`#val-${item.key}`).textContent = `${config[item.key]}${item.unit}`;
            applyGlassStyles();
          }
        })
      ]);
      secSliders.appendChild(row);
    });

    controlsStage.appendChild(secSliders);
  }

  renderControls();
  applyGlassStyles();
}
