/* Flow v2 — Message feedback control (FLOW-8555).
   One shared renderer + live interactivity for chat bubbles, mail items and
   Omniscience outputs. Atlas fb-* states re-render every control through
   applyAll(); the observer watches <html data-state> set by stateful.js.

   Model per unit: { mode:'ai'|'manual', st, vote:'up'|'down'|null, comment }.
   st: unrated | up | down | saving | editor | 'editor-limit' | expired |
       conflict | error | lineage | regfail | none                        */
(function () {
  'use strict';

  var MAX = 200;
  /* Structured quick-reason chips — one tap inside the comment editor.
     Reasons persist alongside the comment; free text stays optional. */
  var REASONS = [
    { id: 'tone', l: 'Unnatural tone' },
    { id: 'context', l: 'Ignored context' },
    { id: 'language', l: 'Wrong language' },
    { id: 'pushy', l: 'Too pushy' },
    { id: 'timing', l: 'Timing off' }
  ];
  function reasonLabel(id) {
    for (var i = 0; i < REASONS.length; i++) if (REASONS[i].id === id) return REASONS[i].l;
    return id;
  }
  var seg = null;
  try { seg = new Intl.Segmenter('en', { granularity: 'grapheme' }); } catch (_) {}
  function glen(s) { return seg ? Array.from(seg.segment(s)).length : String(s || '').length; }
  function gslice(s, n) {
    if (!seg) return String(s || '').slice(0, n);
    return Array.from(seg.segment(s)).slice(0, n).join('');
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  var uid = 0;

  /* -- state → row markup ---------------------------------------------- */
  function thumbs(u) {
    var dis = (u.st === 'saving' || u.st === 'expired' || u.st === 'conflict' || u.st === 'regfail') ? ' disabled' : '';
    var ai = u.mode === 'ai';
    var upA = 'Thumbs up: ' + (ai ? 'good AI output' : 'good message');
    var dnA = 'Thumbs down: ' + (ai ? 'poor AI output' : 'poor message');
    return '<button type="button" class="fb-btn fb-btn--up' + (u.vote === 'up' ? ' is-on' : '') + '" data-fb-vote="up" aria-label="' + upA + '" title="' + upA + ' — press U" aria-keyshortcuts="u" aria-pressed="' + (u.vote === 'up') + '"' + dis + '><span class="ic ic--thumb-up"></span></button>' +
           '<button type="button" class="fb-btn fb-btn--down' + (u.vote === 'down' ? ' is-on' : '') + '" data-fb-vote="down" aria-label="' + dnA + '" title="' + dnA + ' — press D" aria-keyshortcuts="d" aria-pressed="' + (u.vote === 'down') + '"' + dis + '><span class="ic ic--thumb-up"></span></button>';
  }

  /* Next unrated unit on this page — powers the "Next unrated ↓" jump so
     reviewers can rate a thread in batches without scrolling for it. */
  function nextUnrated(unit) {
    var all = document.querySelectorAll('[data-fb-unit]');
    var found = false;
    for (var i = 0; i < all.length; i++) {
      if (all[i] === unit) { found = true; continue; }
      if (!found) continue;
      var u = all[i]._fb;
      if (u && !u.vote && !all[i].hidden &&
          u.st !== 'none' && u.st !== 'expired' && u.st !== 'conflict') return all[i];
    }
    return null;
  }

  function statusBit(u, unit) {
    switch (u.st) {
      case 'saving':
        return '<span class="fb__status"><span class="fb__spin"></span>Saving…</span>';
      case 'up':
      case 'down':
      case 'editor':
      case 'editor-limit': {
        var tags = (u.reasons || []).map(function (id) {
          return '<span class="fb__rtag">' + esc(reasonLabel(id)) + '</span>';
        }).join('');
        var undo = u.undo ? '<button type="button" class="fb__link" data-fb-undo>Undo</button>' : '';
        var nxt = (unit && nextUnrated(unit)) ? '<button type="button" class="fb__link" data-fb-next>Next unrated ↓</button>' : '';
        return '<span class="fb__status"><span class="fb__ok"><span class="ic ic--check"></span>Feedback recorded</span>' + tags +
          undo +
          '<button type="button" class="fb__link" data-fb-add>' + (u.comment ? 'Edit comment' : 'Add comment') + '</button>' + nxt + '</span>';
      }
      case 'expired':
        return '<span class="fb__status"><span class="fb__closed"><span class="ic ic--clock"></span>Feedback window closed</span></span>';
      case 'conflict':
        return '<span class="fb__notice"><span class="ic ic--warn-o"></span>This feedback changed elsewhere. Reload the chat before editing it.</span>';
      case 'error':
        return '<span class="fb__notice fb__notice--err"><span class="ic ic--warn"></span>Couldn’t save your vote.<button type="button" class="fb__link" data-fb-retry>Retry</button></span>';
      case 'regfail':
        return '<span class="fb__notice"><span class="ic ic--warn-o"></span>Feedback target not registered yet.<button type="button" class="fb__link" data-fb-reg>Retry feedback</button></span>';
      default:
        return '';
    }
  }

  function row(u, unit) {
    var ai = u.mode === 'ai';
    var mode = ai
      ? '<span class="fb__mode"><span class="ic ic--omni"></span>AI output</span>'
      : '<span class="fb__mode"><span class="ic ic--chat"></span>Message review</span>';
    var pend = (ai && u.st === 'lineage')
      ? '<span class="fb__pending"><span class="ic ic--clock"></span>Lineage pending</span>' : '';
    return '<div class="fb fb--' + (ai ? 'ai' : 'manual') + '" role="group" aria-label="' + (ai ? 'AI output review' : 'Message review') + '">' +
      mode + thumbs(u) + pend + statusBit(u, unit) + '</div>';
  }

  function editorHtml(u) {
    var id = 'fb-ta-' + (u.uid || (u.uid = ++uid));
    var val = u.draft || '';
    var n = glen(val);
    var chips = REASONS.map(function (r) {
      var on = (u.draftReasons || []).indexOf(r.id) >= 0;
      return '<button type="button" class="fb-rsn' + (on ? ' is-on' : '') + '" data-fb-rsn="' + r.id + '" aria-pressed="' + on + '">' + r.l + '</button>';
    }).join('');
    var canSave = n > 0 || (u.draftReasons || []).length > 0;
    return '<div class="fb-editor" data-fb-editor>' +
      '<label class="fb-editor__lbl" for="' + id + '">Comment <span class="opt">— optional, internal only</span></label>' +
      '<textarea id="' + id + '" rows="2" placeholder="What would make this output better?" aria-describedby="' + id + '-c">' + esc(val) + '</textarea>' +
      '<div class="fb-reasons" role="group" aria-label="Quick reasons">' + chips + '</div>' +
      '<div class="fb-editor__bar">' +
        '<span class="fb-editor__cnt' + (n >= MAX ? ' is-max' : '') + '" id="' + id + '-c">' + n + '/200</span>' +
        '<button type="button" class="btn btn--quiet btn--sm" data-fb-cancel>Cancel</button>' +
        '<button type="button" class="btn btn--soft btn--sm" data-fb-save' + (canSave ? '' : ' disabled') + '>Save comment</button>' +
      '</div></div>';
  }

  function renderUnit(unit) {
    var u = unit._fb;
    if (u.st === 'none') { unit.innerHTML = ''; unit.hidden = true; return; }
    unit.hidden = false;
    var openEditor = (u.st === 'editor' || u.st === 'editor-limit' || u.st === 'saving-comment');
    unit.innerHTML = row(u, unit) + (openEditor ? editorHtml(u) : '');
    if (u.st === 'saving-comment') {
      var b = unit.querySelector('[data-fb-save]');
      if (b) { b.disabled = true; b.innerHTML = '<span class="fb__spin"></span>'; }
      var c = unit.querySelector('[data-fb-cancel]');
      if (c) c.disabled = true;
    }
  }

  /* -- public render ---------------------------------------------------- */
  /* cfg: { mode:'ai'|'manual', st, vote?, comment?, draft? } → unit HTML   */
  function render(cfg) {
    return '<div class="fb-unit" data-fb-unit data-fb="' + esc(JSON.stringify(cfg)) + '"></div>';
  }

  function hydrate(root) {
    (root || document).querySelectorAll('[data-fb-unit]').forEach(function (unit) {
      if (unit._fb) return;
      var cfg = {};
      try { cfg = JSON.parse(unit.getAttribute('data-fb') || '{}'); } catch (_) {}
      unit._fb = {
        mode: cfg.mode === 'ai' ? 'ai' : 'manual',
        st: cfg.st || 'unrated',
        vote: cfg.vote || (cfg.st === 'up' || cfg.st === 'down' || cfg.st === 'expired' || cfg.st === 'conflict' ? (cfg.vote || (cfg.st === 'down' ? 'down' : 'up')) : null),
        comment: cfg.comment || null,
        reasons: cfg.reasons || [],
        draft: cfg.draft || '',
        draftReasons: [],
        undo: false,
        _t: null,
        orig: cfg.st || 'unrated',
        origVote: cfg.vote || null
      };
      if (u_editorLimit(unit._fb)) unit._fb.draft = LIMIT_TEXT;
      renderUnit(unit);
    });
  }
  function u_editorLimit(u) { return u.st === 'editor-limit'; }

  /* 200-grapheme demo text for the limit state */
  var LIMIT_TEXT = gslice('Warmer, shorter, more specific — name the café and keep the question open. ', 200);

  /* -- atlas state mapping --------------------------------------------- */
  var FB_MAP = {
    'fb-default': 'unrated',
    'fb-saving': 'saving',
    'fb-comment': 'editor',
    'fb-comment-limit': 'editor-limit',
    'fb-expired': 'expired',
    'fb-conflict': 'conflict',
    'fb-error': 'error',
    'fb-lineage': 'lineage',
    'fb-regfail': 'regfail',
    'fb-no-perm': 'none'
  };

  function applyAll(state) {
    var mapped = FB_MAP[state];
    document.querySelectorAll('[data-fb-unit]').forEach(function (unit) {
      var u = unit._fb;
      if (!u) return;
      clearTimeout(u._t); u.undo = false;
      if (!mapped) { u.st = u.orig; u.vote = u.origVote || (u.orig === 'down' ? 'down' : u.orig === 'up' || u.orig === 'expired' || u.orig === 'conflict' ? 'up' : null); }
      else {
        u.st = mapped;
        if (mapped === 'unrated') { u.vote = null; u.draft = ''; u.draftReasons = []; }
        if (mapped === 'editor') { u.vote = u.vote || 'down'; u.draft = ''; u.draftReasons = []; }
        if (mapped === 'editor-limit') { u.vote = u.vote || 'down'; u.draft = LIMIT_TEXT; u.draftReasons = ['tone', 'context']; }
        if (mapped === 'expired' || mapped === 'conflict') u.vote = u.vote || 'up';
        if (mapped === 'error' || mapped === 'lineage') u.vote = null;
        if (mapped === 'lineage' && u.mode !== 'ai') u.st = 'unrated';
      }
      renderUnit(unit);
    });
  }

  /* -- interactions ------------------------------------------------------ */
  function saveVote(unit, dir) {
    var u = unit._fb;
    clearTimeout(u._t);
    u.st = 'saving'; u.undo = false; renderUnit(unit);
    setTimeout(function () {
      u.st = dir; u.vote = dir; u.undo = true;
      renderUnit(unit);
      /* Undo affordance — 6s window, then the recorded marker settles. */
      u._t = setTimeout(function () { u.undo = false; renderUnit(unit); }, 6000);
    }, 650);
  }

  function scrollToUnit(unit) {
    var sc = unit.closest('.convo__msgs, .scroll, .v2-main');
    if (!sc) return;
    var r = unit.getBoundingClientRect(), c = sc.getBoundingClientRect();
    sc.scrollTop += (r.top - c.top) - 56;
  }

  function revealEditor(unit) {
    var ed = unit.querySelector('[data-fb-editor]');
    if (!ed) return;
    var ta = ed.querySelector('textarea');
    if (ta) ta.focus();
    /* scroll the message list only enough to reveal the editor — no scrollIntoView */
    var sc = unit.closest('.convo__msgs, .scroll, .v2-main');
    if (sc) {
      var r = ed.getBoundingClientRect(), c = sc.getBoundingClientRect();
      if (r.bottom > c.bottom - 8) sc.scrollTop += (r.bottom - c.bottom) + 12;
    }
  }

  document.addEventListener('click', function (e) {
    var v = e.target.closest('[data-fb-vote]');
    if (v && !v.disabled) { saveVote(v.closest('[data-fb-unit]'), v.getAttribute('data-fb-vote')); return; }

    var add = e.target.closest('[data-fb-add]');
    if (add) {
      var u = add.closest('[data-fb-unit]');
      u._fb.st = 'editor';
      u._fb.draft = u._fb.comment || '';
      u._fb.draftReasons = (u._fb.reasons || []).slice();
      renderUnit(u); revealEditor(u); return;
    }

    var rsn = e.target.closest('[data-fb-rsn]');
    if (rsn) {
      var ru = rsn.closest('[data-fb-unit]')._fb;
      ru.draftReasons = ru.draftReasons || [];
      var ix = ru.draftReasons.indexOf(rsn.getAttribute('data-fb-rsn'));
      if (ix >= 0) ru.draftReasons.splice(ix, 1); else ru.draftReasons.push(rsn.getAttribute('data-fb-rsn'));
      var on = ix < 0;
      rsn.classList.toggle('is-on', on);
      rsn.setAttribute('aria-pressed', String(on));
      var sv = rsn.closest('[data-fb-editor]').querySelector('[data-fb-save]');
      if (sv) sv.disabled = !(glen(ru.draft) > 0 || ru.draftReasons.length > 0);
      return;
    }

    var un = e.target.closest('[data-fb-undo]');
    if (un) {
      var uu = un.closest('[data-fb-unit]')._fb;
      clearTimeout(uu._t);
      uu.undo = false; uu.st = 'unrated'; uu.vote = null;
      renderUnit(un.closest('[data-fb-unit]'));
      if (window.flowToast) flowToast('Vote removed (prototype)');
      return;
    }

    var nx = e.target.closest('[data-fb-next]');
    if (nx) {
      var src = nx.closest('[data-fb-unit]');
      var tgt = nextUnrated(src);
      if (tgt) scrollToUnit(tgt);
      return;
    }

    var cancel = e.target.closest('[data-fb-cancel]');
    if (cancel) { var u2 = cancel.closest('[data-fb-unit]'); u2._fb.st = u2._fb.vote || 'unrated'; renderUnit(u2); return; }

    var save = e.target.closest('[data-fb-save]');
    if (save && !save.disabled) {
      var u3 = save.closest('[data-fb-unit]');
      var ta = u3.querySelector('textarea');
      u3._fb.draft = ta ? ta.value : '';
      u3._fb.st = 'saving-comment'; renderUnit(u3);
      setTimeout(function () {
        u3._fb.comment = u3._fb.draft;
        u3._fb.reasons = (u3._fb.draftReasons || []).slice();
        u3._fb.st = u3._fb.vote || 'down';
        renderUnit(u3);
        if (window.flowToast) flowToast('Comment saved (prototype)');
      }, 650);
      return;
    }

    var retry = e.target.closest('[data-fb-retry]');
    if (retry) { var u4 = retry.closest('[data-fb-unit]'); saveVote(u4, 'up'); return; }

    var reg = e.target.closest('[data-fb-reg]');
    if (reg) {
      var u5 = reg.closest('[data-fb-unit]');
      u5._fb.st = 'unrated'; renderUnit(u5);
      if (window.flowToast) flowToast('Feedback target registered — vote is now possible');
      return;
    }
  });

  document.addEventListener('input', function (e) {
    var ta = e.target.closest && e.target.closest('.fb-editor textarea');
    if (!ta) return;
    var unit = ta.closest('[data-fb-unit]');
    if (glen(ta.value) > MAX) ta.value = gslice(ta.value, MAX);
    var n = glen(ta.value);
    unit._fb.draft = ta.value;
    var cnt = unit.querySelector('.fb-editor__cnt');
    if (cnt) { cnt.textContent = n + '/200'; cnt.classList.toggle('is-max', n >= MAX); }
    var save = unit.querySelector('[data-fb-save]');
    if (save) save.disabled = !(n || (unit._fb.draftReasons || []).length);
  });

  /* Power-user keys: hover a message row / control, press U / D to vote. */
  var hotUnit = null;
  document.addEventListener('mouseover', function (e) {
    var el = e.target && e.target.closest ? e.target.closest('[data-fb-unit]') : null;
    if (!el) {
      var r = e.target && e.target.closest ? e.target.closest('.msg-row') : null;
      el = r ? r.querySelector('[data-fb-unit]') : null;
    }
    hotUnit = el;
  });
  document.addEventListener('mouseout', function (e) {
    if (!e.relatedTarget) hotUnit = null;
  });
  document.addEventListener('keydown', function (e) {
    if (!hotUnit || !hotUnit._fb) return;
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
    var dir = e.key === 'u' ? 'up' : e.key === 'd' ? 'down' : null;
    if (!dir) return;
    var btn = hotUnit.querySelector('[data-fb-vote="' + dir + '"]');
    if (btn && !btn.disabled) { e.preventDefault(); saveVote(hotUnit, dir); }
  });

  /* -- observe the state engine ----------------------------------------- */
  var lastState = null;
  function onState() {
    var s = document.documentElement.getAttribute('data-state');
    if (s === lastState) return;
    lastState = s;
    applyAll(s);
  }

  window.FlowFB = { render: render, hydrate: hydrate, applyAll: applyAll, glen: glen };

  document.addEventListener('DOMContentLoaded', function () {
    hydrate(document);
    onState();
    new MutationObserver(onState).observe(document.documentElement, { attributes: true, attributeFilter: ['data-state'] });
  });
})();
