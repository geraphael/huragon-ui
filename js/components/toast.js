// Notification toast system
import { el, qs } from '../utils/dom.js';

let container = null;

function getContainer() {
  if (!container) {
    container = qs('#toast-container');
    if (!container) {
      container = el('div', { id: 'toast-container' });
      document.body.appendChild(container);
    }
  }
  return container;
}

export function showToast(message, icon = '✅', duration = 2400) {
  const cont = getContainer();
  const toast = el('div', { className: 'toast' }, [
    el('span', { textContent: icon }),
    el('span', { textContent: message })
  ]);

  cont.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => {
      toast.remove();
    }, 260);
  }, duration);
}
