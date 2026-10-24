// Tool 1: Mesh Gradient Generator
import { el, qs } from '../utils/dom.js';
import { randomHex } from '../utils/color.js';

export const meta = {
  id: 'mesh-gradient',
  name: 'Mesh Gradient',
  icon: '🌈'
};

const defaultStops = [
  { x: 15, y: 20, color: '#8b5cf6', radius: 45 },
  { x: 80, y: 25, color: '#ec4899', radius: 50 },
  { x: 30, y: 75, color: '#3b82f6', radius: 45 },
  { x: 85, y: 80, color: '#06b6d4', radius: 55 },
  { x: 50, y: 50, color: '#10b981', radius: 40 }
];

let stops = [...defaultStops];
let bgColor = '#090915';
let isDragging = false;
let activeStopIndex = -1;

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  // Preview Canvas Area
  previewStage.innerHTML = '';
  const canvasWrapper = el('div', {
    style: {
      width: '100%',
      height: '100%',
      position: 'relative',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-md)',
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

  // Resize canvas according to display resolution
  function resizeCanvas() {
    const rect = canvasWrapper.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      render();
    }
  }

  // Render on canvas
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

      // Draw indicator handle
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, idx === activeStopIndex ? 10 * window.devicePixelRatio : 7 * window.devicePixelRatio, 0, Math.PI * 2);
      ctx.fillStyle = stop.color;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5 * window.devicePixelRatio;
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });

    updateCode();
  }

  // Pointer drag events on canvas
  canvasWrapper.addEventListener('mousedown', (e) => {
    const rect = canvasWrapper.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Check hit
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
      // Add new point on click
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

  // Controls
  function renderControls() {
    controlsStage.innerHTML = '';

    const secGlobal = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', innerHTML: '<span>⚙️</span> Global Settings' }),
      el('div', { className: 'control-group' }, [
        el('div', { className: 'control-label-row' }, [
          el('span', { className: 'control-label', textContent: 'Base Background Color' }),
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
          innerHTML: '🎲 Randomize Colors',
          onclick: () => {
            stops.forEach(st => st.color = randomHex());
            render();
            renderControls();
          }
        }),
        el('button', {
          className: 'btn btn-outline',
          innerHTML: '🔄 Reset',
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

    // Color points list
    const secStops = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', innerHTML: `<span>📍</span> Color Points (${stops.length}/8)` })
    ]);

    stops.forEach((st, idx) => {
      const row = el('div', {
        className: 'glass-card',
        style: {
          padding: '12px',
          marginBottom: '10px',
          borderColor: idx === activeStopIndex ? 'var(--accent)' : 'var(--border)'
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
            el('span', { style: { fontSize: '0.8rem', fontWeight: '600' }, textContent: `Point #${idx + 1}` })
          ]),
          stops.length > 2 ? el('button', {
            className: 'btn btn-ghost btn-icon',
            innerHTML: '✕',
            title: 'Remove point',
            onclick: () => {
              stops.splice(idx, 1);
              activeStopIndex = Math.min(activeStopIndex, stops.length - 1);
              render();
              renderControls();
            }
          }) : null
        ]),
        el('div', { className: 'control-group', style: { marginBottom: '6px' } }, [
          el('div', { className: 'control-label-row' }, [
            el('span', { className: 'control-label', textContent: 'Spread Size' }),
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

    const tailwindCode = `/* In your Tailwind config / CSS layer */
.bg-mesh-custom {
  background-color: ${bgColor};
  background-image:
${radialLayers};
}`;

    onCodeChange({ css: cssCode, tailwind: tailwindCode });
  }

  renderControls();
  window.addEventListener('resize', resizeCanvas);
  setTimeout(resizeCanvas, 50);
}
