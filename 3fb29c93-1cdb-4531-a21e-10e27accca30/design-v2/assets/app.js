/* Flow v2 — shared interactions: menus, tabs, modals, toasts,
   rail collapse, theme toggle, segmented controls, demo actions. */
(function () {
  'use strict';

  document.addEventListener('click', function (e) {
    var t = e.target;

    /* dropdown menus */
    var opener = t.closest('[data-menu-open]');
    if (opener) {
      var menu = document.getElementById(opener.getAttribute('data-menu-open'));
      if (menu) {
        var wasOpen = menu.classList.contains('is-open');
        document.querySelectorAll('.menu.is-open').forEach(function (m) { m.classList.remove('is-open'); });
        menu.classList.toggle('is-open', !wasOpen);
        opener.setAttribute('aria-expanded', String(!wasOpen));
      }
      return;
    }
    if (!t.closest('.menu')) {
      document.querySelectorAll('.menu.is-open').forEach(function (m) {
        m.classList.remove('is-open');
        var b = document.querySelector('[data-menu-open="' + m.id + '"]');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
    }

    /* lady context switcher items */
    var ctxItem = t.closest('.ctx-menu__item');
    if (ctxItem) {
      var m = ctxItem.closest('.ctx-menu');
      m.querySelectorAll('.ctx-menu__item').forEach(function (i) {
        i.classList.toggle('is-active', i === ctxItem);
        i.setAttribute('aria-checked', String(i === ctxItem));
      });
      var sw = document.querySelector('.ctx-switch');
      if (sw) {
        var nameEl = ctxItem.querySelector('.n');
        var av = ctxItem.querySelector('.avatar');
        if (nameEl && sw.querySelector('.meta .n')) sw.querySelector('.meta .n').textContent = nameEl.textContent;
        if (av && sw.querySelector('.avatar')) sw.querySelector('.avatar').textContent = av.textContent;
      }
      window.flowToast('Switched to ' + (nameEl ? nameEl.textContent : 'lady') + ' — prototype context');
      return;
    }

    /* modals */
    var mo = t.closest('[data-modal-open]');
    if (mo) {
      var modal = document.getElementById(mo.getAttribute('data-modal-open'));
      if (modal) {
        modal.classList.add('is-open');
        var f = modal.querySelector('input, select, textarea, button:not(.icon-btn)');
        if (f) f.focus();
      }
      return;
    }
    var mc = t.closest('[data-modal-close]');
    if (mc) {
      var host = mc.closest('.modal-backdrop');
      if (host) host.classList.remove('is-open');
      return;
    }
    if (t.classList && t.classList.contains('modal-backdrop')) { t.classList.remove('is-open'); return; }

    /* tabs ([data-tab] → [data-tab-panel] inside closest [data-tab-scope]) */
    var tab = t.closest('[data-tab]');
    if (tab) {
      var group = tab.closest('[role="tablist"], .tabs, .seg');
      var scope = tab.closest('[data-tab-scope]') || document;
      var target = tab.getAttribute('data-tab');
      if (group) group.querySelectorAll('[data-tab]').forEach(function (x) {
        x.classList.toggle('is-active', x === tab);
        x.setAttribute('aria-selected', String(x === tab));
      });
      scope.querySelectorAll('[data-tab-panel]').forEach(function (p) {
        p.hidden = p.getAttribute('data-tab-panel') !== target;
      });
      return;
    }

    /* chips (filter toggles, single-select group) */
    var chip = t.closest('.chip[data-chip]');
    if (chip) {
      var cg = chip.closest('[data-chip-group]');
      if (cg) cg.querySelectorAll('.chip').forEach(function (c) { c.classList.toggle('is-active', c === chip); });
      else chip.classList.toggle('is-active');
      return;
    }

    /* rail collapse / expand (persisted; auto-compact handled in components.js) */
    var railBtn = t.closest('[data-rail-toggle]');
    if (railBtn) {
      var shell = railBtn.closest('.v2-shell');
      if (shell) {
        var min = !shell.classList.contains('rail-min');
        try { localStorage.setItem('v2-rail', min ? 'min' : 'full'); } catch (_) {}
        if (window.FlowUI && window.FlowUI.syncRail) window.FlowUI.syncRail();
        else shell.classList.toggle('rail-min', min);
      }
      return;
    }

    /* mobile nav drawer */
    var navOpen = t.closest('[data-nav-open]');
    if (navOpen) {
      var sh = navOpen.closest('.v2-shell');
      if (sh) {
        sh.classList.add('nav-open');
        navOpen.setAttribute('aria-expanded', 'true');
        var first = sh.querySelector('.v2-rail__link.is-active') || sh.querySelector('.v2-rail__link');
        if (first) first.focus({ preventScroll: true });
      }
      return;
    }
    var navClose = t.closest('[data-nav-close]');
    if (navClose) {
      var sh2 = navClose.closest('.v2-shell');
      if (sh2) {
        sh2.classList.remove('nav-open');
        var ob = sh2.querySelector('[data-nav-open]');
        if (ob) { ob.setAttribute('aria-expanded', 'false'); if (navClose.classList.contains('v2-rail__close')) ob.focus(); }
      }
      return;
    }

    /* theme toggle (topbar + statebar handled in stateful.js too) */
    var thBtn = t.closest('[data-theme-toggle]');
    if (thBtn) {
      var d = document.documentElement;
      var next = d.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      if (window.FlowState) window.FlowState.setTheme(next);
      else d.setAttribute('data-theme', next);
      try { localStorage.setItem('v2-theme', next); } catch (_) {}
      return;
    }

    /* pagination */
    var pg = t.closest('.pagination button');
    if (pg && !pg.disabled) {
      var pr = pg.closest('.pagination');
      pr.querySelectorAll('button').forEach(function (b) {
        b.classList.toggle('is-active', b === pg);
        if (b === pg) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
      });
      window.flowToast('Page ' + pg.textContent.trim() + ' (prototype — list unchanged)');
      return;
    }

    /* reload buttons inside error/offline states */
    if (t.closest('[data-reload]')) { window.flowToast('Retrying… (prototype)'); return; }

    /* generic toast actions */
    var toastAct = t.closest('[data-toast]');
    if (toastAct) { window.flowToast(toastAct.getAttribute('data-toast')); return; }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.is-open,.menu.is-open').forEach(function (m) { m.classList.remove('is-open'); });
      document.querySelectorAll('.v2-shell.nav-open').forEach(function (s) {
        s.classList.remove('nav-open');
        var b = s.querySelector('[data-nav-open]');
        if (b) { b.setAttribute('aria-expanded', 'false'); b.focus(); }
      });
      return;
    }
    /* `[` toggles the rail (not while typing) */
    if (e.key === '[' && !e.metaKey && !e.ctrlKey && !e.altKey) {
      var tg = e.target;
      if (tg && (tg.tagName === 'INPUT' || tg.tagName === 'TEXTAREA' || tg.isContentEditable)) return;
      var tb = document.querySelector('[data-rail-toggle]');
      if (tb) { e.preventDefault(); tb.click(); }
    }
  });

  /* collapsed-rail popovers: flyout subs + link tooltips are position:fixed
     (nav scroll container clips absolute children) — set coords on hover/focus */
  function placeRailPop(el) {
    var shell = el.closest && el.closest('.rail-min');
    if (!shell) return;
    var g = el.closest('.v2-rail__group');
    if (g) {
      var sub = g.querySelector('.v2-rail__sub');
      if (sub) {
        var r = g.getBoundingClientRect();
        var h = sub.querySelectorAll('a').length * 33 + 52;
        var top = Math.max(8, Math.min(r.top - 4, window.innerHeight - h - 8));
        sub.style.setProperty('--sub-left', Math.round(r.right + 8) + 'px');
        sub.style.setProperty('--sub-top', Math.round(top) + 'px');
      }
    }
    var link = el.closest('.v2-rail__link[data-tip]');
    if (link) {
      var lr = link.getBoundingClientRect();
      link.style.setProperty('--tip-top', Math.round(lr.top + lr.height / 2) + 'px');
    }
  }
  document.addEventListener('mouseover', function (e) {
    if (e.target.closest) placeRailPop(e.target);
  });
  document.addEventListener('focusin', function (e) {
    if (e.target.closest) placeRailPop(e.target);
  });

  document.addEventListener('change', function (e) {
    var sel = e.target.closest('select[data-demo]');
    if (sel) window.flowToast('Changed to ' + sel.value + ' (prototype)');
  });

  /* demo form submit → fake validation or success toast via data-form attr */
  document.addEventListener('submit', function (e) {
    var form = e.target.closest('form[data-form]');
    if (!form) return;
    e.preventDefault();
    var mode = form.getAttribute('data-form');
    if (mode === 'validate') {
      var firstBad = null;
      form.querySelectorAll('[required]').forEach(function (inp) {
        var bad = !inp.value.trim();
        var field = inp.closest('.field');
        if (field) field.classList.toggle('has-error', bad);
        if (bad && !firstBad) firstBad = inp;
      });
      if (firstBad) { firstBad.focus(); window.flowToast('Fill in the required fields'); return; }
      window.flowToast(form.getAttribute('data-success') || 'Saved (prototype)');
      return;
    }
    window.flowToast(form.getAttribute('data-success') || 'Sent (prototype)');
  });

  /* toast */
  var toastTimer = null;
  window.flowToast = function (message) {
    var host = document.getElementById('flow-toast');
    if (!host) {
      host = document.createElement('div');
      host.id = 'flow-toast';
      host.className = 'toast';
      host.setAttribute('role', 'status');
      host.setAttribute('aria-live', 'polite');
      document.body.appendChild(host);
    }
    host.innerHTML = '<span class="ic ic--check"></span><span></span>';
    host.lastChild.textContent = message;
    host.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { host.classList.remove('is-visible'); }, 2400);
  };
})();
