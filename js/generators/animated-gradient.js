// Tool 21: Animated Gradient Background
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';

export const meta = {
  id: 'animated-gradient',
  name: 'Animated Gradient'
};

let config = {
  angle: -45,
  color1: '#18181b',
  color2: '#3f3f46',
  color3: '#09090b',
  color4: '#27272a',
  duration: 10,
  bgSize: 400
};

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    id: 'animated-gradient-preview',
    style: {
      width: '100%',
      height: '100%',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    innerHTML: `
      <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:8px; padding:14px 22px; font-size:0.85rem; font-weight:500; color:var(--text-main); box-shadow:var(--shadow-md); z-index:2;">
        Animated Gradient Surface
      </div>
    `
  });

  previewStage.appendChild(centerStage);

  function applyAnimation() {
    const gradStr = `linear-gradient(${config.angle}deg, ${config.color1}, ${config.color2}, ${config.color3}, ${config.color4})`;
    
    // Inject dynamic keyframe animation style
    let styleTag = qs('#anim-grad-styles');
    if (!styleTag) {
      styleTag = el('style', { id: 'anim-grad-styles' });
      document.head.appendChild(styleTag);
    }

    styleTag.textContent = `
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;

    centerStage.style.background = gradStr;
    centerStage.style.backgroundSize = `${config.bgSize}% ${config.bgSize}%`;
    centerStage.style.animation = `gradientShift ${config.duration}s ease infinite`;

    const css = `/* Huragon/ui — Animated CSS Gradient */
.animated-gradient-bg {
  background: ${gradStr};
  background-size: ${config.bgSize}% ${config.bgSize}%;
  animation: gradientShift ${config.duration}s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}`;

    const tailwind = `<div class="bg-[linear-gradient(${config.angle}deg,${config.color1},${config.color2},${config.color3},${config.color4})] bg-[length:${config.bgSize}%_${config.bgSize}%] animate-pulse">
  <!-- Content -->
</div>`;

    onCodeChange({ css, tailwind });
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const sec = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', textContent: 'Animation Parameters' }),

      createSlider('Cycle Duration', config.duration, 4, 30, (v) => { config.duration = v; applyAnimation(); }, 's'),
      createSlider('Gradient Zoom (Size)', config.bgSize, 200, 600, (v) => { config.bgSize = v; applyAnimation(); }, '%'),
      createSlider('Angle', config.angle, -180, 180, (v) => { config.angle = v; applyAnimation(); }, 'deg')
    ]);

    const secColors = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', textContent: 'Palette Stops' }),
      renderColorPicker('Color 1', config.color1, (v) => { config.color1 = v; applyAnimation(); }),
      renderColorPicker('Color 2', config.color2, (v) => { config.color2 = v; applyAnimation(); }),
      renderColorPicker('Color 3', config.color3, (v) => { config.color3 = v; applyAnimation(); }),
      renderColorPicker('Color 4', config.color4, (v) => { config.color4 = v; applyAnimation(); })
    ]);

    controlsStage.appendChild(sec);
    controlsStage.appendChild(secColors);
  }

  function renderColorPicker(label, val, onChange) {
    return el('div', { className: 'control-group' }, [
      el('div', { className: 'control-label-row' }, [
        el('span', { className: 'control-label', textContent: label }),
        el('span', { className: 'control-value', textContent: val })
      ]),
      el('div', { className: 'color-picker-wrapper' }, [
        el('input', {
          type: 'color',
          value: val,
          oninput: (e) => onChange(e.target.value)
        }),
        el('span', { className: 'color-hex-text', textContent: val })
      ])
    ]);
  }

  function createSlider(label, val, min, max, onChange, unit = '') {
    const valSpan = el('span', { className: 'control-value', textContent: `${val}${unit}` });
    return el('div', { className: 'control-group' }, [
      el('div', { className: 'control-label-row' }, [
        el('span', { className: 'control-label', textContent: label }),
        valSpan
      ]),
      el('input', {
        type: 'range',
        min,
        max,
        value: val,
        oninput: (e) => {
          const v = parseFloat(e.target.value);
          valSpan.textContent = `${v}${unit}`;
          onChange(v);
        }
      })
    ]);
  }

  renderControls();
  applyAnimation();
}
