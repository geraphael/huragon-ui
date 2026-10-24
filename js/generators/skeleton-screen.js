// Tool: Skeleton Screen & Shimmer Loader
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';

export const meta = {
  id: 'skeleton-screen',
  name: 'Skeleton Loader'
};

let config = {
  type: 'card', // 'card', 'profile', 'article'
  baseColor: '#27272a',
  highlightColor: '#3f3f46',
  speed: 1.5,
  borderRadius: 8,
  animationType: 'shimmer', // 'shimmer' or 'pulse'
  loaded: false // interactive reveal toggle
};

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
      gap: '16px',
      padding: '24px'
    }
  });

  const previewBox = el('div', {
    id: 'skeleton-preview-box',
    style: {
      width: '100%',
      maxWidth: '440px',
      padding: '24px',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-md)',
      transition: 'all 0.3s ease'
    }
  });

  // Floating interactive reveal pill above the card
  const toggleBar = el('div', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '4px 10px',
      borderRadius: '999px',
      background: 'var(--bg-input)',
      border: '1px solid var(--border)'
    }
  }, [
    el('span', { style: { fontSize: '0.75rem', color: 'var(--text-muted)' }, textContent: 'State:' }),
    el('button', {
      className: `btn ${!config.loaded ? 'btn-primary' : 'btn-outline'}`,
      style: { fontSize: '0.72rem', padding: '3px 10px', borderRadius: '999px' },
      textContent: 'Skeleton Loading',
      onclick: () => {
        config.loaded = false;
        update();
      }
    }),
    el('button', {
      className: `btn ${config.loaded ? 'btn-primary' : 'btn-outline'}`,
      style: { fontSize: '0.72rem', padding: '3px 10px', borderRadius: '999px' },
      textContent: 'Revealed Content',
      onclick: () => {
        config.loaded = true;
        update();
      }
    })
  ]);

  centerStage.appendChild(toggleBar);
  centerStage.appendChild(previewBox);
  previewStage.appendChild(centerStage);

  // Render controls
  controlsStage.innerHTML = '';

  const section = el('div', { className: 'control-section' }, [
    el('div', { className: 'control-section-header' }, [
      el('h4', { className: 'control-section-title', textContent: 'Skeleton Preset' })
    ]),
    el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' } }, [
      createTypeBtn('Card', 'card'),
      createTypeBtn('Profile', 'profile'),
      createTypeBtn('Article', 'article')
    ]),

    el('div', { className: 'control-section-header' }, [
      el('h4', { className: 'control-section-title', textContent: 'Animation Style' })
    ]),
    el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' } }, [
      createAnimBtn('Wave Shimmer', 'shimmer'),
      createAnimBtn('Gentle Pulse', 'pulse')
    ]),

    el('div', { className: 'control-section-header' }, [
      el('h4', { className: 'control-section-title', textContent: 'Appearance & Timing' })
    ]),
    createSlider('Animation Duration', 0.6, 3.0, 0.1, config.speed, 's', (v) => {
      config.speed = v;
      update();
    }),
    createSlider('Border Radius', 0, 24, 1, config.borderRadius, 'px', (v) => {
      config.borderRadius = v;
      update();
    }),

    el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' } }, [
      createColorControl('Base Color', config.baseColor, (v) => {
        config.baseColor = v;
        update();
      }),
      createColorControl('Highlight Color', config.highlightColor, (v) => {
        config.highlightColor = v;
        update();
      })
    ]),

    el('div', { style: { marginTop: '20px', display: 'flex', gap: '8px' } }, [
      el('button', {
        className: 'btn btn-outline',
        style: { flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' },
        innerHTML: `${ICONS.refresh} Reset Defaults`,
        onclick: () => {
          config = {
            type: 'card',
            baseColor: '#27272a',
            highlightColor: '#3f3f46',
            speed: 1.5,
            borderRadius: 8,
            animationType: 'shimmer',
            loaded: false
          };
          mount(container, onCodeChange);
        }
      })
    ])
  ]);

  controlsStage.appendChild(section);

  function createTypeBtn(label, type) {
    const btn = el('button', {
      className: `btn btn-outline ${config.type === type ? 'active' : ''}`,
      style: { fontSize: '0.8rem', padding: '6px 10px' },
      textContent: label,
      onclick: (e) => {
        config.type = type;
        controlsStage.querySelectorAll('.btn-outline').forEach(b => {
          if (['Card', 'Profile', 'Article'].includes(b.textContent.trim())) {
            b.classList.remove('active');
          }
        });
        e.currentTarget.classList.add('active');
        update();
      }
    });
    return btn;
  }

  function createAnimBtn(label, anim) {
    const btn = el('button', {
      className: `btn btn-outline ${config.animationType === anim ? 'active' : ''}`,
      style: { fontSize: '0.8rem', padding: '6px 10px' },
      textContent: label,
      onclick: (e) => {
        config.animationType = anim;
        controlsStage.querySelectorAll('.btn-outline').forEach(b => {
          if (['Wave Shimmer', 'Gentle Pulse'].includes(b.textContent.trim())) {
            b.classList.remove('active');
          }
        });
        e.currentTarget.classList.add('active');
        update();
      }
    });
    return btn;
  }

  function update() {
    // Re-sync toggle bar buttons
    const btns = toggleBar.querySelectorAll('button');
    if (btns.length === 2) {
      btns[0].className = `btn ${!config.loaded ? 'btn-primary' : 'btn-outline'}`;
      btns[1].className = `btn ${config.loaded ? 'btn-primary' : 'btn-outline'}`;
    }

    renderSkeletonPreview(previewBox);
    generateCode();
  }

  function generateCode() {
    let css = '';
    let tailwind = '';

    if (config.animationType === 'shimmer') {
      css = `/* Shimmer Skeleton Loader */
.skeleton {
  background: linear-gradient(
    90deg,
    ${config.baseColor} 0%,
    ${config.highlightColor} 50%,
    ${config.baseColor} 100%
  );
  background-size: 200% 100%;
  animation: shimmer ${config.speed}s infinite linear;
  border-radius: ${config.borderRadius}px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}`;
      tailwind = `<!-- Tailwind Shimmer Item -->
<div class="animate-pulse bg-zinc-800 rounded-[${config.borderRadius}px] h-6 w-full"></div>`;
    } else {
      css = `/* Gentle Pulse Skeleton Loader */
.skeleton {
  background-color: ${config.baseColor};
  animation: pulse ${config.speed}s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  border-radius: ${config.borderRadius}px;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}`;
      tailwind = `<!-- Tailwind Pulse Skeleton -->
<div class="animate-pulse bg-zinc-800 rounded-[${config.borderRadius}px] h-6 w-full"></div>`;
    }

    onCodeChange({ css, tailwind });
  }

  update();
}

function renderSkeletonPreview(container) {
  let styleEl = qs('#skeleton-live-style');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'skeleton-live-style';
    document.head.appendChild(styleEl);
  }

  if (config.animationType === 'shimmer') {
    styleEl.textContent = `
      @keyframes huragon-shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      .huragon-skeleton-el {
        background: linear-gradient(90deg, ${config.baseColor} 0%, ${config.highlightColor} 50%, ${config.baseColor} 100%);
        background-size: 200% 100%;
        animation: huragon-shimmer ${config.speed}s infinite linear;
        border-radius: ${config.borderRadius}px;
      }
    `;
  } else {
    styleEl.textContent = `
      @keyframes huragon-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.35; }
      }
      .huragon-skeleton-el {
        background-color: ${config.baseColor};
        animation: huragon-pulse ${config.speed}s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        border-radius: ${config.borderRadius}px;
      }
    `;
  }

  if (config.loaded) {
    // Render Revealed Real Content
    if (config.type === 'card') {
      container.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div style="height:180px; width:100%; border-radius:${config.borderRadius}px; background:#18181b; border:1px solid #27272a; display:flex; align-items:center; justify-content:center; color:var(--text-dim); font-size:0.85rem;">
            <span>Cover Graphic Preview</span>
          </div>
          <div style="display:flex; flex-direction:column; gap:6px;">
            <div style="font-size:1.05rem; font-weight:600; color:var(--text-main);">Production Ready UI Architecture</div>
            <div style="font-size:0.825rem; color:var(--text-muted); line-height:1.45;">
              Zero-dependency, high performance components built specifically for modern developer applications.
            </div>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
            <button class="btn btn-primary" style="padding:5px 12px; font-size:0.75rem;">Explore Docs</button>
            <span style="font-size:0.75rem; color:var(--text-dim);">3 min read</span>
          </div>
        </div>
      `;
    } else if (config.type === 'profile') {
      container.innerHTML = `
        <div style="display:flex; align-items:center; gap:16px;">
          <div style="width:56px; height:56px; border-radius:50%; background:#27272a; border:2px solid #3f3f46; display:flex; align-items:center; justify-content:center; font-weight:600; color:var(--text-main); font-size:1.1rem; flex-shrink:0;">
            JH
          </div>
          <div style="display:flex; flex-direction:column; gap:3px; width:100%;">
            <div style="font-size:1rem; font-weight:600; color:var(--text-main);">Jordan Howard</div>
            <div style="font-size:0.8rem; color:var(--text-dim);">Principal Systems Architect</div>
          </div>
        </div>
        <div style="margin-top:16px; font-size:0.825rem; color:var(--text-muted); line-height:1.5;">
          Building resilient distributed systems, edge runtimes, and developer tooling across the open web.
        </div>
      `;
    } else {
      container.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:14px;">
          <div style="font-size:1.15rem; font-weight:700; color:var(--text-main);">Distributed Consensus at Scale</div>
          <p style="font-size:0.825rem; color:var(--text-muted); line-height:1.55; margin:0;">
            Understanding the Raft consensus algorithm begins with the concept of replicated state machines. Each node in the cluster maintains an identical sequence of operational log entries.
          </p>
          <p style="font-size:0.825rem; color:var(--text-muted); line-height:1.55; margin:0;">
            By ensuring leader election transitions smoothly across terms, cluster partitions can be tolerated with zero loss of persistent transactional guarantees.
          </p>
        </div>
      `;
    }
    return;
  }

  // Render Skeleton Placeholders
  if (config.type === 'card') {
    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:16px;">
        <div class="huragon-skeleton-el" style="height:180px; width:100%;"></div>
        <div style="display:flex; flex-direction:column; gap:10px;">
          <div class="huragon-skeleton-el" style="height:20px; width:75%;"></div>
          <div class="huragon-skeleton-el" style="height:14px; width:95%;"></div>
          <div class="huragon-skeleton-el" style="height:14px; width:60%;"></div>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
          <div class="huragon-skeleton-el" style="height:32px; width:90px;"></div>
          <div class="huragon-skeleton-el" style="height:32px; width:32px; border-radius:50%;"></div>
        </div>
      </div>
    `;
  } else if (config.type === 'profile') {
    container.innerHTML = `
      <div style="display:flex; align-items:center; gap:16px;">
        <div class="huragon-skeleton-el" style="width:56px; height:56px; border-radius:50%; flex-shrink:0;"></div>
        <div style="display:flex; flex-direction:column; gap:10px; width:100%;">
          <div class="huragon-skeleton-el" style="height:16px; width:55%;"></div>
          <div class="huragon-skeleton-el" style="height:12px; width:80%;"></div>
        </div>
      </div>
      <div style="display:flex; flex-direction:column; gap:10px; margin-top:20px;">
        <div class="huragon-skeleton-el" style="height:12px; width:100%;"></div>
        <div class="huragon-skeleton-el" style="height:12px; width:90%;"></div>
        <div class="huragon-skeleton-el" style="height:12px; width:70%;"></div>
      </div>
    `;
  } else {
    // Article
    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:14px;">
        <div class="huragon-skeleton-el" style="height:24px; width:60%; margin-bottom:4px;"></div>
        <div class="huragon-skeleton-el" style="height:14px; width:100%;"></div>
        <div class="huragon-skeleton-el" style="height:14px; width:98%;"></div>
        <div class="huragon-skeleton-el" style="height:14px; width:94%;"></div>
        <div class="huragon-skeleton-el" style="height:14px; width:82%;"></div>
        <div style="height:10px;"></div>
        <div class="huragon-skeleton-el" style="height:14px; width:96%;"></div>
        <div class="huragon-skeleton-el" style="height:14px; width:75%;"></div>
      </div>
    `;
  }
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
