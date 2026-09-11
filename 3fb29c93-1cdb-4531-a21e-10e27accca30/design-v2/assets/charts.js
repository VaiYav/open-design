/* FlowCharts — zero-dependency SVG chart engine for design-v2.
 *
 * Design contract:
 * - Every color resolves through CSS custom properties via class rules in
 *   tokens-v2.css (.fc-*), so ?theme=dark needs no re-render.
 * - Real axes: Y ticks are computed with a nice-number pass and gridlines
 *   are aligned to them — never decorative.
 * - Hover = crosshair + a single HTML tooltip per chart (richer than
 *   <title>); every datum is also keyboard-focusable (tabindex + aria-label)
 *   and shows the same tooltip on focus.
 * - Legends are buttons (aria-pressed) that dim their series — data is
 *   never dropped from the axis, so scales stay stable.
 * - null = unknown/pending: gaps break line runs, hatched caps on bars,
 *   and are listed in tooltips as their own rows — never interpolated,
 *   never colored as negative.
 */
window.FlowCharts = (function () {
  'use strict';

  var uid = 0;

  /* ---------- scales ---------- */

  // Nice-number axis: pick a step from a 1/2/2.5/5 family so that the
  // range splits into ~targetN ticks, then snap bounds to whole steps.
  function axis(minV, maxV, targetN, clampTop) {
    var span = Math.max(1e-9, maxV - minV);
    var fam = [1, 2, 2.5, 5];
    var mag = Math.pow(10, Math.floor(Math.log10(span / targetN)));
    var step = 10 * mag;
    for (var i = 0; i < fam.length; i++) {
      if (span / (fam[i] * mag) <= targetN) { step = fam[i] * mag; break; }
    }
    var lo = Math.max(0, Math.floor(minV / step) * step);
    var hi = Math.ceil(maxV / step) * step;
    if (clampTop != null) hi = Math.min(hi, clampTop);
    if (hi <= lo) hi = lo + step;
    var ts = [];
    for (var v = lo; v <= hi + step / 2; v += step) ts.push(Math.round(v * 100) / 100);
    return { lo: lo, hi: hi, ticks: ts };
  }

  function smoothPath(pts) {
    /* Catmull-Rom → cubic bezier; pts: [[x,y],…] in one contiguous run. */
    var f = function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); };
    if (pts.length < 3) return 'M' + pts.map(f).join(' L');
    var d = 'M' + f(pts[0]);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      var c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
      var c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += 'C' + c1x.toFixed(1) + ',' + c1y.toFixed(1) + ' ' + c2x.toFixed(1) + ',' + c2y.toFixed(1) + ' ' + f(p2);
    }
    return d;
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ---------- shared tooltip ---------- */

  function tipEl(host) {
    var t = host.querySelector('.fc-tip');
    if (!t) {
      t = document.createElement('div');
      t.className = 'fc-tip';
      t.setAttribute('role', 'tooltip');
      host.appendChild(t);
    }
    return t;
  }

  function showTip(host, html, x, y) {
    var t = tipEl(host);
    t.innerHTML = html;
    t.classList.add('is-on');
    // measure then place; flip left when past ~62% of the chart width
    var hw = host.clientWidth || 1;
    var tx = Math.max(8, Math.min(x, hw - t.offsetWidth - 8));
    if (x > hw * 0.62) tx = x - t.offsetWidth - 12;
    else tx = x + 12;
    t.style.left = Math.max(6, Math.min(tx, hw - t.offsetWidth - 6)) + 'px';
    t.style.top = Math.max(4, y - 14) + 'px';
  }
  function hideTip(host) {
    var t = host.querySelector('.fc-tip');
    if (t) t.classList.remove('is-on');
  }

  /* ---------- legend ---------- */

  function legend(host, items, onToggle) {
    var lg = document.createElement('div');
    lg.className = 'fc-legend';
    lg.setAttribute('role', 'group');
    items.forEach(function (it, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'fc-lg';
      b.setAttribute('aria-pressed', 'true');
      b.innerHTML = '<i class="fc-sw fc-sw--' + it.cls + '"></i>' + esc(it.label);
      b.addEventListener('click', function () {
        var on = b.getAttribute('aria-pressed') !== 'true';
        b.setAttribute('aria-pressed', String(on));
        onToggle(i, on);
      });
      lg.appendChild(b);
    });
    host.appendChild(lg);
    return lg;
  }

  /* ---------- stacked bars ---------- */
  /* cfg = { rows, segments:[{k,label,cls}], aria, tip(row,idx)->html,
           fmt(v)->str } */
  function bars(el, cfg) {
    el.classList.add('fc');
    el.innerHTML = '';
    var rows = cfg.rows, segs = cfg.segments;
    var n = rows.length;
    var W = 700, H = 208, pl = 34, pr = 6, pt = 10, pb = 26;
    var pw = W - pl - pr, ph = H - pt - pb;
    var totals = rows.map(function (r) {
      return segs.reduce(function (s, sg) { return s + (r[sg.k] || 0); }, 0);
    });
    var ax = axis(0, Math.max.apply(null, totals), 4);
    var slot = pw / n;
    var bw = Math.min(slot * 0.6, 44);
    var X = function (i) { return pl + slot * i + slot / 2; };
    var Y = function (v) { return pt + (ax.hi - v) / ax.hi * ph; };
    var id = 'fc' + (++uid);

    var s = '<defs><pattern id="' + id + '-hatch" width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">' +
      '<rect width="6" height="6" class="fc-hatch-bg"/><line x1="0" y1="0" x2="0" y2="6" class="fc-hatch-ln"/></pattern></defs>';

    // gridlines + y labels
    ax.ticks.forEach(function (v) {
      s += '<line class="fc-grid" x1="' + pl + '" y1="' + Y(v).toFixed(1) + '" x2="' + (W - pr) + '" y2="' + Y(v).toFixed(1) + '"/>' +
           '<text class="fc-ax" x="' + (pl - 7) + '" y="' + (Y(v) + 3.5).toFixed(1) + '" text-anchor="end">' + v + '</text>';
    });
    // baseline
    s += '<line class="fc-base" x1="' + pl + '" y1="' + (pt + ph) + '" x2="' + (W - pr) + '" y2="' + (pt + ph) + '"/>';

    var hits = [];
    rows.forEach(function (r, i) {
      var cx = X(i), x0 = cx - bw / 2;
      var acc = 0;
      var parts = [];
      segs.forEach(function (sg) {
        var v = r[sg.k] || 0;
        if (v <= 0) return;
        var y1 = Y(acc + v), y0 = Y(acc), h = Math.max(1.5, y0 - y1);
        parts.push({ sg: sg, y: y1, h: h });
        acc += v;
      });
      // column hover bg
      s += '<rect class="fc-colbg" x="' + (cx - slot / 2 + 1).toFixed(1) + '" y="' + pt + '" width="' + (slot - 2).toFixed(1) + '" height="' + ph + '"/>';
      var cc = cfg.colCls ? cfg.colCls(r, i) : '';
      s += '<g class="fc-col' + (cc ? ' ' + cc : '') + '">';
      parts.forEach(function (p, pi) {
        var rx = (pi === parts.length - 1) ? ' rx="3"' : '';
        var fill = p.sg.cls === 'x' ? ' fill="url(#' + id + '-hatch)"' : '';
        s += '<rect class="fc-seg fc-seg--' + p.sg.cls + '" x="' + x0.toFixed(1) + '" y="' + p.y.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + p.h.toFixed(1) + '"' + rx + fill + '/>';
      });
      s += '</g>';
      // x label
      s += '<text class="fc-ax" x="' + cx.toFixed(1) + '" y="' + (H - 9) + '" text-anchor="middle">' + esc(r.d) + '</text>';
      hits.push({ i: i, x: cx - slot / 2, w: slot, cx: cx });
    });

    // hit columns (focusable) — last so they sit on top
    hits.forEach(function (h) {
      var r = rows[h.i];
      var total = totals[h.i];
      var label = r.d + ' — ' + total + ' rated';
      s += '<rect class="fc-hit" data-i="' + h.i + '" x="' + h.x.toFixed(1) + '" y="' + pt + '" width="' + h.w.toFixed(1) + '" height="' + ph + '" tabindex="0" role="img" aria-label="' + esc(label) + '"/>';
    });

    el.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="fc-svg" role="img" aria-label="' + esc(cfg.aria || 'bar chart') + '">' + s + '</svg>';

    var svg = el.querySelector('svg');
    var tip = function (i) {
      var r = rows[i];
      var rowsHtml = segs.map(function (sg) {
        var v = r[sg.k] || 0;
        return '<div class="fc-tip-r"><i class="fc-sw fc-sw--' + sg.cls + '"></i>' + esc(sg.label) + '<b>' + (cfg.fmt ? cfg.fmt(v) : v) + '</b></div>';
      }).join('');
      return '<div class="fc-tip-t">' + esc(r.d) + '</div>' + rowsHtml +
        (cfg.tip ? cfg.tip(r, i) : '');
    };
    var on = function (i) {
      svg.querySelectorAll('.fc-colbg').forEach(function (c, ci) { c.classList.toggle('is-on', ci === i); });
      var h = hits[i];
      var scale = svg.clientWidth ? svg.clientWidth / W : 1;
      showTip(el, tip(i), h.cx * scale, pt * scale + 20);
    };
    svg.addEventListener('pointermove', function (e) {
      var rect = svg.getBoundingClientRect();
      var vx = (e.clientX - rect.left) / rect.width * W;
      var i = Math.floor((vx - pl) / slot);
      if (i < 0 || i >= n) { hideTip(el); svg.querySelectorAll('.fc-colbg.is-on').forEach(function (c) { c.classList.remove('is-on'); }); return; }
      on(i);
    });
    svg.addEventListener('pointerleave', function () {
      hideTip(el);
      svg.querySelectorAll('.fc-colbg.is-on').forEach(function (c) { c.classList.remove('is-on'); });
    });
    svg.querySelectorAll('.fc-hit').forEach(function (h) {
      h.addEventListener('focus', function () { on(+h.getAttribute('data-i')); });
      h.addEventListener('blur', function () {
        hideTip(el);
        svg.querySelectorAll('.fc-colbg.is-on').forEach(function (c) { c.classList.remove('is-on'); });
      });
    });

    if (cfg.legend !== false) {
      legend(el, segs, function (si, on) {
        svg.querySelectorAll('.fc-seg--' + segs[si].cls).forEach(function (r2) { r2.classList.toggle('is-off', !on); });
      });
    }
  }

  /* ---------- multi-series lines ---------- */
  /* cfg = { rows, series:[{k,label,cls}], unit, ymin, ymax, clampTop,
           bandFrom, bandLabel, aria, meta(row)->html } */
  function lines(el, cfg) {
    el.classList.add('fc');
    el.innerHTML = '';
    var rows = cfg.rows, series = cfg.series;
    var n = rows.length;
    var W = 700, H = 208, pl = 38, pr = 46, pt = 12, pb = 26;
    var pw = W - pl - pr, ph = H - pt - pb;
    var unit = cfg.unit || '';
    var vals = [];
    rows.forEach(function (r) {
      series.forEach(function (sr) { if (r[sr.k] != null) vals.push(r[sr.k]); });
    });
    var ax = (cfg.ymin != null || cfg.ymax != null)
      ? { lo: cfg.ymin || 0, hi: cfg.ymax || 100, ticks: null }
      : axis(Math.min.apply(null, vals), Math.max.apply(null, vals), 4, cfg.clampTop);
    if (!ax.ticks) ax = axis(ax.lo, ax.hi, 4, cfg.clampTop); // rebuild ticks over fixed bounds
    var X = function (i) { return pl + i * pw / (n - 1); };
    var Y = function (v) { return pt + (ax.hi - v) / (ax.hi - ax.lo) * ph; };
    var id = 'fc' + (++uid);

    var s = '<defs>';
    series.forEach(function (sr) {
      s += '<linearGradient id="' + id + '-' + sr.cls + '" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" class="fc-stop-' + sr.cls + '-a"/><stop offset="1" class="fc-stop-' + sr.cls + '-b"/></linearGradient>';
    });
    s += '</defs>';

    ax.ticks.forEach(function (v) {
      var lbl = unit === '%' ? v + '%' : v;
      s += '<line class="fc-grid" x1="' + pl + '" y1="' + Y(v).toFixed(1) + '" x2="' + (W - pr) + '" y2="' + Y(v).toFixed(1) + '"/>' +
           '<text class="fc-ax" x="' + (pl - 7) + '" y="' + (Y(v) + 3.5).toFixed(1) + '" text-anchor="end">' + lbl + '</text>';
    });
    s += '<line class="fc-base" x1="' + pl + '" y1="' + (pt + ph) + '" x2="' + (W - pr) + '" y2="' + (pt + ph) + '"/>';

    if (cfg.bandFrom != null) {
      var bx = X(cfg.bandFrom) - (X(1) - X(0)) / 2;
      s += '<rect class="fc-band" x="' + bx.toFixed(1) + '" y="' + pt + '" width="' + (W - pr - bx).toFixed(1) + '" height="' + ph + '"/>' +
           '<text class="fc-band-t" x="' + (bx + 8).toFixed(1) + '" y="' + (pt + 13) + '">' + esc(cfg.bandLabel || 'maturing') + '</text>';
    }

    var ptIndex = []; // per row: [{x,y,si}]
    series.forEach(function (sr, si) {
      var run = [], runs = [];
      rows.forEach(function (r, i) {
        var v = r[sr.k];
        if (v == null) { if (run.length) runs.push(run); run = []; return; }
        run.push([X(i), Y(v)]);
        (ptIndex[i] = ptIndex[i] || []).push({ x: X(i), y: Y(v), si: si });
      });
      if (run.length) runs.push(run);
      s += '<g class="fc-ser fc-ser--' + sr.cls + '">';
      runs.forEach(function (rpts) {
        var d = smoothPath(rpts);
        if (rpts.length > 1) {
          s += '<path d="' + d + ' L' + rpts[rpts.length - 1][0].toFixed(1) + ',' + (pt + ph) + ' L' + rpts[0][0].toFixed(1) + ',' + (pt + ph) + ' Z" class="fc-area" fill="url(#' + id + '-' + sr.cls + ')"/>';
        }
        s += '<path class="fc-ln" d="' + d + '"/>';
      });
      rows.forEach(function (r, i) {
        var v = r[sr.k];
        if (v == null) return;
        s += '<circle class="fc-pt" cx="' + X(i).toFixed(1) + '" cy="' + Y(v).toFixed(1) + '" r="3.2"/>';
      });
      // end label on last non-null point
      for (var li = rows.length - 1; li >= 0; li--) {
        var v = rows[li][sr.k];
        if (v != null) {
          s += '<text class="fc-end" x="' + (W - pr + 8) + '" y="' + (Y(v) + 3.5).toFixed(1) + '">' + v + unit + '</text>';
          break;
        }
      }
      s += '</g>';
    });

    // crosshair guide + focus ring points
    s += '<line class="fc-guide" x1="0" y1="' + pt + '" x2="0" y2="' + (pt + ph) + '" opacity="0"/>';
    s += '<g class="fc-focus" opacity="0"></g>';

    // x labels (thin if crowded)
    var every = n > 14 ? Math.ceil(n / 12) : 1;
    rows.forEach(function (r, i) {
      if (i % every) return;
      s += '<text class="fc-ax" x="' + X(i).toFixed(1) + '" y="' + (H - 9) + '" text-anchor="middle">' + esc(r.d) + '</text>';
    });

    // hit bands per index (focusable)
    var bhw = pw / (n - 1);
    rows.forEach(function (r, i) {
      var hx = i === 0 ? pl : X(i) - bhw / 2;
      var hw = (i === 0 || i === n - 1) ? bhw / 2 : bhw;
      var parts = series.map(function (sr) {
        var v = r[sr.k];
        return esc(sr.label) + ' ' + (v == null ? 'pending' : v + unit);
      }).join(', ');
      s += '<rect class="fc-hit" data-i="' + i + '" x="' + hx.toFixed(1) + '" y="' + pt + '" width="' + hw.toFixed(1) + '" height="' + ph + '" tabindex="0" role="img" aria-label="' + esc(r.d + ' — ' + parts) + '"/>';
    });

    el.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="fc-svg" role="img" aria-label="' + esc(cfg.aria || 'line chart') + '">' + s + '</svg>';

    var svg = el.querySelector('svg');
    var guide = svg.querySelector('.fc-guide');
    var focusG = svg.querySelector('.fc-focus');
    var hidden = {};

    var tip = function (i) {
      var r = rows[i];
      var rowsHtml = series.map(function (sr, si) {
        if (hidden[si]) return '';
        var v = r[sr.k];
        var val = v == null ? '<i class="fc-tip-p">pending</i>' : '<b>' + v + unit + '</b>';
        return '<div class="fc-tip-r"><i class="fc-sw fc-sw--' + sr.cls + '"></i>' + esc(sr.label) + val + '</div>';
      }).join('');
      return '<div class="fc-tip-t">' + esc(r.d) + '</div>' + rowsHtml +
        (cfg.meta ? '<div class="fc-tip-m">' + cfg.meta(r) + '</div>' : '');
    };
    var on = function (i) {
      var gx = X(i);
      guide.setAttribute('x1', gx.toFixed(1)); guide.setAttribute('x2', gx.toFixed(1));
      guide.setAttribute('opacity', '1');
      var f = '';
      (ptIndex[i] || []).forEach(function (p) {
        if (hidden[p.si]) return;
        f += '<circle class="fc-ring fc-ring--' + series[p.si].cls + '" cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="6"/>';
      });
      focusG.innerHTML = f;
      focusG.setAttribute('opacity', '1');
      var scale = svg.clientWidth ? svg.clientWidth / W : 1;
      var ys = (ptIndex[i] || []).map(function (p) { return p.y; });
      var yA = ys.length ? Math.min.apply(null, ys) : pt + ph / 2;
      showTip(el, tip(i), gx * scale, yA * scale);
    };
    var off = function () {
      guide.setAttribute('opacity', '0');
      focusG.setAttribute('opacity', '0');
      hideTip(el);
    };
    svg.addEventListener('pointermove', function (e) {
      var rect = svg.getBoundingClientRect();
      var vx = (e.clientX - rect.left) / rect.width * W;
      var i = Math.round((vx - pl) / bhw);
      if (i < 0 || i >= n) { off(); return; }
      on(i);
    });
    svg.addEventListener('pointerleave', off);
    svg.querySelectorAll('.fc-hit').forEach(function (h) {
      h.addEventListener('focus', function () { on(+h.getAttribute('data-i')); });
      h.addEventListener('blur', off);
    });

    if (cfg.legend !== false) {
      legend(el, series, function (si, isOn) {
        hidden[si] = !isOn;
        svg.querySelectorAll('.fc-ser--' + series[si].cls).forEach(function (g) { g.classList.toggle('is-off', !isOn); });
      });
    }
  }

  /* ---------- horizontal bars ---------- */
  /* cfg = { rows, label(r), value(r), total, cls, extra(r)->html,
           highlight:fn(r,i)->bool } */
  function hbars(el, cfg) {
    el.classList.add('fc-hb');
    el.innerHTML = '';
    var max = Math.max.apply(null, cfg.rows.map(cfg.value));
    cfg.rows.forEach(function (r, i) {
      var v = cfg.value(r);
      var share = cfg.total ? Math.round(v / cfg.total * 100) + '%' : '';
      var vTxt = cfg.fmt ? cfg.fmt(v) : v;
      var row = document.createElement('div');
      row.className = 'fc-hbr' + (cfg.highlight && cfg.highlight(r, i) ? ' is-hot' : '');
      row.innerHTML =
        '<span class="fc-hbr-l" title="' + esc(cfg.label(r)) + '">' + esc(cfg.label(r)) + '</span>' +
        '<span class="fc-hbr-t"><i class="fc-hbr-f ' + (cfg.cls || '') + '" style="width:' + (v / max * 100).toFixed(1) + '%"></i></span>' +
        '<span class="fc-hbr-v">' + vTxt + (share ? ' <small>' + share + '</small>' : '') + '</span>';
      if (cfg.extra) {
        var ex = cfg.extra(r);
        if (ex) {
          var d = document.createElement('span');
          d.className = 'fc-hbr-x';
          d.innerHTML = ex;
          row.appendChild(d);
        }
      }
      el.appendChild(row);
    });
  }

  /* ---------- sparkline ---------- */
  /* cfg = { values:[n], cls:'a|ok|bad|mut' }. Decorative trend hint —
     aria-hidden: the KPI's own delta text already carries the meaning. */
  function spark(el, cfg) {
    cfg = cfg || {};
    el.classList.add('fc-spark', 'fc-spark--' + (cfg.cls || 'a'));
    var vs = (cfg.values || []).filter(function (v) { return typeof v === 'number' && isFinite(v); });
    if (vs.length < 2) { el.innerHTML = ''; return; }
    var W = 120, H = 30, p = 3;
    var lo = Math.min.apply(null, vs), hi = Math.max.apply(null, vs);
    if (hi - lo < 1e-9) { lo -= 1; hi += 1; }
    var pad = (hi - lo) * 0.14; lo -= pad; hi += pad;
    var X = function (i) { return p + i * (W - 2 * p) / (vs.length - 1); };
    var Y = function (v) { return p + (hi - v) / (hi - lo) * (H - 2 * p); };
    var pts = vs.map(function (v, i) { return [X(i), Y(v)]; });
    var d = smoothPath(pts);
    var id = 'fcs' + (++uid);
    var last = pts[pts.length - 1];
    el.innerHTML =
      '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" class="fc-spk-svg" aria-hidden="true" focusable="false">' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" class="fc-stop-' + (cfg.cls || 'a') + '-a"/><stop offset="1" class="fc-stop-' + (cfg.cls || 'a') + '-b"/></linearGradient></defs>' +
      '<path class="fc-spk-area" d="' + d + ' L' + last[0].toFixed(1) + ',' + H + ' L' + pts[0][0].toFixed(1) + ',' + H + ' Z" fill="url(#' + id + ')"/>' +
      '<path class="fc-spk-ln" d="' + d + '"/>' +
      '<circle class="fc-spk-dot" cx="' + last[0].toFixed(1) + '" cy="' + last[1].toFixed(1) + '" r="2.6"/></svg>';
  }

  /* Auto-mount: any element with data-spark="v,v,…" (optional
     data-spark-cls) becomes a sparkline host. Runs once on DOM ready —
     page scripts add their data-spark hosts synchronously before it. */
  function mountSparks(root) {
    (root || document).querySelectorAll('[data-spark]').forEach(function (el) {
      if (el.__sparked) return;
      el.__sparked = true;
      var vs = (el.getAttribute('data-spark') || '').split(',').map(function (s) { return parseFloat(s); });
      spark(el, { values: vs, cls: el.getAttribute('data-spark-cls') || 'a' });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { mountSparks(document); });
  } else {
    mountSparks(document);
  }

  return { bars: bars, lines: lines, hbars: hbars, spark: spark, mountSparks: mountSparks };
})();
