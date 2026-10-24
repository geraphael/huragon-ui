// Tool 11: CSS Filters & Backdrop-Filter Studio
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';

export const meta = {
  id: 'css-filters',
  name: 'CSS Filters'
};

const defaultFilters = {
  blur: 0,
  brightness: 100,
  contrast: 100,
  grayscale: 0,
  hueRotate: 0,
  invert: 0,
  saturate: 100,
  sepia: 0
};

let filters = { ...defaultFilters };

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px'
    }
  });

  const previewCard = el('div', {
    id: 'filter-target-card',
    style: {
      width: '320px',
      height: '240px',
      borderRadius: 'var(--radius-md)',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid var(--border)',
      background: 'linear-gradient(135deg, #18181b 0%, #27272a 40%, #52525b 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: '20px',
      transition: 'filter 0.15s ease'
    },
    innerHTML: `
      <div style="position:absolute; top:24px; left:24px; width:48px; height:48px; border-radius:50%; background:linear-gradient(135deg, #3b82f6, #06b6d4); opacity:0.9;"></div>
      <div style="position:relative; z-index:2;">
        <span style="font-size:0.7rem; color:#a1a1aa; text-transform:uppercase; letter-spacing:0.04em;">Filter Target</span>
        <h3 style="font-size:1.1rem; font-weight:600; color:#fff; margin-top:2px;">Visual Studio</h3>
      </div>
    `
  });

  centerStage.appendChild(previewCard);
  previewStage.appendChild(centerStage);

  function applyFilters() {
    const filterString = [
      filters.blur > 0 ? `blur(${filters.blur}px)` : '',
      filters.brightness !== 100 ? `brightness(${filters.brightness}%)` : '',
      filters.contrast !== 100 ? `contrast(${filters.contrast}%)` : '',
      filters.grayscale > 0 ? `grayscale(${filters.grayscale}%)` : '',
      filters.hueRotate > 0 ? `hue-rotate(${filters.hueRotate}deg)` : '',
      filters.invert > 0 ? `invert(${filters.invert}%)` : '',
      filters.saturate !== 100 ? `saturate(${filters.saturate}%)` : '',
      filters.sepia > 0 ? `sepia(${filters.sepia}%)` : ''
    ].filter(Boolean).join(' ') || 'none';

    previewCard.style.filter = filterString;

    const css = `/* Huragon/ui — CSS Filters */
.filtered-element {
  filter: ${filterString};
}`;

    const tailwind = `<div class="${filterString === 'none' ? '' : `[filter:${filterString.replace(/\s+/g, '_')}]`}">
  <!-- Filtered element -->
</div>`;

    onCodeChange({ css, tailwind });
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const secTop = el('div', { className: 'controls-section' }, [
      el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, [
        el('div', { className: 'section-title', style: { marginBottom: 0 }, textContent: 'Filter Properties' }),
        el('button', {
          className: 'btn btn-outline',
          style: { padding: '3px 8px', fontSize: '0.7rem' },
          innerHTML: `${ICONS.refresh} <span>Reset</span>`,
          onclick: () => {
            filters = { ...defaultFilters };
            renderControls();
            applyFilters();
          }
        })
      ])
    ]);
    controlsStage.appendChild(secTop);

    const controlsList = [
      { key: 'blur', label: 'Blur', min: 0, max: 20, unit: 'px' },
      { key: 'brightness', label: 'Brightness', min: 0, max: 200, unit: '%' },
      { key: 'contrast', label: 'Contrast', min: 0, max: 200, unit: '%' },
      { key: 'saturate', label: 'Saturation', min: 0, max: 200, unit: '%' },
      { key: 'grayscale', label: 'Grayscale', min: 0, max: 100, unit: '%' },
      { key: 'hueRotate', label: 'Hue Rotate', min: 0, max: 360, unit: 'deg' },
      { key: 'invert', label: 'Invert', min: 0, max: 100, unit: '%' },
      { key: 'sepia', label: 'Sepia', min: 0, max: 100, unit: '%' }
    ];

    controlsList.forEach(item => {
      const row = el('div', { className: 'control-group' }, [
        el('div', { className: 'control-label-row' }, [
          el('span', { className: 'control-label', textContent: item.label }),
          el('span', { className: 'control-value', id: `fval-${item.key}`, textContent: `${filters[item.key]}${item.unit}` })
        ]),
        el('input', {
          type: 'range',
          min: item.min,
          max: item.max,
          value: filters[item.key],
          oninput: (e) => {
            filters[item.key] = parseInt(e.target.value, 10);
            qs(`#fval-${item.key}`).textContent = `${filters[item.key]}${item.unit}`;
            applyFilters();
          }
        })
      ]);
      controlsStage.appendChild(row);
    });
  }

  renderControls();
  applyFilters();
}
