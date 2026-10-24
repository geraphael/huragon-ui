// Tool: Modern CSS Reset Generator
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';

export const meta = {
  id: 'css-reset',
  name: 'CSS Reset Generator'
};

let rules = {
  boxSizing: true,
  marginZero: true,
  responsiveMedia: true,
  formFonts: true,
  smoothScroll: true,
  accessibleLineHeight: true,
  isolationRoot: true
};

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    id: 'reset-preview-container',
    style: {
      width: '100%',
      maxWidth: '620px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }
  });

  previewStage.appendChild(centerStage);

  // Controls
  controlsStage.innerHTML = '';

  const section = el('div', { className: 'control-section' }, [
    el('div', { className: 'control-section-header' }, [
      el('h4', { className: 'control-section-title', textContent: 'Reset Rules' })
    ]),
    createToggle('Box Sizing: border-box (Universal)', rules.boxSizing, (v) => {
      rules.boxSizing = v;
      update();
    }),
    createToggle('Remove default margins (body, headings, p)', rules.marginZero, (v) => {
      rules.marginZero = v;
      update();
    }),
    createToggle('Fluid responsive images & media', rules.responsiveMedia, (v) => {
      rules.responsiveMedia = v;
      update();
    }),
    createToggle('Form controls inherit font typography', rules.formFonts, (v) => {
      rules.formFonts = v;
      update();
    }),
    createToggle('Smooth scroll with prefers-reduced-motion', rules.smoothScroll, (v) => {
      rules.smoothScroll = v;
      update();
    }),
    createToggle('Accessible line-height & font smoothing', rules.accessibleLineHeight, (v) => {
      rules.accessibleLineHeight = v;
      update();
    }),
    createToggle('Root isolation context (avoid z-index leaks)', rules.isolationRoot, (v) => {
      rules.isolationRoot = v;
      update();
    })
  ]);

  controlsStage.appendChild(section);

  function update() {
    renderInfo(centerStage);
    generateCode();
  }

  function renderInfo(target) {
    target.innerHTML = `
      <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:24px; box-shadow:var(--shadow-md);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <h3 style="font-size:1.1rem; font-weight:600; color:var(--text-main);">Modern CSS Baseline</h3>
          <span style="font-size:0.75rem; font-family:var(--font-mono); color:var(--text-dim); background:var(--bg-main); padding:3px 8px; border-radius:4px; border:1px solid var(--border);">
            ${Object.values(rules).filter(Boolean).length} Rules Active
          </span>
        </div>
        <p style="font-size:0.85rem; line-height:1.6; color:var(--text-muted); margin-bottom:18px;">
          A lightweight, standard-compliant CSS reset modeled after modern best practices from Andy Bell and Josh Comeau. Eliminates inconsistent browser defaults without bloating page weight.
        </p>

        <!-- Preview Mock Layout -->
        <div style="background:var(--bg-main); border:1px solid var(--border); border-radius:var(--radius-md); padding:16px;">
          <h4 style="font-size:0.95rem; font-weight:600; color:var(--text-main); margin-bottom:6px;">Normalized Heading</h4>
          <p style="font-size:0.8rem; color:var(--text-muted); line-height:1.5; margin-bottom:12px;">Default browser margins stripped, inherited clean font smoothing.</p>
          <div style="display:flex; gap:8px;">
            <input type="text" placeholder="Inherited font..." style="background:var(--bg-card); border:1px solid var(--border); border-radius:4px; padding:6px 10px; font-size:0.8rem; color:var(--text-main); flex:1;" />
            <button class="btn btn-primary" style="padding:6px 12px; font-size:0.8rem;">Submit</button>
          </div>
        </div>
      </div>
    `;
  }

  function generateCode() {
    let parts = ['/* Huragon/ui Modern CSS Reset */'];

    if (rules.boxSizing) {
      parts.push(`/* 1. Use a more-intuitive box-sizing model */
*, *::before, *::after {
  box-sizing: border-box;
}`);
    }

    if (rules.marginZero) {
      parts.push(`/* 2. Remove default margin */
* {
  margin: 0;
  padding: 0;
}`);
    }

    if (rules.accessibleLineHeight) {
      parts.push(`/* 3. Add accessible line-height & text rendering */
body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}`);
    }

    if (rules.responsiveMedia) {
      parts.push(`/* 4. Improve media defaults */
img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}`);
    }

    if (rules.formFonts) {
      parts.push(`/* 5. Inherit fonts for form controls */
input, button, textarea, select {
  font: inherit;
}`);
    }

    if (rules.smoothScroll) {
      parts.push(`/* 6. Respect user motion preference for smooth scroll */
@media (prefers-reduced-motion: no-preference) {
  html:focus-within {
    scroll-behavior: smooth;
  }
}`);
    }

    if (rules.isolationRoot) {
      parts.push(`/* 7. Create a root stacking context */
#root, #__next, #app {
  isolation: isolate;
}`);
    }

    const css = parts.join('\n\n');
    const tailwind = `/* In Tailwind CSS, preflight handles most reset rules automatically.
Add custom overrides in globals.css if needed: */
@layer base {
  body {
    @apply antialiased text-zinc-100 bg-zinc-950;
  }
}`;

    onCodeChange({ css, tailwind });
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

  update();
}
