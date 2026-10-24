// Tool: Modern Responsive Navbar Generator
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';

export const meta = {
  id: 'navbar-builder',
  name: 'Navbar Generator'
};

let config = {
  style: 'glass', // 'glass', 'solid', 'floating'
  sticky: true,
  blurAmount: 12,
  bgOpacity: 0.85,
  borderBottom: true,
  brandText: 'Acme UI',
  linksAlignment: 'center', // 'center', 'right'
  paddingY: 14,
  ctaText: 'Get Started'
};

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    id: 'navbar-preview-container',
    style: {
      width: '100%',
      height: '100%',
      position: 'relative',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      background: 'var(--bg-main)',
      border: '1px solid var(--border)'
    }
  });

  previewStage.appendChild(centerStage);

  // Controls
  controlsStage.innerHTML = '';

  const section = el('div', { className: 'control-section' }, [
    el('div', { className: 'control-section-header' }, [
      el('h4', { className: 'control-section-title', textContent: 'Navbar Style' })
    ]),
    el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' } }, [
      createStyleBtn('Frosted Glass', 'glass'),
      createStyleBtn('Solid Zinc', 'solid'),
      createStyleBtn('Floating Island', 'floating')
    ]),

    el('div', { className: 'control-section-header' }, [
      el('h4', { className: 'control-section-title', textContent: 'Dimensions & Blur' })
    ]),
    createSlider('Vertical Padding', 8, 24, 2, config.paddingY, 'px', (v) => {
      config.paddingY = v;
      update();
    }),
    createSlider('Backdrop Blur', 0, 24, 2, config.blurAmount, 'px', (v) => {
      config.blurAmount = v;
      update();
    }),
    createSlider('Background Opacity', 0.2, 1.0, 0.05, config.bgOpacity, '', (v) => {
      config.bgOpacity = v;
      update();
    }),

    el('div', { className: 'control-section-header', style: { marginTop: '16px' } }, [
      el('h4', { className: 'control-section-title', textContent: 'Layout & Options' })
    ]),
    createToggle('Sticky to Top', config.sticky, (v) => {
      config.sticky = v;
      update();
    }),
    createToggle('Bottom Border Divider', config.borderBottom, (v) => {
      config.borderBottom = v;
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
          if (['Frosted Glass', 'Solid Zinc', 'Floating Island'].includes(b.textContent.trim())) {
            b.classList.remove('active');
          }
        });
        e.currentTarget.classList.add('active');
        update();
      }
    });
  }

  function update() {
    renderNavbar(centerStage);
    generateCode();
  }

  function renderNavbar(target) {
    let navStyle = '';
    let containerStyle = '';

    if (config.style === 'glass') {
      navStyle = `
        background: rgba(18, 18, 22, ${config.bgOpacity});
        backdrop-filter: blur(${config.blurAmount}px);
        -webkit-backdrop-filter: blur(${config.blurAmount}px);
        border-bottom: ${config.borderBottom ? '1px solid var(--border)' : 'none'};
      `;
    } else if (config.style === 'solid') {
      navStyle = `
        background: #18181b;
        border-bottom: ${config.borderBottom ? '1px solid var(--border)' : 'none'};
      `;
    } else {
      // Floating Island
      containerStyle = 'padding: 16px 20px;';
      navStyle = `
        margin: 0 auto;
        max-width: 900px;
        background: rgba(24, 24, 27, ${config.bgOpacity});
        backdrop-filter: blur(${config.blurAmount}px);
        border: 1px solid var(--border);
        border-radius: 999px;
        box-shadow: 0 8px 32px -4px rgba(0,0,0,0.4);
      `;
    }

    target.innerHTML = `
      <div style="width:100%; height:100%; position:relative; overflow-y:auto; display:flex; flex-direction:column; ${containerStyle}">
        <!-- Navbar -->
        <header style="width:100%; z-index:10; ${navStyle} transition:all 0.2s ease;">
          <div style="max-width:1120px; margin:0 auto; padding:${config.paddingY}px 24px; display:flex; align-items:center; justify-content:space-between;">
            <!-- Brand -->
            <div style="display:flex; align-items:center; gap:10px;">
              <div style="width:28px; height:28px; border-radius:6px; background:#ffffff; color:#09090b; font-weight:700; font-size:0.85rem; display:flex; align-items:center; justify-content:center;">
                A
              </div>
              <span style="font-weight:600; font-size:0.95rem; color:var(--text-main); letter-spacing:-0.02em;">${config.brandText}</span>
            </div>

            <!-- Links -->
            <nav style="display:flex; align-items:center; gap:20px; font-size:0.85rem; color:var(--text-muted);">
              <span style="cursor:pointer; color:var(--text-main); font-weight:500;">Features</span>
              <span style="cursor:pointer;">Solutions</span>
              <span style="cursor:pointer;">Changelog</span>
              <span style="cursor:pointer;">Pricing</span>
            </nav>

            <!-- Actions -->
            <div style="display:flex; align-items:center; gap:10px;">
              <button class="btn btn-primary" style="padding:6px 14px; font-size:0.8rem; border-radius:${config.style === 'floating' ? '999px' : 'var(--radius-sm)'};">
                ${config.ctaText}
              </button>
            </div>
          </div>
        </header>

        <!-- Mock Page Content Behind / Beneath -->
        <div style="padding:48px 24px; max-width:800px; margin:0 auto; text-align:center;">
          <h2 style="font-size:1.8rem; font-weight:700; color:var(--text-main); letter-spacing:-0.03em; margin-bottom:12px;">
            Next-Generation Application Interface
          </h2>
          <p style="color:var(--text-muted); font-size:0.925rem; line-height:1.6; max-width:540px; margin:0 auto;">
            Experience effortless navigation with clean monochromatic typography, frosted glass physics, and adaptive responsive constraints.
          </p>
        </div>
      </div>
    `;
  }

  function generateCode() {
    let css = '';
    let tailwind = '';

    if (config.style === 'glass') {
      css = `/* Frosted Glass Sticky Navbar */
.navbar {
  position: ${config.sticky ? 'sticky' : 'relative'};
  top: 0;
  width: 100%;
  z-index: 50;
  padding: ${config.paddingY}px 24px;
  background-color: rgba(18, 18, 22, ${config.bgOpacity});
  backdrop-filter: blur(${config.blurAmount}px);
  -webkit-backdrop-filter: blur(${config.blurAmount}px);
  ${config.borderBottom ? 'border-bottom: 1px solid var(--border);' : ''}
}`;
      tailwind = `<!-- Tailwind Frosted Glass Navbar -->
<header class="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md px-6 py-3.5">
  <div class="max-w-6xl mx-auto flex items-center justify-between">
    <div class="font-semibold text-white tracking-tight">${config.brandText}</div>
    <nav class="hidden md:flex items-center gap-6 text-sm text-zinc-400">
      <a href="#" class="text-white">Features</a>
      <a href="#" class="hover:text-white">Pricing</a>
      <a href="#" class="hover:text-white">Docs</a>
    </nav>
    <button class="bg-white text-zinc-950 font-medium text-xs px-3.5 py-1.5 rounded-md hover:bg-zinc-200">
      ${config.ctaText}
    </button>
  </div>
</header>`;
    } else if (config.style === 'floating') {
      css = `/* Floating Island Navbar */
.navbar-island {
  position: ${config.sticky ? 'sticky' : 'relative'};
  top: 16px;
  max-width: 900px;
  margin: 0 auto;
  z-index: 50;
  padding: ${config.paddingY}px 24px;
  background-color: rgba(24, 24, 27, ${config.bgOpacity});
  backdrop-filter: blur(${config.blurAmount}px);
  border: 1px solid var(--border);
  border-radius: 9999px;
  box-shadow: 0 8px 32px -4px rgba(0, 0, 0, 0.4);
}`;
      tailwind = `<!-- Tailwind Floating Island Navbar -->
<header class="sticky top-4 z-50 max-w-4xl mx-auto border border-zinc-800 bg-zinc-900/80 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl">
  <div class="flex items-center justify-between">
    <span class="font-semibold text-white tracking-tight">${config.brandText}</span>
    <nav class="flex items-center gap-6 text-sm text-zinc-400">
      <a href="#" class="text-white">Features</a>
      <a href="#" class="hover:text-white">Pricing</a>
    </nav>
    <button class="bg-white text-zinc-950 text-xs font-medium px-4 py-1.5 rounded-full">
      ${config.ctaText}
    </button>
  </div>
</header>`;
    } else {
      css = `/* Solid Zinc Navbar */
.navbar-solid {
  position: ${config.sticky ? 'sticky' : 'relative'};
  top: 0;
  width: 100%;
  z-index: 50;
  padding: ${config.paddingY}px 24px;
  background-color: #18181b;
  ${config.borderBottom ? 'border-bottom: 1px solid var(--border);' : ''}
}`;
      tailwind = `<!-- Tailwind Solid Navbar -->
<header class="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-900 px-6 py-3.5">
  <div class="max-w-6xl mx-auto flex items-center justify-between">
    <div class="font-semibold text-white">${config.brandText}</div>
    <button class="bg-white text-zinc-950 text-xs px-3.5 py-1.5 rounded-md font-medium">
      ${config.ctaText}
    </button>
  </div>
</header>`;
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

function createToggle(label, initial, onChange) {
  const wrapper = el('div', { className: 'control-item', style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' } });
  const lbl = el('label', { className: 'control-label', textContent: label });
  const chk = el('input', {
    type: 'checkbox',
    checked: initial,
    style: { cursor: 'pointer', width: '16px', height: '16px', accentColor: '#ffffff' },
    onchange: (e) => onChange(e.target.checked)
  });

  wrapper.appendChild(lbl);
  wrapper.appendChild(chk);
  return wrapper;
}
