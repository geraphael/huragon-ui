// Tool 5: Button Studio Generator (Interactive button archetypes with ripple, segmented pills & split menu)
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';

export const meta = {
  id: 'button-generator',
  name: 'Button Studio'
};

let config = {
  type: 'action', // action, segmented, split, loading
  label: 'Get Started',
  variant: 'primary', // primary, secondary, outline, ghost
  radius: 8,
  paddingX: 16,
  paddingY: 9,
  fontSize: 14,
  fontWeight: 500,
  hoverScale: 1.02,
  segmentedActive: 'Daily'
};

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    style: {
      width: '100%',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px',
      padding: '40px'
    }
  });

  const mountContainer = el('div', {
    id: 'button-preview-target',
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80px',
      position: 'relative'
    }
  });

  centerStage.appendChild(mountContainer);

  const interactiveHint = el('div', {
    style: {
      fontSize: '0.75rem',
      color: 'var(--text-dim)',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    innerHTML: `${ICONS.sparkles} <span>Click and hover the component above to test full live interactivity</span>`
  });
  centerStage.appendChild(interactiveHint);

  previewStage.appendChild(centerStage);

  renderButtonPreview();

  function renderButtonPreview() {
    mountContainer.innerHTML = '';

    if (config.type === 'action') {
      renderActionButton(mountContainer);
    } else if (config.type === 'heroui') {
      renderHeroUIVariants(mountContainer);
    } else if (config.type === 'segmented') {
      renderSegmentedPills(mountContainer);
    } else if (config.type === 'split') {
      renderSplitButton(mountContainer);
    } else if (config.type === 'loading') {
      renderLoadingButton(mountContainer);
    }

    updateCode();
  }

  // HeroUI & shadcn Button Palette Gallery
  function renderHeroUIVariants(target) {
    const grid = el('div', {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '14px',
        width: '100%',
        maxWidth: '520px'
      }
    });

    const variants = [
      { name: 'Solid', class: 'btn-solid', desc: 'Primary High-contrast' },
      { name: 'Flat', class: 'btn-flat', desc: 'Soft Elevated Background' },
      { name: 'Faded', class: 'btn-faded', desc: 'Subtle Surface Border' },
      { name: 'Bordered', class: 'btn-bordered', desc: '1.5px Geometric Outline' },
      { name: 'Light', class: 'btn-light', desc: 'Transparent Hover Fill' },
      { name: 'Loading', class: 'btn-solid btn-loading', desc: 'Async Spinner State' }
    ];

    variants.forEach(v => {
      const card = el('div', {
        style: {
          padding: '16px 12px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: `${config.radius}px`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          boxShadow: 'var(--shadow-sm)'
        }
      });

      const b = el('button', {
        className: `btn ${v.class}`,
        style: {
          padding: `${config.paddingY}px ${config.paddingX}px`,
          borderRadius: `${config.radius}px`,
          fontSize: `${config.fontSize}px`,
          fontWeight: config.fontWeight
        }
      });

      if (v.name === 'Loading') {
        b.innerHTML = `<span style="width:14px; height:14px; border:2px solid currentColor; border-right-color:transparent; border-radius:50%; animation:btnSpin 0.75s linear infinite; display:inline-block;"></span> <span>Saving...</span>`;
      } else {
        b.innerHTML = `<span>${v.name}</span>`;
      }

      b.onmousedown = (e) => {
        b.style.transform = 'scale(0.96)';
        createRipple(e, b);
      };
      b.onmouseup = () => { b.style.transform = 'scale(1)'; };

      card.appendChild(b);
      card.appendChild(el('span', { style: { fontSize: '0.68rem', color: 'var(--text-dim)', textAlign: 'center' }, textContent: v.desc }));
      grid.appendChild(card);
    });

    target.appendChild(grid);
  }

  // 1. Action Button with ripple
  function renderActionButton(target) {
    const btn = el('button', {
      className: `ui-studio-btn ${config.variant}`,
      style: {
        fontSize: `${config.fontSize}px`,
        fontWeight: config.fontWeight,
        padding: `${config.paddingY}px ${config.paddingX}px`,
        borderRadius: `${config.radius}px`,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        userSelect: 'none',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.15s ease',
        border: '1px solid transparent'
      }
    });

    if (config.variant === 'primary') {
      btn.style.background = 'var(--text-main)';
      btn.style.color = 'var(--bg-app)';
      btn.style.borderColor = 'var(--text-main)';
    } else if (config.variant === 'secondary') {
      btn.style.background = 'var(--bg-card)';
      btn.style.color = 'var(--text-main)';
      btn.style.borderColor = 'var(--border)';
    } else if (config.variant === 'outline') {
      btn.style.background = 'transparent';
      btn.style.color = 'var(--text-main)';
      btn.style.borderColor = 'var(--border-strong)';
    } else if (config.variant === 'ghost') {
      btn.style.background = 'transparent';
      btn.style.color = 'var(--text-muted)';
    }

    btn.innerHTML = `<span>${config.label}</span> ${ICONS.arrowUpRight}`;

    btn.onmouseenter = () => {
      btn.style.transform = `scale(${config.hoverScale})`;
      if (config.variant === 'ghost') btn.style.background = 'var(--bg-hover)';
    };
    btn.onmouseleave = () => {
      btn.style.transform = 'scale(1)';
      if (config.variant === 'ghost') btn.style.background = 'transparent';
    };
    btn.onmousedown = (e) => {
      btn.style.transform = 'scale(0.97)';
      createRipple(e, btn);
    };
    btn.onmouseup = () => {
      btn.style.transform = `scale(${config.hoverScale})`;
    };

    target.appendChild(btn);
  }

  // 2. Segmented Pill Switcher (Inspiration: Astra & MikroTik dashboards)
  function renderSegmentedPills(target) {
    const wrapper = el('div', {
      className: 'segmented-pill-bar',
      style: {
        borderRadius: `${config.radius * 2}px`
      }
    });

    const items = ['Daily', 'Weekly', 'Monthly', 'Yearly', 'Custom'];
    items.forEach(it => {
      const pill = el('button', {
        className: `segmented-pill-btn ${config.segmentedActive === it ? 'active' : ''}`,
        textContent: it,
        onclick: () => {
          config.segmentedActive = it;
          renderSegmentedPills(target);
          updateCode();
        }
      });
      wrapper.appendChild(pill);
    });

    target.appendChild(wrapper);
  }

  // 3. Split Action Button with Dropdown (Inspiration: DigitalOcean)
  function renderSplitButton(target) {
    const splitWrap = el('div', {
      className: 'split-button-container',
      style: {
        borderRadius: `${config.radius}px`
      }
    });

    const mainBtn = el('button', {
      className: 'split-button-main',
      textContent: 'Deploy application',
      onclick: () => {
        mainBtn.style.opacity = '0.7';
        setTimeout(() => mainBtn.style.opacity = '1', 120);
      }
    });

    const arrowBtn = el('button', {
      className: 'split-button-arrow',
      innerHTML: ICONS.chevronDown
    });

    const menu = el('div', {
      className: 'split-dropdown-menu',
      style: { display: 'none' }
    }, [
      el('div', { className: 'split-dropdown-item', innerHTML: `<span>Deploy latest commit</span> ${ICONS.arrowUpRight}` }),
      el('div', { className: 'split-dropdown-item', innerHTML: `<span>Redeploy with clean cache</span>` }),
      el('div', { className: 'split-dropdown-item', innerHTML: `<span>Download production bundle</span>` })
    ]);

    arrowBtn.onclick = (e) => {
      e.stopPropagation();
      menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    };

    document.addEventListener('click', () => {
      if (menu) menu.style.display = 'none';
    });

    splitWrap.appendChild(mainBtn);
    splitWrap.appendChild(arrowBtn);
    splitWrap.appendChild(menu);
    target.appendChild(splitWrap);
  }

  // 4. Loading Async Button
  function renderLoadingButton(target) {
    const btn = el('button', {
      className: 'btn btn-primary',
      style: {
        padding: `${config.paddingY}px ${config.paddingX + 6}px`,
        borderRadius: `${config.radius}px`,
        fontSize: `${config.fontSize}px`,
        fontWeight: config.fontWeight,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer'
      }
    });

    let isLoading = false;
    btn.innerHTML = `<span>Submit Request</span>`;

    btn.onclick = () => {
      if (isLoading) return;
      isLoading = true;
      btn.innerHTML = `
        <span class="loading-spin-circle" style="width:14px; height:14px; border:2px solid currentColor; border-top-color:transparent; border-radius:50%; display:inline-block; animation:btnSpin 0.7s linear infinite;"></span>
        <span>Processing...</span>
      `;
      btn.style.opacity = '0.85';
      btn.style.pointerEvents = 'none';

      setTimeout(() => {
        isLoading = false;
        btn.innerHTML = `${ICONS.checkCircle} <span>Completed</span>`;
        btn.style.background = '#10b981';
        btn.style.borderColor = '#10b981';
        btn.style.color = '#ffffff';

        setTimeout(() => {
          btn.innerHTML = `<span>Submit Request</span>`;
          btn.style.background = 'var(--text-main)';
          btn.style.borderColor = 'var(--text-main)';
          btn.style.color = 'var(--bg-app)';
          btn.style.opacity = '1';
          btn.style.pointerEvents = 'auto';
        }, 1600);
      }, 1200);
    };

    target.appendChild(btn);
  }

  function createRipple(e, btn) {
    const circle = document.createElement('span');
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const radius = diameter / 2;
    const rect = btn.getBoundingClientRect();

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.style.position = 'absolute';
    circle.style.borderRadius = '50%';
    circle.style.background = 'rgba(255, 255, 255, 0.25)';
    circle.style.transform = 'scale(0)';
    circle.style.animation = 'rippleAnim 0.4s linear';
    circle.style.pointerEvents = 'none';

    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 400);
  }

  function updateCode() {
    let css = '';
    let tailwind = '';

    if (config.type === 'action') {
      css = `/* Huragon/ui — Interactive Action Button */
.ui-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: ${config.paddingY}px ${config.paddingX}px;
  font-size: ${config.fontSize}px;
  font-weight: ${config.fontWeight};
  border-radius: ${config.radius}px;
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
}

.ui-button:hover {
  transform: scale(${config.hoverScale});
}

.ui-button:active {
  transform: scale(0.97);
}`;
      tailwind = `<button class="inline-flex items-center gap-2 px-[${config.paddingX}px] py-[${config.paddingY}px] text-[${config.fontSize}px] font-[${config.fontWeight}] rounded-[${config.radius}px] bg-zinc-100 text-zinc-900 transition-all hover:scale-[${config.hoverScale}] active:scale-95">
  ${config.label}
</button>`;
    } else if (config.type === 'segmented') {
      css = `/* Huragon/ui — Segmented Pill Control */
.segmented-pill-bar {
  display: inline-flex;
  align-items: center;
  padding: 3px;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: 999px;
}

.segmented-pill-btn {
  padding: 4px 12px;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-muted);
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 999px;
  transition: all 0.15s ease;
}

.segmented-pill-btn.active {
  color: var(--bg-app);
  background: var(--text-main);
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}`;
      tailwind = `<div class="inline-flex items-center p-1 bg-zinc-900 border border-zinc-800 rounded-full">
  <button class="px-3 py-1 text-xs font-semibold rounded-full bg-zinc-100 text-zinc-900 shadow">Daily</button>
  <button class="px-3 py-1 text-xs font-medium rounded-full text-zinc-400 hover:text-zinc-100">Weekly</button>
  <button class="px-3 py-1 text-xs font-medium rounded-full text-zinc-400 hover:text-zinc-100">Monthly</button>
</div>`;
    } else if (config.type === 'split') {
      css = `/* Huragon/ui — Split Action Dropdown */
.split-button {
  display: inline-flex;
  border-radius: ${config.radius}px;
  border: 1px solid var(--border-strong);
  background: var(--bg-card);
}

.split-button-main {
  padding: 6px 12px;
  border-right: 1px solid var(--border);
}

.split-button-arrow {
  padding: 6px 8px;
}`;
      tailwind = `<div class="inline-flex border border-zinc-800 rounded-[${config.radius}px] bg-zinc-900">
  <button class="px-3 py-1.5 text-xs text-zinc-100 border-r border-zinc-800 hover:bg-zinc-800">Deploy</button>
  <button class="px-2 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800">⌵</button>
</div>`;
    } else if (config.type === 'loading') {
      css = `/* Huragon/ui — Async Loading State Button */
@keyframes btnSpin {
  to { transform: rotate(360deg); }
}

.btn-loading {
  opacity: 0.85;
  pointer-events: none;
}`;
      tailwind = `<button disabled class="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-md bg-zinc-100 text-zinc-900 opacity-80 cursor-not-allowed">
  <svg class="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24"></svg>
  Processing...
</button>`;
    }

    onCodeChange({ css, tailwind });
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const sec = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', textContent: 'Button Archetype' }),

      el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', marginBottom: '16px' } }, [
        { id: 'heroui', name: 'HeroUI Palette' },
        { id: 'action', name: 'Action Ripple' },
        { id: 'segmented', name: 'Segmented Pill' },
        { id: 'split', name: 'Split Dropdown' },
        { id: 'loading', name: 'Async Loading' }
      ].map(t => el('button', {
        className: `btn ${config.type === t.id ? 'btn-primary' : 'btn-outline'}`,
        style: { padding: '6px 8px', fontSize: '0.72rem' },
        textContent: t.name,
        onclick: () => {
          config.type = t.id;
          renderControls();
          renderButtonPreview();
        }
      }))),

      ...(config.type === 'action' ? [
        el('div', { className: 'control-group' }, [
          el('div', { className: 'control-label-row' }, [
            el('span', { className: 'control-label', textContent: 'Button Label' })
          ]),
          el('input', {
            type: 'text',
            value: config.label,
            style: {
              width: '100%',
              padding: '7px 10px',
              background: 'var(--bg-input)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-main)',
              fontSize: '0.8rem'
            },
            oninput: (e) => {
              config.label = e.target.value;
              renderButtonPreview();
            }
          })
        ]),

        el('div', { className: 'control-group' }, [
          el('div', { className: 'control-label-row' }, [
            el('span', { className: 'control-label', textContent: 'Style Variant' })
          ]),
          el('div', { style: { display: 'flex', gap: '6px' } }, [
            'primary', 'secondary', 'outline', 'ghost'
          ].map(v => el('button', {
            className: `btn ${config.variant === v ? 'btn-primary' : 'btn-outline'}`,
            style: { flex: '1', padding: '5px 8px', fontSize: '0.72rem', textTransform: 'capitalize' },
            textContent: v,
            onclick: () => {
              config.variant = v;
              renderControls();
              renderButtonPreview();
            }
          })))
        ])
      ] : []),

      el('div', { className: 'section-title', textContent: 'Geometry' }),

      createSlider('Border Radius', config.radius, 0, 24, (v) => { config.radius = v; renderButtonPreview(); }, 'px'),
      createSlider('Horizontal Padding', config.paddingX, 8, 36, (v) => { config.paddingX = v; renderButtonPreview(); }, 'px'),
      createSlider('Vertical Padding', config.paddingY, 4, 18, (v) => { config.paddingY = v; renderButtonPreview(); }, 'px')
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
          const v = parseFloat(e.target.value);
          valSpan.textContent = `${v}${unit}`;
          onChange(v);
        }
      })
    ]);
  }

  renderControls();
}
