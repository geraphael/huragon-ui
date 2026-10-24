// Tool 13: 3D Transform & Tilt Studio
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';

export const meta = {
  id: 'transform-3d',
  name: '3D Transform & Tilt'
};

let config = {
  perspective: 800,
  rotateX: 18,
  rotateY: -22,
  rotateZ: 0,
  translateZ: 30,
  scale: 1,
  preserve3d: true
};

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    id: 'transform-perspective-container',
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px'
    }
  });

  const card = el('div', {
    id: 'transform-target-card',
    style: {
      width: '280px',
      height: '180px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-lg)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px',
      color: 'var(--text-main)',
      transition: 'transform 0.1s ease-out'
    },
    innerHTML: `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:0.75rem; font-weight:600; text-transform:uppercase; letter-spacing:0.04em;">Perspective 3D</span>
        <span style="font-size:0.65rem; padding:2px 6px; border-radius:4px; background:var(--bg-input); border:1px solid var(--border);">CSS Matrix</span>
      </div>
      <div>
        <p style="font-size:0.8rem; color:var(--text-muted); margin:0;">Hardware-accelerated CSS 3D space with natural depth & vanishing points.</p>
      </div>
    `
  });

  centerStage.appendChild(card);
  previewStage.appendChild(centerStage);

  function applyTransform() {
    centerStage.style.perspective = `${config.perspective}px`;
    centerStage.style.perspectiveOrigin = '50% 50%';

    const transformStr = `rotateX(${config.rotateX}deg) rotateY(${config.rotateY}deg) rotateZ(${config.rotateZ}deg) translateZ(${config.translateZ}px) scale(${config.scale})`;
    card.style.transform = transformStr;
    card.style.transformStyle = config.preserve3d ? 'preserve-3d' : 'flat';

    const css = `/* Huragon/ui — 3D Transform */
.perspective-container {
  perspective: ${config.perspective}px;
  perspective-origin: 50% 50%;
}

.perspective-card {
  transform: ${transformStr};
  transform-style: ${config.preserve3d ? 'preserve-3d' : 'flat'};
  transition: transform 0.15s ease-out;
}`;

    onCodeChange({ css });
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const sec = el('div', { className: 'controls-section' }, [
      el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, [
        el('div', { className: 'section-title', style: { marginBottom: 0 }, textContent: '3D Spatial Coordinates' }),
        el('button', {
          className: 'btn btn-outline',
          style: { padding: '3px 8px', fontSize: '0.7rem' },
          innerHTML: `${ICONS.refresh} <span>Reset</span>`,
          onclick: () => {
            config.rotateX = 0;
            config.rotateY = 0;
            config.rotateZ = 0;
            config.translateZ = 0;
            config.perspective = 800;
            renderControls();
            applyTransform();
          }
        })
      ])
    ]);
    controlsStage.appendChild(sec);

    const controlsList = [
      { key: 'rotateX', label: 'Rotate X (Pitch)', min: -60, max: 60, unit: 'deg' },
      { key: 'rotateY', label: 'Rotate Y (Yaw)', min: -60, max: 60, unit: 'deg' },
      { key: 'rotateZ', label: 'Rotate Z (Roll)', min: -45, max: 45, unit: 'deg' },
      { key: 'translateZ', label: 'Depth (Translate Z)', min: -100, max: 100, unit: 'px' },
      { key: 'perspective', label: 'Camera Perspective', min: 200, max: 1600, unit: 'px' }
    ];

    controlsList.forEach(item => {
      const row = el('div', { className: 'control-group' }, [
        el('div', { className: 'control-label-row' }, [
          el('span', { className: 'control-label', textContent: item.label }),
          el('span', { className: 'control-value', id: `tval-${item.key}`, textContent: `${config[item.key]}${item.unit}` })
        ]),
        el('input', {
          type: 'range',
          min: item.min,
          max: item.max,
          value: config[item.key],
          oninput: (e) => {
            config[item.key] = parseInt(e.target.value, 10);
            qs(`#tval-${item.key}`).textContent = `${config[item.key]}${item.unit}`;
            applyTransform();
          }
        })
      ]);
      controlsStage.appendChild(row);
    });
  }

  renderControls();
  applyTransform();
}
