/* Flow console design-copy — shared interactions.
   Tabs, modals, pagination, logout menu, chat-layer theme, toasts. */
(function () {
  'use strict';

  document.addEventListener('click', function (e) {
    // Logout / "more" menu
    var logoutBtn = e.target.closest('[data-logout-toggle]');
    if (logoutBtn) {
      var menu = logoutBtn.parentElement.querySelector('.logout__menu');
      if (menu) {
        var open = menu.classList.toggle('is-open');
        logoutBtn.setAttribute('aria-expanded', String(open));
      }
      return;
    }
    if (!e.target.closest('.logout')) {
      document.querySelectorAll('.logout__menu.is-open').forEach(function (m) {
        m.classList.remove('is-open');
        var b = m.parentElement.querySelector('[data-logout-toggle]');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
    }

    var modalOpener = e.target.closest('[data-modal-open]');
    if (modalOpener) {
      var modal = document.getElementById(modalOpener.getAttribute('data-modal-open'));
      if (modal) {
        modal.classList.add('is-open');
        var first = modal.querySelector('input, select, textarea, button:not(.modal__close)');
        if (first) first.focus();
      }
      return;
    }

    var closer = e.target.closest('[data-modal-close]');
    if (closer) {
      var host = closer.closest('.modal-backdrop');
      if (host) host.classList.remove('is-open');
      return;
    }

    if (e.target.classList && e.target.classList.contains('modal-backdrop')) {
      e.target.classList.remove('is-open');
      return;
    }

    // Tabs — scoped to the closest tab group; panels matched inside the
    // nearest shared ancestor ([data-tab-scope] or document).
    var tab = e.target.closest('[data-tab]');
    if (tab) {
      var group = tab.closest('[role="tablist"], .tabs');
      var scope = tab.closest('[data-tab-scope]') || document;
      var target = tab.getAttribute('data-tab');
      if (group) {
        group.querySelectorAll('[data-tab]').forEach(function (t) {
          var active = t === tab;
          t.classList.toggle('is-active', active);
          t.setAttribute('aria-selected', String(active));
        });
      }
      scope.querySelectorAll('[data-tab-panel]').forEach(function (panel) {
        panel.hidden = panel.getAttribute('data-tab-panel') !== target;
      });
      var nav = group && group.getAttribute('data-tab-nav');
      if (nav) {
        // navigation-mode tabs: the link is followed normally; here we just toast
        window.flowToast('Section: ' + tab.textContent.trim());
      }
      return;
    }

    var pageBtn = e.target.closest('.pagination button');
    if (pageBtn && !pageBtn.disabled) {
      var pager = pageBtn.closest('.pagination');
      pager.querySelectorAll('button').forEach(function (b) {
        b.classList.toggle('is-active', b === pageBtn);
        if (b === pageBtn) b.setAttribute('aria-current', 'page');
        else b.removeAttribute('aria-current');
      });
      window.flowToast('Page ' + pageBtn.textContent.trim() + ' (prototype — list unchanged)');
      return;
    }

    // Sidebar collapse (admin `.sidebar`, tools `.tsidebar`)
    var sidebarBtn = e.target.closest('[data-sidebar-toggle]');
    if (sidebarBtn) {
      var sidebar = sidebarBtn.closest('.sidebar, .tsidebar');
      if (sidebar) sidebar.classList.toggle('is-collapsed');
      return;
    }

    // AI-chat scoped theme toggle
    var chatThemeBtn = e.target.closest('[data-chat-theme-toggle]');
    if (chatThemeBtn) {
      var layer = chatThemeBtn.closest('.chat-layout');
      if (layer) {
        var next = layer.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        layer.setAttribute('data-theme', next);
        chatThemeBtn.textContent = next === 'light' ? '☀️' : '🌙';
        chatThemeBtn.setAttribute('aria-pressed', String(next === 'dark'));
      }
      return;
    }
  });

  document.addEventListener('change', function (e) {
    var ctx = e.target.closest('[data-context-select]');
    if (ctx) window.flowToast('Switched to ' + e.target.value + ' (prototype)');
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.is-open').forEach(function (m) {
        m.classList.remove('is-open');
      });
      document.querySelectorAll('.logout__menu.is-open').forEach(function (m) {
        m.classList.remove('is-open');
      });
    }
  });

  var toastTimer = null;
  window.flowToast = function (message) {
    var host = document.getElementById('flow-toast');
    if (!host) {
      host = document.createElement('div');
      host.id = 'flow-toast';
      host.className = 'toast';
      host.setAttribute('role', 'status');
      document.body.appendChild(host);
    }
    host.textContent = message;
    host.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { host.classList.remove('is-visible'); }, 2200);
  };
})();
