// Router & Module Loader
import { qs } from './utils/dom.js';
import { getToolMeta } from './tools-registry.js';

// Dynamic generator loaders map
const generatorsMap = {
  'mesh-gradient': () => import('./generators/mesh-gradient.js'),
  'glassmorphism': () => import('./generators/glassmorphism.js'),
  'box-shadow': () => import('./generators/box-shadow.js'),
  'svg-wave': () => import('./generators/svg-wave.js'),
  'button-generator': () => import('./generators/button-generator.js'),
  'neumorphism': () => import('./generators/neumorphism.js'),
  'loading-spinner': () => import('./generators/loading-spinner.js')
};

let activeModule = null;

export async function navigateTo(toolId, onCodeUpdate) {
  const loader = generatorsMap[toolId];
  const meta = getToolMeta(toolId);

  // Update top bar tool name & description
  if (meta) {
    const titleEl = qs('#current-tool-title');
    const descEl = qs('#current-tool-desc');
    if (titleEl) titleEl.innerHTML = `<span>${meta.icon || '🎨'}</span> ${meta.name}`;
    if (descEl) descEl.textContent = meta.desc;
  }

  // Update active sidebar nav styling
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
    // Elegant fallback view for tools currently in upcoming phases
    previewStage.innerHTML = `
      <div style="text-align:center; padding:40px; max-width:440px;">
        <div style="font-size:3rem; margin-bottom:12px;">🛠️</div>
        <h3 style="font-size:1.4rem; font-weight:700; margin-bottom:8px;">${meta ? meta.name : toolId}</h3>
        <p style="color:var(--text-muted); font-size:0.9rem; line-height:1.6; margin-bottom:20px;">
          This generator is registered in the <strong>Huragon/ui</strong> catalog and queued in the phased implementation roadmap.
        </p>
        <button class="btn btn-primary" onclick="location.hash='#mesh-gradient'">Open Mesh Gradient</button>
      </div>
    `;
    controlsStage.innerHTML = `
      <div style="padding:20px; color:var(--text-dim); font-size:0.85rem;">
        Select one of the live studio tools from the sidebar to customize and generate production-ready CSS.
      </div>
    `;
    onCodeUpdate({ css: `/* Selected tool: ${toolId} */\n/* Switch to Mesh Gradient, Glassmorphism, Box Shadow, Wave, Button, Soft UI, or Spinner */` });
    return;
  }

  try {
    const mod = await loader();
    activeModule = mod;
    mod.mount(qs('#workspace'), onCodeUpdate);
  } catch (err) {
    console.error('Failed to load tool module:', err);
  }
}
