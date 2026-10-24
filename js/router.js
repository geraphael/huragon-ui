// Router & Module Loader
import { qs } from './utils/dom.js';
import { getToolMeta } from './tools-registry.js';

const generatorsMap = {
  // Gradients
  'mesh-gradient': () => import('./generators/mesh-gradient.js'),
  'gradient-builder': () => import('./generators/gradient-builder.js'),

  // Effects & Shadows
  'glassmorphism': () => import('./generators/glassmorphism.js'),
  'box-shadow': () => import('./generators/box-shadow.js'),
  'css-filters': () => import('./generators/css-filters.js'),
  'text-effects': () => import('./generators/text-effects.js'),
  'transform-3d': () => import('./generators/transform-3d.js'),
  'neumorphism': () => import('./generators/neumorphism.js'),

  // Shapes
  'svg-wave': () => import('./generators/svg-wave.js'),
  'clip-path': () => import('./generators/clip-path.js'),
  'border-radius': () => import('./generators/border-radius.js'),

  // Layout
  'flexbox-playground': () => import('./generators/flexbox-playground.js'),

  // Components
  'button-generator': () => import('./generators/button-generator.js'),
  'card-designer': () => import('./generators/card-designer.js'),
  'toggle-checkbox': () => import('./generators/toggle-checkbox.js'),
  'tooltip-generator': () => import('./generators/tooltip-generator.js'),
  'badge-tag': () => import('./generators/badge-tag.js'),

  // Animations & Loaders
  'loading-spinner': () => import('./generators/loading-spinner.js'),

  // Patterns
  'background-patterns': () => import('./generators/background-patterns.js'),

  // Utilities
  'scrollbar-styler': () => import('./generators/scrollbar-styler.js')
};

export async function navigateTo(toolId, onCodeUpdate) {
  const loader = generatorsMap[toolId];
  const meta = getToolMeta(toolId);

  if (meta) {
    const titleEl = qs('#current-tool-title');
    const descEl = qs('#current-tool-desc');
    if (titleEl) titleEl.textContent = meta.name;
    if (descEl) descEl.textContent = meta.desc;
  }

  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.dataset.toolId === toolId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  if (!loader) {
    previewStage.innerHTML = `
      <div style="text-align:center; padding:40px; max-width:400px;">
        <h3 style="font-size:1.15rem; font-weight:600; margin-bottom:8px; color:var(--text-main);">${meta ? meta.name : toolId}</h3>
        <p style="color:var(--text-muted); font-size:0.825rem; line-height:1.5; margin-bottom:20px;">
          This generator is registered in the Huragon catalog and will be available in the next release.
        </p>
        <button class="btn btn-primary" onclick="location.hash='#mesh-gradient'">Open Mesh Gradient</button>
      </div>
    `;
    controlsStage.innerHTML = `
      <div style="padding:16px; color:var(--text-dim); font-size:0.8rem;">
        Select an active generator from the navigation to configure CSS output.
      </div>
    `;
    onCodeUpdate({ css: `/* Selected tool: ${toolId} */\n/* Switch to an active tool in the sidebar */` });
    return;
  }

  try {
    const mod = await loader();
    mod.mount(qs('#workspace'), onCodeUpdate);
  } catch (err) {
    console.error('Failed to load tool module:', err);
  }
}
