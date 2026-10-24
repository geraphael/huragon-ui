// Tool: Section Dividers & Separators
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';

export const meta = {
  id: 'divider-separator',
  name: 'Section Dividers'
};

let config = {
  style: 'gradient-fade', // 'gradient-fade', 'center-text', 'dashed', 'center-icon'
  text: 'OR CONTINUE WITH',
  thickness: 1,
  color: '#3f3f46',
  widthPercent: 100
};

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    id: 'divider-preview-container',
    style: {
      width: '100%',
      maxWidth: '560px',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
      padding: '24px'
    }
  });

  previewStage.appendChild(centerStage);

  // Controls
  controlsStage.innerHTML = '';

  const section = el('div', { className: 'control-section' }, [
    el('div', { className: 'control-section-header' }, [
      el('h4', { className: 'control-section-title', textContent: 'Divider Variant' })
    ]),
    el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '16px' } }, [
      createStyleBtn('Gradient Fade', 'gradient-fade'),
      createStyleBtn('Centered Label', 'center-text'),
      createStyleBtn('Centered Icon', 'center-icon'),
      createStyleBtn('Technical Dash', 'dashed')
    ]),

    el('div', { className: 'control-section-header' }, [
      el('h4', { className: 'control-section-title', textContent: 'Dimensions & Color' })
    ]),
    createSlider('Line Thickness', 1, 4, 1, config.thickness, 'px', (v) => {
      config.thickness = v;
      update();
    }),
    createSlider('Width Constraint', 40, 100, 5, config.widthPercent, '%', (v) => {
      config.widthPercent = v;
      update();
    }),
    createColorControl('Line Color', config.color, (v) => {
      config.color = v;
      update();
    })
  ]);

  controlsStage.appendChild(section);

  function createStyleBtn(label, st) {
    return el('button', {
      className: `btn btn-outline ${config.style === st ? 'active' : ''}`,
      style: { fontSize: '0.75rem', padding: '6px 8px' },
      textContent: label,
      onclick: (e) => {
        config.style = st;
        controlsStage.querySelectorAll('.btn-outline').forEach(b => {
          if (['Gradient Fade', 'Centered Label', 'Centered Icon', 'Technical Dash'].includes(b.textContent.trim())) {
            b.classList.remove('active');
          }
        });
        e.currentTarget.classList.add('active');
        update();
      }
    });
  }

  function update() {
    renderDivider(centerStage);
    generateCode();
  }

  function renderDivider(target) {
    let dividerHtml = '';

    if (config.style === 'gradient-fade') {
      dividerHtml = `
        <div style="width:${config.widthPercent}%; margin:0 auto; height:${config.thickness}px; background:linear-gradient(90deg, transparent, ${config.color}, transparent);"></div>
      `;
    } else if (config.style === 'center-text') {
      dividerHtml = `
        <div style="width:${config.widthPercent}%; margin:0 auto; display:flex; align-items:center; gap:16px;">
          <div style="flex:1; height:${config.thickness}px; background:${config.color};"></div>
          <span style="font-size:0.7rem; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:var(--text-muted); padding:2px 8px; background:var(--bg-card); border:1px solid var(--border); border-radius:4px;">${config.text}</span>
          <div style="flex:1; height:${config.thickness}px; background:${config.color};"></div>
        </div>
      `;
    } else if (config.style === 'center-icon') {
      dividerHtml = `
        <div style="width:${config.widthPercent}%; margin:0 auto; display:flex; align-items:center; gap:16px;">
          <div style="flex:1; height:${config.thickness}px; background:linear-gradient(90deg, transparent, ${config.color});"></div>
          <div style="width:24px; height:24px; border-radius:50%; background:var(--bg-card); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; color:var(--text-muted);">
            ${ICONS.sparkles}
          </div>
          <div style="flex:1; height:${config.thickness}px; background:linear-gradient(90deg, ${config.color}, transparent);"></div>
        </div>
      `;
    } else {
      // Dashed
      dividerHtml = `
        <div style="width:${config.widthPercent}%; margin:0 auto; height:0; border-top:${config.thickness}px dashed ${config.color};"></div>
      `;
    }

    target.innerHTML = `
      <!-- Top Card -->
      <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-md); padding:18px 24px;">
        <span style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.04em;">Upper Content Block</span>
        <h4 style="font-size:0.95rem; font-weight:600; color:var(--text-main); margin-top:4px;">Primary Workspace Account</h4>
      </div>

      <!-- Divider -->
      ${dividerHtml}

      <!-- Bottom Card -->
      <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-md); padding:18px 24px;">
        <span style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.04em;">Lower Content Block</span>
        <h4 style="font-size:0.95rem; font-weight:600; color:var(--text-main); margin-top:4px;">Single Sign-On / Federation</h4>
      </div>
    `;
  }

  function generateCode() {
    let css = '';
    let tailwind = '';

    if (config.style === 'gradient-fade') {
      css = `/* Smooth Gradient Fade Divider */
.divider-fade {
  width: ${config.widthPercent}%;
  height: ${config.thickness}px;
  margin: 24px auto;
  background: linear-gradient(
    90deg,
    transparent,
    ${config.color},
    transparent
  );
}`;
      tailwind = `<!-- Tailwind Gradient Fade Divider -->
<div class="w-full h-px my-6 bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>`;
    } else if (config.style === 'center-text') {
      css = `/* Centered Label Divider */
.divider-label {
  display: flex;
  align-items: center;
  gap: 16px;
  width: ${config.widthPercent}%;
  margin: 24px auto;
}

.divider-label::before,
.divider-label::after {
  content: "";
  flex: 1;
  height: ${config.thickness}px;
  background-color: ${config.color};
}

.divider-label span {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
}`;
      tailwind = `<!-- Tailwind Centered Text Divider -->
<div class="relative flex items-center justify-center my-6">
  <div class="w-full border-t border-zinc-800"></div>
  <span class="absolute bg-zinc-950 px-3 text-xs uppercase text-zinc-500 font-medium">${config.text}</span>
</div>`;
    } else if (config.style === 'center-icon') {
      css = `/* Centered Icon Divider */
.divider-icon {
  display: flex;
  align-items: center;
  gap: 16px;
  width: ${config.widthPercent}%;
  margin: 24px auto;
}

.divider-icon::before {
  content: "";
  flex: 1;
  height: ${config.thickness}px;
  background: linear-gradient(90deg, transparent, ${config.color});
}

.divider-icon::after {
  content: "";
  flex: 1;
  height: ${config.thickness}px;
  background: linear-gradient(90deg, ${config.color}, transparent);
}`;
      tailwind = `<!-- Tailwind Centered Icon Divider -->
<div class="flex items-center my-6">
  <div class="flex-1 h-px bg-gradient-to-r from-transparent to-zinc-700"></div>
  <div class="px-3 text-zinc-500">•</div>
  <div class="flex-1 h-px bg-gradient-to-l from-transparent to-zinc-700"></div>
</div>`;
    } else {
      css = `/* Technical Dashed Divider */
.divider-dashed {
  width: ${config.widthPercent}%;
  margin: 24px auto;
  border-top: ${config.thickness}px dashed ${config.color};
}`;
      tailwind = `<!-- Tailwind Dashed Divider -->
<div class="w-full border-t border-dashed border-zinc-700 my-6"></div>`;
    }

    onCodeChange({ css, tailwind });
  }

  update();
}

function createSlider(label, min, max, step, initial, unit, onChange) {
  const wrapper = el('div', { className: 'control-item' });
  const row = el('div', { className: 'control-label-row' }, [
    el('label', { className: 'control-label', textContent: label }),
    el('span', { className: 'control-value', textContent: `${initial}${unit}` })
  ]);
  const valSpan = row.querySelector('.control-value');
  const slider = el('input', {
    type: 'range',
    min,
    max,
    step,
    value: initial,
    oninput: (e) => {
      const v = parseFloat(e.target.value);
      valSpan.textContent = `${v}${unit}`;
      onChange(v);
    }
  });

  wrapper.appendChild(row);
  wrapper.appendChild(slider);
  return wrapper;
}

function createColorControl(label, initial, onChange) {
  const wrapper = el('div', { className: 'control-item' });
  const row = el('div', { className: 'control-label-row' }, [
    el('label', { className: 'control-label', textContent: label })
  ]);
  const picker = el('input', {
    type: 'color',
    value: initial,
    style: { width: '100%', height: '34px', padding: '0', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: 'transparent' },
    oninput: (e) => onChange(e.target.value)
  });

  wrapper.appendChild(row);
  wrapper.appendChild(picker);
  return wrapper;
}
