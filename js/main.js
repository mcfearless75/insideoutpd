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
