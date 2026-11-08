/* Arcadia AI-modules — interactie zonder framework. window.ArcadiaAI.init(root?) koppelt alles met data-ai-*. Idempotent. */
(function () {
  function $all(root, sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }
  function once(el, key) { if (el.dataset[key]) return false; el.dataset[key] = '1'; return true; }

  // Kopieerknop in een PromptBlock
  function initCopy(root) {
    $all(root, '[data-ai-copy]').forEach(function (btn) {
      if (!once(btn, 'aiBound')) return;
      btn.addEventListener('click', function () {
        var box = btn.closest('.ai-prompt');
        var src = box && box.querySelector('.ai-prompt__body');
        if (!src) return;
        var label = btn.querySelector('[data-label]');
        function done() {
          btn.setAttribute('data-copied', '');
          if (label) label.textContent = 'Gekopieerd';
          setTimeout(function () { btn.removeAttribute('data-copied'); if (label) label.textContent = 'Kopieer'; }, 1800);
        }
        var text = src.innerText;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, function () { selectText(src); });
        } else { selectText(src); }
      });
    });
  }
  function selectText(el) { var r = document.createRange(); r.selectNodeContents(el); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); }

  // Meerkeuzevraag: data-ai-choice (data-mode="instant" | "check"), opties .ai-option met data-correct="true"
  function initChoice(root) {
    $all(root, '[data-ai-choice]').forEach(function (q) {
      if (!once(q, 'aiBound')) return;
      var multi = q.hasAttribute('data-multi');
      var instant = q.getAttribute('data-mode') === 'instant';
      var opts = $all(q, '.ai-option');
      var checkBtn = q.querySelector('[data-ai-check]');
      var fbOk = q.querySelector('.ai-feedback--correct');
      var fbNo = q.querySelector('.ai-feedback--wrong');
      opts.forEach(function (o) {
        o.setAttribute('aria-pressed', 'false');
        o.addEventListener('click', function () {
          if (q.hasAttribute('data-checked')) return;
          if (!multi) opts.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
          o.setAttribute('aria-pressed', o.getAttribute('aria-pressed') === 'true' && multi ? 'false' : 'true');
          if (checkBtn) checkBtn.disabled = !opts.some(function (x) { return x.getAttribute('aria-pressed') === 'true'; });
          if (instant) check();
        });
      });
      if (checkBtn) { checkBtn.disabled = true; checkBtn.addEventListener('click', check); }
      function check() {
        var ok = opts.every(function (x) { return (x.getAttribute('aria-pressed') === 'true') === (x.getAttribute('data-correct') === 'true'); });
        q.setAttribute('data-checked', '');
        opts.forEach(function (x) {
          var picked = x.getAttribute('aria-pressed') === 'true', right = x.getAttribute('data-correct') === 'true';
          if (right) x.setAttribute('data-result', 'correct'); else if (picked) x.setAttribute('data-result', 'wrong');
        });
        if (fbOk) fbOk.hidden = !ok;
        if (fbNo) fbNo.hidden = ok;
        if (checkBtn) checkBtn.hidden = true;
        q.dispatchEvent(new CustomEvent('ai:answered', { bubbles: true, detail: { correct: ok } }));
      }
    });
  }

  // Schaal, barometer-keuze: één knop tegelijk aria-pressed
  function initToggleGroup(root, groupSel, itemSel) {
    $all(root, groupSel).forEach(function (g) {
      if (g.hasAttribute('data-readonly') || !once(g, 'aiBound')) return;
      var items = $all(g, itemSel);
      items.forEach(function (it) {
        if (!it.hasAttribute('aria-pressed')) it.setAttribute('aria-pressed', 'false');
        it.addEventListener('click', function () {
          items.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
          it.setAttribute('aria-pressed', 'true');
          g.dispatchEvent(new CustomEvent('ai:answered', { bubbles: true, detail: { value: it.value || it.getAttribute('data-level') } }));
        });
      });
    });
  }

  // Open vraag: data-min = minimum aantal woorden
  function initOpen(root) {
    $all(root, '[data-ai-open]').forEach(function (f) {
      if (!once(f, 'aiBound')) return;
      var input = f.querySelector('.ai-input'), out = f.querySelector('[data-ai-count]');
      var min = parseInt(f.getAttribute('data-min') || '0', 10);
      function upd() {
        var n = (input.value.trim().match(/\S+/g) || []).length;
        if (!out) return;
        if (n >= min) { out.textContent = n + ' woorden ✓'; out.setAttribute('data-ok', ''); }
        else { out.textContent = n + ' / ' + min + ' woorden'; out.removeAttribute('data-ok'); }
      }
      input.addEventListener('input', upd); upd();
    });
  }

  // Stappen: data-ai-stepper rond .ai-step's; knoppen data-ai-next / data-ai-prev; voortgang .ai-progress
  function initStepper(root) {
    $all(root, '[data-ai-stepper]').forEach(function (s) {
      if (!once(s, 'aiBound')) return;
      var steps = $all(s, '.ai-step'), i = 0;
      var nodes = $all(s, '.ai-progress__node'), count = s.querySelector('[data-ai-stepcount]');
      function show(n, scroll) {
        i = Math.max(0, Math.min(steps.length - 1, n));
        steps.forEach(function (st, k) { st.hidden = k !== i; });
        nodes.forEach(function (nd, k) { nd.setAttribute('data-state', k < i ? 'done' : k === i ? 'current' : 'todo'); });
        if (count) count.textContent = 'Stap ' + (i + 1) + ' van ' + Math.max(steps.length, nodes.length);
        var f = steps[i].querySelector('.ai-step__q'); if (f) { f.setAttribute('tabindex', '-1'); f.focus({ preventScroll: !scroll }); }
      }
      s.addEventListener('click', function (e) {
        var t = e.target.closest('[data-ai-next],[data-ai-prev]'); if (!t || t.disabled) return;
        show(i + (t.hasAttribute('data-ai-next') ? 1 : -1), true);
      });
      show(0);
    });
  }

  function init(root) {
    root = root || document;
    initCopy(root); initChoice(root); initOpen(root);
    initToggleGroup(root, '[data-ai-scale]', '.ai-scale__opt');
    initToggleGroup(root, '.ai-baro', '.ai-baro__seg');
    initStepper(root);
  }

  window.ArcadiaAI = Object.assign(window.ArcadiaAI || {}, { init: init, version: '1.0.0' });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(); });
  else init();
})();
