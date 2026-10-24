// Tool 23: CSS Grid Studio
import { el, qs } from '../utils/dom.js';

export const meta = {
  id: 'grid-generator',
  name: 'CSS Grid Studio'
};

let config = {
  columns: 3,
  rows: 3,
  gap: 12,
  minColWidth: 100
};

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const gridContainer = el('div', {
    id: 'interactive-grid-viewport',
    style: {
      width: '100%',
      height: '380px',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      padding: '16px',
      display: 'grid',
      transition: 'all 0.15s ease'
    }
  });

  previewStage.appendChild(gridContainer);

  function applyGrid() {
    gridContainer.style.gridTemplateColumns = `repeat(${config.columns}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${config.rows}, 1fr)`;
    gridContainer.style.gap = `${config.gap}px`;

    gridContainer.innerHTML = '';
    const totalCells = config.columns * config.rows;

    for (let i = 1; i <= totalCells; i++) {
      const cell = el('div', {
        style: {
          background: 'var(--bg-input)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.8rem',
          fontFamily: 'monospace'
        },
        textContent: `${i}`
      });
      gridContainer.appendChild(cell);
    }

    const css = `/* Huragon/ui — CSS Grid Layout */
.grid-container {
  display: grid;
  grid-template-columns: repeat(${config.columns}, 1fr);
  grid-template-rows: repeat(${config.rows}, 1fr);
  gap: ${config.gap}px;
}`;

    const tailwind = `<div class="grid grid-cols-${config.columns} grid-rows-${config.rows} gap-[${config.gap}px]">
  <!-- Grid Items -->
</div>`;

    onCodeChange({ css, tailwind });
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const sec = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', textContent: 'Grid Dimensions' }),

      createSlider('Columns', config.columns, 1, 6, (v) => { config.columns = v; applyGrid(); }, ''),
      createSlider('Rows', config.rows, 1, 6, (v) => { config.rows = v; applyGrid(); }, ''),
      createSlider('Gap', config.gap, 0, 32, (v) => { config.gap = v; applyGrid(); }, 'px')
    ]);

    controlsStage.appendChild(sec);
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
          const v = parseInt(e.target.value, 10);
          valSpan.textContent = `${v}${unit}`;
          onChange(v);
        }
      })
    ]);
  }

  renderControls();
  applyGrid();
}
