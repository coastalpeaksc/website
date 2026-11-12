/* Coastal Peak Elite Services — website behavior. Content comes from site-config.js. */
(function () {
  "use strict";
  var S = window.SITE || {};

  var ICON = {
    phone: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 6 9 7 9-7"/>'
  };
  function svg(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[name] + "</svg>";
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function $$(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  function tel() {
    var d = String(S.phone || "").replace(/[^\d+]/g, "");
    if (d.charAt(0) !== "+") d = (d.length === 10 ? "+1" : "+") + d;
    return "tel:" + d;
  }
  function ig() { return "https://www.instagram.com/" + String(S.instagram || "").replace(/^@/, "") + "/"; }
  function fb() {
    var f = String(S.facebook || "").trim();
    return /^https?:/i.test(f) ? f : "https://www.facebook.com/" + f.replace(/^(www\.)?facebook\.com\//i, "");
  }

  /* ---------- Text, links, icons ---------- */
  $$("[data-text]").forEach(function (el) { el.textContent = S[el.getAttribute("data-text")] || ""; });
  $$("[data-icon]").forEach(function (el) { el.outerHTML = svg(el.getAttribute("data-icon")); });
  $$("[data-tel]").forEach(function (el) { el.href = tel(); });
  $$("[data-mail]").forEach(function (el) { el.href = "mailto:" + S.email; });
  $$("[data-ig]").forEach(function (el) { el.href = ig(); if (!el.textContent) el.textContent = "@" + String(S.instagram).replace(/^@/, ""); });
  $$("[data-fb]").forEach(function (el) { el.href = fb(); if (!el.textContent) el.textContent = fb().replace(/^https?:\/\/(www\.)?/, ""); });
  $$("[data-card]").forEach(function (el) { el.href = S.cardUrl; });
  if (!S.instagram) $$("[data-ig]").forEach(function (el) { (el.closest("li") || el).remove(); });
  if (!S.facebook) $$("[data-fb]").forEach(function (el) { (el.closest("li") || el).remove(); });
  if (!S.cardUrl) $$("[data-card]").forEach(function (el) { (el.closest("li") || el).remove(); });

  $$("[data-list]").forEach(function (el) {
    el.innerHTML = (S[el.getAttribute("data-list")] || []).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
  });

  function num(i) { return String(i + 1).padStart(2, "0"); }

  document.getElementById("services-list").innerHTML = (S.services || []).map(function (s, i) {
    return '<li class="service"><span class="num">' + num(i) + '</span><h3 class="h3">' + esc(s.title) + "</h3><p>" + esc(s.description) + "</p></li>";
  }).join("");

  document.getElementById("steps-list").innerHTML = (S.buildersSteps || []).map(function (s, i) {
    return '<li class="step"><span class="num">' + num(i) + '</span><div><h3 class="h3">' + esc(s.title) + "</h3><p>" + esc(s.description) + "</p></div></li>";
  }).join("");

  document.getElementById("why-list").innerHTML = (S.why || []).map(function (s) {
    return '<div class="why__item"><h3 class="h3">' + esc(s.title) + "</h3><p>" + esc(s.description) + "</p></div>";
  }).join("");

  document.getElementById("serviceSelect").innerHTML = (S.formServices || []).map(function (s) {
    return "<option>" + esc(s) + "</option>";
  }).join("");

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Mobile menu ---------- */
  var btn = document.getElementById("menuBtn"), nav = document.getElementById("nav");
  btn.addEventListener("click", function () {
    var open = document.body.classList.toggle("menu-open");
    btn.setAttribute("aria-expanded", open);
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { document.body.classList.remove("menu-open"); btn.setAttribute("aria-expanded", "false"); }
  });

  /* ---------- Header state + call bar ---------- */
  var header = document.getElementById("header"), callbar = document.getElementById("callbar");
  function onScroll() {
    var y = window.scrollY || 0;
    header.classList.toggle("is-scrolled", y > 24);
    callbar.classList.toggle("is-visible", y > window.innerHeight * 0.6);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Estimate form -> email ---------- */
  var form = document.getElementById("estimateForm"), err = document.getElementById("formError");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = form.elements;
    if (!f.name.value.trim() || !f.phone.value.trim()) { err.hidden = false; (f.name.value.trim() ? f.phone : f.name).focus(); return; }
    err.hidden = true;
    var subject = "Estimate request: " + f.service.value + " — " + f.name.value.trim();
    var body = [
      "Name: " + f.name.value.trim(),
      "Phone: " + f.phone.value.trim(),
      "Email: " + f.email.value.trim(),
      "City: " + f.city.value.trim(),
      "Service: " + f.service.value,
      "I am a: " + f.client.value,
      "",
      "Project details:",
      f.details.value.trim()
    ].join("\n");
    location.href = "mailto:" + S.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  });
})();
