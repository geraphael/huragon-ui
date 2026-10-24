// Tool 15: Clip-Path Polygon Clipper
import { el, qs } from '../utils/dom.js';

export const meta = {
  id: 'clip-path',
  name: 'Clip-Path Polygon'
};

const presets = {
  triangle: '50% 0%, 0% 100%, 100% 100%',
  hexagon: '25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%',
  star: '50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%',
  chevron: '75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%',
  cross: '10% 25%, 35% 25%, 35% 0%, 65% 0%, 65% 25%, 90% 25%, 90% 50%, 65% 50%, 65% 100%, 35% 100%, 35% 50%, 10% 50%'
};

let currentPreset = 'hexagon';
let polygonPoints = presets[currentPreset];

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

  const clippedBox = el('div', {
    id: 'clipped-polygon-box',
    style: {
      width: '260px',
      height: '260px',
      background: 'linear-gradient(135deg, #27272a 0%, #52525b 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'clip-path 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
    }
  });

  centerStage.appendChild(clippedBox);
  previewStage.appendChild(centerStage);

  function applyClip() {
    clippedBox.style.clipPath = `polygon(${polygonPoints})`;
    clippedBox.style.webkitClipPath = `polygon(${polygonPoints})`;

    const css = `/* Huragon/ui — CSS Clip-Path */
.clipped-element {
  clip-path: polygon(${polygonPoints});
  -webkit-clip-path: polygon(${polygonPoints});
}`;

    const tailwind = `<div class="[clip-path:polygon(${polygonPoints.replace(/\s+/g, '_')})]">
  <!-- Content -->
</div>`;

    onCodeChange({ css, tailwind });
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const sec = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', textContent: 'Geometric Presets' }),
      el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' } }, [
        'hexagon', 'triangle', 'star', 'chevron', 'cross'
      ].map(p => el('button', {
        className: `btn ${currentPreset === p ? 'btn-primary' : 'btn-outline'}`,
        style: { fontSize: '0.75rem', textTransform: 'capitalize' },
        textContent: p,
        onclick: () => {
          currentPreset = p;
          polygonPoints = presets[p];
          renderControls();
          applyClip();
        }
      })))
    ]);

    controlsStage.appendChild(sec);
  }

  renderControls();
  applyClip();
}
