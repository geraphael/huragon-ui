// Tool 2: Glassmorphism UI Generator
import { el, qs } from '../utils/dom.js';

export const meta = {
  id: 'glassmorphism',
  name: 'Glassmorphism',
  icon: '🪟'
};

let config = {
  blur: 16,
  opacity: 0.15,
  saturation: 140,
  borderOpacity: 0.25,
  borderRadius: 20,
  shadowBlur: 24,
  shadowOpacity: 0.35,
  glassColor: '#ffffff',
  borderColor: '#ffffff',
  cardType: 'profile' // profile, stat, credit
};

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  // Preview stage background: vibrant mesh backdrop so glass stands out
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
      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 40%, #ec4899 80%, #06b6d4 100%)',
      padding: '24px'
    }
  });

  // Background floating geometric shapes to showcase the blur effect
  const shape1 = el('div', {
    style: {
      position: 'absolute',
      width: '180px',
      height: '180px',
      borderRadius: '50%',
      background: '#ec4899',
      top: '15%',
      left: '20%',
      filter: 'blur(10px)',
      opacity: '0.8'
    }
  });
  const shape2 = el('div', {
    style: {
      position: 'absolute',
      width: '220px',
      height: '220px',
      borderRadius: '50%',
      background: '#06b6d4',
      bottom: '15%',
      right: '20%',
      filter: 'blur(10px)',
      opacity: '0.85'
    }
  });
  backdrop.appendChild(shape1);
  backdrop.appendChild(shape2);

  // The actual Glassmorphism Card
  const glassCard = el('div', {
    id: 'interactive-glass-card',
    style: {
      width: '340px',
      maxWidth: '100%',
      padding: '28px',
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
    glassCard.style.boxShadow = `0 12px ${config.shadowBlur}px 0 rgba(0, 0, 0, ${config.shadowOpacity})`;

    updateCode(r, g, b, br, bg, bb);
  }

  function renderCardContent(target) {
    target.innerHTML = `
      <div style="display:flex; align-items:center; gap:16px; margin-bottom:20px;">
        <div style="width:54px; height:54px; border-radius:50%; background:linear-gradient(135deg, #f43f5e, #fbbf24); display:flex; align-items:center; justify-content:center; font-size:1.4rem; box-shadow:0 4px 12px rgba(0,0,0,0.25);">✨</div>
        <div>
          <h4 style="margin:0; font-size:1.15rem; font-weight:700;">Huragon Card</h4>
          <p style="margin:0; font-size:0.8rem; opacity:0.8;">@huragon_ui · Verified</p>
        </div>
      </div>
      <p style="font-size:0.9rem; line-height:1.5; margin-bottom:20px; opacity:0.95;">
        Frosted glass creates visual depth and elegance. Designed for high-end web applications and modern operating systems.
      </p>
      <div style="display:flex; gap:10px;">
        <button style="flex:1; padding:10px; border-radius:10px; background:rgba(255,255,255,0.2); border:1px solid rgba(255,255,255,0.3); color:#fff; font-weight:600; font-size:0.85rem; cursor:pointer;">Explore</button>
        <button style="flex:1; padding:10px; border-radius:10px; background:#fff; color:#0f172a; border:none; font-weight:600; font-size:0.85rem; cursor:pointer;">Follow</button>
      </div>
    `;
  }

  function updateCode(r, g, b, br, bg, bb) {
    const css = `/* Huragon/ui — Glassmorphism */
.glass-container {
  background: rgba(${r}, ${g}, ${b}, ${config.opacity});
  backdrop-filter: blur(${config.blur}px) saturate(${config.saturation}%);
  -webkit-backdrop-filter: blur(${config.blur}px) saturate(${config.saturation}%);
  border: 1px solid rgba(${br}, ${bg}, ${bb}, ${config.borderOpacity});
  border-radius: ${config.borderRadius}px;
  box-shadow: 0 12px ${config.shadowBlur}px 0 rgba(0, 0, 0, ${config.shadowOpacity});
}`;

    const tailwind = `/* Tailwind CSS */
<div class="backdrop-blur-[${config.blur}px] backdrop-saturate-[${config.saturation}%] bg-white/[${config.opacity}] border border-white/[${config.borderOpacity}] rounded-[${config.borderRadius}px] shadow-[0_12px_${config.shadowBlur}px_rgba(0,0,0,${config.shadowOpacity})]">
  <!-- Content -->
</div>`;

    onCodeChange({ css, tailwind });
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const controlsData = [
      { key: 'blur', label: 'Blur Intensity', min: 0, max: 40, unit: 'px' },
      { key: 'opacity', label: 'Background Opacity', min: 0, max: 1, step: 0.02, unit: '' },
      { key: 'saturation', label: 'Saturation Boost', min: 100, max: 200, unit: '%' },
      { key: 'borderOpacity', label: 'Border Opacity', min: 0, max: 1, step: 0.05, unit: '' },
      { key: 'borderRadius', label: 'Border Radius', min: 0, max: 48, unit: 'px' },
      { key: 'shadowBlur', label: 'Shadow Depth', min: 0, max: 60, unit: 'px' },
      { key: 'shadowOpacity', label: 'Shadow Opacity', min: 0, max: 1, step: 0.05, unit: '' }
    ];

    const secSliders = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', innerHTML: '<span>🎚️</span> Glass Properties' })
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

    // Color controls
    const secColors = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', innerHTML: '<span>🎨</span> Color & Tone' }),
      el('div', { className: 'control-group' }, [
        el('div', { className: 'control-label-row' }, [
          el('span', { className: 'control-label', textContent: 'Glass Color Tint' }),
          el('span', { className: 'control-value', textContent: config.glassColor })
        ]),
        el('div', { className: 'color-picker-wrapper' }, [
          el('input', {
            type: 'color',
            value: config.glassColor,
            oninput: (e) => {
              config.glassColor = e.target.value;
              applyGlassStyles();
            }
          }),
          el('span', { className: 'color-hex-text', textContent: config.glassColor })
        ])
      ])
    ]);

    controlsStage.appendChild(secSliders);
    controlsStage.appendChild(secColors);
  }

  renderControls();
  applyGlassStyles();
}
