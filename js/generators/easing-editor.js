// Tool: Cubic-Bezier Physics & Easing Editor
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';

export const meta = {
  id: 'easing-editor',
  name: 'Cubic-Bezier Easing'
};

let config = {
  p1x: 0.16,
  p1y: 1.0,
  p2x: 0.3,
  p2y: 1.0,
  duration: 1.2
};

const PRESETS = [
  { name: 'Snappy (Linear/Apple)', p: [0.16, 1.0, 0.3, 1.0] },
  { name: 'Ease-Out Fast', p: [0.0, 0.0, 0.2, 1.0] },
  { name: 'Bouncy Overshoot', p: [0.34, 1.56, 0.64, 1.0] },
  { name: 'Ease-In-Out', p: [0.42, 0.0, 0.58, 1.0] },
  { name: 'Anticipate Back', p: [0.36, 0.0, 0.66, -0.56] }
];

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    id: 'easing-preview-container',
    style: {
      width: '100%',
      maxWidth: '560px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }
  });

  previewStage.appendChild(centerStage);

  // Controls
  controlsStage.innerHTML = '';

  const section = el('div', { className: 'control-section' }, [
    el('div', { className: 'control-section-header' }, [
      el('h4', { className: 'control-section-title', textContent: 'Curated Curves' })
    ]),
    el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '16px' } },
      PRESETS.map(p => el('button', {
        className: 'btn btn-outline',
        style: { fontSize: '0.75rem', padding: '6px 8px' },
        textContent: p.name,
        onclick: () => {
          config.p1x = p.p[0];
          config.p1y = p.p[1];
          config.p2x = p.p[2];
          config.p2y = p.p[3];
          mount(container, onCodeChange);
        }
      }))
    ),

    el('div', { className: 'control-section-header' }, [
      el('h4', { className: 'control-section-title', textContent: 'Bezier Control Points' })
    ]),
    createSlider('Point 1 X', 0.0, 1.0, 0.01, config.p1x, '', (v) => {
      config.p1x = v;
      update();
    }),
    createSlider('Point 1 Y', -1.0, 2.0, 0.01, config.p1y, '', (v) => {
      config.p1y = v;
      update();
    }),
    createSlider('Point 2 X', 0.0, 1.0, 0.01, config.p2x, '', (v) => {
      config.p2x = v;
      update();
    }),
    createSlider('Point 2 Y', -1.0, 2.0, 0.01, config.p2y, '', (v) => {
      config.p2y = v;
      update();
    }),

    createSlider('Race Duration', 0.5, 4.0, 0.1, config.duration, 's', (v) => {
      config.duration = v;
      update();
    })
  ]);

  controlsStage.appendChild(section);

  function update() {
    renderView(centerStage);
    generateCode();
  }

  function renderView(target) {
    const bezierStr = `cubic-bezier(${config.p1x}, ${config.p1y}, ${config.p2x}, ${config.p2y})`;

    // SVG curve coords
    const pad = 30;
    const w = 240;
    const h = 180;
    const x0 = pad;
    const y0 = pad + h; // Bottom left (0, 0)
    const x3 = pad + w;
    const y3 = pad; // Top right (1, 1)

    const x1 = pad + config.p1x * w;
    const y1 = pad + (1 - config.p1y) * h;
    const x2 = pad + config.p2x * w;
    const y2 = pad + (1 - config.p2y) * h;

    target.innerHTML = `
      <!-- Curve Graph Card -->
      <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px; box-shadow:var(--shadow-md); display:flex; flex-direction:column; align-items:center;">
        <div style="width:100%; display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <span style="font-size:0.8rem; font-weight:600; color:var(--text-main);">Curve Visualizer</span>
          <span style="font-size:0.75rem; font-family:var(--font-mono); color:var(--text-muted);">${bezierStr}</span>
        </div>
        <svg viewBox="0 0 ${w + pad * 2} ${h + pad * 2}" style="width:100%; max-width:320px; height:auto; overflow:visible;">
          <!-- Grid Box -->
          <rect x="${pad}" y="${pad}" width="${w}" height="${h}" fill="none" stroke="var(--border)" stroke-dasharray="3,3" />
          <!-- Diagonal Reference Line -->
          <line x1="${x0}" y1="${y0}" x2="${x3}" y2="${y3}" stroke="var(--border)" stroke-width="1" />
          <!-- Handles -->
          <line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}" stroke="var(--text-dim)" stroke-width="1.5" stroke-dasharray="2,2" />
          <line x1="${x3}" y1="${y3}" x2="${x2}" y2="${y2}" stroke="var(--text-dim)" stroke-width="1.5" stroke-dasharray="2,2" />
          <!-- Bezier Curve -->
          <path d="M ${x0} ${y0} C ${x1} ${y1}, ${x2} ${y2}, ${x3} ${y3}" fill="none" stroke="#ffffff" stroke-width="2.5" />
          <!-- Handle Circles -->
          <circle cx="${x1}" cy="${y1}" r="4.5" fill="#a1a1aa" />
          <circle cx="${x2}" cy="${y2}" r="4.5" fill="#a1a1aa" />
        </svg>
      </div>

      <!-- Animation Race Track -->
      <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px; box-shadow:var(--shadow-md);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <span style="font-size:0.8rem; font-weight:600; color:var(--text-main);">Easing Race Track</span>
          <button class="btn btn-outline" id="play-easing-race-btn" style="font-size:0.75rem; padding:4px 10px;">
            ${ICONS.refresh} Replay Motion
          </button>
        </div>

        <div style="display:flex; flex-direction:column; gap:14px;">
          <!-- Custom Bezier Track -->
          <div>
            <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted); margin-bottom:6px;">
              <span>Custom Curve</span>
              <span style="font-family:var(--font-mono);">${config.duration}s</span>
            </div>
            <div style="width:100%; height:12px; background:var(--bg-main); border:1px solid var(--border); border-radius:999px; position:relative; overflow:hidden;">
              <div id="ball-custom" style="width:20px; height:12px; border-radius:999px; background:#ffffff; position:absolute; left:0; top:0;"></div>
            </div>
          </div>

          <!-- Linear Track -->
          <div>
            <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-dim); margin-bottom:6px;">
              <span>Linear (Reference)</span>
              <span style="font-family:var(--font-mono);">${config.duration}s</span>
            </div>
            <div style="width:100%; height:12px; background:var(--bg-main); border:1px solid var(--border); border-radius:999px; position:relative; overflow:hidden;">
              <div id="ball-linear" style="width:20px; height:12px; border-radius:999px; background:#52525b; position:absolute; left:0; top:0;"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    const playBtn = target.querySelector('#play-easing-race-btn');
    if (playBtn) {
      playBtn.addEventListener('click', triggerRace);
    }

    triggerRace();
  }

  function triggerRace() {
    const customBall = qs('#ball-custom');
    const linearBall = qs('#ball-linear');
    if (!customBall || !linearBall) return;

    // Reset transitions
    customBall.style.transition = 'none';
    linearBall.style.transition = 'none';
    customBall.style.transform = 'translateX(0)';
    linearBall.style.transform = 'translateX(0)';

    // Trigger reflow
    void customBall.offsetWidth;

    // Run animation
    const containerW = customBall.parentElement.offsetWidth;
    const targetX = containerW - 20;

    customBall.style.transition = `transform ${config.duration}s cubic-bezier(${config.p1x}, ${config.p1y}, ${config.p2x}, ${config.p2y})`;
    linearBall.style.transition = `transform ${config.duration}s linear`;

    customBall.style.transform = `translateX(${targetX}px)`;
    linearBall.style.transform = `translateX(${targetX}px)`;
  }

  function generateCode() {
    const bezierStr = `cubic-bezier(${config.p1x}, ${config.p1y}, ${config.p2x}, ${config.p2y})`;

    const css = `/* Huragon/ui Custom Physics Curve */
.custom-easing {
  transition-property: all;
  transition-duration: ${config.duration}s;
  transition-timing-function: ${bezierStr};
}`;

    const tailwind = `<!-- Tailwind Custom Easing -->
<div class="transition-all duration-[${Math.round(config.duration * 1000)}ms] ease-[${bezierStr}]">
  ...
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
