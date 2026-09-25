const test = require("node:test");
const assert = require("node:assert/strict");
const { FakeElement, FakeStorage, createApp, event, click, submit } = require("./harness");

const dashboard = (app) => app.document.querySelector("#view-dashboard").innerHTML;
const backlog = (app) => app.document.querySelector("#view-backlog").innerHTML;
const wishlist = (app) => app.document.querySelector("#view-wishlist").innerHTML;

test("initial load renders the dashboard, seeded data, counts, and AI recommendation", () => {
  const app = createApp(); const state = app.api.getState();
  assert.equal(app.api.getActiveView(), "dashboard"); assert.match(dashboard(app), /Make time for/); assert.match(dashboard(app), /Wishlist snapshot/); assert.match(dashboard(app), /TUNIC/);
  assert.equal(state.games.length, 14); assert.equal(state.games.filter((item) => !item.wishlist).length, 8); assert.equal(state.games.filter((item) => item.wishlist).length, 6);
  assert.equal(app.document.querySelector("#nav-backlog-count").textContent, "6"); assert.equal(app.document.querySelector("#nav-wishlist-count").textContent, "6"); assert.match(wishlist(app), /R\$/);
});

test("every sidebar menu link changes the active view, title, hash, and panel", () => {
  const app = createApp(); const expected = { dashboard: "Overview", backlog: "Backlog", wishlist: "Wishlist", played: "Recently played", genres: "Genre pulse" };
  for (const [view, title] of Object.entries(expected)) { click(app, app.document.navItems.find((item) => item.dataset.view === view)); assert.equal(app.api.getActiveView(), view); assert.equal(app.window.location.hash, view); assert.equal(app.document.querySelector("#page-title").textContent, title); assert.ok(app.document.querySelector(`#view-${view}`).classList.contains("active")); }
});

test("cross-view links from dashboard route to backlog, wishlist, played, and genres", () => {
  const app = createApp(); for (const view of ["backlog", "wishlist", "played", "genres"]) { click(app, new FakeElement("button", { "data-view-target": view })); assert.equal(app.api.getActiveView(), view); }
});

test("backlog search filters loaded games and backlog status filters show the correct subset", () => {
  const app = createApp(); app.api.switchView("backlog"); const search = app.document.querySelector("#backlog-search"); search.value = "hades"; search.dispatchEvent(event("input", search)); assert.match(backlog(app), /Hades/); assert.doesNotMatch(backlog(app), /COCOON/); search.value = ""; search.dispatchEvent(event("input", search));
  const playedFilter = app.document.querySelectorAll("[data-filter]").find((item) => item.dataset.filter === "played"); playedFilter.dispatchEvent(event("click", playedFilter)); assert.equal(app.api.getBacklogFilter(), "played"); assert.match(backlog(app), /Outer Wilds/); assert.doesNotMatch(backlog(app), /Sable/);
});

test("backlog sort controls change ordering for dashboard and full backlog", () => {
  const app = createApp(); app.api.switchView("backlog"); const sort = app.document.querySelector("#backlog-sort"); sort.value = "title"; sort.dispatchEvent(event("change", sort)); assert.match(backlog(app), /Baldur’s Gate 3[\s\S]*COCOON/); assert.equal(sort.value, "title");
  app.api.switchView("dashboard"); const dashboardSort = app.document.querySelector("#dashboard-sort"); dashboardSort.value = "hours"; dashboardSort.dispatchEvent(event("change", dashboardSort)); assert.equal(dashboardSort.value, "hours"); assert.match(dashboard(app), /Hades/);
});

test("played toggle updates status, last played date, counts, and rendered row", () => {
  const app = createApp(); const before = app.api.getState().games.find((item) => item.id === "sable"); assert.equal(before.status, "backlog"); click(app, new FakeElement("button", { "data-action": "toggle-played", "data-id": "sable" })); const after = app.api.getState().games.find((item) => item.id === "sable"); assert.equal(after.status, "played"); assert.equal(after.lastPlayed, "2026-09-25"); assert.equal(app.document.querySelector("#sidebar-played-percent").textContent, "38"); click(app, new FakeElement("button", { "data-action": "toggle-played", "data-id": "sable" })); assert.equal(app.api.getState().games.find((item) => item.id === "sable").status, "backlog");
});

test("wishlist sorting supports price, title, and AI ranking with an explainable signal", () => {
  const app = createApp(); app.api.switchView("wishlist"); const select = app.document.querySelector("#wishlist-sort"); select.value = "price"; select.dispatchEvent(event("change", select)); assert.equal(app.api.getWishlistSort(), "price"); assert.match(wishlist(app), /Lowest price/); assert.match(wishlist(app), /AI ranking is a lightweight signal/);
  click(app, new FakeElement("button", { "data-action": "sort-ai" })); assert.equal(app.api.getWishlistSort(), "ai"); assert.match(wishlist(app), /Ranked for you/); assert.match(wishlist(app), /logged the most time/);
});

test("add-game modal creates a library game and a wishlist game with correct fields", () => {
  const app = createApp(); click(app, new FakeElement("button", { "data-action": "open-modal", "data-modal": "game" })); assert.equal(app.document.querySelector("#modal-backdrop").hidden, false); assert.match(app.document.querySelector("#modal").innerHTML, /Add a game/); submit(app, { title: "The Forgotten City", genre: "Adventure", price: "79.90", status: "backlog", hours: "0" }); let added = app.api.getState().games.find((item) => item.title === "The Forgotten City"); assert.ok(added); assert.equal(added.wishlist, false); assert.equal(added.price, 79.9);
  click(app, new FakeElement("button", { "data-action": "open-modal", "data-modal": "game" })); submit(app, { title: "Pacific Drive", genre: "Survival", price: "109.90", status: "wishlist", hours: "0" }); added = app.api.getState().games.find((item) => item.title === "Pacific Drive"); assert.equal(added.wishlist, true); assert.equal(added.status, "wishlist"); assert.match(wishlist(app), /Pacific Drive/);
});

test("session modal logs a session, updates hours and status, and feeds genre analysis", () => {
  const app = createApp(); click(app, new FakeElement("button", { "data-action": "open-modal", "data-modal": "session" })); assert.match(app.document.querySelector("#modal").innerHTML, /Log a play session/); const before = app.api.getState(); const sableBefore = before.games.find((item) => item.id === "sable").hours; submit(app, { gameId: "sable", date: "2026-09-25", hours: "2.5", note: "A focused evening." }); const after = app.api.getState(); assert.equal(after.sessions.length, before.sessions.length + 1); assert.equal(after.games.find((item) => item.id === "sable").hours, sableBefore + 2.5); assert.equal(after.games.find((item) => item.id === "sable").status, "in-progress"); assert.match(app.document.querySelector("#view-played").innerHTML, /A focused evening/);
});

test("modal closes from close action, backdrop click, and Escape", () => {
  const app = createApp(); click(app, new FakeElement("button", { "data-action": "open-modal", "data-modal": "game" })); click(app, new FakeElement("button", { "data-action": "close-modal" })); assert.equal(app.document.querySelector("#modal-backdrop").hidden, true); click(app, new FakeElement("button", { "data-action": "open-modal", "data-modal": "game" })); app.document.querySelector("#modal-backdrop").dispatchEvent(event("click", app.document.querySelector("#modal-backdrop"))); assert.equal(app.document.querySelector("#modal-backdrop").hidden, true); click(app, new FakeElement("button", { "data-action": "open-modal", "data-modal": "game" })); app.document.dispatchEvent(event("keydown", app.document, { key: "Escape" })); assert.equal(app.document.querySelector("#modal-backdrop").hidden, true);
});

test("mobile sidebar opens and closes through both controls", () => {
  const app = createApp(); const sidebar = app.document.querySelector("#sidebar"); app.document.querySelector("#open-sidebar").dispatchEvent(event("click", app.document.querySelector("#open-sidebar"))); assert.ok(sidebar.classList.contains("open")); app.document.querySelector("#close-sidebar").dispatchEvent(event("click", app.document.querySelector("#close-sidebar"))); assert.equal(sidebar.classList.contains("open"), false);
});

test("keyboard shortcuts navigate to all views", () => {
  const app = createApp(); for (const [key, view] of [["1", "dashboard"], ["2", "backlog"], ["3", "wishlist"], ["4", "played"], ["5", "genres"]]) { app.document.dispatchEvent(event("keydown", app.document, { key, ctrlKey: true })); assert.equal(app.api.getActiveView(), view); }
});

test("theme toggle updates the document and persists the preference", () => {
  const app = createApp(); assert.equal(app.document.body.dataset.theme, "light"); app.document.querySelector("#theme-toggle").dispatchEvent(event("click", app.document.querySelector("#theme-toggle"))); assert.equal(app.document.body.dataset.theme, "dark"); const saved = JSON.parse(app.storage.getItem("steam-log-state-v1")); assert.equal(saved.theme, "dark"); app.document.querySelector("#theme-toggle").dispatchEvent(event("click", app.document.querySelector("#theme-toggle"))); assert.equal(app.document.body.dataset.theme, "light");
});

test("state survives a fresh app load through localStorage", () => {
  const storage = new FakeStorage(); const first = createApp({ storage }); click(first, new FakeElement("button", { "data-action": "toggle-played", "data-id": "sable" })); const second = createApp({ storage }); assert.equal(second.api.getState().games.find((item) => item.id === "sable").status, "played");
});

test("deep-link hash opens the requested view on initial load", () => {
  const app = createApp({ hash: "#wishlist" }); assert.equal(app.api.getActiveView(), "wishlist"); assert.ok(app.document.querySelector("#view-wishlist").classList.contains("active"));
});
