// DOM manipulation helpers

export function el(tag, attrs = {}, children = []) {
  const element = document.createElement(tag);
  
  for (const [key, val] of Object.entries(attrs)) {
    if (key === 'className' || key === 'class') {
      element.className = val;
    } else if (key === 'innerHTML') {
      element.innerHTML = val;
    } else if (key === 'textContent' || key === 'text') {
      element.textContent = val;
    } else if (key.startsWith('on') && typeof val === 'function') {
      element.addEventListener(key.slice(2).toLowerCase(), val);
    } else if (key === 'style' && typeof val === 'object') {
      Object.assign(element.style, val);
    } else {
      element.setAttribute(key, val);
    }
  }

  if (!Array.isArray(children)) {
    children = [children];
  }

  for (const child of children) {
    if (child == null) continue;
    if (typeof child === 'string' || typeof child === 'number') {
      element.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      element.appendChild(child);
    }
  }

  return element;
}

export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function qsa(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}
