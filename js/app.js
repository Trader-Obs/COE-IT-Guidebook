(function () {
  "use strict";

  var $ = function (s) { return document.querySelector(s); };

  var ICONS = {
    power: '<path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.8 0"/>',
    wifi: '<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><path d="M12 20h.01"/>',
    gauge: '<path d="M12 14l4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
    monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>',
    box: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.3 7L12 12l8.7-5"/><path d="M12 22V12"/>',
    printer: '<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
    key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="M11.4 11.6L21 2"/><path d="M16 7l3 3"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4"/><path d="M15.4 6.5l-6.8 4"/>'
  };

  function icon(name) {
    return '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || "") + "</svg>";
  }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  var problem = null;
  var nodeId = "start";
  var history = [];   // [{ id, answer }]  answer: "Yes" | "No" | "Fixed" | "Still not working"

  /* ---------- home ---------- */
  function renderTiles(filter) {
    var f = (filter || "").trim().toLowerCase();
    var ul = $("#tiles");
    ul.innerHTML = "";
    var shown = 0;
    window.PROBLEMS.forEach(function (p) {
      var hay = (p.title + " " + p.blurb + " " + p.keywords).toLowerCase();
      if (f && !f.split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; })) return;
      shown++;
      var li = document.createElement("li");
      var b = document.createElement("button");
      b.type = "button";
      b.className = "tile";
      b.innerHTML = '<span class="ico">' + icon(p.icon) + '</span><span class="tt">' + esc(p.title) + '</span><span class="tb">' + esc(p.blurb) + "</span>";
      b.addEventListener("click", function () { startProblem(p); });
      li.appendChild(b);
      ul.appendChild(li);
    });
    $("#none").hidden = shown !== 0;
  }

  function showHome() {
    problem = null;
    $("#guide-view").hidden = true;
    $("#home-view").hidden = false;
    window.scrollTo(0, 0);
  }

  /* ---------- guide ---------- */
  function startProblem(p) {
    problem = p;
    nodeId = "start";
    history = [];
    $("#home-view").hidden = true;
    $("#guide-view").hidden = false;
    $("#gTitle").textContent = p.title;
    render();
    window.scrollTo(0, 0);
  }

  function go(answer, next) {
    history.push({ id: nodeId, answer: answer });
    nodeId = next;
    render();
  }

  function undo() {
    if (!history.length) return;
    var last = history.pop();
    nodeId = last.id;
    render();
  }

  function render() {
    var n = problem.nodes[nodeId];
    renderTrail();
    var card = $("#card");
    var undoBtn = history.length ? '<button type="button" class="linkish" id="undo">Go back one step</button>' : "";

    if (n.t === "q") {
      card.className = "card";
      card.innerHTML =
        '<p class="kind">Question</p>' +
        '<h2>' + esc(n.text) + '</h2>' +
        (n.hint ? '<p class="hint">' + esc(n.hint) + '</p>' : "") +
        '<div class="btns"><button type="button" class="btn primary" id="yes">Yes</button><button type="button" class="btn" id="no">No</button></div>' +
        undoBtn;
      $("#yes").addEventListener("click", function () { go("Yes", n.yes); });
      $("#no").addEventListener("click", function () { go("No", n.no); });
    } else if (n.t === "step") {
      card.className = "card";
      card.innerHTML =
        '<p class="kind">Try this</p>' +
        '<h2>' + esc(n.text) + '</h2>' +
        '<p class="hint">When you have done it, check if the problem is gone.</p>' +
        '<div class="btns"><button type="button" class="btn primary" id="ok">That fixed it</button><button type="button" class="btn" id="fail">Still not working</button></div>' +
        undoBtn;
      $("#ok").addEventListener("click", function () { go("That fixed it", n.ok); });
      $("#fail").addEventListener("click", function () { go("Still not working", n.fail); });
    } else {
      renderEnd(n, undoBtn);
    }
    var u = $("#undo");
    if (u) u.addEventListener("click", undo);
    $("#card").scrollIntoView({ block: "nearest", behavior: "auto" });
    var h = card.querySelector("h2");
    if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
  }

  function renderTrail() {
    var ol = $("#trail");
    ol.innerHTML = "";
    history.forEach(function (h) {
      var node = problem.nodes[h.id];
      var li = document.createElement("li");
      li.innerHTML = '<span class="tq">' + esc(shorten(node.text, 70)) + '</span><span class="ta">' + esc(h.answer) + "</span>";
      ol.appendChild(li);
    });
  }

  function shorten(t, n) { return t.length > n ? t.slice(0, n - 1).replace(/\s+\S*$/, "") + "..." : t; }

  function renderEnd(n, undoBtn) {
    var card = $("#card");
    if (n.status === "fixed") {
      card.className = "card done";
      card.innerHTML =
        '<p class="kind">Solved</p><h2>' + esc(n.title) + '</h2><p>' + esc(n.text) + '</p>' +
        '<div class="btns"><button type="button" class="btn primary" id="another">Fix something else</button><button type="button" class="btn" id="again">Start this guide again</button></div>' +
        undoBtn;
      $("#another").addEventListener("click", showHome);
      $("#again").addEventListener("click", function () { startProblem(problem); });
      return;
    }
    card.className = "card report";
    card.innerHTML =
      '<p class="kind">Needs the ICT unit</p><h2>' + esc(n.title) + '</h2><p>' + esc(n.text) + '</p>' +
      '<div class="contact"><b>' + esc(window.CONTACT.unit) + '</b><br>' + esc(window.CONTACT.how) + '</div>' +
      '<h3>What to tell them</h3>' +
      '<div class="fields">' +
        '<label>Room or computer number<input id="loc" type="text" maxlength="40" placeholder="e.g. Lab 2, PC 14"></label>' +
        '<label>Your name<input id="who" type="text" maxlength="40" placeholder="optional"></label>' +
      '</div>' +
      '<textarea id="report" readonly rows="10" aria-label="Report text"></textarea>' +
      '<div class="btns"><button type="button" class="btn primary" id="copy">Copy report</button><button type="button" class="btn" id="another">Fix something else</button></div>' +
      '<p id="copied" class="copied" hidden>Copied. Paste it into a message or show it to the ICT staff.</p>' +
      undoBtn;
    function build() {
      var lines = ["IT support request", "Problem: " + problem.title];
      var loc = $("#loc").value.trim(), who = $("#who").value.trim();
      if (loc) lines.push("Where: " + loc);
      if (who) lines.push("From: " + who);
      lines.push("", "What I already tried:");
      history.forEach(function (h) {
        var node = problem.nodes[h.id];
        lines.push("- " + node.text + " (" + h.answer + ")");
      });
      lines.push("", "Result: still needs help. " + n.title + ".");
      $("#report").value = lines.join("\n");
    }
    build();
    $("#loc").addEventListener("input", build);
    $("#who").addEventListener("input", build);
    $("#another").addEventListener("click", showHome);
    $("#copy").addEventListener("click", function () {
      var t = $("#report");
      var done = function () { $("#copied").hidden = false; };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(t.value).then(done, function () { t.select(); document.execCommand("copy"); done(); });
      } else {
        t.removeAttribute("readonly"); t.select(); document.execCommand("copy"); t.setAttribute("readonly", ""); done();
      }
    });
  }

  /* ---------- wiring ---------- */
  $("#q").addEventListener("input", function (e) { renderTiles(e.target.value); });
  $("#allBtn").addEventListener("click", showHome);
  $("#home").addEventListener("click", function (e) { e.preventDefault(); showHome(); });
  renderTiles("");
})();
