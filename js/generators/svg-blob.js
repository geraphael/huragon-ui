// Tool 22: Organic SVG Blob Generator
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';

export const meta = {
  id: 'svg-blob',
  name: 'SVG Blob Generator'
};

let config = {
  points: 6,
  variance: 25,
  size: 320,
  fillColor: '#27272a',
  borderColor: '#52525b',
  borderWidth: 1,
  seed: Math.random()
};

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px'
    }
  });

  const blobContainer = el('div', { id: 'blob-render-area' });
  centerStage.appendChild(blobContainer);
  previewStage.appendChild(centerStage);

  // Generate cubic bezier smooth organic blob
  function generateBlobPath(numPoints, variance, size, seedVal) {
    const center = size / 2;
    const baseRadius = size * 0.38;
    const angleStep = (Math.PI * 2) / numPoints;
    const pts = [];

    // Simple pseudo-random using seed
    let s = seedVal;
    function rand() {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    }

    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleStep;
      const offset = (rand() - 0.5) * (variance / 50) * baseRadius;
      const r = baseRadius + offset;
      pts.push({
        x: center + Math.cos(angle) * r,
        y: center + Math.sin(angle) * r
      });
    }

    // Convert coordinates to closed smooth cubic bezier SVG path
    let d = `M ${(pts[0].x + pts[numPoints - 1].x) / 2},${(pts[0].y + pts[numPoints - 1].y) / 2}`;
    for (let i = 0; i < numPoints; i++) {
      const current = pts[i];
      const next = pts[(i + 1) % numPoints];
      const midX = (current.x + next.x) / 2;
      const midY = (current.y + next.y) / 2;
      d += ` Q ${current.x},${current.y} ${midX},${midY}`;
    }
    d += ' Z';
    return d;
  }

  function renderBlob() {
    const pathD = generateBlobPath(config.points, config.variance, config.size, config.seed);

    blobContainer.innerHTML = `
      <svg width="${config.size}" height="${config.size}" viewBox="0 0 ${config.size} ${config.size}" xmlns="http://www.w3.org/2000/svg" style="display:block; filter:drop-shadow(0 4px 12px rgba(0,0,0,0.4));">
        <path d="${pathD}" fill="${config.fillColor}" stroke="${config.borderColor}" stroke-width="${config.borderWidth}" />
      </svg>
    `;

    const svgMarkup = `<!-- Huragon/ui — Organic SVG Blob -->
<svg width="${config.size}" height="${config.size}" viewBox="0 0 ${config.size} ${config.size}" xmlns="http://www.w3.org/2000/svg">
  <path d="${pathD}" fill="${config.fillColor}" stroke="${config.borderColor}" stroke-width="${config.borderWidth}" />
</svg>`;

    const cssClip = `/* CSS clip-path polygon approximation */
.blob-shape {
  width: ${config.size}px;
  height: ${config.size}px;
  background-color: ${config.fillColor};
}`;

    onCodeChange({ css: svgMarkup, tailwind: svgMarkup });
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const sec = el('div', { className: 'controls-section' }, [
      el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, [
        el('div', { className: 'section-title', style: { marginBottom: 0 }, textContent: 'Blob Topology' }),
        el('button', {
          className: 'btn btn-outline',
          style: { padding: '3px 8px', fontSize: '0.7rem' },
          innerHTML: `${ICONS.shuffle} <span>Regenerate</span>`,
          onclick: () => {
            config.seed = Math.random();
            renderBlob();
          }
        })
      ])
    ]);
    controlsStage.appendChild(sec);

    const secSliders = el('div', { className: 'controls-section' }, [
      createSlider('Vertices (Points)', config.points, 4, 12, (v) => { config.points = v; renderBlob(); }, ''),
      createSlider('Morph Variance', config.variance, 5, 50, (v) => { config.variance = v; renderBlob(); }, '%'),
      createSlider('Diameter Size', config.size, 180, 420, (v) => { config.size = v; renderBlob(); }, 'px'),

      el('div', { className: 'control-group' }, [
        el('div', { className: 'control-label-row' }, [
          el('span', { className: 'control-label', textContent: 'Fill Color' }),
          el('span', { className: 'control-value', textContent: config.fillColor })
        ]),
        el('div', { className: 'color-picker-wrapper' }, [
          el('input', {
            type: 'color',
            value: config.fillColor,
            oninput: (e) => {
              config.fillColor = e.target.value;
              renderBlob();
            }
          }),
          el('span', { className: 'color-hex-text', textContent: config.fillColor })
        ])
      ])
    ]);
    controlsStage.appendChild(secSliders);
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
  renderBlob();
}
