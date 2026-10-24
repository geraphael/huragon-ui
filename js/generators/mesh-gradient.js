// Tool 1: Mesh Gradient Generator
import { el, qs } from '../utils/dom.js';
import { randomHex } from '../utils/color.js';
import { ICONS } from '../utils/icons.js';

export const meta = {
  id: 'mesh-gradient',
  name: 'Mesh Gradient'
};

const defaultStops = [
  { x: 18, y: 22, color: '#3b82f6', radius: 48 },
  { x: 78, y: 24, color: '#6366f1', radius: 52 },
  { x: 28, y: 72, color: '#0ea5e9', radius: 46 },
  { x: 82, y: 78, color: '#8b5cf6', radius: 50 },
  { x: 50, y: 50, color: '#06b6d4', radius: 44 }
];

let stops = [...defaultStops];
let bgColor = '#09090b';
let isDragging = false;
let activeStopIndex = -1;

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';
  const canvasWrapper = el('div', {
    style: {
      width: '100%',
      height: '100%',
      position: 'relative',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid var(--border)',
      cursor: 'crosshair',
      userSelect: 'none'
    }
  });

  const canvas = el('canvas', {
    style: {
      width: '100%',
      height: '100%',
      display: 'block'
    }
  });
  canvasWrapper.appendChild(canvas);
  previewStage.appendChild(canvasWrapper);

  function resizeCanvas() {
    const rect = canvasWrapper.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      render();
    }
  }

  function render() {
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);

    stops.forEach((stop, idx) => {
      const cx = (stop.x / 100) * w;
      const cy = (stop.y / 100) * h;
      const r = (stop.radius / 100) * Math.max(w, h);

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, stop.color);
      grad.addColorStop(1, 'transparent');

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Clean handle indicator
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, idx === activeStopIndex ? 8 * window.devicePixelRatio : 5 * window.devicePixelRatio, 0, Math.PI * 2);
      ctx.fillStyle = stop.color;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2 * window.devicePixelRatio;
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });

    updateCode();
  }

  canvasWrapper.addEventListener('mousedown', (e) => {
    const rect = canvasWrapper.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    let hitIndex = -1;
    stops.forEach((st, idx) => {
      const dx = st.x - x;
      const dy = st.y - y;
      if (Math.sqrt(dx * dx + dy * dy) < 7) {
        hitIndex = idx;
      }
    });

    if (hitIndex !== -1) {
      activeStopIndex = hitIndex;
      isDragging = true;
    } else if (stops.length < 8) {
      stops.push({ x: Math.round(x), y: Math.round(y), color: randomHex(), radius: 45 });
      activeStopIndex = stops.length - 1;
      isDragging = true;
      renderControls();
    }
    render();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging || activeStopIndex === -1) return;
    const rect = canvasWrapper.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    stops[activeStopIndex].x = Math.round(x);
    stops[activeStopIndex].y = Math.round(y);
    render();
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  function renderControls() {
    controlsStage.innerHTML = '';

    const secGlobal = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', textContent: 'Canvas Settings' }),
      el('div', { className: 'control-group' }, [
        el('div', { className: 'control-label-row' }, [
          el('span', { className: 'control-label', textContent: 'Base Background' }),
          el('span', { className: 'control-value', textContent: bgColor })
        ]),
        el('div', { className: 'color-picker-wrapper' }, [
          el('input', {
            type: 'color',
            value: bgColor,
            oninput: (e) => {
              bgColor = e.target.value;
              render();
            }
          }),
          el('span', { className: 'color-hex-text', textContent: bgColor })
        ])
      ]),
      el('div', { style: { display: 'flex', gap: '8px', marginTop: '12px' } }, [
        el('button', {
          className: 'btn btn-primary',
          style: { flex: '1' },
          innerHTML: `${ICONS.shuffle} <span>Randomize</span>`,
          onclick: () => {
            stops.forEach(st => st.color = randomHex());
            render();
            renderControls();
          }
        }),
        el('button', {
          className: 'btn btn-outline',
          style: { flex: '1' },
          innerHTML: `${ICONS.refresh} <span>Reset</span>`,
          onclick: () => {
            stops = JSON.parse(JSON.stringify(defaultStops));
            activeStopIndex = 0;
            render();
            renderControls();
          }
        })
      ])
    ]);
    controlsStage.appendChild(secGlobal);

    const secStops = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', textContent: `Color Points (${stops.length}/8)` })
    ]);

    stops.forEach((st, idx) => {
      const row = el('div', {
        className: 'glass-card',
        style: {
          padding: '10px 12px',
          marginBottom: '8px',
          borderColor: idx === activeStopIndex ? 'var(--text-muted)' : 'var(--border)'
        }
      }, [
        el('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' } }, [
          el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
            el('input', {
              type: 'color',
              value: st.color,
              oninput: (e) => {
                st.color = e.target.value;
                render();
              }
            }),
            el('span', { style: { fontSize: '0.785rem', fontWeight: '500' }, textContent: `Point ${idx + 1}` })
          ]),
          stops.length > 2 ? el('button', {
            className: 'btn btn-ghost btn-icon',
            innerHTML: ICONS.close,
            title: 'Remove point',
            onclick: () => {
              stops.splice(idx, 1);
              activeStopIndex = Math.min(activeStopIndex, stops.length - 1);
              render();
              renderControls();
            }
          }) : null
        ]),
        el('div', { className: 'control-group', style: { marginBottom: '0' } }, [
          el('div', { className: 'control-label-row' }, [
            el('span', { className: 'control-label', textContent: 'Spread' }),
            el('span', { className: 'control-value', textContent: `${st.radius}%` })
          ]),
          el('input', {
            type: 'range',
            min: '20',
            max: '90',
            value: st.radius,
            oninput: (e) => {
              st.radius = parseInt(e.target.value, 10);
              render();
            }
          })
        ])
      ]);
      secStops.appendChild(row);
    });

    controlsStage.appendChild(secStops);
  }

  function updateCode() {
    const radialLayers = stops.map(st => {
      return `  radial-gradient(circle at ${st.x}% ${st.y}%, ${st.color} 0%, transparent ${st.radius}%)`;
    }).join(',\n');

    const cssCode = `/* Huragon/ui — Mesh Gradient */
.mesh-gradient-bg {
  background-color: ${bgColor};
  background-image:
${radialLayers};
  background-size: 100% 100%;
}`;

    const tailwindCode = `/* In globals.css */
.bg-mesh-custom {
  background-color: ${bgColor};
  background-image:
${radialLayers};
}`;

    onCodeChange({ css: cssCode, tailwind: tailwindCode });
  }

  renderControls();
  window.addEventListener('resize', resizeCanvas);
  setTimeout(resizeCanvas, 40);
}
