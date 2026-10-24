// Tool 24: Fluid Typography clamp() Calculator
import { el, qs } from '../utils/dom.js';

export const meta = {
  id: 'responsive-typography',
  name: 'Fluid Typography clamp()'
};

let config = {
  minWidth: 375,
  maxWidth: 1280,
  minFontSize: 16,
  maxFontSize: 28,
  sampleText: 'Responsive Typography with CSS clamp()'
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
      padding: '40px',
      textAlign: 'center'
    }
  });

  const previewText = el('h2', {
    id: 'fluid-text-preview',
    style: {
      fontWeight: '600',
      letterSpacing: '-0.02em',
      color: 'var(--text-main)',
      maxWidth: '700px',
      lineHeight: '1.2'
    }
  });

  const formulaBadge = el('div', {
    style: {
      marginTop: '24px',
      padding: '8px 16px',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      fontFamily: 'monospace',
      fontSize: '0.8rem',
      color: 'var(--text-muted)'
    }
  });

  centerStage.appendChild(previewText);
  centerStage.appendChild(formulaBadge);
  previewStage.appendChild(centerStage);

  // Exact CSS clamp formula: clamp(min, slope + y-intersection, max)
  function calculateClamp() {
    const minWidthRem = config.minWidth / 16;
    const maxWidthRem = config.maxWidth / 16;
    const minFontRem = config.minFontSize / 16;
    const maxFontRem = config.maxFontSize / 16;

    const slope = (maxFontRem - minFontRem) / (maxWidthRem - minWidthRem);
    const yAxisIntersection = -minWidthRem * slope + minFontRem;

    const slopeVw = (slope * 100).toFixed(3);
    const yAxisRem = yAxisIntersection.toFixed(3);

    const clampStr = `clamp(${minFontRem.toFixed(3)}rem, ${yAxisRem}rem + ${slopeVw}vw, ${maxFontRem.toFixed(3)}rem)`;
    
    previewText.textContent = config.sampleText;
    previewText.style.fontSize = clampStr;
    formulaBadge.textContent = clampStr;

    const css = `/* Huragon/ui — Fluid Responsive Typography */
.fluid-heading {
  font-size: ${clampStr};
  line-height: 1.25;
}`;

    const tailwind = `<h2 class="text-[${clampStr}]">
  ${config.sampleText}
</h2>`;

    onCodeChange({ css, tailwind });
  }

  function renderControls() {
    controlsStage.innerHTML = '';

    const sec = el('div', { className: 'controls-section' }, [
      el('div', { className: 'section-title', textContent: 'Font Scaling Scale' }),

      createSlider('Min Font Size (Mobile)', config.minFontSize, 12, 32, (v) => { config.minFontSize = v; calculateClamp(); }, 'px'),
      createSlider('Max Font Size (Desktop)', config.maxFontSize, 24, 72, (v) => { config.maxFontSize = v; calculateClamp(); }, 'px'),
      createSlider('Min Viewport Width', config.minWidth, 320, 640, (v) => { config.minWidth = v; calculateClamp(); }, 'px'),
      createSlider('Max Viewport Width', config.maxWidth, 960, 1920, (v) => { config.maxWidth = v; calculateClamp(); }, 'px')
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
          const v = parseInt(e.target.value, 10);
          valSpan.textContent = `${v}${unit}`;
          onChange(v);
        }
      })
    ]);
  }

  renderControls();
  calculateClamp();
}
