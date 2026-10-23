// Luqman's Cookie Co. — builds every page from config.js (window.SITE).
// You shouldn't need to edit this file; change config.js instead.
// Each feature below only runs if its elements exist on the current page.
(function () {
  'use strict';

  var SITE = window.SITE;
  if (!SITE) {
    console.error('config.js did not load — check it for a typo (a missing comma or quote).');
    return;
  }

  var PAGE = document.body.getAttribute('data-page') || 'page';
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =========================================================
     Helpers
     ========================================================= */

  // "[LIKE THIS]" (or empty) means "not filled in yet"
  function isPlaceholder(value) {
    if (value === null || value === undefined) return true;
    var text = String(value).trim();
    return text === '' || /\[[^\]]*\]/.test(text);
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

  function $(id) { return document.getElementById(id); }

  // Text that is styled as a placeholder when it hasn't been filled in
  function setText(node, value) {
    node.textContent = value == null ? '' : value;
    node.classList.toggle('placeholder', isPlaceholder(value));
  }

  // localStorage / sessionStorage can be blocked (private mode), so never let it break the page
  function store(kind) {
    var s = null;
    try { s = window[kind]; s.setItem('lcc-test', '1'); s.removeItem('lcc-test'); } catch (e) { s = null; }
    return {
      get: function (k) { try { return s ? s.getItem(k) : null; } catch (e) { return null; } },
      set: function (k, v) { try { if (s) s.setItem(k, v); } catch (e) { /* ignore */ } }
    };
  }
  var local = store('localStorage');
  var session = store('sessionStorage');

  // "2026-10-28" → Date at local midnight, or null
  function parseDay(text) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(text || '').trim());
    if (!m) return null;
    var d = new Date(+m[1], +m[2] - 1, +m[3]);
    return isNaN(d) ? null : d;
  }
  function today() {
    var d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  function todayKey() {
    var d = today();
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  }
  function formatDay(date) { // "Tue 28 Oct"
    return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
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
    if (!link) return;
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

  function locationText() {
    return [get('location.place'), get('location.detail')]
      .filter(function (v) { return !isPlaceholder(v); }).join(' · ');
  }

  function menuHasAllergens() {
    return (SITE.menu || []).some(function (item) {
      return Array.isArray(item.allergens) && item.allergens.some(function (a) { return !isPlaceholder(a); });
    });
  }

  // "Allergen info coming soon — ask us." with a WhatsApp link when possible
  function allergenNotice(itemName) {
    var askUrl = whatsappUrl('Hi Luqman\'s Cookie Co., I have an allergen question' + (itemName ? ' about the ' + itemName : '') + '.');
    return el('p', { className: 'allergen-pending', role: 'note' }, [
      el('strong', { text: 'Allergen info coming soon — ' }),
      askUrl ? el('a', { href: askUrl, target: '_blank', rel: 'noopener', text: 'ask us' }) : 'ask us',
      '.'
    ]);
  }

  /* =========================================================
     QR tracking: ?src=machine, ?src=coffee, ?src=wrapper …
     Remembered for this visit and added to every form submission.
     ========================================================= */
  var SOURCE = (function () {
    var fromUrl = '';
    try { fromUrl = new URLSearchParams(location.search).get('src') || ''; } catch (e) { /* old browser */ }
    fromUrl = fromUrl.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 30);
    if (fromUrl) session.set('lcc-src', fromUrl);
    return fromUrl || session.get('lcc-src') || 'direct';
  })();

  /* =========================================================
     Shared bits (every page)
     ========================================================= */
  document.querySelectorAll('[data-text]').forEach(function (node) {
    var value = get(node.getAttribute('data-text'));
    if (value !== undefined) setText(node, value);
  });

  document.querySelectorAll('.year').forEach(function (node) {
    node.textContent = new Date().getFullYear();
  });

  /* =========================================================
     MENU PAGE
     ========================================================= */

  // ---------- Marquee (menu names, repeated for a seamless loop) ----------
  (function renderMarquee() {
    var marquee = $('marquee');
    if (!marquee) return;
    var track = marquee.querySelector('.marquee-track');
    var names = (SITE.menu || []).map(function (item) { return item.name; })
      .filter(function (name) { return !isPlaceholder(name); });
    if (!names.length) return;

    // Repeat short lists so one copy is always wider than the screen
    // (not needed when motion is off: the list is shown still, once)
    var items = names;
    while (!reducedMotion && items.length < 8) items = items.concat(names);

    track.textContent = '';
    track.appendChild(el('ul', { className: 'marquee-list' },
      items.map(function (n) { return el('li', { text: n }); })));
    track.appendChild(el('ul', { className: 'marquee-list', 'aria-hidden': 'true' },
      items.map(function (n) { return el('li', { text: n }); })));
    marquee.setAttribute('aria-label', 'On the menu: ' + names.join(', '));
  })();

  // ---------- Exam season mode ----------
  (function renderExam() {
    var banner = $('exam-banner');
    var exam = SITE.exam || {};
    if (!banner || !exam.examMode) return;
    var target = new Date(exam.examDate);
    if (isNaN(target)) { console.warn('exam.examDate in config.js is not a valid date.'); return; }

    $('exam-title').textContent = exam.title || 'Finals Fuel';
    var message = $('exam-message');
    var countdown = $('countdown');
    var units = {};
    countdown.querySelectorAll('[data-unit]').forEach(function (b) { units[b.getAttribute('data-unit')] = b; });
    $('exam-sr').textContent = 'Exams start on ' + target.toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Dubai'
    }) + '.';
    banner.hidden = false;

    function tick() {
      var ms = target - Date.now();
      if (ms <= 0) {
        message.textContent = exam.afterMessage || 'Good luck with your exams!';
        countdown.hidden = true;
        return false;
      }
      message.textContent = exam.message || 'Exams start in';
      var s = Math.floor(ms / 1000);
      units.d.textContent = Math.floor(s / 86400);
      units.h.textContent = String(Math.floor(s % 86400 / 3600)).padStart(2, '0');
      units.m.textContent = String(Math.floor(s % 3600 / 60)).padStart(2, '0');
      units.s.textContent = String(s % 60).padStart(2, '0');
      return true;
    }
    if (tick()) {
      var timer = setInterval(function () { if (!tick()) clearInterval(timer); }, 1000);
    }
  })();

  // ---------- Fresh batch badge + location line ----------
  (function renderInfo() {
    var chip = $('fresh-batch');
    if (chip) {
      var baked = parseDay(get('freshBatch.bakedOn'));
      var maxAge = Number(get('freshBatch.hideAfterDays'));
      if (isNaN(maxAge)) maxAge = 3;
      if (baked) {
        var age = Math.round((today() - baked) / 86400000);
        // Hide stale dates (and future dates, which are probably a typo)
        if (age >= 0 && age <= maxAge) {
          $('fresh-batch-text').textContent = 'Fresh batch: ' + formatDay(baked);
          chip.hidden = false;
        }
      }
    }
    var line = $('location-line');
    if (line && locationText()) line.textContent = locationText();
  })();

  // ---------- Menu cards ----------
  (function renderMenu() {
    var grid = $('menu-grid');
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
            el('span', { className: 'price', text: isPlaceholder(item.price) ? 'AED [PRICE]' : 'AED ' + item.price })
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
    // Never guess allergens: show a clear warning until they are confirmed in config.js
    body.appendChild(allergens.length
      ? el('ul', { className: 'allergen-list' }, allergens.map(function (a) { return el('li', { text: a }); }))
      : allergenNotice(item.name));

    return el('details', { className: 'allergen-panel' }, [
      el('summary', { text: 'Ingredients & allergens' }),
      body
    ]);
  }

  // ---------- Perfect with coffee ----------
  (function renderPairings() {
    var list = $('pairings-list');
    if (!list) return;
    var pairs = (SITE.pairings || []).filter(function (p) {
      return !isPlaceholder(p.treat) && !isPlaceholder(p.coffee);
    });
    if (!pairs.length) { $('pairings').hidden = true; return; }

    pairs.forEach(function (p, i) {
      var cookie = el('span', { className: 'pair-icon', 'aria-hidden': 'true' });
      cookie.innerHTML = '<svg><use href="#cookie"/></svg>';
      var cup = el('span', { className: 'pair-icon pair-cup', 'aria-hidden': 'true' });
      cup.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17M8 3c0 1.5 1 1.5 1 3M12 3c0 1.5 1 1.5 1 3"/></svg>';
      list.appendChild(el('li', { className: 'pair reveal', style: '--delay:' + i * 80 + 'ms' }, [
        el('div', { className: 'pair-icons' }, [cookie, el('span', { className: 'pair-plus', 'aria-hidden': 'true', text: '+' }), cup]),
        el('p', { className: 'pair-name' }, [p.treat, el('span', { className: 'pair-amp', text: ' + ' }), p.coffee]),
        isPlaceholder(p.note) ? null : el('p', { className: 'pair-note muted', text: p.note })
      ]));
    });
  })();

  // ---------- About ----------
  (function renderAbout() {
    var node = $('about-text');
    var text = String(get('about.text') || '');
    if (!node || isPlaceholder(text.replace('{bakery}', 'x'))) return;
    var parts = String(text).split('{bakery}');
    node.textContent = '';
    parts.forEach(function (part, i) {
      if (i > 0) {
        var name = el('strong');
        setText(name, get('about.bakery'));
        node.appendChild(name);
      }
      node.appendChild(document.createTextNode(part));
    });
  })();

  wireLink($('instagram-btn'), instagramUrl(), $('instagram-note'));

  /* =========================================================
     HELP + ORDERS PAGES: WhatsApp buttons and FAQ
     ========================================================= */
  wireLink($('help-btn'), whatsappUrl(get('help.whatsappMessage')), $('help-note'));
  wireLink($('orders-wa-btn'), whatsappUrl(get('orders.whatsappMessage')), $('orders-wa-note'));

  (function renderFaq() {
    var list = $('faq-list');
    if (!list) return;
    (get('help.faq') || []).forEach(function (item) {
      if (isPlaceholder(item.q)) return;
      var answer = el('div', { className: 'faq-answer' });
      var a = String(item.a == null ? '' : item.a).trim();

      if (a === '{location}') {
        answer.appendChild(el('p', { text: locationText() || 'Location coming soon.' }));
      } else if (a === '{allergens}') {
        answer.appendChild(menuHasAllergens()
          ? el('p', {}, ['Each item lists its allergens under "Ingredients & allergens" on the ',
                         el('a', { href: 'index.html#menu', text: 'Menu tab' }), '.'])
          : allergenNotice(''));
      } else if (isPlaceholder(a)) {
        var askUrl = whatsappUrl('Hi Luqman\'s Cookie Co., I have a question: ' + item.q);
        answer.appendChild(el('p', { className: 'muted' }, [
          'Answer coming soon. ',
          askUrl ? el('a', { href: askUrl, target: '_blank', rel: 'noopener', text: 'Ask us on WhatsApp' }) : 'Ask us',
          ' in the meantime.'
        ]));
      } else {
        answer.appendChild(el('p', { text: a }));
      }

      list.appendChild(el('details', { className: 'faq-item' }, [
        el('summary', { text: item.q }),
        answer
      ]));
    });
  })();

  /* =========================================================
     FORMS → Google Forms
     Sends through a hidden iframe (the standard way to post to Google
     Forms from your own page), so we know when the send has finished.
     ========================================================= */
  function formsReady() {
    var forms = SITE.forms || {};
    if (isPlaceholder(forms.action) || !/^https:\/\/docs\.google\.com\/forms\//.test(forms.action)) return false;
    var fields = forms.fields || {};
    return ['type', 'choice'].every(function (k) { return !isPlaceholder(fields[k]); });
  }

  var sendCount = 0;
  function sendToGoogle(data) {
    return new Promise(function (resolve, reject) {
      if (!formsReady()) return reject('not-connected');
      if (navigator.onLine === false) return reject('offline');

      var fields = SITE.forms.fields;
      var name = 'lcc-send-' + (++sendCount);
      var frame = el('iframe', { name: name, title: 'Form sender', tabIndex: -1, 'aria-hidden': 'true', className: 'hp' });
      var form = el('form', { method: 'POST', action: SITE.forms.action, target: name, acceptCharset: 'UTF-8', className: 'hp' });

      data.source = SOURCE + ' / ' + PAGE;
      Object.keys(data).forEach(function (key) {
        if (!isPlaceholder(fields[key]) && data[key]) {
          form.appendChild(el('input', { type: 'hidden', name: fields[key], value: String(data[key]) }));
        }
      });

      document.body.appendChild(frame);
      document.body.appendChild(form);

      var done = false;
      function finish(ok) {
        if (done) return;
        done = true;
        clearTimeout(timer);
        setTimeout(function () { frame.remove(); form.remove(); }, 1000);
        ok ? resolve() : reject('timeout');
      }
      var timer = setTimeout(function () { finish(false); }, 15000);
      form.submit();
      frame.addEventListener('load', function () { finish(true); });
    });
  }

  var ERRORS = {
    'not-connected': "Forms aren't connected yet. Please check back soon!",
    'offline': "You seem to be offline. Please try again when you're connected.",
    'timeout': 'Sorry, that took too long. Please try again.'
  };

  function setStatus(form, message, type) {
    var status = form.querySelector('.form-status');
    if (!status) return;
    status.textContent = message;
    status.className = 'form-status' + (type ? ' is-' + type : '');
  }

  // Collect [data-field] inputs. Several inputs can share a field; data-label prefixes each line.
  function collect(form) {
    var data = { type: form.getAttribute('data-type') };
    form.querySelectorAll('[data-field]').forEach(function (input) {
      if ((input.type === 'radio' || input.type === 'checkbox') && !input.checked) return;
      var value = input.value.trim();
      if (!value) return;
      var key = input.getAttribute('data-field');
      var label = input.getAttribute('data-label');
      var line = label ? label + ': ' + value : value;
      data[key] = data[key] ? data[key] + '\n' + line : line;
    });
    return data;
  }

  function wireForm(form, opts) {
    if (!form) return;
    opts = opts || {};
    var button = form.querySelector('button[type="submit"]');
    var buttonText = button ? button.textContent : '';

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      // Honeypot: real people never see this field, so only bots fill it in
      var trap = form.querySelector('input[name="website"]');
      if (trap && trap.value) {
        setStatus(form, opts.success || 'Thank you!', 'success');
        form.reset();
        return;
      }

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var data = collect(form);
      if (opts.extra) Object.assign(data, opts.extra());

      button.disabled = true;
      button.classList.add('is-loading');
      button.textContent = 'Sending…';
      setStatus(form, '', '');

      sendToGoogle(data).then(function () {
        if (!opts.keepValues) form.reset();
        setStatus(form, opts.success || 'Thank you! Sent.', 'success');
        if (opts.onSuccess) opts.onSuccess();
      }, function (reason) {
        setStatus(form, ERRORS[reason] || ERRORS.timeout, 'error');
      }).then(function () {
        button.classList.remove('is-loading');
        button.textContent = buttonText;
        if (!opts.keepDisabled || !form.classList.contains('is-done')) button.disabled = false;
      });
    });
  }

  /* =========================================================
     VOTE PAGE
     ========================================================= */
  (function renderVote() {
    var form = $('vote-form');
    if (!form) return;
    var vote = SITE.vote || {};
    var voteKey = 'lcc-vote-' + (vote.round || 'current');
    var options = (vote.options || []).filter(function (o) { return !isPlaceholder(o); });
    var box = $('vote-options');

    // Closing date
    var ends = parseDay(vote.endsOn);
    var closed = ends && today() > ends;
    if (ends) {
      $('vote-ends').textContent = closed ? 'Voting has closed. The winner will be posted here soon.' : 'Voting closes ' + formatDay(ends) + '.';
      $('vote-ends').hidden = false;
    }

    if (options.length < 2) {
      form.hidden = true;
      $('vote-ends').hidden = false;
      $('vote-ends').textContent = 'The next vote opens soon. Check back here!';
    } else {
      options.forEach(function (option, i) {
        var id = 'vote-opt-' + i;
        box.appendChild(el('div', { className: 'vote-option' }, [
          el('input', { type: 'radio', id: id, name: 'vote-choice', value: option, required: true, 'data-field': 'choice' }),
          el('label', { htmlFor: id }, [el('span', { className: 'vote-radio', 'aria-hidden': 'true' }), el('span', { text: option })])
        ]));
      });
    }

    function lock(message) {
      form.classList.add('is-done');
      form.querySelectorAll('input, button').forEach(function (n) { n.disabled = true; });
      setStatus(form, message, 'success');
    }

    var votedFor = local.get(voteKey);
    if (closed) lock('');
    else if (votedFor) {
      // Show which option this phone voted for
      form.querySelectorAll('input[name="vote-choice"]').forEach(function (r) { r.checked = r.value === votedFor; });
      lock("You've voted this round. Thanks! The winner will be posted here.");
    }

    wireForm(form, {
      keepDisabled: true,
      keepValues: true,
      extra: function () { return { comment: 'Round ' + (vote.round || '') }; },
      success: "Your vote is in. Thanks! The winner will be posted here.",
      onSuccess: function () {
        var picked = form.querySelector('input[name="vote-choice"]:checked');
        local.set(voteKey, picked ? picked.value : '1');
        lock("Your vote is in. Thanks! The winner will be posted here.");
      }
    });

    // Last month's winner
    var winner = vote.lastWinner;
    if (winner && !isPlaceholder(winner.name)) {
      $('last-winner-name').textContent = winner.name;
      $('last-winner-result').textContent = isPlaceholder(winner.result) ? '' : winner.result;
      $('last-winner').hidden = false;
    }
  })();

  // ---------- Rate today's cookie (one tap = sent) ----------
  (function renderRate() {
    var buttons = $('rate-buttons');
    if (!buttons) return;
    var item = get('rate.item');
    var hasItem = !isPlaceholder(item);
    if (hasItem) $('rate-title').textContent = 'How was the ' + item + '?';

    var rateKey = 'lcc-rate-' + todayKey();
    var thanks = $('rate-thanks');
    var commentForm = $('rate-comment-form');
    var chosen = '';

    function showThanks(emoji, text, celebrate) {
      $('rate-thanks-emoji').textContent = emoji;
      $('rate-thanks-text').textContent = text;
      thanks.hidden = false;
      thanks.classList.remove('is-celebrating');
      if (celebrate && !reducedMotion) {
        void thanks.offsetWidth; // restart the animation
        thanks.classList.add('is-celebrating');
        burst(thanks);
      }
    }

    function setButtons(disabled, selected) {
      buttons.querySelectorAll('.rate-btn').forEach(function (b) {
        b.disabled = disabled;
        b.classList.toggle('is-selected', b === selected);
        b.setAttribute('aria-pressed', b === selected ? 'true' : 'false');
      });
    }

    var previous = local.get(rateKey);
    if (previous) {
      var prevBtn = buttons.querySelector('[data-value="' + previous + '"]');
      setButtons(true, prevBtn);
      showThanks(prevBtn ? prevBtn.querySelector('.emoji').textContent : '🍪', "You've already rated today. Thanks!", false);
    }

    buttons.addEventListener('click', function (event) {
      var btn = event.target.closest('.rate-btn');
      if (!btn || btn.disabled) return;
      chosen = btn.getAttribute('data-value');
      var emoji = btn.querySelector('.emoji').textContent;

      // Thank straight away; the send happens in the background
      setButtons(true, btn);
      showThanks(emoji, 'Thanks for rating!', true);
      commentForm.hidden = false;

      sendToGoogle({ type: 'rating', choice: chosen, comment: hasItem ? item : '' }).then(function () {
        local.set(rateKey, chosen);
      }, function (reason) {
        setButtons(false, null);
        commentForm.hidden = true;
        showThanks('😕', ERRORS[reason] || ERRORS.timeout, false);
      });
    });

    wireForm(commentForm, {
      extra: function () { return { choice: chosen || local.get(rateKey) || '', comment: (hasItem ? item + ': ' : '') + $('rate-comment').value.trim() }; },
      success: 'Got it. Thanks for the feedback!',
      onSuccess: function () { commentForm.querySelector('.field').hidden = true; commentForm.querySelector('button').hidden = true; }
    });
  })();

  // Little crumb burst for the thank-you animation
  function burst(container) {
    var colours = ['#D9A066', '#A9541F', '#3B2418', '#EBC9A2'];
    for (var i = 0; i < 10; i++) {
      var angle = (Math.PI * 2 * i) / 10;
      var dist = 50 + Math.random() * 30;
      var crumb = el('span', { className: 'burst', 'aria-hidden': 'true' });
      crumb.style.setProperty('--x', Math.cos(angle) * dist + 'px');
      crumb.style.setProperty('--y', Math.sin(angle) * dist + 'px');
      crumb.style.background = colours[i % colours.length];
      container.appendChild(crumb);
      setTimeout(crumb.remove.bind(crumb), 900);
    }
  }

  // ---------- Name our next cookie ----------
  wireForm($('name-form'), { success: "Great idea. Thanks! Winners go in the Hall of Fame below." });

  // ---------- Hall of Fame ----------
  (function renderHall() {
    var list = $('hall-list');
    if (!list) return;
    var winners = (SITE.hallOfFame || []).filter(function (w) { return !isPlaceholder(w.cookie); });
    if (!winners.length) { $('hall-empty').hidden = false; return; }
    winners.forEach(function (w) {
      var by = [isPlaceholder(w.by) ? '' : 'Named by ' + w.by, isPlaceholder(w.month) ? '' : w.month]
        .filter(Boolean).join(' · ');
      list.appendChild(el('li', { className: 'hall-item' }, [
        el('span', { className: 'hall-medal', 'aria-hidden': 'true', text: '🏆' }),
        el('div', {}, [el('p', { className: 'hall-name', text: w.cookie }), by ? el('p', { className: 'muted', text: by }) : null])
      ]));
    });
  })();

  /* =========================================================
     ORDERS PAGE
     ========================================================= */
  (function wireOrders() {
    var dateInput = $('order-date');
    if (dateInput) {
      var d = today();
      dateInput.min = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }
    wireForm($('order-form'), { success: "Request sent. Thanks! We'll get back to you." });
  })();

  /* =========================================================
     Fade-in on scroll
     ========================================================= */
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
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.1 });
    reveals.forEach(function (node) { observer.observe(node); });
  }
})();
