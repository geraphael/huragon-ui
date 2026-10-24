// Tool: Typography & Prose System (HeroUI & shadcn/ui Specs + Mathematical Modular Scale)
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';
import { copyToClipboard } from '../clipboard.js';

export const meta = {
  id: 'typography-scale',
  name: 'Typography System'
};

let config = {
  tab: 'specimen', // 'specimen', 'article', 'scale'
  baseSize: 16,
  fontFamily: 'sans', // 'sans', 'serif', 'mono'
  ratioName: 'Major Third',
  ratio: 1.250
};

const RATIOS = [
  { name: 'Major Second', val: 1.125 },
  { name: 'Minor Third', val: 1.200 },
  { name: 'Major Third', val: 1.250 },
  { name: 'Perfect Fourth', val: 1.333 },
  { name: 'Augmented Fourth', val: 1.414 },
  { name: 'Golden Ratio', val: 1.618 }
];

const STEPS = [
  { key: '4xl', exp: 4, label: 'Hero Display' },
  { key: '3xl', exp: 3, label: 'Heading 1' },
  { key: '2xl', exp: 2, label: 'Heading 2' },
  { key: 'xl',  exp: 1, label: 'Heading 3' },
  { key: 'lg',  exp: 0.5, label: 'Heading 4' },
  { key: 'base', exp: 0, label: 'Body Text' },
  { key: 'sm',  exp: -1, label: 'Caption & Helper' },
  { key: 'xs',  exp: -2, label: 'Micro Footnote' }
];

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  previewStage.innerHTML = '';

  const centerStage = el('div', {
    id: 'typography-preview-container',
    style: {
      width: '100%',
      maxWidth: '840px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      padding: '20px 16px 60px'
    }
  });

  // Top Sub-Nav Tabs: Specimen vs Article Preview vs Modular Scale
  const tabNav = el('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      padding: '6px 10px',
      boxShadow: 'var(--shadow-sm)'
    }
  });

  tabNav.innerHTML = `
    <div style="display:flex; align-items:center; gap:6px;">
      <button class="btn btn-ghost typo-tab-btn ${config.tab === 'specimen' ? 'active' : ''}" data-tab="specimen" style="font-size:0.75rem; padding:5px 12px;">Hierarchy Specimen</button>
      <button class="btn btn-ghost typo-tab-btn ${config.tab === 'article' ? 'active' : ''}" data-tab="article" style="font-size:0.75rem; padding:5px 12px;">Editorial Article</button>
      <button class="btn btn-ghost typo-tab-btn ${config.tab === 'scale' ? 'active' : ''}" data-tab="scale" style="font-size:0.75rem; padding:5px 12px;">Modular Calculator</button>
    </div>
    <div style="font-size:0.7rem; font-family:var(--font-mono); color:var(--text-dim); background:var(--bg-main); padding:2px 8px; border-radius:4px; border:1px solid var(--border);">
      base: ${config.baseSize}px
    </div>
  `;

  tabNav.querySelectorAll('.typo-tab-btn').forEach(btn => {
    btn.onclick = () => {
      tabNav.querySelectorAll('.typo-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      config.tab = btn.dataset.tab;
      render();
    };
  });

  centerStage.appendChild(tabNav);

  const displayArea = el('div', { id: 'typography-display-area' });
  centerStage.appendChild(displayArea);
  previewStage.appendChild(centerStage);

  renderControls();
  render();

  function renderControls() {
    controlsStage.innerHTML = '';

    const section = el('div', { className: 'control-section' }, [
      el('div', { className: 'control-section-header' }, [
        el('h4', { className: 'control-section-title', textContent: 'Font Typeface' })
      ]),
      el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '16px' } }, [
        createFontFamilyBtn('Inter / Sans', 'sans'),
        createFontFamilyBtn('Serif', 'serif'),
        createFontFamilyBtn('Mono', 'mono')
      ]),

      el('div', { className: 'control-section-header' }, [
        el('h4', { className: 'control-section-title', textContent: 'Modular Ratio' })
      ]),
      el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', marginBottom: '16px' } },
        RATIOS.map(r => el('button', {
          className: `btn btn-outline ${config.ratioName === r.name ? 'active' : ''}`,
          style: { fontSize: '0.72rem', padding: '5px 8px' },
          textContent: `${r.name} (${r.val})`,
          onclick: () => {
            config.ratioName = r.name;
            config.ratio = r.val;
            renderControls();
            render();
          }
        }))
      ),

      el('div', { className: 'control-section-header' }, [
        el('h4', { className: 'control-section-title', textContent: 'Base Font Size' })
      ]),
      createSlider('Root Font Size', 13, 20, 1, config.baseSize, 'px', (v) => {
        config.baseSize = v;
        tabNav.querySelector('div:last-child').textContent = `base: ${config.baseSize}px`;
        render();
      })
    ]);

    controlsStage.appendChild(section);
  }

  function createFontFamilyBtn(label, key) {
    return el('button', {
      className: `btn btn-outline ${config.fontFamily === key ? 'active' : ''}`,
      style: { fontSize: '0.75rem', padding: '6px 4px' },
      textContent: label,
      onclick: () => {
        config.fontFamily = key;
        renderControls();
        render();
      }
    });
  }

  function getFontFamilyCss() {
    if (config.fontFamily === 'serif') return 'Georgia, Cambria, "Times New Roman", Times, serif';
    if (config.fontFamily === 'mono') return 'var(--font-mono, monospace)';
    return 'var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)';
  }

  function render() {
    displayArea.innerHTML = '';
    const ff = getFontFamilyCss();

    if (config.tab === 'specimen') {
      renderSpecimen(displayArea, ff);
    } else if (config.tab === 'article') {
      renderArticle(displayArea, ff);
    } else {
      renderScale(displayArea, ff);
    }

    generateCode();
  }

  // 1. SHADCN / HEROUI HIERARCHY SPECIMEN
  function renderSpecimen(target, ff) {
    target.innerHTML = `
      <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:28px; box-shadow:var(--shadow-sm); font-family:${ff}; display:flex; flex-direction:column; gap:24px;">
        <div style="border-bottom:1px solid var(--border); padding-bottom:14px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h3 style="font-size:1.05rem; font-weight:700; color:var(--text-main); margin:0 0 2px;">shadcn / HeroUI Typography Elements</h3>
            <p style="font-size:0.75rem; color:var(--text-muted); margin:0;">Click any row to copy Tailwind utility classes</p>
          </div>
          <span style="font-size:0.72rem; color:var(--text-dim); font-family:var(--font-mono);">WCAG Compliant</span>
        </div>

        <div style="display:flex; flex-direction:column; gap:20px;">
          <!-- H1 -->
          <div class="typo-specimen-item" data-tw="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl" style="cursor:pointer; padding:8px; border-radius:var(--radius-md); transition:background 0.15s ease;">
            <div style="font-size:0.7rem; font-family:var(--font-mono); color:var(--text-dim); margin-bottom:4px;">h1 · text-4xl font-extrabold tracking-tight</div>
            <h1 style="font-size:2.25rem; font-weight:800; color:var(--text-main); margin:0; letter-spacing:-0.035em; line-height:1.15;">
              The Next Evolution of Digital Interfaces
            </h1>
          </div>

          <!-- H2 -->
          <div class="typo-specimen-item" data-tw="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0" style="cursor:pointer; padding:8px; border-radius:var(--radius-md); transition:background 0.15s ease;">
            <div style="font-size:0.7rem; font-family:var(--font-mono); color:var(--text-dim); margin-bottom:4px;">h2 · border-b pb-2 text-3xl font-semibold</div>
            <h2 style="font-size:1.75rem; font-weight:700; color:var(--text-main); margin:0; border-bottom:1px solid var(--border); padding-bottom:6px; letter-spacing:-0.025em;">
              Architectural Design Principles
            </h2>
          </div>

          <!-- H3 -->
          <div class="typo-specimen-item" data-tw="scroll-m-20 text-2xl font-semibold tracking-tight" style="cursor:pointer; padding:8px; border-radius:var(--radius-md); transition:background 0.15s ease;">
            <div style="font-size:0.7rem; font-family:var(--font-mono); color:var(--text-dim); margin-bottom:4px;">h3 · text-2xl font-semibold</div>
            <h3 style="font-size:1.35rem; font-weight:600; color:var(--text-main); margin:0; letter-spacing:-0.02em;">
              Zero-latency micro-interactions and smooth layout transitions
            </h3>
          </div>

          <!-- Lead Paragraph -->
          <div class="typo-specimen-item" data-tw="text-xl text-muted-foreground" style="cursor:pointer; padding:8px; border-radius:var(--radius-md); transition:background 0.15s ease;">
            <div style="font-size:0.7rem; font-family:var(--font-mono); color:var(--text-dim); margin-bottom:4px;">p.lead · text-xl text-muted-foreground</div>
            <p style="font-size:1.15rem; color:var(--text-muted); margin:0; line-height:1.6; font-weight:400;">
              Modern design systems require seamless cohesion between component tokens, typography rhythms, and accessible contrast thresholds.
            </p>
          </div>

          <!-- Body Paragraph -->
          <div class="typo-specimen-item" data-tw="leading-7 [&:not(:first-child)]:mt-6" style="cursor:pointer; padding:8px; border-radius:var(--radius-md); transition:background 0.15s ease;">
            <div style="font-size:0.7rem; font-family:var(--font-mono); color:var(--text-dim); margin-bottom:4px;">p · leading-7 (Body Text)</div>
            <p style="font-size:0.95rem; color:var(--text-main); margin:0; line-height:1.7;">
              Once upon a time in software engineering, developers built user interfaces by handwriting isolated styles. Today, composable primitives and mathematical proportions guarantee visual harmony across every screen breakpoint.
            </p>
          </div>

          <!-- Blockquote -->
          <div class="typo-specimen-item" data-tw="mt-6 border-l-2 pl-6 italic text-zinc-400" style="cursor:pointer; padding:8px; border-radius:var(--radius-md); transition:background 0.15s ease;">
            <div style="font-size:0.7rem; font-family:var(--font-mono); color:var(--text-dim); margin-bottom:4px;">blockquote · border-l-2 pl-6 italic</div>
            <blockquote style="margin:0; border-left:3px solid var(--accent); padding-left:18px; font-style:italic; color:var(--text-muted); font-size:0.95rem; line-height:1.6;">
              "Simplicity is about subtracting the obvious and adding the meaningful."
            </blockquote>
          </div>

          <!-- Inline Code & Shortcut -->
          <div class="typo-specimen-item" data-tw="rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold" style="cursor:pointer; padding:8px; border-radius:var(--radius-md); transition:background 0.15s ease;">
            <div style="font-size:0.7rem; font-family:var(--font-mono); color:var(--text-dim); margin-bottom:4px;">code & kbd · inline badges</div>
            <div style="font-size:0.9rem; color:var(--text-main); display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
              <span>Run the CLI command</span>
              <code style="background:var(--bg-input); border:1px solid var(--border); padding:3px 7px; border-radius:4px; font-family:var(--font-mono); font-size:0.8rem; color:var(--accent);">npx create-huragon-ui@latest</code>
              <span>or press</span>
              <kbd style="background:var(--bg-input); border:1px solid var(--border-strong); border-bottom-width:2px; padding:2px 6px; border-radius:4px; font-size:0.75rem; font-family:var(--font-mono);">⌘K</kbd>
            </div>
          </div>

          <!-- Small & Muted -->
          <div class="typo-specimen-item" data-tw="text-sm text-muted-foreground" style="cursor:pointer; padding:8px; border-radius:var(--radius-md); transition:background 0.15s ease;">
            <div style="font-size:0.7rem; font-family:var(--font-mono); color:var(--text-dim); margin-bottom:4px;">small & muted · footnote caption</div>
            <small style="font-size:0.8rem; color:var(--text-dim); display:block;">
              Licensed under MIT. Zero tracking or telemetry stored. Global currency set to USD ($).
            </small>
          </div>
        </div>
      </div>
    `;

    target.querySelectorAll('.typo-specimen-item').forEach(item => {
      item.onmouseenter = () => item.style.background = 'var(--bg-hover)';
      item.onmouseleave = () => item.style.background = 'transparent';
      item.onclick = () => {
        copyToClipboard(item.dataset.tw);
      };
    });
  }

  // 2. EDITORIAL ARTICLE PREVIEW BLOCK
  function renderArticle(target, ff) {
    target.innerHTML = `
      <article style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:36px; box-shadow:var(--shadow-sm); font-family:${ff}; max-width:760px; margin:0 auto;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
          <span style="font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--accent); background:rgba(255, 255, 255, 0.05); padding:2px 8px; border-radius:999px; border:1px solid var(--border);">Design Systems</span>
          <span style="font-size:0.75rem; color:var(--text-dim);">· 5 min read · Oct 2026</span>
        </div>

        <h1 style="font-size:2.2rem; font-weight:800; color:var(--text-main); margin:0 0 12px; letter-spacing:-0.03em; line-height:1.2;">
          Building Design Systems with Mathematical Proportions
        </h1>

        <p style="font-size:1.1rem; color:var(--text-muted); line-height:1.6; margin:0 0 24px;">
          How harmonic modular scales and zinc-shaded monochromatic palettes establish instant visual hierarchy and effortless developer readability.
        </p>

        <div style="display:flex; align-items:center; gap:12px; border-top:1px solid var(--border); border-bottom:1px solid var(--border); padding:12px 0; margin-bottom:28px;">
          <div style="width:36px; height:36px; border-radius:50%; background:var(--bg-input); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.85rem; color:var(--text-main);">
            JD
          </div>
          <div>
            <div style="font-size:0.85rem; font-weight:600; color:var(--text-main);">Julian Doe</div>
            <div style="font-size:0.72rem; color:var(--text-dim);">Lead Systems Architect @ Huragon Labs</div>
          </div>
        </div>

        <p style="font-size:0.95rem; color:var(--text-main); line-height:1.75; margin:0 0 18px;">
          When constructing high-craft software products, arbitrary pixel values introduce friction. A developer may use <code style="background:var(--bg-input); padding:2px 5px; border-radius:4px; font-size:0.8rem; font-family:var(--font-mono); color:var(--accent);">15px</code> in one dialog and <code style="background:var(--bg-input); padding:2px 5px; border-radius:4px; font-size:0.8rem; font-family:var(--font-mono); color:var(--accent);">17px</code> in another. Over time, visual dissonance degrades the perceived quality of the interface.
        </p>

        <h2 style="font-size:1.4rem; font-weight:700; color:var(--text-main); margin:28px 0 12px; letter-spacing:-0.02em;">
          The Power of the Major Third (1.250)
        </h2>

        <p style="font-size:0.95rem; color:var(--text-main); line-height:1.75; margin:0 0 18px;">
          By multiplying each typographic step by a constant ratio like <code style="background:var(--bg-input); padding:2px 5px; border-radius:4px; font-size:0.8rem; font-family:var(--font-mono);">1.25</code>, headings scale naturally with the human eye's perception of weight.
        </p>

        <blockquote style="margin:24px 0; border-left:3px solid var(--accent); padding-left:18px; font-style:italic; color:var(--text-muted); font-size:1rem; line-height:1.6;">
          "Good typography is invisible until it is done poorly. When done correctly, the reader absorbs ideas without calculating layout boundaries."
        </blockquote>

        <p style="font-size:0.95rem; color:var(--text-main); line-height:1.75; margin:0 0 18px;">
          Key advantages when adopting a standardized typography tokens layer:
        </p>

        <ul style="margin:0 0 20px; padding-left:24px; color:var(--text-main); font-size:0.9rem; line-height:1.7;">
          <li style="margin-bottom:6px;">Consistent line-height calculations preventing text clipping</li>
          <li style="margin-bottom:6px;">Direct synchronization with Tailwind utility configuration classes</li>
          <li style="margin-bottom:6px;">Seamless fluid clamp() viewport transitions across mobile and 4K displays</li>
        </ul>
      </article>
    `;
  }

  // 3. MODULAR SCALE CALCULATOR
  function renderScale(target, ff) {
    const calculated = STEPS.map(s => {
      const px = Math.round(config.baseSize * Math.pow(config.ratio, s.exp) * 10) / 10;
      const rem = (px / config.baseSize).toFixed(2).replace(/\.?0+$/, '') + 'rem';
      return { ...s, px, rem };
    });

    target.innerHTML = `
      <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:24px; box-shadow:var(--shadow-sm); font-family:${ff};">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
          <div>
            <h3 style="font-size:1.05rem; font-weight:600; color:var(--text-main); margin-bottom:4px;">
              ${config.ratioName} Ratio (${config.ratio})
            </h3>
            <span style="font-size:0.75rem; color:var(--text-muted);">Click any row to copy font-size declaration</span>
          </div>
          <span style="font-size:0.75rem; font-family:var(--font-mono); color:var(--text-dim); background:var(--bg-main); padding:4px 8px; border-radius:4px; border:1px solid var(--border);">
            base: ${config.baseSize}px
          </span>
        </div>

        <div style="display:flex; flex-direction:column; gap:10px;">
          ${calculated.map(s => `
            <div class="type-scale-row" data-val="${s.rem}" style="display:flex; align-items:baseline; justify-content:space-between; padding:12px 16px; background:var(--bg-main); border:1px solid var(--border); border-radius:var(--radius-md); cursor:pointer; transition:background 0.15s ease;">
              <div style="display:flex; align-items:baseline; gap:16px; overflow:hidden;">
                <span style="font-family:var(--font-mono); font-size:0.75rem; font-weight:600; color:var(--text-muted); width:40px; flex-shrink:0;">${s.key}</span>
                <span style="font-size:${Math.min(32, s.px)}px; font-weight:600; color:var(--text-main); line-height:1.2; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                  ${s.label}
                </span>
              </div>
              <div style="display:flex; align-items:baseline; gap:12px; flex-shrink:0;">
                <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-dim);">${s.px}px</span>
                <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-main); font-weight:600;">${s.rem}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    target.querySelectorAll('.type-scale-row').forEach(row => {
      row.onclick = () => {
        copyToClipboard(`font-size: ${row.dataset.val};`);
      };
    });
  }

  function generateCode() {
    const calculated = STEPS.map(s => {
      const px = Math.round(config.baseSize * Math.pow(config.ratio, s.exp) * 10) / 10;
      const rem = (px / config.baseSize).toFixed(2).replace(/\.?0+$/, '') + 'rem';
      return { ...s, px, rem };
    });

    const cssVars = calculated.map(s => `  --text-${s.key}: ${s.rem}; /* ${s.px}px */`).join('\n');
    const css = `/* Huragon/UI Typography System (${config.ratioName} Ratio) */
:root {
${cssVars}
}

/* shadcn / HeroUI Base Hierarchy */
h1 { font-size: var(--text-3xl); font-weight: 800; letter-spacing: -0.03em; line-height: 1.2; }
h2 { font-size: var(--text-2xl); font-weight: 700; letter-spacing: -0.025em; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; }
h3 { font-size: var(--text-xl); font-weight: 600; letter-spacing: -0.02em; }
p  { font-size: var(--text-base); line-height: 1.7; color: var(--text-main); }
lead { font-size: var(--text-lg); color: var(--text-muted); }
blockquote { border-left: 3px solid var(--accent); padding-left: 1rem; font-style: italic; }`;

    const twFonts = calculated.map(s => `        '${s.key}': '${s.rem}',`).join('\n');
    const tailwind = `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontSize: {
${twFonts}
      }
    }
  }
};`;

    const react = `// React / Tailwind Typography Helpers
export function TypographyH1({ children }) {
  return <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">{children}</h1>;
}

export function TypographyH2({ children }) {
  return <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">{children}</h2>;
}

export function TypographyLead({ children }) {
  return <p className="text-xl text-muted-foreground">{children}</p>;
}`;

    onCodeChange({ css, tailwind, react });
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
}
