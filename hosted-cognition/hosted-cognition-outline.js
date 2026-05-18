/* ───────── Hosted Cognition · Interactive Outline · behavior ───────── */
(function () {
  const { PARTS, CHAPTERS, TERMS, EVENTS, SCAFFOLD } = window.HCO;

  /* ─────────────── ARGUMENT ARC ─────────────── */
  const arcParts = document.querySelectorAll(".arc-part");
  const arcDetail = document.getElementById("arcDetail");

  function renderPart(n) {
    const p = PARTS[n];
    arcDetail.innerHTML = `
      <div class="head">
        <div class="pn">${p.pn}</div>
        <h3>${p.title}</h3>
        <div class="chaps">${p.chaps}</div>
      </div>
      <div class="body">
        ${p.body.map(t => `<p>${t}</p>`).join("")}
      </div>
    `;
    arcParts.forEach(el => el.classList.toggle("active", el.dataset.part === String(n)));
  }

  arcParts.forEach(el => {
    el.addEventListener("click", () => renderPart(el.dataset.part));
    el.addEventListener("mouseenter", () => renderPart(el.dataset.part));
  });
  renderPart(1);

  /* ─────────────── CHAPTER LIST ─────────────── */
  const list = document.getElementById("chapterList");
  let html = "";
  for (const item of CHAPTERS) {
    if (item.part) {
      html += `
        <div class="part-divider">
          <div class="pn">PART ${item.part}</div>
          <div class="pt"><strong>${item.name}</strong></div>
        </div>
      `;
      continue;
    }
    html += `
      <article class="chap">
        <div class="chap-num">
          <span class="word">${item.word}</span>
          № ${item.n}
        </div>
        <div class="chap-body">
          <h3 class="chap-title">${item.title}</h3>
          <p class="chap-thesis">${item.thesis}</p>
          <div class="chap-case"><span class="dot"></span>${item.caseLabel}</div>
        </div>
        <aside class="chap-aside">
          <span class="label">What the chapter says</span>
          ${item.aside}
        </aside>
      </article>
    `;
  }
  list.innerHTML = html;

  /* ─────────────── TERMS GLOSSARY ─────────────── */
  const termsGrid = document.getElementById("termsGrid");
  termsGrid.innerHTML = TERMS.map(t => `
    <div class="term">
      <div class="glyph" aria-hidden="true">${t.glyph}</div>
      <div class="term-body">
        <h3>${t.name}</h3>
        <div class="pron">${t.pron}</div>
        <p>${t.defn}</p>
        <div class="ref">${t.ref}</div>
      </div>
    </div>
  `).join("");

  /* ─────────────── TIMELINE ─────────────── */
  const tlEvents = document.getElementById("tlEvents");
  const tlDetail = document.getElementById("tlDetail");

  function renderEvent(i) {
    const ev = EVENTS[i];
    tlDetail.innerHTML = `
      <div class="when">
        <span>${ev.short}</span>
        <span class="full">${ev.full}</span>
      </div>
      <div class="what">
        <h3>${ev.title}</h3>
        <p>${ev.body}</p>
      </div>
      <div class="where">
        <div class="label">Anchored in</div>
        <div class="name">${ev.title}</div>
        <div class="chno">${ev.chapter} &nbsp;·&nbsp; ${ev.chno}</div>
      </div>
    `;
    [...tlEvents.children].forEach((el, idx) => el.classList.toggle("active", idx === i));
  }

  tlEvents.innerHTML = EVENTS.map((ev, i) => `
    <div class="tl-event" data-i="${i}">
      <div class="date">${ev.short}</div>
      <div class="label">${ev.label}</div>
      <div class="stem"></div>
      <div class="pin"></div>
    </div>
  `).join("");

  [...tlEvents.children].forEach((el, i) => {
    el.addEventListener("click", () => renderEvent(i));
    el.addEventListener("mouseenter", () => renderEvent(i));
  });
  // open on Replit deletion (the book's own opening case)
  renderEvent(EVENTS.findIndex(e => e.short === "Jul ’25"));

  /* ─────────────── SCAFFOLD DEMO ─────────────── */
  const ta = document.getElementById("scaffoldText");
  const ghost = document.getElementById("scaffoldGhost");
  const toggle = document.getElementById("scaffoldToggle");
  const enabledInput = document.getElementById("scaffoldEnabled");
  const acceptCount = document.getElementById("acceptCount");
  const writtenCount = document.getElementById("writtenCount");

  let accepted = 0;
  let written = 0;
  let lastValue = ta.value;

  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function findCompletion(text) {
    if (!enabledInput.checked) return "";
    const t = text.toLowerCase();
    // longest prefix that we have a completion for
    const keys = Object.keys(SCAFFOLD).sort((a, b) => b.length - a.length);
    for (const k of keys) {
      if (k === "") continue;
      if (t.endsWith(k)) return SCAFFOLD[k];
    }
    // fallback: empty seed completion
    if (t.trim() === "") return SCAFFOLD[""];
    return "";
  }

  function render() {
    const text = ta.value;
    const completion = findCompletion(text);
    ghost.innerHTML =
      `<span class="typed">${escapeHtml(text)}</span>` +
      `<span class="ghost">${escapeHtml(completion)}</span>`;
    ghost.dataset.completion = completion;
  }

  ta.addEventListener("input", (e) => {
    const newValue = ta.value;
    // count keystrokes added (positive delta)
    const delta = newValue.length - lastValue.length;
    if (delta > 0) written += delta;
    lastValue = newValue;
    writtenCount.textContent = written;
    render();
  });

  ta.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      const completion = ghost.dataset.completion || "";
      if (completion) {
        e.preventDefault();
        ta.value += completion;
        lastValue = ta.value;
        accepted += completion.length;
        acceptCount.textContent = accepted;
        render();
        // re-position caret to end
        ta.setSelectionRange(ta.value.length, ta.value.length);
      }
    }
  });

  toggle.addEventListener("click", (e) => {
    // label wraps input; click toggles input
    setTimeout(() => {
      toggle.classList.toggle("on", enabledInput.checked);
      render();
    }, 0);
  });

  render();
  writtenCount.textContent = written;
  acceptCount.textContent = accepted;

  /* ─────────────── reveal-on-scroll for arc & glyphs ─────────────── */
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.style.opacity = "1";
          en.target.style.transform = "translateY(0)";
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll(".chap, .term, .arc-detail, .tl-detail").forEach(el => {
      el.style.opacity = "0";
      el.style.transform = "translateY(8px)";
      el.style.transition = "opacity 600ms ease, transform 600ms ease";
      io.observe(el);
    });
  }

  /* ─────────────── smooth scroll for anchor nav ─────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href").slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
})();
