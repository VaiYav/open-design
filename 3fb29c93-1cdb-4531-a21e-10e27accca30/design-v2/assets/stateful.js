/* Flow v2 — state engine.
   ?state=<name> picks which [data-view] block is visible.
   ?theme=light|dark sets the theme (persisted in localStorage).
   ?role=account|admin|main_admin gates nav, screens and feedback controls.
   ?chrome=0 hides the floating state switcher (atlas embeds its own chips).
   Communicates with the atlas via postMessage. */
(function () {
  'use strict';

  var doc = document.documentElement;
  var params;
  try { params = new URLSearchParams(location.search); } catch (_) { params = new Map(); }
  function qp(k) { return params.get ? params.get(k) : null; }

  /* ---- theme ---- */
  var theme = qp('theme');
  if (theme !== 'light' && theme !== 'dark') {
    try { theme = localStorage.getItem('v2-theme') || 'light'; } catch (_) { theme = 'light'; }
  }
  function applyTheme(t) {
    doc.setAttribute('data-theme', t);
    try { localStorage.setItem('v2-theme', t); } catch (_) {}
  }
  applyTheme(theme);

  /* ---- role ---- */
  var ROLE_IDS = ['account', 'admin', 'main_admin'];
  var role = qp('role');
  if (role === null) {
    try { role = localStorage.getItem('v2-role') || 'account'; } catch (_) { role = 'account'; }
  }
  /* An explicit but unknown ?role= always falls back to the least-privileged
     role — never silently to whatever was stored before. */
  if (ROLE_IDS.indexOf(role) === -1) role = 'account';
  /* A role switch re-mounts the shell (nav filtering, persona, denied
     screens) — the URL carries the role first, then we reload once. */
  function applyRole(r, opts) {
    opts = opts || {};
    if (ROLE_IDS.indexOf(r) === -1 || r === doc.getAttribute('data-role')) return;
    doc.setAttribute('data-role', r);
    try { localStorage.setItem('v2-role', r); } catch (_) {}
    try {
      var u = new URL(location.href);
      u.searchParams.set('role', r);
      history.replaceState(null, '', u);
    } catch (_) {}
    if (opts.reload !== false) location.reload();
  }
  doc.setAttribute('data-role', role);
  try { localStorage.setItem('v2-role', role); } catch (_) {}

  if (qp('chrome') === '0') doc.setAttribute('data-chrome', '0');

  /* ---- views ---- */
  var views = Array.prototype.slice.call(document.querySelectorAll('[data-view]'));
  var states = [];
  views.forEach(function (v) {
    v.getAttribute('data-view').split(',').forEach(function (s) {
      s = s.trim();
      if (s && states.indexOf(s) === -1) states.push(s);
    });
  });
  var current = null;

  function viewMatches(v, want) {
    return v.getAttribute('data-view').split(',').map(function (s) { return s.trim(); }).indexOf(want) !== -1;
  }

  function apply(state) {
    if (!views.length) return;
    var want = state && states.indexOf(state) !== -1 ? state : states[0];
    current = want;
    views.forEach(function (v) {
      v.hidden = !viewMatches(v, want);
    });
    doc.setAttribute('data-state', want);
    /* keep tab chrome in sync when a visible block is a tab panel */
    views.forEach(function (v) {
      if (v.hidden || !v.hasAttribute('data-tab-panel')) return;
      var scope = v.closest('[data-tab-scope]') || document;
      var name = v.getAttribute('data-tab-panel');
      scope.querySelectorAll('[data-tab]').forEach(function (b) {
        var on = b.getAttribute('data-tab') === name;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', String(on));
      });
    });
    var u;
    try {
      u = new URL(location.href);
      u.searchParams.set('state', want);
      history.replaceState(null, '', u);
    } catch (_) {}
    syncBar();
    try { window.parent.postMessage({ type: 'v2:state', state: want }, '*'); } catch (_) {}
  }

  /* ---- floating switcher (standalone mode): collapsed FAB, expands on click ---- */
  var bar = null;
  var barOpen = false;
  function buildBar() {
    if (!views.length || qp('chrome') === '0') return;
    bar = document.createElement('div');
    bar.className = 'statebar statebar--fab';
    bar.setAttribute('data-od-id', 'statebar');
    document.body.appendChild(bar);
    syncBar();
  }
  function syncBar() {
    if (!bar) return;
    if (!barOpen) {
      bar.classList.add('statebar--fab');
      bar.innerHTML = '<button type="button" class="statebar__fab" data-st-open aria-label="Screen states">' +
        '<span class="statebar__dot"></span>' + esc2(current) + '</button>';
      return;
    }
    bar.classList.remove('statebar--fab');
    var roleLbl = { account: 'Operator', admin: 'Admin', main_admin: 'Main admin' };
    var h = '<div class="statebar__t">Screen state' +
      '<button type="button" class="chip theme-mini" data-st-theme aria-label="Toggle theme">' +
      (doc.getAttribute('data-theme') === 'dark' ? 'Light' : 'Dark') + '</button>' +
      '<button type="button" class="statebar__x" data-st-open aria-label="Collapse">×</button></div><div class="statebar__chips">';
    states.forEach(function (s) {
      h += '<button type="button" class="chip' + (s === current ? ' is-active' : '') + '" data-st="' + s + '">' + s + '</button>';
    });
    h += '</div><div class="statebar__roles"><span class="statebar__lbl">Role</span>';
    ROLE_IDS.forEach(function (r) {
      h += '<button type="button" class="chip' + (r === role ? ' is-active' : '') + '" data-st-role="' + r + '">' + roleLbl[r] + '</button>';
    });
    bar.innerHTML = h + '</div>';
  }
  function esc2(s) { var d = document.createElement('i'); d.textContent = s; return d.innerHTML; }

  document.addEventListener('click', function (e) {
    var chip = e.target.closest('[data-st]');
    if (chip) { apply(chip.getAttribute('data-st')); return; }
    var link = e.target.closest('[data-state-link]');
    if (link) { e.preventDefault(); apply(link.getAttribute('data-state-link')); return; }
    var th = e.target.closest('[data-st-theme]');
    if (th) {
      applyTheme(doc.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
      syncBar();
      return;
    }
    var rl = e.target.closest('[data-st-role]');
    if (rl) { applyRole(rl.getAttribute('data-st-role')); return; }
    var tgl = e.target.closest('[data-st-open]');
    if (tgl) { barOpen = !barOpen; syncBar(); return; }
    if (barOpen && bar && !e.target.closest('.statebar')) { barOpen = false; syncBar(); }
  });

  /* ---- parent bridge ---- */
  window.addEventListener('message', function (e) {
    var d = e && e.data;
    if (!d || d.type !== 'v2:set') return;
    if (d.theme === 'light' || d.theme === 'dark') { applyTheme(d.theme); syncBar(); }
    if (d.role && ROLE_IDS.indexOf(d.role) !== -1) applyRole(d.role);
    if (d.state) apply(d.state);
  });

  window.FlowState = {
    get current() { return current; },
    get role() { return doc.getAttribute('data-role') || role; },
    states: states,
    set: apply,
    setTheme: applyTheme,
    setRole: applyRole
  };

  /* announce capabilities to atlas */
  function announce() {
    try { window.parent.postMessage({ type: 'v2:states', states: states, state: current, role: doc.getAttribute('data-role') }, '*'); } catch (_) {}
  }

  apply(qp('state'));
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { buildBar(); announce(); });
  } else { buildBar(); announce(); }
})();
