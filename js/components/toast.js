import { el, qs } from '../utils/dom.js';
import { ICONS } from '../utils/icons.js';

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

export function showToast(message, iconSvg = ICONS.check, duration = 2000) {
  const cont = getContainer();
  const toast = el('div', { className: 'toast' }, [
    el('span', { style: { display: 'flex', alignItems: 'center' }, innerHTML: iconSvg }),
    el('span', { textContent: message })
  ]);

  cont.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => {
      toast.remove();
    }, 180);
  }, duration);
}
