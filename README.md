# Huragon/ui — Modern CSS Design Studio

> **One suite to build them all.** An all-in-one CSS design system and visual generator suite inspired by shadcn/ui and modern developer tools. Built with vanilla web standards and zero framework dependencies.

Live Deployment: [https://huragon-ui.geraphael100.workers.dev](https://huragon-ui.geraphael100.workers.dev)  
Repository: [https://github.com/geraphael/huragon-ui](https://github.com/geraphael/huragon-ui)

---

## Suite Architecture (47 Dedicated Generators)

Huragon/ui unifies 47 specialized CSS and design system generators across 10 structured categories:

### 1. Gradients & Backgrounds
* **Mesh Gradient** — Multi-point draggable radial mesh gradient canvas.
* **Linear & Radial Gradient** — Multi-stop linear, radial, and conic gradient designer with angle dial.
* **Animated Gradient** — Continuous keyframe-driven gradient color loops.
* **Aurora Borealis Glow** — Multi-beam atmospheric radial glow with fluid drift physics.

### 2. Effects & Shadows
* **Glassmorphism** — Frosted glass cards with backdrop-filter, saturation boost, and specular borders.
* **Neumorphism (Soft UI)** — Tactile dual-shadow components (flat, convex, concave, pressed).
* **Box Shadow Layers** — Multi-layer optical depth shadow stacking studio.
* **CSS Filters** — Real-time visual filter and backdrop-filter chaining.
* **Text Effects** — Gradient typography, neon glow, and 3D emboss treatments.
* **3D Transform & Tilt** — Perspective camera pitch, yaw, roll, and interactive pointer card tilt.

### 3. Shapes & Dividers
* **SVG Wave Divider** — Parametric multi-layer section transitions with looping animation.
* **SVG Blob Generator** — Organic cubic-bezier SVG fluid blob paths with random seeds.
* **Clip-Path Polygon** — Visual coordinate polygon clipper with geometric presets.
* **Fancy Border Radius** — 8-value organic squircle generator with dual-axis sliders.

### 4. Layout Systems
* **CSS Grid Studio** — Multi-track template builder with visual column and row track spanning.
* **Flexbox Playground** — Interactive flex alignment, direction, wrap, and gap workbench.

### 5. Responsive & Viewports
* **Device Mockups** — Interactive phone, tablet, and laptop hardware chassis simulator.
* **Media Query Builder** — Mobile-first, desktop-first, modern range syntax, and container queries.
* **Fluid Typography clamp()** — Viewport-scaled mathematical font size calculator.

### 6. UI Components
* **Button Studio** — Multi-state button generator with hover, active, focus, and gradient presets.
* **Card Designer** — Content, statistics, and product cards with elevation physics.
* **Navbar Generator** — Responsive navigation bars with frosted glass blur and mobile menus.
* **Input & Form Controls** — Modern text inputs, focus ring halos, and floating label animations.
* **Toggle & Checkbox** — Accessible pure CSS iOS/Material switches and custom checks.
* **CSS Tooltip Builder** — Directional hover tooltips with smooth micro-interactions.
* **Badge & Status Tag** — Status pills, count notification badges, and active dot indicators.
* **Avatar & Avatar Stack** — Overlapping avatar groups with cut-out rings and presence dots.
* **Data Table Styler** — Striped, bordered, and sticky-header data tables with density presets.
* **Section Dividers** — Gradient fade lines, centered badges, and technical dashed separators.

### 7. Animations & Loaders
* **CSS Spinners & Loaders** — Pure CSS single-element spinners, dual rings, and bouncing pulses.
* **Skeleton Loader** — Shimmer wave and gentle pulse placeholder loading states.
* **Hover Effects Library** — Elevation lift, scale zoom, ambient glow, and border stroke micro-interactions.
* **Keyframe Timeline** — Multi-step visual keyframe timeline animation builder.
* **Text Animations** — Typewriter effect, digital glitch, gradient shimmer, and blur-in reveal.

### 8. Patterns & Textures
* **CSS Background Patterns** — Procedural dot matrix, blueprint grid, diagonal stripes, and cross-hatch.
* **SVG Noise & Grain** — Film grain and tactile textures using SVG feTurbulence.
* **Animated Underlines** — Left-to-right expansion, center-outward, and marker sweep link underlines.

### 9. Color & Typography
* **Color Palette Studio** — 11-step Tailwind shade scales (50-950) with OKLCH color space support.
* **WCAG Contrast Checker** — Real-time AA/AAA compliance analyzer with luminance calculation.
* **Type Scale System** — Mathematical musical modular scales (Major Third, Golden Ratio, etc.).

### 10. CSS Utilities
* **Scrollbar Styler** — Cross-browser WebKit and Firefox custom scrollbars.
* **Cubic-Bezier Easing** — Curve editor with interactive comparison race tracks.
* **Transition Builder** — Multi-property coordinated transition timing builder.
* **Color Format Converter** — Instant conversion between HEX, RGB, RGBA, HSL, OKLCH, and CMYK.
* **Spacing System (8pt/4pt)** — Systematic spacing scale generator with rem tokens.
* **Aspect Ratio Calculator** — Standard 16:9, 4:3, 1:1 containers and legacy padding-top calculation.
* **CSS Reset Generator** — Modern modular baseline reset with customizable rules.

---

## Technical Specifications

* **Pure Vanilla Architecture**: Zero bundler or framework runtime overhead. Handcrafted with semantic HTML5, CSS3 Custom Properties, and ES Modules.
* **Progressive Web App (PWA)**: Full offline capability with Service Worker caching, Web App Manifest, maskable vector icons, and native install prompt.
* **Responsive Simulation**: Live testing container with presets for Full Desktop, Laptop (980px), Tablet (768px), and Mobile (375px).
* **Code Export**: Instant copyable Vanilla CSS custom properties and matching Tailwind CSS arbitrary classes with tokenized syntax highlighting.
* **Theme Modes**: Native dark and light themes using high-contrast monochromatic neutral tones.

---

## Local Development

Launch Huragon/ui with any local static HTTP server:

```bash
# Using Python
python -m http.server 3000

# Using Node.js
npx serve .
```

Open `http://localhost:3000` in any modern web browser.

---

## Cloudflare Pages Deployment

Huragon/ui is structured for direct deployment to Cloudflare Pages:

1. Push to your GitHub repository:
   ```bash
   git push origin main
   ```
2. Connect the repository in the **Cloudflare Dashboard** under **Workers & Pages**.
3. Select **None** as the framework preset, leave the build command blank, and set output directory to `/`.
4. Deploy for edge delivery worldwide with sub-second response times.

---

## License

MIT License. Free for personal and commercial projects.
