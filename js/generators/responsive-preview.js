// Tool: Device Mockups & Responsive Stage Studio
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';

export const meta = {
  id: 'responsive-preview',
  name: 'Device Mockups'
};

let config = {
  device: 'mobile', // 'mobile', 'tablet', 'laptop'
  orientation: 'portrait', // 'portrait', 'landscape'
  scale: 0.85
};

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    id: 'mockup-preview-container',
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      padding: '20px'
    }
  });

  previewStage.appendChild(centerStage);

  // Controls
  controlsStage.innerHTML = '';

  const section = el('div', { className: 'control-section' }, [
    el('div', { className: 'control-section-header' }, [
      el('h4', { className: 'control-section-title', textContent: 'Hardware Profile' })
    ]),
    el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' } }, [
      createDeviceBtn('Mobile', 'mobile'),
      createDeviceBtn('Tablet', 'tablet'),
      createDeviceBtn('Laptop', 'laptop')
    ]),

    el('div', { className: 'control-section-header' }, [
      el('h4', { className: 'control-section-title', textContent: 'Screen Orientation' })
    ]),
    el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' } }, [
      createOrientBtn('Portrait', 'portrait'),
      createOrientBtn('Landscape', 'landscape')
    ]),

    el('div', { className: 'control-section-header' }, [
      el('h4', { className: 'control-section-title', textContent: 'Stage Scale' })
    ]),
    createSlider('Viewport Scale', 0.5, 1.0, 0.05, config.scale, 'x', (v) => {
      config.scale = v;
      update();
    })
  ]);

  controlsStage.appendChild(section);

  function createDeviceBtn(label, dev) {
    return el('button', {
      className: `btn btn-outline ${config.device === dev ? 'active' : ''}`,
      style: { fontSize: '0.75rem', padding: '6px 8px' },
      textContent: label,
      onclick: (e) => {
        config.device = dev;
        controlsStage.querySelectorAll('.btn-outline').forEach(b => {
          if (['Mobile', 'Tablet', 'Laptop'].includes(b.textContent.trim())) {
            b.classList.remove('active');
          }
        });
        e.currentTarget.classList.add('active');
        update();
      }
    });
  }

  function createOrientBtn(label, ori) {
    return el('button', {
      className: `btn btn-outline ${config.orientation === ori ? 'active' : ''}`,
      style: { fontSize: '0.75rem', padding: '6px 8px' },
      textContent: label,
      onclick: (e) => {
        config.orientation = ori;
        controlsStage.querySelectorAll('.btn-outline').forEach(b => {
          if (['Portrait', 'Landscape'].includes(b.textContent.trim())) {
            b.classList.remove('active');
          }
        });
        e.currentTarget.classList.add('active');
        update();
      }
    });
  }

  function update() {
    renderMockup(centerStage);
    generateCode();
  }

  function renderMockup(target) {
    let w = 375;
    let h = 667;
    let radius = 36;
    let bezel = 10;

    if (config.device === 'tablet') {
      w = 600;
      h = 800;
      radius = 24;
      bezel = 12;
    } else if (config.device === 'laptop') {
      w = 800;
      h = 500;
      radius = 16;
      bezel = 14;
    }

    if (config.orientation === 'landscape' && config.device !== 'laptop') {
      const temp = w;
      w = h;
      h = temp;
    }

    target.innerHTML = `
      <div style="transform:scale(${config.scale}); transform-origin:center; transition:transform 0.2s ease;">
        <!-- Hardware Chassis -->
        <div style="width:${w + bezel * 2}px; height:${h + bezel * 2}px; background:#18181b; border:2px solid #3f3f46; border-radius:${radius}px; padding:${bezel}px; box-shadow:0 25px 50px -12px rgba(0,0,0,0.6); position:relative; overflow:hidden;">
          
          <!-- Screen Glass -->
          <div style="width:100%; height:100%; background:var(--bg-main); border-radius:${radius - 6}px; overflow-y:auto; overflow-x:hidden; position:relative; display:flex; flex-direction:column;">
            
            <!-- Mobile Notch / Island -->
            ${config.device === 'mobile' && config.orientation === 'portrait' ? `
              <div style="width:96px; height:20px; background:#18181b; border-radius:0 0 12px 12px; margin:0 auto; display:flex; align-items:center; justify-content:center;">
                <span style="width:8px; height:8px; border-radius:50%; background:#09090b;"></span>
              </div>
            ` : ''}

            <!-- In-Screen App Content -->
            <div style="padding:16px; display:flex; flex-direction:column; gap:12px;">
              <!-- Header -->
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-weight:700; font-size:0.9rem; color:var(--text-main);">huragon/ui</span>
                <span style="font-size:0.7rem; color:var(--text-muted); font-family:var(--font-mono);">${w}×${h}</span>
              </div>

              <!-- Stat Card -->
              <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:10px; padding:12px;">
                <span style="font-size:0.7rem; color:var(--text-muted);">Active Breakpoint</span>
                <div style="font-size:1.2rem; font-weight:700; color:var(--text-main); margin-top:2px;">
                  ${config.device.toUpperCase()}
                </div>
              </div>

              <!-- Content Cards -->
              <div style="display:flex; flex-direction:column; gap:8px;">
                <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:8px; padding:10px; font-size:0.75rem; color:var(--text-muted);">
                  Fluid container scaling automatically adapts across viewports.
                </div>
                <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:8px; padding:10px; font-size:0.75rem; color:var(--text-muted);">
                  Hardware bezel simulator with zero layout jitter.
                </div>
              </div>

              <button class="btn btn-primary" style="margin-top:6px; font-size:0.75rem; padding:8px;">
                Explore Components
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function generateCode() {
    let w = 375;
    let h = 667;
    if (config.device === 'tablet') { w = 768; h = 1024; }
    if (config.device === 'laptop') { w = 1280; h = 800; }
    if (config.orientation === 'landscape' && config.device !== 'laptop') {
      const temp = w; w = h; h = temp;
    }

    const css = `/* Responsive Device Mockup Wrapper */
.device-frame {
  width: ${w}px;
  height: ${h}px;
  max-width: 100%;
  border-radius: 28px;
  border: 10px solid #18181b;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  position: relative;
  background-color: var(--bg-main);
}`;

    const tailwind = `<!-- Tailwind Device Mockup Container -->
<div class="w-[${w}px] h-[${h}px] max-w-full rounded-[28px] border-[10px] border-zinc-900 shadow-2xl overflow-hidden bg-zinc-950">
  <iframe src="/app" class="w-full h-full border-0"></iframe>
</div>`;

    onCodeChange({ css, tailwind });
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

  update();
}
