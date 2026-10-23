// Luqman's Cookie Co. — builds the page from config.js (window.SITE).
// You shouldn't need to edit this file; change config.js instead.
(function () {
  'use strict';

  var SITE = window.SITE;
  if (!SITE) {
    console.error('config.js did not load — check it for a typo (a missing comma or quote).');
    return;
  }

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Helpers ----------

  // "[LIKE THIS]" (or empty) means "not filled in yet"
  function isPlaceholder(value) {
    if (value === null || value === undefined) return true;
    var text = String(value).trim();
    return text === '' || /^\[.*\]$/.test(text);
  }

  // Read "a.b.c" from SITE
  function get(path) {
    return path.split('.').reduce(function (obj, key) {
      return obj == null ? undefined : obj[key];
    }, SITE);
  }

  // Small element builder: el('p', { className: 'x' }, ['text', childEl])
  function el(tag, props, children) {
    var node = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function (key) {
        if (key === 'className') node.className = props[key];
        else if (key === 'text') node.textContent = props[key];
        else if (key === 'style') node.setAttribute('style', props[key]);
        else if (key in node) node[key] = props[key];
        else node.setAttribute(key, props[key]);
      });
    }
    (children || []).forEach(function (child) {
      if (child == null || child === false) return;
      node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
    });
    return node;
  }

  // Text that is styled as a placeholder when it hasn't been filled in
  function setText(node, value) {
    node.textContent = value == null ? '' : value;
    node.classList.toggle('placeholder', isPlaceholder(value));
  }

  function whatsappUrl(message) {
    var number = String(get('contact.whatsapp') || '').replace(/\D/g, '');
    if (isPlaceholder(get('contact.whatsapp')) || number.length < 8) return null;
    return 'https://wa.me/' + number + (message ? '?text=' + encodeURIComponent(message) : '');
  }

  function instagramUrl() {
    var handle = String(get('contact.instagram') || '').replace(/^@/, '').trim();
    if (isPlaceholder(get('contact.instagram')) || !handle) return null;
    return 'https://www.instagram.com/' + encodeURIComponent(handle) + '/';
  }

  // Point a link at url, or show it as "coming soon" if url is missing
  function wireLink(link, url, note) {
    if (url) {
      link.href = url;
      link.classList.remove('is-pending');
      link.removeAttribute('aria-disabled');
      if (note) note.hidden = true;
    } else {
      link.removeAttribute('href');
      link.classList.add('is-pending');
      link.setAttribute('aria-disabled', 'true');
      if (note) note.hidden = false;
    }
  }

  function formatPrice(price) {
    return isPlaceholder(price) ? 'AED [PRICE]' : 'AED ' + price;
  }

  // ---------- Simple text fields: <p data-text="brand.tagline"> ----------
  document.querySelectorAll('[data-text]').forEach(function (node) {
    var value = get(node.getAttribute('data-text'));
    if (value !== undefined) setText(node, value);
  });

  // ---------- Marquee (menu names, repeated for a seamless loop) ----------
  (function renderMarquee() {
    var track = document.querySelector('#marquee .marquee-track');
    var names = (SITE.menu || []).map(function (item) { return item.name; })
      .filter(function (name) { return !isPlaceholder(name); });
    if (!track || !names.length) return;

    // Repeat short lists so one copy is always wider than the screen
    // (not needed when motion is off: the list is shown still, once)
    var items = names;
    while (!reducedMotion && items.length < 8) items = items.concat(names);

    track.textContent = '';
    track.appendChild(el('ul', { className: 'marquee-list' },
      items.map(function (n) { return el('li', { text: n }); })));
    track.appendChild(el('ul', { className: 'marquee-list', 'aria-hidden': 'true' },
      items.map(function (n) { return el('li', { text: n }); })));
    document.getElementById('marquee').setAttribute('aria-label', 'On the menu: ' + names.join(', '));
  })();

  // ---------- Menu ----------
  (function renderMenu() {
    var grid = document.getElementById('menu-grid');
    if (!grid) return;

    (SITE.menu || []).forEach(function (item, i) {
      var badges = [];
      if (item.soldOut)   badges.push(el('span', { className: 'badge badge-soldout', text: 'Sold out' }));
      if (item.isNew)     badges.push(el('span', { className: 'badge badge-new', text: 'New' }));
      if (item.favourite) badges.push(el('span', { className: 'badge badge-fav', text: 'Favourite' }));
      if (item.lighter)   badges.push(el('span', { className: 'badge badge-light', text: 'Lighter option' }));

      var media;
      if (!isPlaceholder(item.image)) {
        media = el('img', {
          className: 'card-media',
          src: item.image,
          alt: item.imageAlt || item.name,
          width: 800, height: 500,
          loading: i < 2 ? 'eager' : 'lazy',
          decoding: 'async'
        });
        // If the photo is missing, fall back to the drawn tile
        media.addEventListener('error', function () { media.replaceWith(drawnTile()); });
      } else {
        media = drawnTile();
      }

      var desc = el('p', { className: 'card-desc' });
      setText(desc, item.description);

      grid.appendChild(el('li', {
        className: 'card reveal' + (item.soldOut ? ' is-soldout' : ''),
        style: '--delay:' + (i % 3) * 80 + 'ms'
      }, [
        el('div', { className: 'card-media-wrap' }, [
          media,
          badges.length ? el('div', { className: 'badges' }, badges) : null,
          item.samplePhoto ? el('span', { className: 'sample-tag', text: 'Sample photo' }) : null
        ]),
        el('div', { className: 'card-body' }, [
          el('div', { className: 'card-top' }, [
            el('h3', { text: item.name }),
            el('span', { className: 'price', text: formatPrice(item.price) })
          ]),
          desc,
          allergenPanel(item)
        ])
      ]));
    });
  })();

  function drawnTile() {
    var tile = el('div', { className: 'card-media', 'aria-hidden': 'true' });
    tile.innerHTML = '<svg><use href="#cookie"/></svg>';
    return tile;
  }

  function allergenPanel(item) {
    var body = el('div', { className: 'panel-body' });

    body.appendChild(el('h4', { text: 'Ingredients' }));
    body.appendChild(isPlaceholder(item.ingredients)
      ? el('p', { className: 'muted', text: 'Ingredient list coming soon.' })
      : el('p', { text: item.ingredients }));

    body.appendChild(el('h4', { text: 'Allergens' }));
    var allergens = Array.isArray(item.allergens) ? item.allergens.filter(function (a) { return !isPlaceholder(a); }) : [];
    if (allergens.length) {
      body.appendChild(el('ul', { className: 'allergen-list' },
        allergens.map(function (a) { return el('li', { text: a }); })));
    } else {
      // Never guess allergens: show a clear warning until they are confirmed in config.js
      var askUrl = whatsappUrl('Hi Luqman\'s Cookie Co., I have an allergen question about the ' + item.name + '.');
      body.appendChild(el('p', { className: 'allergen-pending', role: 'note' }, [
        el('strong', { text: 'Allergen info coming soon — ' }),
        askUrl ? el('a', { href: askUrl, target: '_blank', rel: 'noopener', text: 'ask us' }) : 'ask us',
        '.'
      ]));
    }

    return el('details', { className: 'allergen-panel' }, [
      el('summary', { text: 'Ingredients & allergens' }),
      body
    ]);
  }

  // ---------- Find us ----------
  (function renderFind() {
    var photo = get('location.photo');
    var figure = document.getElementById('find-photo');
    if (!figure || isPlaceholder(photo)) return;
    figure.appendChild(el('img', {
      src: photo, alt: get('location.photoAlt') || '',
      width: 800, height: 600, loading: 'lazy', decoding: 'async'
    }));
    figure.hidden = false;
  })();

  // ---------- Machine problem ----------
  wireLink(document.getElementById('help-btn'),
           whatsappUrl(get('help.whatsappMessage')),
           document.getElementById('help-note'));

  // ---------- About ----------
  (function renderAbout() {
    var node = document.getElementById('about-text');
    var text = get('about.text');
    if (!node || isPlaceholder(text)) return;
    var bakery = get('about.bakery');
    var parts = String(text).split('{bakery}');
    node.textContent = '';
    parts.forEach(function (part, i) {
      if (i > 0) {
        var name = el('strong');
        setText(name, bakery);
        node.appendChild(name);
      }
      node.appendChild(document.createTextNode(part));
    });
  })();

  // ---------- Footer ----------
  wireLink(document.getElementById('instagram-btn'), instagramUrl(), document.getElementById('instagram-note'));
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // ---------- Fade-in on scroll ----------
  var reveals = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (node) { node.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    reveals.forEach(function (node) { observer.observe(node); });
  }
})();
