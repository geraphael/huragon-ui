// All 47 tools organized into 6 logical developer-workflow groups
// Each tool has an individual `icon` field for sidebar display
export const CATEGORIES = [
  {
    id: 'foundations',
    name: 'Foundations',
    icon: 'compass',
    tools: [
      { id: 'color-palette',      name: 'Color Palette Studio',       icon: 'droplet',  desc: 'Harmonious palettes, 50-950 Tailwind shade scales & OKLCH' },
      { id: 'typography-scale',   name: 'Type Scale System',          icon: 'type',     desc: 'Mathematical font scale generator with Google Fonts' },
      { id: 'font-pairing',       name: 'Font Pairing Studio',        icon: 'type',     desc: 'Google Fonts browser with live pairing preview and variable typography' },
      { id: 'contrast-checker',   name: 'WCAG Contrast Checker',      icon: 'contrast', desc: 'Real-time AA/AAA accessibility compliance and APCA scores' },
      { id: 'spacing-calculator', name: 'Spacing System (8pt/4pt)',   icon: 'space',    desc: 'Design token spacing scale generator' },
      { id: 'css-reset',          name: 'CSS Reset Generator',        icon: 'reset',    desc: 'Curated modern CSS resets with customizable rules' }
    ]
  },
  {
    id: 'visual',
    name: 'Visual Effects',
    icon: 'layers',
    tools: [
      { id: 'mesh-gradient',       name: 'Mesh Gradient',             icon: 'palette',  desc: 'Organic multi-point radial gradient generator' },
      { id: 'gradient-builder',    name: 'Linear & Radial Gradient',  icon: 'palette',  desc: 'Linear, radial, and conic gradient designer' },
      { id: 'animated-gradient',   name: 'Animated Gradient',         icon: 'activity', desc: 'Looping hue-shifting keyframe gradients' },
      { id: 'aurora-gradient',     name: 'Aurora Borealis Glow',      icon: 'feather',  desc: 'Flowing multi-beam northern lights ambient glow' },
      { id: 'glassmorphism',       name: 'Glassmorphism',             icon: 'layers',   desc: 'Frosted glass UI with blur, opacity and specular border' },
      { id: 'neumorphism',         name: 'Neumorphism (Soft UI)',      icon: 'cpu',      desc: 'Dual-shadow soft tactile UI generator' },
      { id: 'box-shadow',          name: 'Box Shadow Layers',         icon: 'layers',   desc: 'Multi-layer complex shadow builder' },
      { id: 'css-filters',         name: 'CSS Filters',               icon: 'filter',   desc: 'Visual filter & backdrop-filter chaining studio' },
      { id: 'background-patterns', name: 'CSS Background Patterns',   icon: 'pattern',  desc: 'Dots, grids, stripes, chevron and geometric textures' },
      { id: 'noise-texture',       name: 'SVG Noise & Grain',         icon: 'noise',    desc: 'Subtle film grain and rough textures using SVG turbulence' }
    ]
  },
  {
    id: 'shapes',
    name: 'Shapes & Layout',
    icon: 'shapes',
    tools: [
      { id: 'svg-wave',          name: 'SVG Wave Divider',      icon: 'wave',   desc: 'Dynamic flowing SVG section dividers with animation' },
      { id: 'svg-blob',          name: 'SVG Blob Generator',    icon: 'shapes', desc: 'Organic fluid blob shapes with random seeds' },
      { id: 'clip-path',         name: 'Clip-Path Polygon',     icon: 'shapes', desc: 'Interactive visual polygon & shape clipper' },
      { id: 'border-radius',     name: 'Fancy Border Radius',   icon: 'shapes', desc: '8-value organic squircle border generator' },
      { id: 'grid-generator',    name: 'CSS Grid Studio',       icon: 'grid',   desc: 'Visual track and grid-template builder' },
      { id: 'flexbox-playground',name: 'Flexbox Playground',    icon: 'ratio',  desc: 'Interactive flex alignment and direction tester' }
    ]
  },
  {
    id: 'components',
    name: 'Components',
    icon: 'box',
    groups: [
      {
        label: 'Dashboard',
        tools: [
          { id: 'app-canvas',        name: 'App Canvas (Homescreen)', icon: 'layout',   desc: 'Composite living dashboard with editable cards, tables, charts and combined CSS' },
          { id: 'blocks-studio',     name: 'Page Blocks Studio',    icon: 'grid',    desc: 'shadcn/ui & HeroUI application blocks: Analytics, Auth, Settings, Pricing' }
        ]
      },
      {
        label: 'Charts & Graphs',
        tools: [
          { id: 'charts-studio',     name: 'Charts & Graphs',       icon: 'barChart',desc: 'Interactive Area, Bar, Donut charts and sparklines' }
        ]
      },
      {
        label: 'Buttons & Triggers',
        tools: [
          { id: 'button-generator',  name: 'Button Studio',         icon: 'zap',     desc: 'HeroUI & shadcn buttons with solid, flat, faded & loading states' },
          { id: 'toggle-checkbox',   name: 'Toggle & Checkbox',     icon: 'toggle',  desc: 'Pure CSS iOS/Material toggle switches and custom checks' },
          { id: 'badge-tag',         name: 'Badge & Status Tag',    icon: 'tag',     desc: 'Status pills, notification badges and tags' }
        ]
      },
      {
        label: 'Form & Selectors',
        tools: [
          { id: 'form-input-styler', name: 'Input & Form Controls', icon: 'form',    desc: 'Modern inputs, focus rings and floating labels' },
          { id: 'tabs-component',    name: 'Tabs & Segmented',      icon: 'tabs',    desc: 'HeroUI animated pill slider, underline & bordered tabs' },
          { id: 'tooltip-generator', name: 'CSS Tooltip Builder',   icon: 'tooltip', desc: 'Pure CSS directional hover tooltips' }
        ]
      },
      {
        label: 'Data Display',
        tools: [
          { id: 'table-styler',      name: 'Data Table Studio',     icon: 'table',   desc: 'E-commerce & SaaS data table with search, sorting & bulk actions' },
          { id: 'card-designer',     name: 'Card Designer',         icon: 'box',     desc: 'Modern content, stats, blur glass and pricing cards' },
          { id: 'list-accordion',    name: 'Lists & Accordions',    icon: 'list',    desc: 'Interactive collapsible FAQ accordion & HeroUI listbox' },
          { id: 'avatar-stack',      name: 'Avatar & Stack',        icon: 'users',   desc: 'User avatars, status indicators and overlapping stacks' }
        ]
      },
      {
        label: 'Navigation & Overlays',
        tools: [
          { id: 'navbar-builder',    name: 'Navbar Generator',      icon: 'navbar',  desc: 'Responsive header bars with glass effect and mobile nav' },
          { id: 'modal-dialog',      name: 'Modal & Dialog Studio', icon: 'modal',   desc: 'Interactive dialogs with backdrop blur, alert & slide sheet' },
          { id: 'divider-separator', name: 'Section Dividers',      icon: 'divider', desc: 'Ornate and minimal CSS horizontal separators' }
        ]
      }
    ],
    tools: [
      { id: 'app-canvas',        name: 'App Canvas (Homescreen)', icon: 'layout',   desc: 'Composite living dashboard with editable cards, tables, charts and combined CSS' },
      { id: 'blocks-studio',     name: 'Page Blocks Studio',    icon: 'grid',    desc: 'shadcn/ui & HeroUI application blocks: Analytics, Auth, Settings, Pricing' },
      { id: 'button-generator',  name: 'Button Studio',         icon: 'zap',     desc: 'HeroUI & shadcn buttons with solid, flat, faded & loading states' },
      { id: 'card-designer',     name: 'Card Designer',         icon: 'box',     desc: 'Modern content, stats, blur glass and pricing cards' },
      { id: 'modal-dialog',      name: 'Modal & Dialog Studio', icon: 'modal',   desc: 'Interactive dialogs with backdrop blur, alert & slide sheet' },
      { id: 'tabs-component',    name: 'Tabs & Segmented',      icon: 'tabs',    desc: 'HeroUI animated pill slider, underline & bordered tabs' },
      { id: 'charts-studio',     name: 'Charts & Graphs',       icon: 'barChart',desc: 'Interactive Area, Bar, Donut charts and sparklines' },
      { id: 'table-styler',      name: 'Data Table Studio',     icon: 'table',   desc: 'E-commerce & SaaS data table with search, sorting & bulk actions' },
      { id: 'list-accordion',    name: 'Lists & Accordions',    icon: 'list',    desc: 'Interactive collapsible FAQ accordion & HeroUI listbox' },
      { id: 'navbar-builder',    name: 'Navbar Generator',      icon: 'navbar',  desc: 'Responsive header bars with glass effect and mobile nav' },
      { id: 'form-input-styler', name: 'Input & Form Controls', icon: 'form',    desc: 'Modern inputs, focus rings and floating labels' },
      { id: 'toggle-checkbox',   name: 'Toggle & Checkbox',     icon: 'toggle',  desc: 'Pure CSS iOS/Material toggle switches and custom checks' },
      { id: 'tooltip-generator', name: 'CSS Tooltip Builder',   icon: 'tooltip', desc: 'Pure CSS directional hover tooltips' },
      { id: 'badge-tag',         name: 'Badge & Status Tag',    icon: 'tag',     desc: 'Status pills, notification badges and tags' },
      { id: 'avatar-stack',      name: 'Avatar & Stack',        icon: 'users',   desc: 'User avatars, status indicators and overlapping stacks' },
      { id: 'divider-separator', name: 'Section Dividers',      icon: 'divider', desc: 'Ornate and minimal CSS horizontal separators' }
    ]
  },
  {
    id: 'motion',
    name: 'Motion & Text',
    icon: 'activity',
    tools: [
      { id: 'loading-spinner',   name: 'CSS Spinners & Loaders', icon: 'loader',    desc: 'Pure CSS single-element spinners, bars and pulses' },
      { id: 'skeleton-screen',   name: 'Skeleton Loader',        icon: 'skeleton',  desc: 'Shimmering placeholder UI for asynchronous loading' },
      { id: 'hover-effects',     name: 'Hover Effects Library',  icon: 'cursor',    desc: 'Scale, glow, rotate and border-draw hover micro-interactions' },
      { id: 'keyframe-animator', name: 'Keyframe Timeline',      icon: 'film',      desc: 'Multi-step visual timeline animation builder' },
      { id: 'text-animations',   name: 'Text Animations',        icon: 'text',      desc: 'Typing effect, glitch, fade-in and rainbow text motion' },
      { id: 'text-effects',      name: 'Text Effects',           icon: 'neon',      desc: 'Gradients, neon glow, 3D emboss text effects' },
      { id: 'underline-effects', name: 'Animated Underlines',    icon: 'underline', desc: 'Expand, sweep, gradient and playful link hover underlines' },
      { id: 'transform-3d',      name: '3D Transform & Tilt',    icon: 'cube',      desc: '3D perspective, rotation and interactive card tilt' }
    ]
  },
  {
    id: 'tools',
    name: 'Dev Tools',
    icon: 'tool',
    tools: [
      { id: 'color-converter',       name: 'Color Format Converter',    icon: 'swap',      desc: 'HEX, RGB, HSL, OKLCH, and CMYK instant conversion' },
      { id: 'easing-editor',         name: 'Cubic-Bezier Easing',       icon: 'bezier',    desc: 'Draggable physics curve editor with live comparison' },
      { id: 'transition-builder',    name: 'Transition Builder',         icon: 'transition',desc: 'Multi-property CSS transition timing builder' },
      { id: 'scrollbar-styler',      name: 'Scrollbar Styler',          icon: 'scroll',    desc: 'WebKit & Firefox custom scrollbars' },
      { id: 'aspect-ratio',          name: 'Aspect Ratio Calculator',   icon: 'ratio',     desc: '16:9, 4:3, 1:1 responsive container ratio generator' },
      { id: 'media-query',           name: 'Media Query Builder',       icon: 'desktop',   desc: 'Responsive breakpoints and container query generator' },
      { id: 'responsive-preview',    name: 'Device Mockups',            icon: 'tablet',    desc: 'Real-time Mobile, Tablet, Laptop frame previews' },
      { id: 'responsive-typography', name: 'Fluid Typography clamp()',  icon: 'type',      desc: 'Fluid viewport-scaled font size calculator' }
    ]
  }
];

export function getToolMeta(toolId) {
  for (const cat of CATEGORIES) {
    if (cat.tools) {
      const tool = cat.tools.find(t => t.id === toolId);
      if (tool) return { ...tool, categoryName: cat.name, categoryId: cat.id };
    }
    if (cat.groups) {
      for (const group of cat.groups) {
        const tool = group.tools.find(t => t.id === toolId);
        if (tool) return { ...tool, categoryName: cat.name, categoryId: cat.id, groupName: group.label };
      }
    }
  }
  return null;
}
