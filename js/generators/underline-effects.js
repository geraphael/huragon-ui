// Tool: Animated Link Underlines & Sweeps
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';

export const meta = {
  id: 'underline-effects',
  name: 'Animated Underlines'
};

let config = {
  effect: 'left-to-right', // 'left-to-right', 'center-out', 'marker-sweep', 'gradient-line'
  thickness: 2,
  duration: 0.25,
  color: '#ffffff',
  offset: 3
};

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    id: 'underline-preview-container',
    style: {
      width: '100%',
      maxWidth: '560px',
      padding: '36px',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-md)'
    }
  });

  previewStage.appendChild(centerStage);

  // Controls
  controlsStage.innerHTML = '';

  const section = el('div', { className: 'control-section' }, [
    el('div', { className: 'control-section-header' }, [
      el('h4', { className: 'control-section-title', textContent: 'Underline Motion' })
    ]),
    el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '16px' } }, [
      createEffectBtn('Left to Right', 'left-to-right'),
      createEffectBtn('Center Outward', 'center-out'),
      createEffectBtn('Marker Sweep', 'marker-sweep'),
      createEffectBtn('Gradient Sweep', 'gradient-line')
    ]),

    el('div', { className: 'control-section-header' }, [
      el('h4', { className: 'control-section-title', textContent: 'Style & Timing' })
    ]),
    createSlider('Line Thickness', 1, 6, 1, config.thickness, 'px', (v) => {
      config.thickness = v;
      update();
    }),
    createSlider('Baseline Offset', 0, 10, 1, config.offset, 'px', (v) => {
      config.offset = v;
      update();
    }),
    createSlider('Animation Speed', 0.1, 0.6, 0.05, config.duration, 's', (v) => {
      config.duration = v;
      update();
    }),
    createColorControl('Accent Color', config.color, (v) => {
      config.color = v;
      update();
    })
  ]);

  controlsStage.appendChild(section);

  function createEffectBtn(label, eff) {
    return el('button', {
      className: `btn btn-outline ${config.effect === eff ? 'active' : ''}`,
      style: { fontSize: '0.75rem', padding: '6px 8px' },
      textContent: label,
      onclick: (e) => {
        config.effect = eff;
        controlsStage.querySelectorAll('.btn-outline').forEach(b => {
          if (['Left to Right', 'Center Outward', 'Marker Sweep', 'Gradient Sweep'].includes(b.textContent.trim())) {
            b.classList.remove('active');
          }
        });
        e.currentTarget.classList.add('active');
        update();
      }
    });
  }

  function update() {
    renderPreview(centerStage);
    generateCode();
  }

  function renderPreview(target) {
    let linkStyle = '';

    if (config.effect === 'left-to-right') {
      linkStyle = `
        .huragon-animated-link {
          position: relative;
          text-decoration: none;
          color: var(--text-main);
          font-weight: 500;
          cursor: pointer;
        }
        .huragon-animated-link::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -${config.offset}px;
          width: 0;
          height: ${config.thickness}px;
          background: ${config.color};
          transition: width ${config.duration}s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .huragon-animated-link:hover::after {
          width: 100%;
        }
      `;
    } else if (config.effect === 'center-out') {
      linkStyle = `
        .huragon-animated-link {
          position: relative;
          text-decoration: none;
          color: var(--text-main);
          font-weight: 500;
          cursor: pointer;
        }
        .huragon-animated-link::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -${config.offset}px;
          width: 100%;
          height: ${config.thickness}px;
          background: ${config.color};
          transform: scaleX(0);
          transform-origin: center;
          transition: transform ${config.duration}s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .huragon-animated-link:hover::after {
          transform: scaleX(1);
        }
      `;
    } else if (config.effect === 'marker-sweep') {
      linkStyle = `
        .huragon-animated-link {
          background-image: linear-gradient(${config.color}33, ${config.color}33);
          background-size: 0% 100%;
          background-repeat: no-repeat;
          text-decoration: none;
          color: var(--text-main);
          font-weight: 500;
          cursor: pointer;
          padding: 2px 4px;
          border-radius: 3px;
          transition: background-size ${config.duration}s ease-in-out;
        }
        .huragon-animated-link:hover {
          background-size: 100% 100%;
        }
      `;
    } else {
      // Gradient line
      linkStyle = `
        .huragon-animated-link {
          background-image: linear-gradient(90deg, ${config.color}, #a1a1aa);
          background-size: 0% ${config.thickness}px;
          background-repeat: no-repeat;
          background-position: left bottom -${config.offset}px;
          text-decoration: none;
          color: var(--text-main);
          font-weight: 500;
          cursor: pointer;
          padding-bottom: ${config.offset}px;
          transition: background-size ${config.duration}s ease;
        }
        .huragon-animated-link:hover {
          background-size: 100% ${config.thickness}px;
        }
      `;
    }

    let styleEl = qs('#underline-live-style');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'underline-live-style';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = linkStyle;

    target.innerHTML = `
      <h3 style="font-size:1.15rem; font-weight:600; color:var(--text-main); margin-bottom:12px;">
        Micro-Interaction Typography
      </h3>
      <p style="font-size:0.95rem; line-height:1.7; color:var(--text-muted); margin-bottom:20px;">
        Modern web design prioritizes subtle attention to detail. Hover over this
        <span class="huragon-animated-link">interactive link</span>
        or check out our
        <span class="huragon-animated-link">design system guidelines</span>
        to experience the smooth underline physics.
      </p>
      <div style="display:flex; align-items:center; gap:16px;">
        <span class="huragon-animated-link" style="font-size:0.85rem; font-weight:600;">Explore Documentation</span>
        <span style="color:var(--text-dim); font-size:0.8rem;">•</span>
        <span class="huragon-animated-link" style="font-size:0.85rem; font-weight:600;">View Changelog</span>
      </div>
    `;
  }

  function generateCode() {
    let css = '';
    let tailwind = '';

    if (config.effect === 'left-to-right') {
      css = `/* Left-to-Right Expanding Underline */
.link-underline {
  position: relative;
  text-decoration: none;
  color: inherit;
}

.link-underline::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -${config.offset}px;
  width: 0;
  height: ${config.thickness}px;
  background-color: ${config.color};
  transition: width ${config.duration}s cubic-bezier(0.16, 1, 0.3, 1);
}

.link-underline:hover::after {
  width: 100%;
}`;
      tailwind = `<!-- Tailwind Animated Underline -->
<a href="#" class="relative inline-block after:absolute after:bottom-0 after:left-0 after:h-[${config.thickness}px] after:w-0 after:bg-white after:transition-all after:duration-200 hover:after:w-full">
  Interactive Link
</a>`;
    } else if (config.effect === 'center-out') {
      css = `/* Center-Outward Underline */
.link-center {
  position: relative;
  text-decoration: none;
  color: inherit;
}

.link-center::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -${config.offset}px;
  width: 100%;
  height: ${config.thickness}px;
  background-color: ${config.color};
  transform: scaleX(0);
  transform-origin: center;
  transition: transform ${config.duration}s cubic-bezier(0.16, 1, 0.3, 1);
}

.link-center:hover::after {
  transform: scaleX(1);
}`;
      tailwind = `<!-- Tailwind Center-Out Underline -->
<a href="#" class="relative inline-block after:absolute after:bottom-0 after:left-0 after:h-[${config.thickness}px] after:w-full after:scale-x-0 after:bg-white after:transition-transform hover:after:scale-x-100">
  Interactive Link
</a>`;
    } else if (config.effect === 'marker-sweep') {
      css = `/* Highlighter Marker Sweep */
.link-marker {
  text-decoration: none;
  background-image: linear-gradient(${config.color}33, ${config.color}33);
  background-size: 0% 100%;
  background-repeat: no-repeat;
  padding: 2px 4px;
  border-radius: 3px;
  transition: background-size ${config.duration}s ease-in-out;
}

.link-marker:hover {
  background-size: 100% 100%;
}`;
      tailwind = `<!-- Tailwind Marker Highlight -->
<a href="#" class="bg-gradient-to-r from-zinc-700/30 to-zinc-700/30 bg-[length:0%_100%] bg-no-repeat transition-[background-size] hover:bg-[length:100%_100%] px-1 rounded">
  Interactive Link
</a>`;
    } else {
      css = `/* Gradient Sweep Underline */
.link-gradient {
  text-decoration: none;
  background-image: linear-gradient(90deg, ${config.color}, #a1a1aa);
  background-size: 0% ${config.thickness}px;
  background-repeat: no-repeat;
  background-position: left bottom -${config.offset}px;
  transition: background-size ${config.duration}s ease;
}

.link-gradient:hover {
  background-size: 100% ${config.thickness}px;
}`;
      tailwind = `<!-- Tailwind Gradient Underline -->
<a href="#" class="bg-gradient-to-r from-white to-zinc-400 bg-no-repeat bg-[length:0%_2px] bg-left-bottom transition-[background-size] hover:bg-[length:100%_2px]">
  Interactive Link
</a>`;
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
