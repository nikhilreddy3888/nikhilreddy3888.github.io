document.documentElement.classList.add('js');

const portrait = document.querySelector('.portrait');
if (portrait) {
  const togglePortrait = () => {
    const active = portrait.classList.toggle('is-color');
    portrait.setAttribute('aria-pressed', String(active));
  };
  const touchInteraction = window.matchMedia('(hover: none)');
  portrait.addEventListener('click', () => {
    if (touchInteraction.matches) togglePortrait();
  });
  portrait.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      togglePortrait();
    }
  });
}

const revealItems = document.querySelectorAll('.reveal');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

// Give headings the same staggered word entrance as the hero. Supporting
// copy rises into place when its own line enters the viewport.
if (!reducedMotion && 'IntersectionObserver' in window) {
  const textObserver = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in-view');
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });

  const textTargets = document.querySelectorAll(
    'main h1, main h2, main h3, main p, main li, main a, ' +
    'main .service-index, main .work-meta > span, main .art-kicker, ' +
    'main .work-art strong, main .fact-grid article > span, ' +
    'main .experience-list article > span:first-child, ' +
    'main .research-list article > span:first-child, ' +
    'main .education-grid > div > span, main .pub-number, main .pub-badge, ' +
    'main .archive-list article > span:first-child'
  );

  textTargets.forEach((element) => {
    if (element.closest('.hero')) return;
    if (element.matches('a') && element.closest('h1, h2, h3, p, li')) return;

    if (element.matches('h1, h2, h3')) {
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) {
        if (walker.currentNode.textContent.trim()) nodes.push(walker.currentNode);
      }
      let wordIndex = 0;
      nodes.forEach((node) => {
        const fragment = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            fragment.append(document.createTextNode(part));
            return;
          }
          const word = document.createElement('span');
          word.className = 'motion-word';
          word.textContent = part;
          word.style.setProperty('--word-delay', `${Math.min(wordIndex * 0.055, 0.75)}s`);
          fragment.append(word);
          wordIndex += 1;
        });
        node.replaceWith(fragment);
      });
      element.classList.add('motion-heading');
    } else {
      element.classList.add('motion-copy');
    }
    textObserver.observe(element);
  });
}

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());
