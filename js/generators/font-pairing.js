// Tool: Font Pairing & Typography Studio
import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';
import { copyToClipboard } from '../clipboard.js';

export const meta = {
  id: 'font-pairing',
  name: 'Font Pairing Studio'
};

const GOOGLE_FONTS = [
  // Sans-serif
  { name: 'Inter', category: 'Sans-serif', weights: [400, 500, 600, 700] },
  { name: 'Plus Jakarta Sans', category: 'Sans-serif', weights: [400, 500, 600, 700, 800] },
  { name: 'DM Sans', category: 'Sans-serif', weights: [400, 500, 700] },
  { name: 'Outfit', category: 'Sans-serif', weights: [400, 500, 600, 700] },
  { name: 'Space Grotesk', category: 'Sans-serif', weights: [400, 500, 600, 700] },
  { name: 'Manrope', category: 'Sans-serif', weights: [400, 500, 600, 700] },
  { name: 'Urbanist', category: 'Sans-serif', weights: [400, 500, 600, 700] },
  
  // Serif
  { name: 'Playfair Display', category: 'Serif', weights: [400, 600, 700, 900] },
  { name: 'Merriweather', category: 'Serif', weights: [300, 400, 700] },
  { name: 'Lora', category: 'Serif', weights: [400, 500, 600, 700] },
  { name: 'Cormorant Garamond', category: 'Serif', weights: [400, 600, 700] },
  { name: 'Newsreader', category: 'Serif', weights: [400, 500, 600, 700] },
  { name: 'DM Serif Display', category: 'Serif', weights: [400] },

  // Display
  { name: 'Syne', category: 'Display', weights: [400, 600, 700, 800] },
  { name: 'Bebas Neue', category: 'Display', weights: [400] },
  { name: 'Bricolage Grotesque', category: 'Display', weights: [400, 600, 700, 800] },
  { name: 'Cinzel', category: 'Display', weights: [400, 600, 700] },

  // Monospace
  { name: 'JetBrains Mono', category: 'Monospace', weights: [400, 500, 600, 700] },
  { name: 'Space Mono', category: 'Monospace', weights: [400, 700] },
  { name: 'Fira Code', category: 'Monospace', weights: [400, 500, 600] }
];

const CURATED_PRESETS = [
  {
    name: 'Neo-Grotesque & Classical',
    heading: 'Inter',
    headingWeight: 700,
    body: 'Merriweather',
    bodyWeight: 400,
    desc: 'Editorial precision with high contrast readability'
  },
  {
    name: 'Modern Editorial',
    heading: 'Playfair Display',
    headingWeight: 700,
    body: 'Plus Jakarta Sans',
    bodyWeight: 400,
    desc: 'Luxury aesthetics paired with geometric precision'
  },
  {
    name: 'Technical Minimalist',
    heading: 'Space Grotesk',
    headingWeight: 600,
    body: 'Inter',
    bodyWeight: 400,
    desc: 'SaaS and developer-first design language'
  },
  {
    name: 'High Fashion & Luxury',
    heading: 'Cormorant Garamond',
    headingWeight: 700,
    body: 'DM Sans',
    bodyWeight: 400,
    desc: 'Refined timeless elegance with clear modern body copy'
  },
  {
    name: 'Cyberpunk & Creative',
    heading: 'Syne',
    headingWeight: 800,
    body: 'JetBrains Mono',
    bodyWeight: 400,
    desc: 'Striking display typography with utilitarian monospaced accents'
  },
  {
    name: 'Clean SaaS Standard',
    heading: 'Plus Jakarta Sans',
    headingWeight: 700,
    body: 'Inter',
    bodyWeight: 400,
    desc: 'The gold standard for modern web application interfaces'
  }
];

let config = {
  headingFont: 'Playfair Display',
  headingWeight: 700,
  headingSize: 44,
  headingSpacing: -0.02,
  headingLineHeight: 1.15,
  bodyFont: 'Plus Jakarta Sans',
  bodyWeight: 400,
  bodySize: 16,
  bodySpacing: 0,
  bodyLineHeight: 1.6,
  specimenMode: 'hero' // 'hero', 'article', 'ui'
};

// Dynamically inject Google Fonts into head
const loadedFonts = new Set();
function loadGoogleFont(fontName) {
  if (loadedFonts.has(fontName)) return;
  loadedFonts.add(fontName);
  const formattedName = fontName.replace(/\s+/g, '+');
  const linkId = `gfont-${formattedName}`;
  if (document.getElementById(linkId)) return;
  const link = document.createElement('link');
  link.id = linkId;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${formattedName}:wght@300;400;500;600;700;800;900&display=swap`;
  document.head.appendChild(link);
}

export function mount(container, onCodeChange) {
  const previewStage = qs('#preview-stage');
  const controlsStage = qs('#controls-scroll');

  loadGoogleFont(config.headingFont);
  loadGoogleFont(config.bodyFont);

  previewStage.innerHTML = '';
  controlsStage.innerHTML = '';

  const centerStage = el('div', {
    id: 'font-pairing-preview',
    style: {
      width: '100%',
      maxWidth: '820px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }
  });

  previewStage.appendChild(centerStage);

  renderSpecimen();
  renderControls();
  emitCode();

  function renderSpecimen() {
    loadGoogleFont(config.headingFont);
    loadGoogleFont(config.bodyFont);

    centerStage.innerHTML = '';

    // Specimen Mode Pill Bar
    const modeBar = el('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        background: 'var(--surface-1)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)'
      }
    }, [
      el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
        el('span', { style: { fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '600' }, textContent: 'Pairing:' }),
        el('span', { style: { fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-primary)' }, textContent: `${config.headingFont} + ${config.bodyFont}` })
      ]),
      el('div', { className: 'segmented-pill-bar' }, [
        el('button', {
          className: `segmented-pill-btn ${config.specimenMode === 'hero' ? 'active' : ''}`,
          textContent: 'Landing Hero',
          onclick: () => { config.specimenMode = 'hero'; renderSpecimen(); emitCode(); }
        }),
        el('button', {
          className: `segmented-pill-btn ${config.specimenMode === 'article' ? 'active' : ''}`,
          textContent: 'Editorial Article',
          onclick: () => { config.specimenMode = 'article'; renderSpecimen(); emitCode(); }
        }),
        el('button', {
          className: `segmented-pill-btn ${config.specimenMode === 'ui' ? 'active' : ''}`,
          textContent: 'UI Component Card',
          onclick: () => { config.specimenMode = 'ui'; renderSpecimen(); emitCode(); }
        })
      ])
    ]);

    centerStage.appendChild(modeBar);

    // Specimen Card
    const specimenCard = el('div', {
      style: {
        background: 'var(--surface-1)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '36px',
        boxShadow: 'var(--shadow-md)',
        transition: 'all 0.2s ease'
      }
    });

    if (config.specimenMode === 'hero') {
      specimenCard.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:20px;">
          <div style="display:inline-flex; align-items:center; gap:8px; padding:4px 12px; border-radius:999px; background:var(--surface-2); border:1px solid var(--border); width:fit-content;">
            <span style="width:6px; height:6px; border-radius:50%; background:var(--success);"></span>
            <span style="font-family:'${config.bodyFont}', sans-serif; font-size:0.75rem; color:var(--text-muted); font-weight:500;">Huragon Typography System</span>
          </div>
          
          <h1 style="font-family:'${config.headingFont}', serif; font-size:${config.headingSize}px; font-weight:${config.headingWeight}; letter-spacing:${config.headingSpacing}em; line-height:${config.headingLineHeight}; color:var(--text-primary); margin:0;">
            Architecting Future-Proof Digital Interfaces with Craft
          </h1>

          <p style="font-family:'${config.bodyFont}', sans-serif; font-size:${config.bodySize}px; font-weight:${config.bodyWeight}; letter-spacing:${config.bodySpacing}em; line-height:${config.bodyLineHeight}; color:var(--text-muted); max-width:640px; margin:0;">
            Design systems require strict mathematical balance between visual hierarchy and functional legibility. Pairing distinctive display typography with high-x-height body copy ensures frictionless readability across any responsive viewport.
          </p>

          <div style="display:flex; gap:12px; margin-top:8px;">
            <button class="btn btn-primary" style="font-family:'${config.bodyFont}', sans-serif; font-weight:600; padding:10px 20px;">Get Started</button>
            <button class="btn btn-outline" style="font-family:'${config.bodyFont}', sans-serif; font-weight:500; padding:10px 20px;">Explore System</button>
          </div>
        </div>
      `;
    } else if (config.specimenMode === 'article') {
      specimenCard.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:20px; max-width:680px; margin:0 auto;">
          <div style="font-family:'${config.bodyFont}', sans-serif; font-size:0.75rem; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; color:var(--text-dim);">Design Engineering · 6 min read</div>
          
          <h2 style="font-family:'${config.headingFont}', serif; font-size:${config.headingSize}px; font-weight:${config.headingWeight}; letter-spacing:${config.headingSpacing}em; line-height:${config.headingLineHeight}; color:var(--text-primary); margin:0;">
            The Mathematical Geometry of Optical Kerning in Modern Browsers
          </h2>

          <div style="display:flex; align-items:center; gap:12px; padding:12px 0; border-top:1px solid var(--border); border-bottom:1px solid var(--border);">
            <div style="width:36px; height:36px; border-radius:50%; background:var(--surface-2); display:flex; align-items:center; justify-content:center; font-family:'${config.bodyFont}', sans-serif; font-weight:700; color:var(--text-primary); font-size:0.85rem;">HG</div>
            <div>
              <div style="font-family:'${config.bodyFont}', sans-serif; font-size:0.85rem; font-weight:600; color:var(--text-primary);">Huragon Editorial Team</div>
              <div style="font-family:'${config.bodyFont}', sans-serif; font-size:0.75rem; color:var(--text-dim);">Published Oct 25 · Updated today</div>
            </div>
          </div>

          <p style="font-family:'${config.bodyFont}', sans-serif; font-size:${config.bodySize}px; font-weight:${config.bodyWeight}; letter-spacing:${config.bodySpacing}em; line-height:${config.bodyLineHeight}; color:var(--text-muted); margin:0;">
            When type designers draft glyphs, rhythm is established through negative white space rather than black strokes. The interplay between character counters and inter-word tracking defines the optical tension of the entire layout.
          </p>

          <blockquote style="margin:12px 0; padding-left:18px; border-left:3px solid var(--text-primary); font-family:'${config.headingFont}', serif; font-size:${Math.round(config.bodySize * 1.2)}px; font-style:italic; color:var(--text-primary); line-height:1.45;">
            "Typography exists to honor content. A typeface without intentional pairing is like architecture without structural harmony."
          </blockquote>

          <p style="font-family:'${config.bodyFont}', sans-serif; font-size:${config.bodySize}px; font-weight:${config.bodyWeight}; letter-spacing:${config.bodySpacing}em; line-height:${config.bodyLineHeight}; color:var(--text-muted); margin:0;">
            By establishing proportional ratios between heading display scales and body prose units, frontend systems achieve effortless aesthetic cohesion without manual per-page overrides.
          </p>
        </div>
      `;
    } else {
      specimenCard.innerHTML = `
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:20px;">
          <div style="background:var(--surface-2); border:1px solid var(--border); border-radius:var(--radius-md); padding:22px; display:flex; flex-direction:column; gap:12px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-family:'${config.bodyFont}', sans-serif; font-size:0.75rem; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-dim);">Subscription Plan</span>
              <span class="badge" style="background:var(--success-muted); color:var(--success); border:1px solid var(--success-border); font-family:'${config.bodyFont}', sans-serif; font-size:0.7rem; padding:2px 8px; border-radius:999px;">Active</span>
            </div>
            <div style="font-family:'${config.headingFont}', serif; font-size:2rem; font-weight:${config.headingWeight}; color:var(--text-primary); line-height:1;">$49.00 <span style="font-family:'${config.bodyFont}', sans-serif; font-size:0.85rem; font-weight:400; color:var(--text-dim);">/ month</span></div>
            <p style="font-family:'${config.bodyFont}', sans-serif; font-size:0.825rem; color:var(--text-muted); margin:0; line-height:1.5;">Unlimited access to all generative UI design tools, code export, and cloud synchronization.</p>
            <button class="btn btn-primary" style="margin-top:auto; font-family:'${config.bodyFont}', sans-serif; font-weight:600;">Upgrade License</button>
          </div>

          <div style="background:var(--surface-2); border:1px solid var(--border); border-radius:var(--radius-md); padding:22px; display:flex; flex-direction:column; gap:12px;">
            <span style="font-family:'${config.bodyFont}', sans-serif; font-size:0.75rem; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-dim);">Key Performance</span>
            <div style="font-family:'${config.headingFont}', serif; font-size:2rem; font-weight:${config.headingWeight}; color:var(--text-primary); line-height:1;">99.98%</div>
            <p style="font-family:'${config.bodyFont}', sans-serif; font-size:0.825rem; color:var(--text-muted); margin:0; line-height:1.5;">Deterministic component rendering latency under 12ms across all major browser runtimes.</p>
            <div style="display:flex; gap:8px; margin-top:auto;">
              <span style="font-family:'${config.bodyFont}', sans-serif; font-size:0.75rem; color:var(--text-dim); background:var(--surface-1); border:1px solid var(--border); padding:4px 8px; border-radius:var(--radius-sm);">HTTP/3</span>
              <span style="font-family:'${config.bodyFont}', sans-serif; font-size:0.75rem; color:var(--text-dim); background:var(--surface-1); border:1px solid var(--border); padding:4px 8px; border-radius:var(--radius-sm);">ESM</span>
            </div>
          </div>
        </div>
      `;
    }

    centerStage.appendChild(specimenCard);
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    // Presets Section
    const presetsSection = el('div', { className: 'controls-section' }, [
      el('h4', { className: 'section-title', textContent: 'Curated Pairings' })
    ]);

    const presetsGrid = el('div', {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '6px'
      }
    });

    CURATED_PRESETS.forEach(preset => {
      const isSelected = config.headingFont === preset.heading && config.bodyFont === preset.body;
      const btn = el('button', {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '2px',
          padding: '8px 12px',
          borderRadius: 'var(--radius-sm)',
          border: `1px solid ${isSelected ? 'var(--text-primary)' : 'var(--border)'}`,
          background: isSelected ? 'var(--surface-2)' : 'var(--surface-1)',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'all 0.15s ease'
        },
        onclick: () => {
          config.headingFont = preset.heading;
          config.headingWeight = preset.headingWeight;
          config.bodyFont = preset.body;
          config.bodyWeight = preset.bodyWeight;
          renderSpecimen();
          renderControls();
          emitCode();
        }
      }, [
        el('div', { style: { display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' } }, [
          el('span', { style: { fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)' }, textContent: preset.name }),
          el('span', { style: { fontSize: '0.68rem', color: 'var(--text-dim)' }, textContent: `${preset.heading} + ${preset.body}` })
        ]),
        el('span', { style: { fontSize: '0.72rem', color: 'var(--text-muted)' }, textContent: preset.desc })
      ]);
      presetsGrid.appendChild(btn);
    });

    presetsSection.appendChild(presetsGrid);
    controlsStage.appendChild(presetsSection);

    // Heading Font Section
    const headingSection = el('div', { className: 'controls-section' }, [
      el('h4', { className: 'section-title', textContent: 'Heading Typography' })
    ]);

    // Heading Font Dropdown
    const headingSelectGroup = el('div', { className: 'control-group' }, [
      el('div', { className: 'control-label-row' }, [
        el('label', { className: 'control-label', textContent: 'Heading Font Family' })
      ])
    ]);

    const headingSelect = el('select', {
      style: {
        width: '100%',
        padding: '7px 10px',
        background: 'var(--bg-input)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        color: 'var(--text-main)',
        fontSize: '0.8rem',
        outline: 'none'
      },
      onchange: (e) => {
        config.headingFont = e.target.value;
        const fontMeta = GOOGLE_FONTS.find(f => f.name === config.headingFont);
        if (fontMeta && !fontMeta.weights.includes(config.headingWeight)) {
          config.headingWeight = fontMeta.weights[fontMeta.weights.length - 1];
        }
        renderSpecimen();
        renderControls();
        emitCode();
      }
    });

    // Group fonts by category
    const categories = ['Sans-serif', 'Serif', 'Display', 'Monospace'];
    categories.forEach(cat => {
      const optGroup = document.createElement('optgroup');
      optGroup.label = cat;
      GOOGLE_FONTS.filter(f => f.category === cat).forEach(f => {
        const opt = document.createElement('option');
        opt.value = f.name;
        opt.textContent = f.name;
        opt.selected = f.name === config.headingFont;
        optGroup.appendChild(opt);
      });
      headingSelect.appendChild(optGroup);
    });

    headingSelectGroup.appendChild(headingSelect);
    headingSection.appendChild(headingSelectGroup);

    // Heading Size Slider
    headingSection.appendChild(createRangeSlider('Heading Font Size', 24, 72, 1, config.headingSize, 'px', (val) => {
      config.headingSize = val;
      renderSpecimen();
      emitCode();
    }));

    // Heading Weight Selector
    const currentHeadingFont = GOOGLE_FONTS.find(f => f.name === config.headingFont) || { weights: [400, 700] };
    const headingWeightGroup = el('div', { className: 'control-group' }, [
      el('div', { className: 'control-label-row' }, [
        el('label', { className: 'control-label', textContent: 'Heading Weight' }),
        el('span', { className: 'control-value', textContent: config.headingWeight })
      ])
    ]);

    const headingWeightBar = el('div', { className: 'segmented-pill-bar', style: { width: '100%', justifyContent: 'space-around' } });
    currentHeadingFont.weights.forEach(w => {
      headingWeightBar.appendChild(el('button', {
        className: `segmented-pill-btn ${config.headingWeight === w ? 'active' : ''}`,
        textContent: w,
        onclick: () => {
          config.headingWeight = w;
          renderSpecimen();
          renderControls();
          emitCode();
        }
      }));
    });
    headingWeightGroup.appendChild(headingWeightBar);
    headingSection.appendChild(headingWeightGroup);

    controlsStage.appendChild(headingSection);

    // Body Font Section
    const bodySection = el('div', { className: 'controls-section' }, [
      el('h4', { className: 'section-title', textContent: 'Body Typography' })
    ]);

    // Body Font Dropdown
    const bodySelectGroup = el('div', { className: 'control-group' }, [
      el('div', { className: 'control-label-row' }, [
        el('label', { className: 'control-label', textContent: 'Body Font Family' })
      ])
    ]);

    const bodySelect = el('select', {
      style: {
        width: '100%',
        padding: '7px 10px',
        background: 'var(--bg-input)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        color: 'var(--text-main)',
        fontSize: '0.8rem',
        outline: 'none'
      },
      onchange: (e) => {
        config.bodyFont = e.target.value;
        const fontMeta = GOOGLE_FONTS.find(f => f.name === config.bodyFont);
        if (fontMeta && !fontMeta.weights.includes(config.bodyWeight)) {
          config.bodyWeight = fontMeta.weights[0];
        }
        renderSpecimen();
        renderControls();
        emitCode();
      }
    });

    categories.forEach(cat => {
      const optGroup = document.createElement('optgroup');
      optGroup.label = cat;
      GOOGLE_FONTS.filter(f => f.category === cat).forEach(f => {
        const opt = document.createElement('option');
        opt.value = f.name;
        opt.textContent = f.name;
        opt.selected = f.name === config.bodyFont;
        optGroup.appendChild(opt);
      });
      bodySelect.appendChild(optGroup);
    });

    bodySelectGroup.appendChild(bodySelect);
    bodySection.appendChild(bodySelectGroup);

    // Body Size Slider
    bodySection.appendChild(createRangeSlider('Body Font Size', 13, 20, 1, config.bodySize, 'px', (val) => {
      config.bodySize = val;
      renderSpecimen();
      emitCode();
    }));

    // Body Line Height Slider
    bodySection.appendChild(createRangeSlider('Body Line Height', 1.2, 2.0, 0.05, config.bodyLineHeight, '', (val) => {
      config.bodyLineHeight = val;
      renderSpecimen();
      emitCode();
    }));

    controlsStage.appendChild(bodySection);
  }

  function createRangeSlider(label, min, max, step, current, unit, onChange) {
    const group = el('div', { className: 'control-group' });
    const valSpan = el('span', { className: 'control-value', textContent: `${current}${unit}` });
    const row = el('div', { className: 'control-label-row' }, [
      el('label', { className: 'control-label', textContent: label }),
      valSpan
    ]);
    const input = el('input', {
      type: 'range',
      min,
      max,
      step,
      value: current,
      oninput: (e) => {
        const v = parseFloat(e.target.value);
        valSpan.textContent = `${v}${unit}`;
        onChange(v);
      }
    });
    group.appendChild(row);
    group.appendChild(input);
    return group;
  }

  function emitCode() {
    const headingEnc = config.headingFont.replace(/\s+/g, '+');
    const bodyEnc = config.bodyFont.replace(/\s+/g, '+');

    const cssSnippet = `/* 1. Google Fonts Embed */
@import url('https://fonts.googleapis.com/css2?family=${headingEnc}:wght@${config.headingWeight}&family=${bodyEnc}:wght@${config.bodyWeight}&display=swap');

/* 2. Global Typography Design Tokens */
:root {
  --font-heading: '${config.headingFont}', serif;
  --font-body:    '${config.bodyFont}', sans-serif;
  
  --fs-heading:   ${config.headingSize}px;
  --fw-heading:   ${config.headingWeight};
  --lh-heading:   ${config.headingLineHeight};
  --ls-heading:   ${config.headingSpacing}em;
  
  --fs-body:      ${config.bodySize}px;
  --fw-body:      ${config.bodyWeight};
  --lh-body:      ${config.bodyLineHeight};
  --ls-body:      ${config.bodySpacing}em;
}

/* 3. Utility Classes */
h1, h2, h3, .heading-display {
  font-family: var(--font-heading);
  font-weight: var(--fw-heading);
  line-height: var(--lh-heading);
  letter-spacing: var(--ls-heading);
  color: var(--text-primary);
}

body, p, .body-copy {
  font-family: var(--font-body);
  font-weight: var(--fw-body);
  font-size: var(--fs-body);
  line-height: var(--lh-body);
  letter-spacing: var(--ls-body);
  color: var(--text-muted);
}`;

    const tailwindSnippet = `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        heading: ["'${config.headingFont}'", 'serif'],
        body: ["'${config.bodyFont}'", 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['${config.headingSize}px', {
          lineHeight: '${config.headingLineHeight}',
          letterSpacing: '${config.headingSpacing}em',
          fontWeight: '${config.headingWeight}',
        }],
        'body-base': ['${config.bodySize}px', {
          lineHeight: '${config.bodyLineHeight}',
          letterSpacing: '${config.bodySpacing}em',
          fontWeight: '${config.bodyWeight}',
        }],
      }
    }
  }
};

<!-- Example Usage -->
<h1 class="font-heading text-display-lg text-zinc-100 font-bold">
  Architecting Digital Interfaces
</h1>
<p class="font-body text-body-base text-zinc-400 mt-4">
  High-craft typography pairing generated with Huragon Studio.
</p>`;

    const reactSnippet = `import React from 'react';

export default function TypographySpecimen() {
  return (
    <div className="font-body text-zinc-300">
      <h1 
        style={{ 
          fontFamily: "'${config.headingFont}', serif",
          fontWeight: ${config.headingWeight},
          fontSize: '${config.headingSize}px',
          lineHeight: ${config.headingLineHeight},
          letterSpacing: '${config.headingSpacing}em'
        }}
        className="text-zinc-50"
      >
        Architecting Digital Interfaces
      </h1>
      <p 
        style={{ 
          fontFamily: "'${config.bodyFont}', sans-serif",
          fontWeight: ${config.bodyWeight},
          fontSize: '${config.bodySize}px',
          lineHeight: ${config.bodyLineHeight}
        }}
        className="text-zinc-400 mt-4 max-w-xl"
      >
        High-craft typography pairing with mathematical hierarchy.
      </p>
    </div>
  );
}`;

    const tokensSnippet = JSON.stringify({
      "$schema": "https://design-tokens.github.io/community-group/format/v1/schema.json",
      "font": {
        "heading": {
          "family": { "value": config.headingFont, "type": "fontFamily" },
          "weight": { "value": config.headingWeight, "type": "fontWeight" },
          "size": { "value": `${config.headingSize}px`, "type": "dimension" },
          "lineHeight": { "value": config.headingLineHeight, "type": "number" },
          "letterSpacing": { "value": `${config.headingSpacing}em`, "type": "dimension" }
        },
        "body": {
          "family": { "value": config.bodyFont, "type": "fontFamily" },
          "weight": { "value": config.bodyWeight, "type": "fontWeight" },
          "size": { "value": `${config.bodySize}px`, "type": "dimension" },
          "lineHeight": { "value": config.bodyLineHeight, "type": "number" }
        }
      }
    }, null, 2);

    onCodeChange({
      css: cssSnippet,
      tailwind: tailwindSnippet,
      react: reactSnippet,
      tokens: tokensSnippet
    });
  }
}
