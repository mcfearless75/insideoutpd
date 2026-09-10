/* Inside Out PD — site scripts (no dependencies) */
(function () {
  "use strict";

  /* Mobile nav toggle */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".primary-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Footer year */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Header shadow once the page has scrolled */
  var header = document.querySelector(".site-header");
  if (header) {
    var setScrolled = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    setScrolled();
    window.addEventListener("scroll", setScrolled, { passive: true });
  }

  var prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Scroll reveal — fade/rise elements into view once, staggered within their group */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      // Stagger siblings that reveal together (same parent) by DOM order
      var seenParents = new Map();
      revealEls.forEach(function (el) {
        var parent = el.parentElement;
        var idx = seenParents.get(parent) || 0;
        el.style.setProperty("--reveal-delay", Math.min(idx * 0.08, 0.4) + "s");
        seenParents.set(parent, idx + 1);
      });

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* Animated stat counters (6, 5, 100 → count up once visible) */
  var counters = document.querySelectorAll("[data-count-to]");
  if (counters.length) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      // leave static text as authored
    } else {
      var animateCount = function (el) {
        var target = parseFloat(el.getAttribute("data-count-to"));
        var suffix = el.getAttribute("data-count-suffix") || "";
        var duration = 900;
        var start = null;
        var from = 0;
        function step(ts) {
          if (start === null) start = ts;
          var progress = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          var value = Math.round(from + (target - from) * eased);
          el.textContent = value + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      };
      var countIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countIo.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { countIo.observe(el); });
    }
  }

  /* Gallery filtering (progressive enhancement — all items show without JS) */
  var filterBar = document.querySelector(".gallery-filter");
  if (filterBar) {
    var buttons = filterBar.querySelectorAll("button");
    var items = document.querySelectorAll(".gallery-item");
    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      buttons.forEach(function (b) { b.classList.remove("is-active"); b.setAttribute("aria-pressed", "false"); });
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");
      var filter = btn.getAttribute("data-filter");
      items.forEach(function (item) {
        var match = filter === "all" || item.getAttribute("data-category") === filter;
        item.style.display = match ? "" : "none";
      });
    });
  }

  /* Contact form: progressive enhancement over Formspree.
     Falls back to a normal POST + redirect if JS/fetch is unavailable. */
  var form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      // Honeypot spam trap
      var honeypot = form.querySelector('input[name="_gotcha"]');
      if (honeypot && honeypot.value) {
        e.preventDefault();
        return;
      }

      if (!window.fetch) return; // let native form submission handle it

      e.preventDefault();
      var status = form.querySelector(".form-status");
      var submitBtn = form.querySelector('button[type="submit"]');
      var data = new FormData(form);

      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending…"; }
      if (status) { status.textContent = ""; status.removeAttribute("data-state"); }

      fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          if (response.ok) {
            form.reset();
            if (status) {
              status.textContent = "Thanks — your message has been sent. We'll be in touch within one business day.";
              status.setAttribute("data-state", "success");
            }
          } else {
            return response.json().then(function (json) {
              throw new Error((json && json.error) || "Something went wrong.");
            });
          }
        })
        .catch(function () {
          if (status) {
            status.textContent = "Sorry, something went wrong sending your message. Please call or email us directly.";
            status.setAttribute("data-state", "error");
          }
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Send message"; }
        });
    });
  }
})();
