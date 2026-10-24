// Tool: CSS Text Animations (Typewriter, Glitch, Shimmer, Blur-In)
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';

export const meta = {
  id: 'text-animations',
  name: 'Text Animations'
};

let config = {
  effect: 'typewriter', // 'typewriter', 'glitch', 'shimmer', 'fade-blur'
  text: 'Modern CSS Design Architecture',
  duration: 3.0,
  fontSize: 28,
  infinite: true
};

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    id: 'text-anim-preview-container',
    style: {
      width: '100%',
      maxWidth: '640px',
      minHeight: '260px',
      padding: '40px 24px',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-md)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }
  });

  previewStage.appendChild(centerStage);

  // Controls
  controlsStage.innerHTML = '';

  const section = el('div', { className: 'control-section' }, [
    el('div', { className: 'control-section-header' }, [
      el('h4', { className: 'control-section-title', textContent: 'Animation Style' })
    ]),
    el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '16px' } }, [
      createEffectBtn('Typewriter Effect', 'typewriter'),
      createEffectBtn('Digital Glitch', 'glitch'),
      createEffectBtn('Gradient Shimmer', 'shimmer'),
      createEffectBtn('Blur-In Fade', 'fade-blur')
    ]),

    el('div', { className: 'control-section-header' }, [
      el('h4', { className: 'control-section-title', textContent: 'Text Content' })
    ]),
    createTextInput('Display Headline', config.text, (v) => {
      config.text = v || 'Modern CSS Design';
      update();
    }),

    el('div', { className: 'control-section-header', style: { marginTop: '16px' } }, [
      el('h4', { className: 'control-section-title', textContent: 'Typography & Speed' })
    ]),
    createSlider('Font Size', 18, 48, 2, config.fontSize, 'px', (v) => {
      config.fontSize = v;
      update();
    }),
    createSlider('Animation Duration', 0.8, 6.0, 0.2, config.duration, 's', (v) => {
      config.duration = v;
      update();
    }),
    createToggle('Infinite Loop', config.infinite, (v) => {
      config.infinite = v;
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
          if (['Typewriter Effect', 'Digital Glitch', 'Gradient Shimmer', 'Blur-In Fade'].includes(b.textContent.trim())) {
            b.classList.remove('active');
          }
        });
        e.currentTarget.classList.add('active');
        update();
      }
    });
  }

  function update() {
    renderAnimation(centerStage);
    generateCode();
  }

  function renderAnimation(target) {
    let animCss = '';
    const iter = config.infinite ? 'infinite' : '1';
    const charCount = config.text.length;

    if (config.effect === 'typewriter') {
      animCss = `
        @keyframes huragon-type {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes huragon-blink {
          50% { border-color: transparent; }
        }
        .huragon-animated-text {
          font-family: var(--font-mono);
          font-size: ${config.fontSize}px;
          font-weight: 600;
          color: var(--text-main);
          white-space: nowrap;
          overflow: hidden;
          display: inline-block;
          border-right: 3px solid #ffffff;
          animation: huragon-type ${config.duration}s steps(${charCount}) ${iter},
                     huragon-blink 0.75s step-end infinite;
          max-width: fit-content;
        }
      `;
    } else if (config.effect === 'glitch') {
      animCss = `
        @keyframes huragon-glitch {
          0% { transform: translate(0); text-shadow: -2px 0 #71717a, 2px 0 #ffffff; }
          20% { transform: translate(-2px, 2px); text-shadow: 2px -1px #a1a1aa, -2px 1px #52525b; }
          40% { transform: translate(-1px, -1px); text-shadow: -1px 2px #ffffff, 1px -2px #71717a; }
          60% { transform: translate(2px, 0); text-shadow: 2px 1px #a1a1aa, -1px -1px #ffffff; }
          80% { transform: translate(1px, -2px); text-shadow: -2px -1px #52525b, 2px 2px #71717a; }
          100% { transform: translate(0); text-shadow: -2px 0 #71717a, 2px 0 #ffffff; }
        }
        .huragon-animated-text {
          font-size: ${config.fontSize}px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.02em;
          animation: huragon-glitch ${config.duration}s ease ${iter};
        }
      `;
    } else if (config.effect === 'shimmer') {
      animCss = `
        @keyframes huragon-text-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .huragon-animated-text {
          font-size: ${config.fontSize}px;
          font-weight: 700;
          letter-spacing: -0.02em;
          background: linear-gradient(90deg, #52525b 0%, #ffffff 50%, #52525b 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: huragon-text-shimmer ${config.duration}s linear ${iter};
        }
      `;
    } else {
      // Fade Blur
      animCss = `
        @keyframes huragon-fade-blur {
          0% { opacity: 0; filter: blur(12px); transform: translateY(10px); }
          100% { opacity: 1; filter: blur(0px); transform: translateY(0); }
        }
        .huragon-animated-text {
          font-size: ${config.fontSize}px;
          font-weight: 700;
          color: var(--text-main);
          letter-spacing: -0.02em;
          animation: huragon-fade-blur ${config.duration}s cubic-bezier(0.16, 1, 0.3, 1) ${iter};
        }
      `;
    }

    let styleEl = qs('#text-anim-live-style');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'text-anim-live-style';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = animCss;

    target.innerHTML = `
      <div style="width:100%; overflow:hidden; text-align:center;">
        <span class="huragon-animated-text">${config.text}</span>
      </div>
      <div style="position:absolute; bottom:14px; font-size:0.75rem; color:var(--text-dim); font-family:var(--font-mono);">
        css keyframe motion
      </div>
    `;
  }

  function generateCode() {
    let css = '';
    const iter = config.infinite ? 'infinite' : 'forwards';

    if (config.effect === 'typewriter') {
      css = `/* Pure CSS Typewriter Animation */
.typewriter {
  font-family: monospace;
  white-space: nowrap;
  overflow: hidden;
  border-right: 3px solid #ffffff;
  width: fit-content;
  animation: typing ${config.duration}s steps(${config.text.length}) ${iter},
             blink 0.75s step-end infinite;
}

@keyframes typing {
  from { width: 0; }
  to { width: 100%; }
}

@keyframes blink {
  50% { border-color: transparent; }
}`;
    } else if (config.effect === 'glitch') {
      css = `/* Digital Glitch Text */
.glitch-text {
  font-weight: bold;
  animation: glitch ${config.duration}s ease ${iter};
}

@keyframes glitch {
  0% { transform: translate(0); text-shadow: -2px 0 #71717a, 2px 0 #ffffff; }
  20% { transform: translate(-2px, 2px); text-shadow: 2px -1px #a1a1aa, -2px 1px #52525b; }
  40% { transform: translate(-1px, -1px); text-shadow: -1px 2px #ffffff, 1px -2px #71717a; }
  60% { transform: translate(2px, 0); text-shadow: 2px 1px #a1a1aa, -1px -1px #ffffff; }
  80% { transform: translate(1px, -2px); text-shadow: -2px -1px #52525b, 2px 2px #71717a; }
  100% { transform: translate(0); text-shadow: -2px 0 #71717a, 2px 0 #ffffff; }
}`;
    } else if (config.effect === 'shimmer') {
      css = `/* Text Gradient Shimmer */
.shimmer-text {
  background: linear-gradient(90deg, #52525b 0%, #ffffff 50%, #52525b 100%);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: textShimmer ${config.duration}s linear ${iter};
}

@keyframes textShimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}`;
    } else {
      css = `/* Blur-In Fade Reveal */
.fade-blur-text {
  animation: fadeBlur ${config.duration}s cubic-bezier(0.16, 1, 0.3, 1) ${iter};
}

@keyframes fadeBlur {
  0% { opacity: 0; filter: blur(12px); transform: translateY(10px); }
  100% { opacity: 1; filter: blur(0px); transform: translateY(0); }
}`;
    }

    const tailwind = `<!-- Tailwind Animated Headline -->
<h1 class="text-3xl font-bold tracking-tight text-white animate-pulse">
  ${config.text}
</h1>`;

    onCodeChange({ css, tailwind });
  }

  function createTextInput(label, initial, onChange) {
    const wrapper = el('div', { className: 'control-item' });
    const lbl = el('label', { className: 'control-label', textContent: label });
    const input = el('input', {
      type: 'text',
      value: initial,
      style: { width: '100%', padding: '6px 10px', fontSize: '0.8rem', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)' },
      oninput: (e) => onChange(e.target.value)
    });

    wrapper.appendChild(lbl);
    wrapper.appendChild(input);
    return wrapper;
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

  function createToggle(label, initial, onChange) {
    const wrapper = el('div', { className: 'control-item', style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' } });
    const lbl = el('label', { className: 'control-label', textContent: label });
    const chk = el('input', {
      type: 'checkbox',
      checked: initial,
      style: { cursor: 'pointer', width: '16px', height: '16px', accentColor: '#ffffff' },
      onchange: (e) => onChange(e.target.checked)
    });

    wrapper.appendChild(lbl);
    wrapper.appendChild(chk);
    return wrapper;
  }

  update();
}
