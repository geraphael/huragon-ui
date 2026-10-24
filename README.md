# 🎨 Huragon/ui — The Ultimate CSS Design Studio

> **One tool to rule them all.** An all-in-one CSS design studio and visual generator suite inspired by shadcn/ui, neumorphism, and modern web design tooling. Built with zero runtime framework dependencies.

![Huragon UI Preview](assets/favicon.svg)

---

## 🚀 Features

- **🌈 Mesh Gradients** — Multi-point radial mesh gradient generator with real-time drag-and-drop handles and randomizer.
- **🪟 Glassmorphism** — Frosted glass cards with live backdrop-filter, saturation boost, and specular border styling.
- **🟦 Box Shadow Layers** — Multi-layer optical depth shadow stack builder with inset toggles.
- **🌊 SVG Wave Dividers** — Parametric flowing section transitions with looping animation and responsive scaling.
- **🔘 Button Studio** — Multi-state button designer with hover, active, gradient, and neon presets.
- **🪨 Neumorphism (Soft UI)** — Dual-shadow tactile UI components (flat, convex, concave, pressed).
- **🔄 CSS Spinners & Loaders** — Pure CSS single-element spinners, dual-rings, and bouncing pulses.
- **📱 Responsive Breakpoint Preview** — Instant Mobile (375px), Tablet (768px), Laptop (1024px), and Full Desktop frame previews.
- **📋 Instant Code Export** — Copy clean Vanilla CSS and Tailwind CSS classes with syntax highlighting.
- **🌗 Theme Toggle** — Full dark and light surface modes with persistent storage.
- **🔍 Fast Search (⌘K / Ctrl+K)** — Instant filter across all 47 planned studio generators.

---

## 🛠️ Tech Stack

- **Pure Vanilla HTML5, CSS3 & Modern JavaScript (ES Modules)**
- **No build step required** (Zero npm dependencies, opens directly or deploys on static CDNs)
- **Hostable for free** on **Cloudflare Pages**, GitHub Pages, or Vercel.

---

## 📦 How to Run Locally

You can run Huragon/ui with any local static HTTP server, for example:

```bash
# Using Python
python -m http.server 3000

# Or using Node.js (npx)
npx serve .
```

Open `http://localhost:3000` in your browser.

---

## ☁️ Deploying to Cloudflare Pages (Free)

1. Push your repository to **GitHub** (e.g. `https://github.com/your-username/huragon-ui`).
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select your repository.
4. Set the build settings:
   - **Framework preset**: `None`
   - **Build command**: *(leave empty)*
   - **Build output directory**: `/` (root)
5. Click **Save and Deploy**. Your site will be live on `https://huragon-ui.pages.dev` with unlimited bandwidth, global edge distribution, and automatic HTTPS.

---

## 📄 License

MIT License © 2026 Huragon/ui
