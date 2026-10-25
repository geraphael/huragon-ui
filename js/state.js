// Global Reactive State using JS Proxy

const listeners = new Map();

export const state = new Proxy({
  currentTool: 'mesh-gradient',
  deviceMode: 'desktop', // mobile, tablet, laptop, desktop
  theme: localStorage.getItem('huragon_theme') || 'dark',
  codeTab: 'css', // css, tailwind, react, tokens
  toolStates: {}
}, {
  set(target, prop, value) {
    target[prop] = value;
    notify(prop, value);
    return true;
  }
});

export function subscribe(prop, callback) {
  if (!listeners.has(prop)) {
    listeners.set(prop, new Set());
  }
  listeners.get(prop).add(callback);
  return () => listeners.get(prop).delete(callback);
}

function notify(prop, value) {
  if (listeners.has(prop)) {
    listeners.get(prop).forEach(cb => {
      try {
        cb(value);
      } catch (e) {
        console.error('State listener error:', e);
      }
    });
  }
}
