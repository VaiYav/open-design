/* Flow v2 — shell builder + shared render helpers.
   Each screen calls FlowUI.mount({nav, title, crumbs, lady}) which injects
   the rail + topbar around the page's <main class="v2-main">. */
(function () {
  'use strict';

  var NAV = [
    { sec: 'Workspace' },
    { id: 'home', href: 'home.html', icon: 'dashboard', label: 'Home' },
    { id: 'inbox', href: 'inbox.html', icon: 'inbox', label: 'Inbox', cnt: 21 },
    { id: 'chats', href: 'chats.html', icon: 'chat', label: 'Chats', cnt: 12 },
    { id: 'mails', href: 'mails.html', icon: 'mail', label: 'Mails', cnt: 3 },
    { id: 'history', href: 'history.html', icon: 'history', label: 'History' },
    { id: 'statistics', href: 'statistics.html', icon: 'stats', label: 'Statistics' },
    { id: 'scorecard', href: 'scorecard.html', icon: 'user', label: 'Scorecard' },
    { sec: 'Manage' },
    { id: 'campaigns', href: 'campaigns.html', icon: 'campaigns', label: 'Campaigns' },
    { id: 'tools', href: 'tools.html', icon: 'tools', label: 'Tools' },
    { id: 'alerts', href: 'alerts.html', icon: 'bell', label: 'Alerts', cnt: 3 },
    { sec: 'System' },
    { id: 'admin', href: 'admin.html', icon: 'admin', label: 'Admin' },
    { id: 'omniscience', href: 'omniscience.html', icon: 'omni', label: 'Omniscience' }
  ];

  var ADMIN_SUB = [
    { href: 'admin.html', label: 'Dashboard' },
    { href: 'admin-administrators.html', label: 'Administrators' },
    { href: 'admin-accounts.html', label: 'Accounts' },
    { href: 'admin-lady-profiles.html', label: 'Lady Profiles' },
    { href: 'admin-schedules.html', label: 'Schedules' },
    { href: 'admin-message-feedback.html', label: 'Message feedback' },
    { href: 'admin-coverage.html', label: 'Coverage' },
    { href: 'monitor.html', label: 'Live monitor' }
  ];

  var TOOLS_SUB = [
    { href: 'tools.html', label: 'All ladies' },
    { href: 'tools-autoreplies.html', label: 'Autoreplies' },
    { href: 'tools-mailing.html', label: 'Mailing' },
    { href: 'tools-presets.html', label: 'Presets' },
    { href: 'tools-blacklists.html', label: 'Blacklists' },
    { href: 'lady-360.html', label: 'Lady 360' }
  ];

  var CAMPAIGNS_SUB = [
    { href: 'campaigns.html', label: 'Overview' },
    { href: 'campaigns-templates.html', label: 'Templates' },
    { href: 'campaigns-groups.html', label: 'Groups' },
    { href: 'campaigns-posts.html', label: 'Posts' },
    { href: 'campaigns-history.html', label: 'History' },
    { href: 'campaigns-performance.html', label: 'Performance' },
    { href: 'planner.html', label: 'Planner' }
  ];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function platformTag(key, opts) {
    var p = window.Fixtures.PLATFORMS[key];
    if (!p) return '';
    var nameOnly = opts && opts.nameOnly;
    return '<span class="platform-tag"><img src="' + p.logo + '" alt="' + esc(p.name) + '">' + (nameOnly ? '' : '<span>' + esc(p.name) + '</span>') + '</span>';
  }

  function ini(name) {
    return String(name || '?').split(/\s+/).map(function (w) { return w[0]; }).join('').toUpperCase().slice(0, 2);
  }

  function avatar(x, cls) {
    return '<span class="avatar ' + (cls || '') + '">' + esc(x.initials || ini(x.name || x.lady || x.op || x.from)) + '</span>';
  }

  function dot(status) {
    var m = { online: 'on', offline: 'off', error: 'err' };
    var t = { online: 'Online', offline: 'Offline', error: 'Connection error' };
    return '<span class="dot dot--' + (m[status] || 'off') + '" title="' + (t[status] || 'Offline') + '"></span>';
  }

  /* Shared state blocks so every screen's empty/error/loading look identical. */
  function stateBlock(kind, opts) {
    opts = opts || {};
    if (kind === 'loading') {
      var rows = '';
      for (var i = 0; i < (opts.rows || 5); i++) {
        rows += '<div class="sk-row"><span class="skeleton" style="width:40px;height:40px;border-radius:50%"></span>' +
          '<span style="flex:1"><span class="skeleton" style="display:block;width:46%;height:13px"></span>' +
          '<span class="skeleton" style="display:block;width:70%;height:11px;margin-top:7px"></span></span></div>';
      }
      return '<div role="status" aria-live="polite" aria-busy="true"><span class="sr-only">Loading…</span>' + rows + '</div>';
    }
    if (kind === 'error') {
      return '<div class="state"><div class="state__icon state__icon--danger"><span class="ic ic--warn ic--lg"></span></div>' +
        '<h2>' + esc(opts.title || 'Something went wrong') + '</h2>' +
        '<p>' + esc(opts.hint || 'The data could not be loaded. Check your connection and try again.') + '</p>' +
        '<button class="btn btn--ghost" type="button" data-reload>Try again</button></div>';
    }
    if (kind === 'offline') {
      return '<div class="state"><div class="state__icon state__icon--danger"><span class="ic ic--warn-o ic--lg"></span></div>' +
        '<h2>' + esc(opts.title || 'You are offline') + '</h2>' +
        '<p>' + esc(opts.hint || 'Connection to the platform was lost. Reconnect to continue working.') + '</p>' +
        '<button class="btn btn--ghost" type="button" data-reload>Reconnect</button></div>';
    }
    /* empty */
    return '<div class="state"><div class="state__icon ' + (opts.muted ? 'state__icon--muted' : '') + '"><span class="ic ic--' + (opts.icon || 'inbox') + ' ic--lg"></span></div>' +
      '<h2>' + esc(opts.title || 'Nothing here yet') + '</h2>' +
      '<p>' + esc(opts.hint || 'When there is something to show, it will appear here.') + '</p>' +
      (opts.action ? '<button class="btn btn--soft" type="button" data-toast="' + esc(opts.actionToast || 'Prototype action') + '">' + esc(opts.action) + '</button>' : '') +
      '</div>';
  }

  function railLink(item, activeId) {
    var cls = 'v2-rail__link' + (item.id === activeId ? ' is-active' : '');
    var inner = '<span class="ic ic--' + item.icon + '"></span><span class="lbl">' + esc(item.label) + '</span>' +
      (item.cnt ? '<span class="cnt">' + item.cnt + '</span>' : '') +
      (item.isNew ? '<span class="badge-new">new</span>' : '');
    return '<a class="' + cls + '" href="' + item.href + '"' + (item.id === activeId ? ' aria-current="page"' : '') + '>' + inner + '</a>';
  }

  function buildRail(cfg) {
    var rail = document.createElement('aside');
    rail.className = 'v2-rail';
    rail.setAttribute('data-od-id', 'nav-rail');
    var html = '<div class="v2-rail__brand"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNDIiIGhlaWdodD0iNTciPgogIDxkZWZzPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMS43IiB4Mj0iMi43IiB5MT0iLjIiIHkyPSIuMiIgZ3JhZGllbnRVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMzYjQyYjgiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMTgxYjg5Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IHhsaW5rOmhyZWY9IiNhIiBpZD0iYiIgeDE9Ii40IiB4Mj0iLjQiIHkxPSIxLjQiIHkyPSIuMiIvPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJjIiB4MT0iMS43IiB4Mj0iMS43IiB5MT0iMSIgeTI9Ii0uMyIgZ3JhZGllbnRVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM1ODYyZGUiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOTE2N2ZmIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJkIiB4MT0iMS44IiB4Mj0iMS44IiB5MT0iMS44IiB5Mj0iLjIiIGdyYWRpZW50VW5pdHM9Im9iamVjdEJvdW5kaW5nQm94Ij4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjNTg2MmRlIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2VjNTBmZiIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHBhdGggZmlsbD0idXJsKCNhKSIgZD0ibTc1OS4xIDI0OC4yIDIwIDV2LTE2bC0yMS02djE1YzAgMSAuMiAxLjggMSAyWiIgZGF0YS1uYW1lPSJQYXRoIDEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC03NTguMSAtMTk2LjIpIi8+CiAgPHBhdGggZmlsbD0idXJsKCNiKSIgZD0iTTc5MC4xIDIxMC4ydjE1bC0zMS0xMGMtLjgtLjMtMS0xLjEtMS0ydi0xNGwzMCA5Yy45LjMgMiAxLjEgMiAyWiIgZGF0YS1uYW1lPSJQYXRoIDIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC03NTguMSAtMTg2LjIpIi8+CiAgPHBhdGggZmlsbD0idXJsKCNjKSIgZD0iTTc5MC4xIDIxNnYxNGMwIC44LTEgMS43LTIgMmwtMzAgOHYtMTRjMC0xIC4yLTEuOSAxLTJaIiBkYXRhLW5hbWU9IlBhdGggMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTc1OC4xIC0xOTEpIi8+CiAgPHBhdGggZmlsbD0idXJsKCNkKSIgZD0iTTgwMC4xIDE3OS42djE0YzAgMSAwIDEuOC0xIDJsLTQxIDExdi0xNGMwLS45LjItMS44IDEtMloiIGRhdGEtbmFtZT0iUGF0aCA0IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNzU4LjEgLTE3OS42KSIvPgo8L3N2Zz4=" alt="Flow"><span class="v2-rail__tag">v2</span></div><nav class="v2-rail__nav" aria-label="Primary">';
    NAV.forEach(function (item) {
      if (item.sec) { html += '<div class="v2-rail__sec">' + esc(item.sec) + '</div>'; return; }
      html += railLink(item, cfg.nav);
      if (item.id === 'admin' && cfg.zone === 'admin') {
        html += '<div style="padding:2px 0 4px 30px" class="rail-sub">';
        ADMIN_SUB.forEach(function (s) {
          var act = cfg.sub && s.href.indexOf(cfg.sub) === 0;
          html += '<a class="v2-rail__link' + (act ? ' is-active' : '') + '" style="height:34px;font-size:12.5px" href="' + s.href + '"' + (act ? ' aria-current="page"' : '') + '><span class="lbl">' + esc(s.label) + '</span>' + (s.isNew ? '<span class="badge-new">new</span>' : '') + '</a>';
        });
        html += '</div>';
      }
      if (item.id === 'tools' && cfg.zone === 'tools') {
        html += '<div style="padding:2px 0 4px 30px" class="rail-sub">';
        TOOLS_SUB.forEach(function (s) {
          var act = cfg.sub && s.href.indexOf(cfg.sub) === 0;
          html += '<a class="v2-rail__link' + (act ? ' is-active' : '') + '" style="height:34px;font-size:12.5px" href="' + s.href + '"' + (act ? ' aria-current="page"' : '') + '><span class="lbl">' + esc(s.label) + '</span>' + (s.isNew ? '<span class="badge-new">new</span>' : '') + '</a>';
        });
        html += '</div>';
      }
      if (item.id === 'campaigns' && cfg.zone === 'campaigns') {
        html += '<div style="padding:2px 0 4px 30px" class="rail-sub">';
        CAMPAIGNS_SUB.forEach(function (s) {
          var act = cfg.sub && s.href.indexOf(cfg.sub) === 0;
          html += '<a class="v2-rail__link' + (act ? ' is-active' : '') + '" style="height:34px;font-size:12.5px" href="' + s.href + '"' + (act ? ' aria-current="page"' : '') + '><span class="lbl">' + esc(s.label) + '</span>' + (s.isNew ? '<span class="badge-new">new</span>' : '') + '</a>';
        });
        html += '</div>';
      }
    });
    html += '</nav><div class="v2-rail__foot"><button type="button" class="btn btn--ghost btn--sm v2-rail__collapse" data-rail-toggle aria-label="Collapse navigation"><span class="ic ic--back"></span><span class="lbl">Collapse</span></button></div>';
    rail.innerHTML = html;
    return rail;
  }

  function buildTopbar(cfg) {
    var bar = document.createElement('header');
    bar.className = 'v2-topbar';
    bar.setAttribute('data-od-id', 'topbar');
    var crumb = (cfg.crumbs || []).map(function (c) { return '<span class="v2-topbar__crumb">' + esc(c) + '</span><span class="v2-topbar__crumb">/</span>'; }).join('');
    var html = crumb + '<span class="v2-topbar__title">' + esc(cfg.title || '') + '</span><span class="v2-topbar__sp"></span>';
    if (cfg.lady) {
      html += '<div style="position:relative"><button type="button" class="ctx-switch" data-menu-open="ctx-menu" aria-expanded="false" aria-haspopup="true">' +
        '<span class="avatar avatar--sm">AS</span>' +
        '<span class="meta"><span class="n">Anna S.</span><span class="p"><img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDE4MCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik00MC40MzIzIDE0LjYyMDFDMzkuOTIzNSAxNC44NzUgMzguMDg2NSAxNS43NjQ4IDM2LjMxIDE2LjU4OThDMjUuOTEzOSAyMS40NzkzIDE5LjM4NTYgMzQuMzA3NiAyMS4zNDc1IDQ1Ljk5MTVDMjUuMTUwNyA2OC4wODkyIDQzLjU5NzIgOTAuMzc3MSA2NC44MzggOTguNDQ1NkM2OC43NzA1IDk5LjkwNTYgNzYuMTIyMyAxMDAuNDE1IDc3LjI2NSA5OS4yNzA2Qzc3LjU4NDEgOTguOTU1MyA3Ny4zMjk3IDk3Ljg3NTQgNzYuNTY2NSA5Ni41NDA3QzcxLjQzMDkgODcuMzk2NyA2OC40NTE0IDc5LjMzMjUgNjcuOTQyNiA3My4wNDM2QzY3LjE4MzYgNjMuNjQ0NyA2OS43ODM4IDU2LjIxNTQgNzYuMTgyOCA0OS44NjZDODEuNjk3OCA0NC4zNDE2IDg3LjIxMjcgNDEuOTI3IDkzLjkzNTEgNDEuOTI3QzEwMC42NTcgNDEuOTI3IDEwNS43MjggNDMuODMxOCAxMTIuMjU3IDQ5LjIzMUwxMTYuMjQ5IDUyLjUzMUwxMjAuMDU3IDQ5LjIzMUwxMjMuNzk1IDQ1Ljg2NjNMMTIzLjY3IDQwLjU5NjZDMTIzLjM1NiAyOS41NDc3IDExNy4zOTYgMjAuMjc0MSAxMDcuOTQ5IDE2LjIwOTZDMTA2LjU1MiAxNS41NzQ3IDEwNC45MDUgMTQuODc1IDEwNC4zMzYgMTQuNTU5N0MxMDIuNzQ5IDEzLjczNDcgOTQuMDY0NSAxMy44NTk5IDkxLjk3MzIgMTQuNjg0OUM4Ny4yODE3IDE2LjY1NDUgODUuODg4OSAxNy4zNTQzIDgzLjA5OTEgMTkuNTE0Qzc5LjgwMDUgMjEuOTg5IDc2LjM3NjggMjUuMjkzMyA3NC4yMjUxIDI4LjE0ODNMNzIuODI4IDI5Ljk5MjdMNjcuMjQ4MyAyNC4zMzg2QzYyLjA0ODEgMTkuMTMzOCA2MC43ODA0IDE4LjMwNDUgNTIuOTg0NCAxNC40OTQ5QzUxLjUyNjkgMTMuODU5OSA0MS43IDEzLjkyNDcgNDAuNDMyMyAxNC42MjAxWk00NS42OTI4IDI5LjczMzVDNTAuMzE5NiAzMy45MjMzIDQ5LjM3MSA0MC41MzE5IDQzLjczMDkgNDMuMjYxN0M0MS4wNjYxIDQ0LjU5NjQgNDAuOTQxMSA0NC41OTYzIDM4LjE1MTIgNDMuNTE2NUMzMi43MDA5IDQxLjQyMTYgMzAuOTg5IDM1LjEzMjYgMzQuNzI3NSAzMC44NzgxQzM1LjgwNTUgMjkuNjczIDM3LjMyNzYgMjguNTI4NCAzOC4wODY1IDI4LjQwMzFDNDAuNDMyMiAyNy44OTM0IDQ0LjQyNTEgMjguNTkzMiA0NS42OTI4IDI5LjczNzhWMjkuNzMzNVoiIGZpbGw9IiMzNTdDQjkiLz4KPHBhdGggZD0iTTkwLjczNDQgNDYuNjc5MUM4Ni43NTM4IDQ3LjM3NTMgODEuMjUxNCA1MC4zNDQ2IDc4LjcyODEgNTMuMjQ5NkM3My41NDgyIDU5LjI1MjkgNzEuNDU5IDY2LjcwODggNzIuNzg3MyA3NC4xMDAxQzc0LjE3NTggODEuNTU1OSA3OC4zNDk4IDkwLjU4ODkgODMuNTI5OCA5Ny42MDIxQzg4LjQ2MDQgMTA0LjIzNyA5OC42OTk5IDExMi44OTIgMTA1LjAxOSAxMTUuNzM3QzExNC41NjIgMTIwLjA5OCAxMTguNDE4IDExOS45NyAxMjcuODM3IDExNS4yOTRDMTQyLjk0MiAxMDcuNzA5IDE1Ni41OTUgODkuODMyNiAxNTkuMzEyIDczLjk3NTZDMTYxLjIwNyA2My4zNjEyIDE1Ni4wODggNTIuOTM2IDE0Ni44NTggNDguNTE0MUMxNDMuMjU2IDQ2LjgwOCAxNDIuMDU3IDQ2LjU1NDQgMTM3LjYzMyA0Ni42MTg5QzEzMC44NzEgNDYuNjE4OSAxMjYuNzAyIDQ4LjcwMzEgMTIwLjUwNyA1NS4wODQ2TDExNi4wODQgNTkuNjk1NkwxMTEuMjE4IDU0Ljc3MDlDMTA0LjM5MSA0Ny44ODIzIDk4LjE5NyA0NS40ODQ1IDkwLjczODcgNDYuNjgzNEw5MC43MzQ0IDQ2LjY3OTFaTTkxLjkzMzggNTguODEwNEM5NC4zOTY5IDYwLjA3MzggOTUuNTM2MSA2Mi4wMzMzIDk1LjUzNjEgNjUuMTI3NEM5NS41MzYxIDY5LjIzNTYgOTMuMzg2NyA3MS4zOCA4OS4yMTcgNzEuMzhDODQuNjA0NCA3MS4zOCA4MS42OTQyIDY3Ljk2NzkgODIuNTE5NiA2My41NDZDODMuMzQwNiA1OS4zNzc2IDg4LjIwNjcgNTYuOTExIDkxLjkzOCA1OC44MTA0SDkxLjkzMzhaIiBmaWxsPSIjRkY1OTY2Ii8+CjxwYXRoIGQ9Ik03Ny4xMTU5IDEwMy44ODhDNzYuMjE1MSAxMDQuMjU0IDczLjMyMDUgMTA0LjQzNyA3MC40OTU4IDEwNC4yNTRMNjUuNDE1IDEwMy45NTFMNjQuNTE0MiAxMDUuOTY3QzYyLjc3ODMgMTA5Ljk5OSA2NC44Mzc3IDExMS4xNjMgNzMuNTEyOSAxMTEuMTYzQzc4LjQ2MjYgMTExLjE2MyA3OS44MTM3IDExMC45OCA4MS4wMzM3IDExMC4wMDNDODIuNTExNiAxMDguODQzIDgyLjU3NzIgMTA4Ljc4MSA4MS42MTA4IDEwNi4xNTRDODAuNTgzMyAxMDMuMzQ0IDc5LjY4MjYgMTAyLjkxNSA3Ny4xMTE1IDEwMy44OTJMNzcuMTE1OSAxMDMuODg4WiIgZmlsbD0iIzM1N0NCOSIvPgo8cGF0aCBkPSJNNzAuOTg5NSAxMjEuNDk3QzcwLjk4OTUgMTI0LjA3IDcxLjY5MzYgMTI4Ljc2NSA3MS42OTM2IDEyOC43NjVDNzEuNjkzNiAxMjguNzY1IDcyLjQzNzMgMTM0LjE2OSA3Mi44Nzg1IDEzNi42MTRDNzMuNjk2NyAxNDEuMzIgNzMuNTQwMSAxNDEuNjQ3IDc0LjE1NzkgMTQzLjU1Qzc0Ljk5MzggMTQ2LjEyNiA3Ni4wNDc5IDE0OC45NjQgNzguMzgyNCAxNTIuMzUxQzgyLjk3ODQgMTU5LjA2MyA4NS43NDk4IDE2MS4wNzIgODcuNTc4OCAxNTkuMjVDODguNzEzOSAxNTguMTI0IDg4LjUyNTQgMTU3LjM2OSA4Ni4zODM3IDE1NC45ODRDNzkuNzkwNSAxNDguMTI3IDc3Ljg1NTggMTQ0LjM5MiA3NS41ODk5IDEyMS44NzNMNzUuMDg0NSAxMTcuMTcxTDczLjA3MTMgMTE2Ljk4M0w3MC45OTM4IDExNi43OTVWMTIxLjUwMkw3MC45ODk1IDEyMS40OTdaIiBmaWxsPSIjMzU3Q0I5Ii8+CjxwYXRoIGQ9Ik0xMjAuMjUyIDEyMy43OTNDMTE5LjA1NyAxMjQuMTUyIDExNi4yODYgMTI0LjI3NCAxMTQuMDgxIDEyNC4wMzNDMTEwLjM2NCAxMjMuNzMyIDExMC4xMTUgMTIzLjc5MyAxMDkuNDIxIDEyNS4xNzZDMTA4LjQxNSAxMjcuMzM0IDEwOS4xNjkgMTI4LjIzNSAxMTIuNjMzIDEyOS4wNzJDMTE2LjQ3NSAxMjkuOTEyIDEyMS41NzUgMTI5LjM2OSAxMjMuNDY0IDEyNy45MzNDMTI0Ljc4NyAxMjYuOTE0IDEyNC43ODcgMTI2Ljg1MiAxMjMuNzc3IDEyNC45OTZDMTIzLjIxMSAxMjMuOTE1IDEyMi42NDIgMTIzLjA3NSAxMjIuNTgyIDEyMy4xMzZDMTIyLjUxOCAxMjMuMTM2IDEyMS40NDcgMTIzLjQzNCAxMjAuMjUyIDEyMy43OTdWMTIzLjc5M1oiIGZpbGw9IiNGRjU5NjYiLz4KPHBhdGggZD0iTTExMy44OTIgMTM0Ljg1MkMxMTMuNzAxIDEzNS4xNjkgMTEzLjM4MSAxMzcuNjI1IDExMy4xMjYgMTQwLjM5OUMxMTIuNzQ1IDE0NS4xMjIgMTEyLjQyNSAxNDcuMDE3IDExMC43NzMgMTUzLjk0N0MxMDkuODk0IDE1Ny42MzIgMTA4Ljk5IDE1OC4xNiAxMDguOTkgMTU4LjE2QzEwNy42MDIgMTYwLjQ0OCAxMDUuOTQgMTYyLjMxNyAxMDYuMTkxIDE2My41MThDMTA2Ljc2MiAxNjUuNTk2IDEwOC44IDE2NS40NjggMTEwLjc3MyAxNjMuMjY1QzExMi4xNzggMTYxLjY5NSAxMTQuMzQ5IDE1OS4wNCAxMTUuNDE5IDE1NC44OUMxMTYuODE2IDE0OS40NzMgMTE4LjUzNCAxMzYuNDg5IDExOC4wOTIgMTM1LjE2NUMxMTcuNzcyIDEzNC4zNDYgMTE0LjMzNyAxMzQuMDkzIDExMy44OTYgMTM0Ljg0OEwxMTMuODkyIDEzNC44NTJaIiBmaWxsPSIjRkY1OTY2Ii8+Cjwvc3ZnPgo=" alt="RealLoves">RL-884217 · <span class="dot dot--on" style="width:7px;height:7px;box-shadow:none"></span> online</span></span>' +
        '<span class="ic ic--chev-d" style="width:16px;height:16px;color:var(--faint)"></span></button>' +
        '<div class="menu ctx-menu" id="ctx-menu" role="menu">';
      window.Fixtures.LADIES.forEach(function (l, i) {
        html += '<button type="button" class="ctx-menu__item' + (i === 0 ? ' is-active' : '') + '" role="menuitemradio" aria-checked="' + (i === 0) + '" data-ctx="' + esc(l.id) + '">' +
          '<span class="avatar avatar--sm">' + esc(l.initials) + '</span>' +
          '<span style="flex:1"><span class="n" style="font-weight:700;font-size:13px;display:block">' + esc(l.name) + '</span>' +
          '<span class="p" style="font-size:11px;color:var(--muted);display:flex;align-items:center;gap:5px"><img src="' + window.Fixtures.PLATFORMS[l.platform].logo + '" alt="" style="height:13px">' + esc(l.id) + '</span></span>' +
          dot(l.status) + (l.unread ? '<span class="unread">' + l.unread + '</span>' : '') + '</button>';
      });
      html += '</div></div>';
    }
    html += '<div class="status-strip"><span class="status-pill"><span class="dot dot--on"></span>5 platforms</span><span class="status-pill"><span class="ic ic--clock ic--sm"></span>Shift 08:00–16:00</span></div>';
    html += '<a class="icon-btn" href="alerts.html" aria-label="Alerts" title="Alerts"><span class="ic ic--bell"></span><span class="ping"></span></a>';
    html += '<button type="button" class="icon-btn theme-ic" data-theme-toggle aria-label="Toggle theme" title="Toggle light/dark"><svg class="th th--moon" viewBox="0 0 24 24" width="19" height="19" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 7 7 0 1 0 20 14.5Z" fill="currentColor"/></svg><svg class="th th--sun" viewBox="0 0 24 24" width="19" height="19" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="currentColor"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M19.4 4.6l-2.1 2.1M6.7 17.3l-2.1 2.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>';
    html += '<div style="position:relative"><button type="button" class="icon-btn" data-menu-open="acct-menu" aria-expanded="false" aria-haspopup="true" aria-label="Account menu"><span class="avatar avatar--sm" style="width:28px;height:28px;font-size:10px">KV</span></button>' +
      '<div class="menu" id="acct-menu" role="menu" style="right:0;top:46px;left:auto">' +
      '<div style="padding:9px 11px"><div style="font-weight:700;font-size:13px">Katerina V.</div><div class="tiny muted">Operator · katerina@flow.local</div></div><div class="menu-sep"></div>' +
      '<button type="button" role="menuitem" data-toast="Opened profile settings (prototype)"><span class="ic ic--user ic--sm"></span>Profile settings</button>' +
      '<button type="button" role="menuitem" data-toast="Keyboard shortcuts (prototype)"><span class="ic ic--list ic--sm"></span>Shortcuts</button>' +
      '<div class="menu-sep"></div>' +
      '<button type="button" role="menuitem" class="danger" data-toast="Logged out (prototype)"><span class="ic ic--logout ic--sm"></span>Log out</button>' +
      '<button type="button" role="menuitem" class="danger" data-toast="Logged out of all devices (prototype)"><span class="ic ic--logout-all ic--sm"></span>Log out everywhere</button>' +
      '</div></div>';
    bar.innerHTML = html;
    return bar;
  }

  function mount(cfg) {
    cfg = cfg || {};
    var page = document.getElementById('page');
    if (!page) return;
    var shell = document.createElement('div');
    shell.className = 'v2-shell';
    var col = document.createElement('div');
    col.className = 'v2-col';
    document.body.insertBefore(shell, page);
    shell.appendChild(buildRail(cfg));
    shell.appendChild(col);
    col.appendChild(buildTopbar(cfg));
    col.appendChild(page);
    try {
      if (localStorage.getItem('v2-rail') === 'min') shell.classList.add('rail-min');
    } catch (_) {}
  }

  window.FlowUI = {
    mount: mount,
    esc: esc,
    platformTag: platformTag,
    avatar: avatar,
    dot: dot,
    stateBlock: stateBlock,
    NAV: NAV
  };
})();
