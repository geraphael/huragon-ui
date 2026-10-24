// Huragon/ui Service Worker - v4.0.0 (HeroUI & shadcn/ui Blocks Design Redesign)
const CACHE_NAME = 'huragon-ui-v4';

const STATIC_PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './assets/favicon.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-192.png',
  './assets/icons/icon-maskable-512.png',
  './assets/icons/apple-touch-icon.png',
  './css/reset.css',
  './css/tokens.css',
  './css/base.css',
  './css/layout.css',
  './css/components.css',
  './css/landing.css',
  './js/main.js',
  './js/app.js',
  './js/router.js',
  './js/tools-registry.js',
  './js/highlight.js',
  './js/utils/dom.js',
  './js/utils/icons.js',
  './js/generators/mesh-gradient.js',
  './js/generators/gradient-builder.js',
  './js/generators/animated-gradient.js',
  './js/generators/aurora-gradient.js',
  './js/generators/glassmorphism.js',
  './js/generators/box-shadow.js',
  './js/generators/css-filters.js',
  './js/generators/text-effects.js',
  './js/generators/transform-3d.js',
  './js/generators/neumorphism.js',
  './js/generators/svg-wave.js',
  './js/generators/svg-blob.js',
  './js/generators/clip-path.js',
  './js/generators/border-radius.js',
  './js/generators/grid-generator.js',
  './js/generators/flexbox-playground.js',
  './js/generators/responsive-preview.js',
  './js/generators/media-query.js',
  './js/generators/responsive-typography.js',
  './js/generators/button-generator.js',
  './js/generators/card-designer.js',
  './js/generators/modal-dialog.js',
  './js/generators/tabs-component.js',
  './js/generators/charts-studio.js',
  './js/generators/table-styler.js',
  './js/generators/list-accordion.js',
  './js/generators/navbar-builder.js',
  './js/generators/form-input-styler.js',
  './js/generators/toggle-checkbox.js',
  './js/generators/tooltip-generator.js',
  './js/generators/badge-tag.js',
  './js/generators/avatar-stack.js',
  './js/generators/table-styler.js',
  './js/generators/divider-separator.js',
  './js/generators/loading-spinner.js',
  './js/generators/skeleton-screen.js',
  './js/generators/hover-effects.js',
  './js/generators/keyframe-animator.js',
  './js/generators/text-animations.js',
  './js/generators/background-patterns.js',
  './js/generators/noise-texture.js',
  './js/generators/underline-effects.js',
  './js/generators/color-palette.js',
  './js/generators/contrast-checker.js',
  './js/generators/typography-scale.js',
  './js/generators/scrollbar-styler.js',
  './js/generators/easing-editor.js',
  './js/generators/transition-builder.js',
  './js/generators/color-converter.js',
  './js/generators/spacing-calculator.js',
  './js/generators/aspect-ratio.js',
  './js/generators/css-reset.js'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_PRECACHE).catch((err) => {
        console.warn('[PWA] Pre-cache non-fatal error:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[PWA] Removing obsolete cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Stale-while-revalidate for local assets, cache-first for fonts
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Handle Google Fonts
  if (url.origin.includes('fonts.googleapis.com') || url.origin.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Handle local same-origin assets
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        }).catch(() => {
          // Fallback if offline and request is an HTML page
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });

        return cachedResponse || fetchPromise;
      })
    );
  }
});
