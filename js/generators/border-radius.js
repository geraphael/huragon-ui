// Tool 14: Fancy Border Radius (8-value organic squircle generator)
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';

export const meta = {
  id: 'border-radius',
  name: 'Fancy Border Radius'
};

let radii = {
  tl1: 60, tr1: 40, br1: 30, bl1: 70,
  tl2: 60, tr2: 30, br2: 70, bl2: 40
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

  const blobBox = el('div', {
    id: 'fancy-radius-box',
    style: {
      width: '260px',
      height: '260px',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-md)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-muted)',
      fontSize: '0.825rem',
      transition: 'border-radius 0.15s ease',
      userSelect: 'none'
    },
    textContent: 'Organic Shape'
  });

  centerStage.appendChild(blobBox);
  previewStage.appendChild(centerStage);

  function applyRadius() {
    const radiusStr = `${radii.tl1}% ${radii.tr1}% ${radii.br1}% ${radii.bl1}% / ${radii.tl2}% ${radii.tr2}% ${radii.br2}% ${radii.bl2}%`;
    blobBox.style.borderRadius = radiusStr;

    const css = `/* Huragon/ui — 8-Value Fancy Border Radius */
.organic-container {
  border-radius: ${radiusStr};
}`;

    const tailwind = `<div class="rounded-[${radiusStr.replace(/\s+/g, '_')}]">
  <!-- Content -->
</div>`;

    onCodeChange({ css, tailwind });
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const sec = el('div', { className: 'controls-section' }, [
      el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, [
        el('div', { className: 'section-title', style: { marginBottom: 0 }, textContent: 'Corner Axes' }),
        el('button', {
          className: 'btn btn-outline',
          style: { padding: '3px 8px', fontSize: '0.7rem' },
          innerHTML: `${ICONS.shuffle} <span>Randomize</span>`,
          onclick: () => {
            radii.tl1 = Math.floor(Math.random() * 60) + 20;
            radii.tr1 = 100 - radii.tl1;
            radii.br1 = Math.floor(Math.random() * 60) + 20;
            radii.bl1 = 100 - radii.br1;
            radii.tl2 = Math.floor(Math.random() * 60) + 20;
            radii.tr2 = Math.floor(Math.random() * 60) + 20;
            radii.br2 = 100 - radii.tr2;
            radii.bl2 = 100 - radii.tl2;
            renderControls();
            applyRadius();
          }
        })
      ])
    ]);
    controlsStage.appendChild(sec);

    const cornerControls = [
      { key: 'tl1', label: 'Top Horizontal' },
      { key: 'tr1', label: 'Right Horizontal' },
      { key: 'br1', label: 'Bottom Horizontal' },
      { key: 'bl1', label: 'Left Horizontal' },
      { key: 'tl2', label: 'Top Vertical' },
      { key: 'tr2', label: 'Right Vertical' },
      { key: 'br2', label: 'Bottom Vertical' },
      { key: 'bl2', label: 'Left Vertical' }
    ];

    cornerControls.forEach(c => {
      const row = el('div', { className: 'control-group' }, [
        el('div', { className: 'control-label-row' }, [
          el('span', { className: 'control-label', textContent: c.label }),
          el('span', { className: 'control-value', id: `rval-${c.key}`, textContent: `${radii[c.key]}%` })
        ]),
        el('input', {
          type: 'range',
          min: 10,
          max: 90,
          value: radii[c.key],
          oninput: (e) => {
            radii[c.key] = parseInt(e.target.value, 10);
            qs(`#rval-${c.key}`).textContent = `${radii[c.key]}%`;
            applyRadius();
          }
        })
      ]);
      controlsStage.appendChild(row);
    });
  }

  renderControls();
  applyRadius();
}
