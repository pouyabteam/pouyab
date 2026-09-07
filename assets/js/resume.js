(function () {
  var ORDER = ["leader", "member1", "member2", "member3", "member4", "member5"];
  var DATA = (window.POUYAB_RESUMES || {});
  var I18N = (window.POUYAB_I18N || {});
  var observers = [];
  var state = { id: "leader" };

  function lang() { return document.documentElement.getAttribute("lang") || "fa"; }
  function t(key) {
    var d = I18N[lang()];
    if (d && d[key] !== undefined) return d[key];
    if (I18N.fa && I18N.fa[key] !== undefined) return I18N.fa[key];
    return key;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function qsGet(name) {
    var m = new RegExp("[?&]" + name + "=([^&#]*)").exec(window.location.search);
    return m ? decodeURIComponent(m[1]) : null;
  }
  function initState() {
    var p = qsGet("id") || "leader";
    if (!DATA[p]) p = "leader";
    return { id: p };
  }
  function content() {
    var c = DATA[state.id].content;
    return c[lang()] || c.fa;
  }
  function text(l) {
    if (l === "resume.birth" || l === "resume.marital" || l === "resume.military" ||
        l === "resume.summary" || l === "resume.skills" || l === "resume.education" ||
        l === "resume.experience" || l === "resume.certificates" || l === "resume.languages") return t(l);
    if (l !== undefined) return t(l);
    return "";
  }
  function url(s) {
    if (!s) return "#";
    return /^https?:\/\//i.test(s) ? s : "https://" + s;
  }

  var S = function (i) { return '<svg viewBox="0 0 24 24">' + i + "</svg>"; };
  var ICONS = {
    user: '<path d="M12 11.2a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4z"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/>',
    spark: '<path d="M12 3.5l2.4 5 5.4.7-4 3.9 1 5.4-4.8-2.5-4.8 2.5 1-5.4-4-3.9 5.4-.7 2.4-5z"/>',
    cap: '<path d="M3 9.2l9-4.9 9 4.9-9 4.9-9-4.9z"/><path d="M7 12v3.4c0 1.2 2.2 2.3 5 2.3s5-1.1 5-2.3V12"/><path d="M21 9.5v4.7"/>',
    brief: '<rect x="3" y="7.5" width="18" height="12.5" rx="2"/><path d="M8.5 7.5V6a1.5 1.5 0 0 1 1.5-1.5h4A1.5 1.5 0 0 1 15.5 6v1.5"/><path d="M3 12.5h18"/><path d="M12 11v2"/>',
    medal: '<circle cx="12" cy="9" r="4.6"/><path d="M14.6 12.7L16.4 21l-4.4-2.5L7.6 21l1.8-8.3"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
    mail: '<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    glob: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18"/>',
    linkin: '<path fill="currentColor" stroke="none" d="M20.5 20.5h-3.55v-5.56c0-1.33-.03-3.04-1.86-3.04-1.86 0-2.14 1.45-2.14 2.94v5.66H9.4V9h3.4v1.56h.05c.48-.9 1.63-1.85 3.37-1.85 3.6 0 4.28 2.37 4.28 5.45v6.34zM5.35 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.5H3.58V9h3.54v11.5zM22.22 0H1.76C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.76 24h20.46c.97 0 1.78-.77 1.78-1.73V1.73C24 .77 23.19 0 22.22 0z"/>',
    cake: '<rect x="4" y="8" width="16" height="13" rx="1.5"/><path d="M3.5 13h17"/><path d="M8 4.5v3"/><path d="M12 3.5v4"/><path d="M16 4.5v3"/><circle cx="7.5" cy="16.5" r=".9"/><circle cx="12" cy="16.5" r=".9"/><circle cx="16.5" cy="16.5" r=".9"/>',
    ring: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.2"/>',
    shield: '<path d="M12 3l7 2.8v5.1a9.4 9.4 0 0 1-7 9.6 9.4 9.4 0 0 1-7-9.6V5.8L12 3z"/><path d="M9 12l2 2 4-4"/>',
    uni: '<path d="M12 3.5L21 8l-9 4.5L3 8l9-4.5z"/><path d="M6.5 10.5V15c0 1.4 2.5 2.5 5.5 2.5s5.5-1.1 5.5-2.5v-4.5"/><path d="M21 8v5"/>',
    co: '<rect x="4" y="9" width="16" height="11" rx="1.5"/><path d="M8.5 9V6.5A1.5 1.5 0 0 1 10 5h4a1.5 1.5 0 0 1 1.5 1.5V9"/>',
    cal: '<rect x="4" y="6" width="16" height="14" rx="2"/><path d="M4 11h16"/><path d="M8 4v3"/><path d="M16 4v3"/>',
    print: '<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
    dl: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/>',
    back: '<path d="M15 18l-6-6 6-6"/>'
  };
  var IC = function (k) { return S(ICONS[k]); };

  function fill(lvl) {
    return (Math.max(0, Math.min(5, Number(lvl) || 0)) / 5) * 100;
  }

  function renderCV() {
    var c = content();
    var id = state.id;
    var links = DATA[id].links || {};
    var cv = document.getElementById("rfCv");
    if (!cv || !c) return;

    /* ---------- meta chips ---------- */
    var meta = "";
    if (c.birth && c.birth !== "-")
      meta += '<span class="rf-meta-chip" data-rf-reveal>' + IC("cake") + "<span><em>" + esc(text("resume.birth")) + "</em> <b>" + esc(c.birth) + "</b></span></span>";
    if (c.marital && c.marital !== "-")
      meta += '<span class="rf-meta-chip" data-rf-reveal>' + IC("ring") + "<span><em>" + esc(text("resume.marital")) + "</em> <b>" + esc(c.marital) + "</b></span></span>";

    /* ---------- summary ---------- */
    var summary = "";
    if (c.summary) {
      summary = '<section class="rf-sec" data-rf-reveal>' +
        '<h2 class="rf-sec-head"><span class="rf-sec-ico">' + IC("user") + "</span>" + esc(text("resume.summary")) + '<i class="rf-sec-line"></i></h2>' +
        '<div class="rf-summary">' + String(c.summary).split("\n\n").map(function (p) {
          return "<p>" + esc(p).replace(/\n/g, "<br>") + "</p>";
        }).join("") + "</div></section>";
    }

    /* ---------- skills ---------- */
    var skills = "";
    if (c.skills && c.skills.length) {
      skills = '<section class="rf-sec" data-rf-reveal>' +
        '<h2 class="rf-sec-head"><span class="rf-sec-ico">' + IC("spark") + "</span>" + esc(text("resume.skills")) + '<i class="rf-sec-line"></i></h2>' +
        '<div class="rf-chips">' + c.skills.map(function (s) { return '<span class="rf-chip">' + esc(s) + "</span>"; }).join("") + "</div></section>";
    }

    /* ---------- timeline builder ---------- */
    function tl(items, sub) {
      if (!items || !items.length) return "";
      return '<div class="rf-timeline">' + items.map(function (it) {
        var subs = sub(it);
        return '<div class="rf-tl" data-rf-reveal>' +
          '<span class="rf-tl-dot"></span>' +
          '<div class="rf-tl-card">' +
          (it.period ? '<span class="rf-tl-period">' + IC("cal") + esc(it.period) + "</span>" : "") +
          '<h3 class="rf-tl-title">' + esc(it.degree || it.title || "") + "</h3>" +
          (subs ? '<div class="rf-tl-sub">' + subs + "</div>" : "") +
          "</div></div>";
      }).join("") + "</div>";
    }
    function tlSub(item) {
      var out = "";
      if (item.university || item.company) {
        out += "<span>" + (item.university ? IC("uni") : IC("co")) + esc(item.university || item.company) + "</span>";
      }
      if (item.city) out += "<span>" + IC("pin") + esc(item.city) + "</span>";
      if (item.gpa) out += "<span>" + IC("spark") + esc(item.gpa) + "</span>";
      return out;
    }

    /* ---------- education / experience / certificates ---------- */
    var edu = "";
    if (c.education && c.education.length) {
      edu = '<section class="rf-sec" data-rf-reveal>' +
        '<h2 class="rf-sec-head"><span class="rf-sec-ico">' + IC("cap") + "</span>" + esc(text("resume.education")) + '<i class="rf-sec-line"></i></h2>' +
        tl(c.education, tlSub) + "</section>";
    }
    var exp = "";
    if (c.experience && c.experience.length) {
      exp = '<section class="rf-sec" data-rf-reveal>' +
        '<h2 class="rf-sec-head"><span class="rf-sec-ico">' + IC("brief") + "</span>" + esc(text("resume.experience")) + '<i class="rf-sec-line"></i></h2>' +
        tl(c.experience, tlSub) + "</section>";
    }

    /* ---------- side: contact ---------- */
    var contact = "";
    if (c.phone || c.email || c.location) {
      var rows = "";
      if (c.phone) rows += '<div class="rf-contact-row"><span class="rf-contact-ico">' + IC("phone") + '</span><span class="rf-contact-val"><em class="rf-contact-lbl">' + esc(text("resume.phone")) + "</em>" + '<span class="ltr">' + esc(c.phone) + "</span></span></div>";
      if (c.email) rows += '<div class="rf-contact-row"><span class="rf-contact-ico">' + IC("mail") + '</span><span class="rf-contact-val"><em class="rf-contact-lbl">' + esc(text("resume.email")) + "</em>" + '<span class="ltr">' + esc(c.email) + "</span></span></div>";
      if (c.location) rows += '<div class="rf-contact-row"><span class="rf-contact-ico">' + IC("pin") + '</span><span class="rf-contact-val"><em class="rf-contact-lbl">' + esc(text("resume.city")) + "</em>" + esc(c.location) + "</span></div>";
      contact = '<div class="rf-card" data-rf-reveal>' +
        '<h3 class="rf-card-head"><span class="rf-card-ico">' + IC("phone") + "</span>" + esc(text("resume.contact")) + "</h3>" +
        '<div class="rf-contact-list">' + rows + "</div></div>";
    }

    /* ---------- side: languages ---------- */
    var langs = "";
    if (c.languages && c.languages.length) {
      var blocks = c.languages.map(function (lg) {
        var lv = [lg.reading, lg.writing, lg.speaking, lg.listening]
          .filter(function (n) { return typeof n === "number"; });
        var avg = lv.length ? (lv.reduce(function (a, b) { return a + b; }, 0) / lv.length) : 0;
        var rows = [
          ["resume.langReading", lg.reading],
          ["resume.langWriting", lg.writing],
          ["resume.langSpeaking", lg.speaking],
          ["resume.langListening", lg.listening]
        ].map(function (r) {
          var lvl = Number(r[1]) || 0;
          return '<div class="rf-lang-skill"><label>' + esc(text(r[0])) + '</label>' +
            '<span class="rf-lang-track"><span class="rf-lang-fill" style="width:' + fill(lvl) + '%"></span></span>' +
            '<span class="rf-lang-val">' + lvl + "/5</span></div>";
        }).join("");
        return '<div class="rf-lang"><div class="rf-lang-name">' + esc(lg.name) + '<span class="rf-lang-level">' + avg.toFixed(1) + " / 5</span></div>" + rows + "</div>";
      }).join("");
      langs = '<div class="rf-card" data-rf-reveal>' +
        '<h3 class="rf-card-head"><span class="rf-card-ico">' + IC("glob") + "</span>" + esc(text("resume.languages")) + "</h3>" +
        blocks + "</div>";
    }

    /* ---------- side: links ---------- */
    var linkHtml = "";
    if (c.website || links.linkedin) {
      var btns = "";
      if (c.website)
        btns += '<a class="rf-link-btn site" href="' + esc(url(c.website)) + '" target="_blank" rel="noopener">' + IC("glob") +
          '<span>' + esc(text("resume.website")) + '<em class="rf-link-cap">' + esc(c.website) + "</em></span></a>";
      if (links.linkedin)
        btns += '<a class="rf-link-btn in" href="' + esc(url(links.linkedin)) + '" target="_blank" rel="noopener">' + IC("linkin") +
          '<span>' + esc(text("resume.linkedin")) + '<em class="rf-link-cap">LinkedIn</em></span></a>';
      linkHtml = '<div class="rf-card" data-rf-reveal>' +
        '<h3 class="rf-card-head"><span class="rf-card-ico">' + IC("linkin") + "</span>" + esc(text("resume.links")) + "</h3>" +
        '<div class="rf-links">' + btns + "</div></div>";
    }

    /* ---------- assemble ---------- */
    /* ---------- stats band ---------- */
    function statCard(icon, num, cap, small) {
      return '<div class="rf-stat" data-rf-reveal>' +
        '<span class="rf-stat-icon">' + icon + "</span>" +
        '<span class="rf-stat-info"><b class="rf-stat-num">' + num + (small ? "<small>" + esc(small) + "</small>" : "") + "</b>" +
        '<span class="rf-stat-cap">' + esc(cap) + "</span></span></div>";
    }
    var stats = "";
    if (c.education && c.education.length)
      stats += statCard(IC("cap"), c.education.length, text("resume.education"));
    if (c.experience && c.experience.length)
      stats += statCard(IC("brief"), c.experience.length, text("resume.experience"));
    if (c.skills && c.skills.length)
      stats += statCard(IC("spark"), c.skills.length, text("resume.skills"));
    if (c.languages && c.languages.length) {
      var lg0 = c.languages[0];
      var lv0 = [lg0.reading, lg0.writing, lg0.speaking, lg0.listening]
        .filter(function (n) { return typeof n === "number"; });
      var avg0 = lv0.length ? (lv0.reduce(function (a, b) { return a + b; }, 0) / lv0.length) : 0;
      stats += statCard(IC("glob"), avg0.toFixed(1), lg0.name, "/ 5");
    }

    /* ---------- assemble ---------- */
    cv.innerHTML =
      '<div class="rf-hero">' +
        '<div class="rf-hero-photo" data-rf-reveal>' +
          '<div class="rf-photo-shell"><img src="' + esc(DATA[id].photo) + '" alt="' + esc(c.name) + '" loading="eager"></div>' +
        "</div>" +
        '<div class="rf-hero-info">' +
          '<p class="rf-eyebrow">' + esc(c.role) + "</p>" +
          '<h1 class="rf-name">' + esc(c.name) + "</h1>" +
          (meta ? '<div class="rf-meta">' + meta + "</div>" : "") +
        "</div>" +
      "</div>" +
      (stats ? '<div class="rf-stats">' + stats + "</div>" : "") +
      '<div class="rf-body">' +
        '<main class="rf-main">' + summary + skills + edu + exp + "</main>" +
        '<aside class="rf-side">' + contact + langs + linkHtml + "</aside>" +
      "</div>";

    var backWrap = document.getElementById("rfBackWrap");
    if (backWrap) {
      backWrap.innerHTML =
        '<div class="rf-actions">' +
          '<a class="rf-back" href="index.html#team">' + IC("back") + esc(text("resume.back")) + "</a>" +
          '<button type="button" class="rf-action" id="rfPrintBtn">' + IC("print") + esc(text("resume.print")) + "</button>" +
        "</div>";
      var printBtn = backWrap.querySelector("#rfPrintBtn");
      if (printBtn) printBtn.addEventListener("click", function () { window.print(); });
    }
    var h = document.querySelector(".pouyab-header");
    if (h) {
      var b = h.querySelector('[href^="index.html#team"]');
      if (b) b.classList.add("is-current");
    }
    document.title = c.name + " — " + text("resume.bio") + " | پویاب";
  }

  function releaseObservers() {
    observers.forEach(function (o) { o.disconnect(); });
    observers = [];
  }

  function bindEffects() {
    releaseObservers();
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
        });
      }, { threshold: 0.1, rootMargin: "0px 0px -20px 0px" });
      var els = document.querySelectorAll("[data-rf-reveal]");
      for (var i = 0; i < els.length; i++) io.observe(els[i]);
      observers.push(io);
    } else {
      var fell = document.querySelectorAll("[data-rf-reveal]");
      for (var k = 0; k < fell.length; k++) fell[k].classList.add("is-in");
    }
  }

  function bindChrome() {
    var bar = document.getElementById("rfProgress");
    window.addEventListener("scroll", function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      if (bar) bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    }, { passive: true });
    var header = document.querySelector(".pouyab-header");
    var burger = document.getElementById("pouyabBurger");
    function onScroll() { if (header) header.classList.toggle("is-scrolled", window.scrollY > 10); }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    if (burger && header) {
      burger.addEventListener("click", function () {
        var open = header.classList.toggle("open");
        burger.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
    var anchors = document.querySelectorAll('a[href^="#"]');
    for (var ai = 0; ai < anchors.length; ai++) {
      (function (a) {
        a.addEventListener("click", function (e) {
          var target = document.querySelector(this.getAttribute("href"));
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            if (header && header.classList.contains("open")) {
              header.classList.remove("open");
              if (burger) burger.setAttribute("aria-expanded", "false");
            }
          }
        });
      })(anchors[ai]);
    }
  }

  function hideLoader() {
    var ld = document.getElementById("rfLoader");
    if (ld && !ld.classList.contains("is-done")) {
      setTimeout(function () { ld.classList.add("is-done"); }, 250);
    }
  }

  function renderAll() {
    state = initState();
    if (!DATA[state.id]) return;
    renderCV();
    bindEffects();
    hideLoader();
  }

  window.POUYAB_AFTER_LANG = renderAll;

  function boot() {
    bindChrome();
    renderAll();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();