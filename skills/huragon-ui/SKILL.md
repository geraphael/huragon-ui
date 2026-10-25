---
name: huragon-ui
description: Design, generate, and style monochromatic zinc web interfaces inspired by HeroUI and shadcn/ui. Use when building web apps, components, cards, tables, navbars, forms, and landing pages with pure CSS, Tailwind, or React JSX.
---

# Huragon/UI Design System & Agent Skill

A comprehensive design engineering guide and component blueprint library for AI coding agents (Claude, Codex, Antigravity, Cursor) generating production web interfaces.

## 1. Core Design Tenets

1. **Monochromatic Zinc Precision**: Base palette is strict grayscale (Zinc 50 to 950) with subtle specular 1px borders (`rgba(255,255,255,0.08)` dark, `rgba(0,0,0,0.08)` light). Semantic accents are crisp: Emerald (`#22c55e`) for active/growth, Amber (`#f59e0b`) for pending/warning, Rose (`#f43f5e`) for error/danger.
2. **Zero Pictographic Emojis**: Always use Lucide/Feather monochrome SVG icons with `stroke="currentColor"`, `stroke-width="2"`, `fill="none"`. Never insert Unicode emoji pictographs in UI code, status labels, or buttons.
3. **Global Currency**: Always format financial and pricing metrics with `$` USD (`$45,231.89`, `$1,199.00`, `$249.00`).
4. **Fluid Mathematical Scaling**: Typography and spacing scale proportionally using standard 8pt/4pt rhythm and CSS `clamp()` fluid math.
5. **Multi-Target Portability**: Every component must be constructible in standard CSS with CSS variables, Tailwind utility classes, and typed React JSX.

---

## 2. Global CSS Token System

```css
:root {
  /* Light Theme */
  --bg-primary: #ffffff;
  --bg-secondary: #f4f4f5;
  --surface-1: #ffffff;
  --surface-2: #f4f4f5;
  --surface-3: #e4e4e7;
  --border: #e4e4e7;
  --border-strong: #d4d4d8;
  --text-primary: #09090b;
  --text-secondary: #71717a;
  --text-dim: #a1a1aa;
  --accent: #18181b;
  --accent-contrast: #ffffff;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-full: 9999px;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.05);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.05);
}

.theme-dark {
  /* Dark Theme */
  --bg-primary: #09090b;
  --bg-secondary: #121215;
  --surface-1: #18181b;
  --surface-2: #27272a;
  --surface-3: #3f3f46;
  --border: #27272a;
  --border-strong: #3f3f46;
  --text-primary: #fafafa;
  --text-secondary: #a1a1aa;
  --text-dim: #71717a;
  --accent: #fafafa;
  --accent-contrast: #09090b;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.4);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.4), 0 2px 4px -2px rgba(0,0,0,0.3);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.5), 0 4px 6px -4px rgba(0,0,0,0.4);
}
```

---

## 3. High-Craft Component Blueprints

### A. Metric KPI Stat Card
```html
<div class="kpi-card">
  <div class="kpi-header">
    <span class="kpi-label">Gross Revenue</span>
    <span class="kpi-tag">$ USD</span>
  </div>
  <div class="kpi-value">$45,231.89</div>
  <div class="kpi-trend trend-positive">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
    <span>+20.1% vs last month</span>
  </div>
</div>
```
```css
.kpi-card {
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 20px 22px;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.kpi-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.kpi-tag {
  font-size: 0.68rem;
  font-family: monospace;
  color: var(--text-dim);
  background: var(--surface-2);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
}
.kpi-value {
  font-size: 1.65rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.03em;
}
.kpi-trend {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}
.trend-positive { color: #22c55e; }
.trend-negative { color: #ef4444; }
```

### B. Interactive E-commerce Data Table
```html
<div class="table-container">
  <table class="huragon-table">
    <thead>
      <tr>
        <th>Product</th>
        <th>Category</th>
        <th>Price</th>
        <th>Inventory</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="font-medium">AirPods Pro (2nd Gen)</td>
        <td class="text-secondary">Audio</td>
        <td class="font-mono">$249.00</td>
        <td>142 in stock</td>
        <td><span class="badge badge-success">In Stock</span></td>
      </tr>
      <tr>
        <td class="font-medium">MacBook Air 15" M3</td>
        <td class="text-secondary">Computers</td>
        <td class="font-mono">$1,199.00</td>
        <td>48 in stock</td>
        <td><span class="badge badge-success">In Stock</span></td>
      </tr>
      <tr>
        <td class="font-medium">Studio Display 27" 5K</td>
        <td class="text-secondary">Displays</td>
        <td class="font-mono">$1,599.00</td>
        <td>9 in stock</td>
        <td><span class="badge badge-warning">Low Stock</span></td>
      </tr>
    </tbody>
  </table>
</div>
```
```css
.table-container {
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface-1);
}
.huragon-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
  text-align: left;
}
.huragon-table th {
  padding: 12px 16px;
  background: var(--surface-2);
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--border);
}
.huragon-table td {
  padding: 14px 16px;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border);
}
.huragon-table tr:last-child td {
  border-bottom: none;
}
.huragon-table tr:hover td {
  background: var(--surface-2);
}
.badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  font-size: 0.7rem;
  font-weight: 500;
  border-radius: var(--radius-full);
}
.badge-success {
  background: rgba(34, 197, 94, 0.12);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.25);
}
.badge-warning {
  background: rgba(245, 158, 11, 0.12);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.25);
}
```

### C. Floating Dynamic Island Navbar
```html
<nav class="nav-island">
  <div class="nav-island-brand">huragon/ui</div>
  <div class="nav-island-links">
    <a href="#" class="active">Overview</a>
    <a href="#">Products</a>
    <a href="#">Analytics</a>
    <a href="#">Settings</a>
  </div>
  <div class="nav-island-actions">
    <button class="btn btn-primary btn-sm">Upgrade</button>
  </div>
</nav>
```
```css
.nav-island {
  position: sticky;
  top: 16px;
  z-index: 100;
  display: inline-flex;
  align-items: center;
  gap: 24px;
  padding: 8px 18px;
  background: rgba(24, 24, 27, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-lg);
}
.nav-island-brand {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}
.nav-island-links {
  display: flex;
  align-items: center;
  gap: 16px;
}
.nav-island-links a {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.15s ease;
}
.nav-island-links a.active,
.nav-island-links a:hover {
  color: var(--text-primary);
}
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  border-radius: var(--radius-full);
  transition: all 0.15s ease;
}
.btn-primary {
  background: var(--text-primary);
  color: var(--bg-primary);
}
.btn-primary:hover {
  opacity: 0.92;
}
.btn-sm {
  padding: 5px 12px;
  font-size: 0.72rem;
}
```

---

## 4. Instructions for AI Assistants Generating Code

1. Always default to dark mode tokens (`#09090b` canvas, `#18181b` card surface, `#27272a` subtle border).
2. For cards and dialogs, use subtle backdrop blur (`backdrop-filter: blur(12px)`) with thin borders.
3. Keep controls tactile with active state press scaling (`transform: scale(0.98)`).
4. If writing React/Tailwind code, use `@radix-ui` / shadcn naming conventions with standard Tailwind zinc tokens (`bg-zinc-950`, `border-zinc-800`, `text-zinc-100`).
5. Ensure mobile responsiveness: stack multi-column metric grids (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`) and enable horizontal scrolling on data tables.
