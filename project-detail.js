const tabs = [...document.querySelectorAll('[data-case]')];
const panels = [...document.querySelectorAll('[data-panel]')];
const switcher = document.querySelector('.case-switcher');
const progress = document.querySelector('.reading-progress i');
const diagnosis = document.querySelector('.diagnosis-sequence');

function initGlassSurface() {
  const surface = document.querySelector('.glass-surface-adapt');
  if (!surface) return;

  const probe = document.createElement('div');
  probe.style.backdropFilter = 'url(#glass-surface-probe)';
  const unsupportedEngine = /Firefox/i.test(navigator.userAgent) || (/Safari/i.test(navigator.userAgent) && !/Chrome|Chromium|Edg/i.test(navigator.userAgent));
  const supportsSvgBackdrop = probe.style.backdropFilter !== '' && !unsupportedEngine;

  if (!supportsSvgBackdrop) {
    surface.classList.add('glass-surface--fallback');
    return;
  }

  const ns = 'http://www.w3.org/2000/svg';
  const filterId = 'top-glass-surface-filter';
  const svg = document.createElementNS(ns, 'svg');
  svg.classList.add('glass-surface-filter');
  svg.setAttribute('aria-hidden', 'true');
  const defs = document.createElementNS(ns, 'defs');
  const filter = document.createElementNS(ns, 'filter');
  filter.id = filterId;
  filter.setAttribute('color-interpolation-filters', 'sRGB');
  filter.setAttribute('x', '0%');
  filter.setAttribute('y', '0%');
  filter.setAttribute('width', '100%');
  filter.setAttribute('height', '100%');

  const map = document.createElementNS(ns, 'feImage');
  map.setAttribute('x', '0');
  map.setAttribute('y', '0');
  map.setAttribute('width', '100%');
  map.setAttribute('height', '100%');
  map.setAttribute('preserveAspectRatio', 'none');
  map.setAttribute('result', 'map');
  filter.append(map);

  const channelMatrix = (channel, values, scale) => {
    const displacement = document.createElementNS(ns, 'feDisplacementMap');
    displacement.setAttribute('in', 'SourceGraphic');
    displacement.setAttribute('in2', 'map');
    displacement.setAttribute('scale', String(scale));
    displacement.setAttribute('xChannelSelector', 'R');
    displacement.setAttribute('yChannelSelector', 'G');
    displacement.setAttribute('result', `disp-${channel}`);
    const matrix = document.createElementNS(ns, 'feColorMatrix');
    matrix.setAttribute('in', `disp-${channel}`);
    matrix.setAttribute('type', 'matrix');
    matrix.setAttribute('values', values);
    matrix.setAttribute('result', channel);
    filter.append(displacement, matrix);
  };

  channelMatrix('red', '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0', -34);
  channelMatrix('green', '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0', -29);
  channelMatrix('blue', '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0', -24);

  const blendRG = document.createElementNS(ns, 'feBlend');
  blendRG.setAttribute('in', 'red');
  blendRG.setAttribute('in2', 'green');
  blendRG.setAttribute('mode', 'screen');
  blendRG.setAttribute('result', 'rg');
  const blendRGB = document.createElementNS(ns, 'feBlend');
  blendRGB.setAttribute('in', 'rg');
  blendRGB.setAttribute('in2', 'blue');
  blendRGB.setAttribute('mode', 'screen');
  blendRGB.setAttribute('result', 'output');
  const soften = document.createElementNS(ns, 'feGaussianBlur');
  soften.setAttribute('in', 'output');
  soften.setAttribute('stdDeviation', '.18');
  filter.append(blendRG, blendRGB, soften);
  defs.append(filter);
  svg.append(defs);
  document.body.append(svg);

  const updateMap = () => {
    const rect = surface.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    const edge = Math.max(2, Math.min(width, height) * .035);
    const radius = Math.min(30, height * .32);
    const mapSvg = `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="r" x1="100%" y1="0%" x2="0%" y2="0%"><stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="red"/></linearGradient><linearGradient id="b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="blue"/></linearGradient></defs><rect width="${width}" height="${height}" fill="black"/><rect width="${width}" height="${height}" rx="${radius}" fill="url(#r)"/><rect width="${width}" height="${height}" rx="${radius}" fill="url(#b)" style="mix-blend-mode:screen"/><rect x="${edge}" y="${edge}" width="${width - edge * 2}" height="${height - edge * 2}" rx="${radius}" fill="hsl(0 0% 82% / .76)" style="filter:blur(10px)"/></svg>`;
    map.setAttribute('href', `data:image/svg+xml,${encodeURIComponent(mapSvg)}`);
  };

  surface.style.setProperty('--glass-filter', `url(#${filterId})`);
  surface.classList.add('glass-surface--svg');
  updateMap();
  new ResizeObserver(() => requestAnimationFrame(updateMap)).observe(surface);
}

initGlassSurface();

document.querySelectorAll('.typewriter-title').forEach((title) => {
  const textNodes = [];
  const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    if (walker.currentNode.parentElement?.classList.contains('type-caret')) continue;
    textNodes.push(walker.currentNode);
  }
  let typeIndex = 0;
  textNodes.forEach((node) => {
    const fragment = document.createDocumentFragment();
    Array.from(node.textContent).forEach((char) => {
      if (/\s/.test(char)) {
        fragment.append(char);
        return;
      }
      const span = document.createElement('span');
      span.className = 'type-char';
      span.textContent = char;
      span.style.setProperty('--type-index', typeIndex++);
      fragment.append(span);
    });
    node.replaceWith(fragment);
  });
});

function startCountUp(scope) {
  scope.querySelectorAll('[data-count-up]:not([data-counted])').forEach((counter) => {
    counter.dataset.counted = 'true';
    const target = Number(counter.dataset.countUp) || 0;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      counter.textContent = String(target);
      return;
    }
    const duration = 1450;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

document.querySelectorAll('.story-heading h2').forEach((title) => {
  const textNodes = [];
  const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  let charIndex = 0;
  textNodes.forEach((node) => {
    const fragment = document.createDocumentFragment();
    Array.from(node.textContent).forEach((char) => {
      if (/\s/.test(char)) {
        fragment.append(char);
        return;
      }
      const span = document.createElement('span');
      span.className = 'story-char';
      span.textContent = char;
      span.style.setProperty('--char-index', charIndex++);
      fragment.append(span);
    });
    node.replaceWith(fragment);
  });
});

document.querySelectorAll('.footer-home>span,.footer-bottom>a').forEach((element) => {
  const text = element.textContent;
  element.textContent = '';
  Array.from(text).forEach((char) => {
    if (/\s/.test(char)) {
      const space = document.createElement('span');
      space.className = 'footer-select-space';
      space.textContent = char;
      element.append(space);
      return;
    }
    const letter = document.createElement('span');
    letter.className = 'footer-select-char';
    letter.textContent = char;
    element.append(letter);
  });
});

function observeReveals(scope = document) {
  const items = scope.querySelectorAll('.reveal:not([data-observed]),.detail-reveal:not([data-observed])');
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      startCountUp(entry.target);
      instance.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
  items.forEach((item, index) => {
    item.dataset.observed = 'true';
    item.style.transitionDelay = `${Math.min(index % 3, 2) * 80}ms`;
    observer.observe(item);
  });
}

function setCase(name, updateHash = true) {
  const next = panels.find((panel) => panel.dataset.panel === name) || panels[0];
  panels.forEach((panel) => {
    const active = panel === next;
    panel.hidden = !active;
    panel.classList.toggle('is-active', active);
  });
  tabs.forEach((tab) => {
    const active = tab.dataset.case === next.dataset.panel;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  switcher.dataset.active = next.dataset.panel;
  if (updateHash) {
    history.replaceState(null, '', `#${next.dataset.panel}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  requestAnimationFrame(() => observeReveals(next));
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    setCase(tab.dataset.case);
  });
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const next = tabs[(index + direction + tabs.length) % tabs.length];
    next.focus();
    setCase(next.dataset.case);
  });
});

document.querySelectorAll('[data-case-jump]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    setCase(link.dataset.caseJump);
  });
});

let scrollFrame = 0;
function updateScrollEffects() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
  document.querySelectorAll('.detail-reveal.is-visible').forEach((section) => {
    const rect = section.getBoundingClientRect();
    const scene = Math.max(-1, Math.min(1, (innerHeight * .5 - (rect.top + rect.height * .5)) / innerHeight));
    section.querySelectorAll('.story-piece').forEach((piece, index) => {
      const direction = index % 2 === 0 ? -1 : 1;
      piece.style.setProperty('--piece-y', `${(scene * direction * 9).toFixed(2)}px`);
    });
  });
}
window.addEventListener('scroll', () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = 0;
    updateScrollEffects();
  });
}, { passive: true });
window.addEventListener('resize', updateScrollEffects, { passive: true });

if (diagnosis) {
  diagnosis.addEventListener('pointermove', (event) => {
    const bounds = diagnosis.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    diagnosis.style.setProperty('--pointer-x', `${x.toFixed(2)}%`);
    diagnosis.style.setProperty('--pointer-y', `${y.toFixed(2)}%`);
  }, { passive: true });
}

const initialHash = location.hash.slice(1);
setCase(initialHash === 'explore' ? 'explore' : 'business', false);
if (initialHash && initialHash !== 'business' && initialHash !== 'explore') {
  requestAnimationFrame(() => document.getElementById(initialHash)?.scrollIntoView());
}
updateScrollEffects();
