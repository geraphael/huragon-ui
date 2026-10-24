// All 47 tools registry across 10 categories
export const CATEGORIES = [
  {
    id: 'gradients',
    name: 'Gradients & Backgrounds',
    icon: '🌈',
    tools: [
      { id: 'mesh-gradient', name: 'Mesh Gradient', desc: 'Organic multi-point radial gradient generator', badge: 'Popular' },
      { id: 'gradient-builder', name: 'Linear & Radial Gradient', desc: 'Linear, radial, and conic gradient designer' },
      { id: 'animated-gradient', name: 'Animated Gradient', desc: 'Looping hue-shifting keyframe gradients' }
    ]
  },
  {
    id: 'effects',
    name: 'Effects & Shadows',
    icon: '🪟',
    tools: [
      { id: 'glassmorphism', name: 'Glassmorphism', desc: 'Frosted glass UI with blur, opacity and specular border', badge: 'Hot' },
      { id: 'neumorphism', name: 'Neumorphism (Soft UI)', desc: 'Dual-shadow soft tactile UI generator' },
      { id: 'box-shadow', name: 'Box Shadow Layers', desc: 'Multi-layer complex shadow builder' },
      { id: 'css-filters', name: 'CSS Filters', desc: 'Visual filter & backdrop-filter chaining studio' },
      { id: 'text-effects', name: 'Text Effects', desc: 'Gradients, neon glow, 3D emboss text effects' },
      { id: 'transform-3d', name: '3D Transform & Tilt', desc: '3D perspective, rotation and interactive card tilt' }
    ]
  },
  {
    id: 'shapes',
    name: 'Shapes & Dividers',
    icon: '🌊',
    tools: [
      { id: 'svg-wave', name: 'SVG Wave Divider', desc: 'Dynamic flowing SVG section dividers with animation', badge: 'Popular' },
      { id: 'svg-blob', name: 'SVG Blob Generator', desc: 'Organic fluid blob shapes with random seeds' },
      { id: 'clip-path', name: 'Clip-Path Polygon', desc: 'Interactive visual polygon & shape clipper' },
      { id: 'border-radius', name: 'Fancy Border Radius', desc: '8-value organic squircle border generator' }
    ]
  },
  {
    id: 'layout',
    name: 'Layout Systems',
    icon: '📐',
    tools: [
      { id: 'grid-generator', name: 'CSS Grid Studio', desc: 'Visual track and grid-template builder' },
      { id: 'flexbox-playground', name: 'Flexbox Playground', desc: 'Interactive flex alignment and direction tester' }
    ]
  },
  {
    id: 'responsive',
    name: 'Responsive & Preview',
    icon: '📱',
    tools: [
      { id: 'responsive-preview', name: 'Device Mockups', desc: 'Real-time Mobile, Tablet, Laptop frame previews', badge: 'New' },
      { id: 'media-query', name: 'Media Query Builder', desc: 'Responsive breakpoints and container query generator' },
      { id: 'responsive-typography', name: 'Fluid Typography clamp()', desc: 'Fluid viewport-scaled font size calculator' }
    ]
  },
  {
    id: 'components',
    name: 'UI Components',
    icon: '🧩',
    tools: [
      { id: 'button-generator', name: 'Button Studio', desc: 'Multi-state button generator with hover, active, focus & gradients', badge: 'Essential' },
      { id: 'card-designer', name: 'Card Designer', desc: 'Modern content, stats and product cards with hover lift' },
      { id: 'navbar-builder', name: 'Navbar Generator', desc: 'Responsive header bars with glass effect and mobile nav' },
      { id: 'form-input-styler', name: 'Input & Form Controls', desc: 'Modern inputs, focus rings and floating labels' },
      { id: 'toggle-checkbox', name: 'Toggle & Checkbox', desc: 'Pure CSS iOS/Material toggle switches and custom checks' },
      { id: 'tooltip-generator', name: 'CSS Tooltip Builder', desc: 'Pure CSS directional hover tooltips' },
      { id: 'badge-tag', name: 'Badge & Status Tag', desc: 'Status pills, notification badges and tags' },
      { id: 'avatar-stack', name: 'Avatar & Avatar Stack', desc: 'User avatars, status indicators and overlapping stacks' },
      { id: 'table-styler', name: 'Data Table Styler', desc: 'Modern striped, bordered and sticky header tables' },
      { id: 'divider-separator', name: 'Section Dividers', desc: 'Ornate and minimal CSS horizontal separators' }
    ]
  },
  {
    id: 'animations',
    name: 'Animations & Loaders',
    icon: '🎬',
    tools: [
      { id: 'loading-spinner', name: 'CSS Spinners & Loaders', desc: 'Pure CSS single-element spinners, bars and pulses', badge: 'Popular' },
      { id: 'skeleton-screen', name: 'Skeleton Loader', desc: 'Shimmering placeholder UI for asynchronous loading' },
      { id: 'hover-effects', name: 'Hover Effects Library', desc: 'Scale, glow, rotate and border-draw hover micro-interactions' },
      { id: 'keyframe-animator', name: 'Keyframe Timeline', desc: 'Multi-step visual timeline animation builder' },
      { id: 'text-animations', name: 'Text Animations', desc: 'Typing effect, glitch, fade-in and rainbow text motion' }
    ]
  },
  {
    id: 'patterns',
    name: 'Patterns & Textures',
    icon: '🎯',
    tools: [
      { id: 'background-patterns', name: 'CSS Background Patterns', desc: 'Dots, grids, stripes, chevron and geometric textures' },
      { id: 'noise-texture', name: 'SVG Noise & Grain', desc: 'Subtle film grain and rough textures using SVG turbulence' },
      { id: 'underline-effects', name: 'Animated Underlines', desc: 'Expand, sweep, gradient and playful link hover underlines' }
    ]
  },
  {
    id: 'color',
    name: 'Color & Typography',
    icon: '🎨',
    tools: [
      { id: 'color-palette', name: 'Color Palette Studio', desc: 'Harmonious palettes, 50-950 Tailwind shade scales & OKLCH' },
      { id: 'contrast-checker', name: 'WCAG Contrast Checker', desc: 'Real-time AA/AAA accessibility compliance and APCA scores' },
      { id: 'typography-scale', name: 'Type Scale System', desc: 'Mathematical font scale generator with Google Fonts' }
    ]
  },
  {
    id: 'utilities',
    name: 'CSS Utilities',
    icon: '🔧',
    tools: [
      { id: 'scrollbar-styler', name: 'Scrollbar Styler', desc: 'WebKit & Firefox custom scrollbars' },
      { id: 'easing-editor', name: 'Cubic-Bezier Easing', desc: 'Draggable physics curve editor with live comparison' },
      { id: 'transition-builder', name: 'Transition Builder', desc: 'Multi-property CSS transition timing builder' },
      { id: 'color-converter', name: 'Color Format Converter', desc: 'HEX, RGB, HSL, OKLCH, and CMYK instant conversion' },
      { id: 'spacing-calculator', name: 'Spacing System (8pt/4pt)', desc: 'Design token spacing scale generator' },
      { id: 'aspect-ratio', name: 'Aspect Ratio Calculator', desc: '16:9, 4:3, 1:1 responsive container ratio generator' },
      { id: 'css-reset', name: 'CSS Reset Generator', desc: 'Curated modern CSS resets with customizable rules' }
    ]
  }
];

export function getToolMeta(toolId) {
  for (const cat of CATEGORIES) {
    const tool = cat.tools.find(t => t.id === toolId);
    if (tool) return { ...tool, categoryName: cat.name, categoryId: cat.id };
  }
  return null;
}
