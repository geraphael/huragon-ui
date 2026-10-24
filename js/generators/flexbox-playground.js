// Tool 16: Flexbox Playground
import { el, qs } from '../utils/dom.js';

export const meta = {
  id: 'flexbox-playground',
  name: 'Flexbox Playground'
};

let config = {
  direction: 'row', // row, column, row-reverse, column-reverse
  justify: 'space-between', // flex-start, center, flex-end, space-between, space-around, space-evenly
  align: 'center', // stretch, flex-start, center, flex-end
  wrap: 'wrap', // nowrap, wrap, wrap-reverse
  gap: 12,
  itemsCount: 4
};

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const flexContainer = el('div', {
    id: 'interactive-flex-container',
    style: {
      width: '100%',
      height: '380px',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      padding: '20px',
      display: 'flex',
      transition: 'all 0.15s ease'
    }
  });

  previewStage.appendChild(flexContainer);

  function applyFlex() {
    flexContainer.style.flexDirection = config.direction;
    flexContainer.style.justifyContent = config.justify;
    flexContainer.style.alignItems = config.align;
    flexContainer.style.flexWrap = config.wrap;
    flexContainer.style.gap = `${config.gap}px`;

    flexContainer.innerHTML = '';
    for (let i = 1; i <= config.itemsCount; i++) {
      const item = el('div', {
        style: {
          minWidth: '80px',
          height: '60px',
          background: 'var(--bg-input-focus)',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-main)',
          fontSize: '0.85rem',
          fontWeight: '500'
        },
        textContent: `Item ${i}`
      });
      flexContainer.appendChild(item);
    }

    const css = `/* Huragon/ui — Modern Flexbox Layout */
.flex-container {
  display: flex;
  flex-direction: ${config.direction};
  justify-content: ${config.justify};
  align-items: ${config.align};
  flex-wrap: ${config.wrap};
  gap: ${config.gap}px;
}`;

    onCodeChange({ css });
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const sec = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', textContent: 'Flex Container' }),

      renderRadioGroup('Direction', ['row', 'column', 'row-reverse'], config.direction, (v) => { config.direction = v; applyFlex(); }),
      renderRadioGroup('Justify Content', ['flex-start', 'center', 'flex-end', 'space-between'], config.justify, (v) => { config.justify = v; applyFlex(); }),
      renderRadioGroup('Align Items', ['stretch', 'flex-start', 'center', 'flex-end'], config.align, (v) => { config.align = v; applyFlex(); }),

      el('div', { className: 'control-group' }, [
        el('div', { className: 'control-label-row' }, [
          el('span', { className: 'control-label', textContent: 'Gap' }),
          el('span', { className: 'control-value', id: 'flex-gap-val', textContent: `${config.gap}px` })
        ]),
        el('input', {
          type: 'range',
          min: 0,
          max: 40,
          value: config.gap,
          oninput: (e) => {
            config.gap = parseInt(e.target.value, 10);
            qs('#flex-gap-val').textContent = `${config.gap}px`;
            applyFlex();
          }
        })
      ])
    ]);

    controlsStage.appendChild(sec);
  }

  function renderRadioGroup(label, options, current, onChange) {
    return el('div', { className: 'control-group' }, [
      el('div', { className: 'control-label-row' }, [
        el('span', { className: 'control-label', textContent: label })
      ]),
      el('div', { style: { display: 'flex', gap: '4px', flexWrap: 'wrap' } }, options.map(opt => el('button', {
        className: `btn ${current === opt ? 'btn-primary' : 'btn-outline'}`,
        style: { fontSize: '0.7rem', padding: '4px 8px' },
        textContent: opt,
        onclick: () => onChange(opt)
      })))
    ]);
  }

  renderControls();
  applyFlex();
}
