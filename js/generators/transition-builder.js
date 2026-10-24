// Tool: Multi-Property Transition Builder
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';

export const meta = {
  id: 'transition-builder',
  name: 'Transition Builder'
};

let transitions = [
  { prop: 'transform', duration: 0.3, ease: 'cubic-bezier(0.16, 1, 0.3, 1)', delay: 0 },
  { prop: 'box-shadow', duration: 0.25, ease: 'ease-out', delay: 0 },
  { prop: 'background-color', duration: 0.2, ease: 'ease', delay: 0 }
];

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    id: 'transition-preview-container',
    style: {
      width: '100%',
      maxWidth: '560px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px'
    }
  });

  previewStage.appendChild(centerStage);

  // Controls
  renderControls();

  function renderControls() {
    controlsStage.innerHTML = '';

    const section = el('div', { className: 'control-section' }, [
      el('div', { className: 'control-section-header' }, [
        el('h4', { className: 'control-section-title', textContent: 'Transition Rules' })
      ]),
      el('div', { id: 'transition-list', style: { display: 'flex', flexDirection: 'column', gap: '12px' } },
        transitions.map((t, idx) => el('div', {
          style: {
            background: 'var(--bg-main)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            position: 'relative'
          }
        }, [
          el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' } }, [
            el('span', { style: { fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }, textContent: t.prop }),
            transitions.length > 1 ? el('button', {
              className: 'btn btn-ghost btn-icon',
              style: { padding: '2px', height: '24px', width: '24px' },
              innerHTML: ICONS.trash,
              onclick: () => {
                transitions.splice(idx, 1);
                renderControls();
                update();
              }
            }) : el('span')
          ]),
          createInlineSlider('Duration', 0.05, 1.0, 0.05, t.duration, 's', (v) => {
            t.duration = v;
            update();
          }),
          createInlineSlider('Delay', 0.0, 0.5, 0.05, t.delay, 's', (v) => {
            t.delay = v;
            update();
          })
        ]))
      ),

      el('div', { style: { marginTop: '16px', display: 'flex', gap: '8px' } }, [
        el('button', {
          className: 'btn btn-outline',
          style: { flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' },
          innerHTML: `${ICONS.plus} Add Property`,
          onclick: () => {
            transitions.push({ prop: 'opacity', duration: 0.2, ease: 'ease', delay: 0 });
            renderControls();
            update();
          }
        })
      ])
    ]);

    controlsStage.appendChild(section);
  }

  function update() {
    renderCard(centerStage);
    generateCode();
  }

  function renderCard(target) {
    const transitionStr = transitions.map(t => `${t.prop} ${t.duration}s ${t.ease} ${t.delay}s`).join(', ');

    let styleEl = qs('#transition-live-style');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'transition-live-style';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `
      #transition-box-target {
        transition: ${transitionStr};
      }
      #transition-box-target:hover {
        transform: translateY(-8px) scale(1.04);
        box-shadow: 0 20px 30px -10px rgba(0,0,0,0.4);
        background-color: var(--bg-card-hover);
        opacity: 0.95;
      }
    `;

    target.innerHTML = `
      <div id="transition-box-target" style="width:280px; padding:28px 24px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); box-shadow:var(--shadow-sm); cursor:pointer; text-align:center; user-select:none;">
        <div style="width:40px; height:40px; border-radius:10px; background:var(--bg-main); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; margin:0 auto 14px auto;">
          ${ICONS.sliders}
        </div>
        <h4 style="font-size:1.05rem; font-weight:600; color:var(--text-main); margin-bottom:6px;">Hover Trigger</h4>
        <p style="font-size:0.8rem; color:var(--text-muted); line-height:1.5;">
          Hover cursor over this card to preview coordinated multi-property timing.
        </p>
      </div>
      <span style="font-size:0.75rem; color:var(--text-dim); font-family:var(--font-mono);">
        ${transitions.length} properties choreographed
      </span>
    `;
  }

  function generateCode() {
    const transitionStr = transitions.map(t => `${t.prop} ${t.duration}s ${t.ease}${t.delay > 0 ? ' ' + t.delay + 's' : ''}`).join(',\n              ');

    const css = `/* Huragon/ui Multi-Property Transition */
.choreographed-transition {
  transition: ${transitionStr};
}`;

    const tailwind = `<!-- Tailwind Coordinated Transition -->
<div class="transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.04] hover:shadow-2xl">
  ...
</div>`;

    onCodeChange({ css, tailwind });
  }

  function createInlineSlider(label, min, max, step, initial, unit, onChange) {
    const wrapper = el('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginTop: '6px' } });
    const lbl = el('span', { style: { fontSize: '0.75rem', color: 'var(--text-muted)', width: '60px' }, textContent: label });
    const valSpan = el('span', { style: { fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-main)', width: '35px', textAlign: 'right' }, textContent: `${initial}${unit}` });
    const slider = el('input', {
      type: 'range',
      min,
      max,
      step,
      value: initial,
      style: { flex: '1' },
      oninput: (e) => {
        const v = parseFloat(e.target.value);
        valSpan.textContent = `${v}${unit}`;
        onChange(v);
      }
    });

    wrapper.appendChild(lbl);
    wrapper.appendChild(slider);
    wrapper.appendChild(valSpan);
    return wrapper;
  }

  update();
}
