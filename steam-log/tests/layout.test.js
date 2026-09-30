const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");

test("the page declares the Steam-style shell and shelf layout contract", () => {
  assert.match(html, /<body class="steam-shell" data-layout="steam">/);
  assert.match(html, /<header class="topbar steam-header">/);
  assert.match(html, /class="steam-header-nav"/);
  assert.match(app, /class="hero hero-shelf"/);
  assert.match(app, /class="stats-grid shelf-grid"/);
});

test("the horizontal library navigation exposes every primary view", () => {
  for (const view of ["dashboard", "wishlist", "backlog", "genres"]) {
    assert.match(html, new RegExp(`class="steam-nav-link[^"]*"[^>]*data-view="${view}"`));
  }
  assert.doesNotMatch(html, /class="steam-nav-link[^"]*"[^>]*data-view="played"/);
});

test("Steam visual tokens and responsive layout rules exist", () => {
  assert.match(css, /--steam-blue:/);
  assert.match(css, /--steam-deep:/);
  assert.match(css, /body\.steam-shell\[data-theme="light"\]/);
  assert.match(css, /body\.steam-shell\[data-theme="dark"\]/);
  assert.match(css, /\.steam-shell/);
  assert.match(css, /\.steam-header-nav/);
  assert.match(css, /\.shelf-grid/);
  assert.match(css, /body\.steam-shell \.sidebar \{ display: none; \}/);
  assert.match(css, /body\.steam-shell \.main-content \{ width: 100%; \}/);
  assert.match(css, /@media \(max-width:760px\)/);
});

test("the library table keeps readable alignment and game-first sizing", () => {
  assert.match(css, /body\.steam-shell \.full-table thead/);
  assert.match(css, /body\.steam-shell \.full-table th \{ padding:/);
  assert.match(css, /body\.steam-shell \.full-table th:first-child/);
  assert.match(css, /body\.steam-shell \.full-table td:first-child/);
  assert.match(css, /body\.steam-shell \.full-table \.game-cover \{ width: 48px; height: 60px;/);
  assert.match(css, /body\.steam-shell \.full-table \.game-cell strong \{[^}]*font-family: var\(--sans\)/);
  assert.match(css, /body\.steam-shell \.wish-grid-item \.game-cover \{ width: 64px; height: 78px;/);
});

test("the logo context is visually distinct from the clickable section navigation", () => {
  assert.match(html, /<span class="steam-header-context">YOUR GAME SPACE<\/span>/);
  assert.doesNotMatch(html, /steam-header-tag/);
  assert.match(css, /\.steam-header-context \{[^}]*border:/);
  assert.match(css, /\.steam-header-context \{[^}]*text-transform: uppercase/);
});

test("the comfort visual system avoids mono typography and keeps game listings image-led", () => {
  const monoFont = ["DM", "Mono"].join(" ");
  assert.doesNotMatch(html, new RegExp(monoFont));
  assert.doesNotMatch(css, new RegExp(monoFont));
  assert.match(app, /<img class="game-cover-image"/);
  assert.match(app, /cover\(item, "activity-cover"\)/);
  assert.match(app, /cover\(item, "session-cover"\)/);
  assert.match(css, /body\.steam-shell \.game-cover-image \{[^}]*width: 100%/);
  assert.match(css, /body\.steam-shell \.table td \{[^}]*font-size: 12px/);
  assert.match(css, /body\.steam-shell \.wishlist-snapshot-copy span \{[^}]*font-size: 11px/);
});

test("the home wishlist snapshot has a dedicated card treatment", () => {
  assert.match(app, /wishlist-snapshot-item/);
  assert.match(app, /wishlist-snapshot-price/);
  assert.match(css, /body\.steam-shell \.wish-list, body\.steam-shell \.wishlist-snapshot-list/);
  assert.match(css, /body\.steam-shell \.wishlist-snapshot-item/);
  assert.match(css, /body\.steam-shell \.wishlist-snapshot-cover/);
});

test("the dashboard promotes activity history and rhythm as a first-class highlight", () => {
  assert.match(app, /dashboard-activity-highlight/);
  assert.match(app, /dashboard-activity-heatmap/);
  assert.match(app, /data-view-target="played"[^>]*>View activity/);
  assert.match(css, /body\.steam-shell \.dashboard-activity-highlight/);
  assert.match(css, /body\.steam-shell \.dashboard-activity-heatmap/);
  assert.match(css, /dashboard-activity-highlight \{[^}]*grid-template-columns: minmax\(250px,\.78fr\) minmax\(0,2\.22fr\)/);
  assert.match(css, /body\.steam-shell \.dashboard-activity-history \{ display: none; \}/);
  assert.match(css, /body\.steam-shell \.dashboard-grid \.activity-card \{ display: none; \}/);
  assert.match(app, /Array\.from\(\{ length: 364 \}/);
  assert.match(css, /dashboard-activity-heatmap \.heatmap \{ grid-template-columns: repeat\(52,/);
  assert.match(app, /data-hours="/);
  assert.match(app, /data-date="/);
  assert.match(app, /Less/);
  assert.match(app, /More/);
  assert.match(css, /dashboard-activity-legend/);
});

test("the home browsing columns stay visually aligned", () => {
  assert.match(css, /body\.steam-shell \.dashboard-grid \{[^}]*align-items: stretch/);
  assert.match(css, /body\.steam-shell \.dashboard-left \{[^}]*grid-template-rows: minmax\(0,1fr\)/);
  assert.match(css, /body\.steam-shell \.dashboard-left \.backlog-card \{[^}]*height: 100%/);
  assert.match(css, /body\.steam-shell \.dashboard-right \{[^}]*grid-template-rows: minmax\(0,1fr\) minmax\(0,1fr\)/);
});

test("activity graph uses an accessible styled tooltip and weekday guide", () => {
  assert.match(app, /dashboard-activity-tooltip/);
  assert.match(app, /pointerover/);
  assert.match(app, /focusin/);
  assert.doesNotMatch(app, /data-date=\"\$\{date\.toISOString\(\)\.slice\(0, 10\)\}\" title=/);
  assert.match(app, /Mon/);
  assert.match(app, /Wed/);
  assert.match(app, /Fri/);
  assert.match(css, /body\.steam-shell \.dashboard-activity-weekdays/);
  assert.match(css, /body\.steam-shell \.dashboard-activity-tooltip/);
});

test("library browsing uses spacious rows and visible sorting controls", () => {
  assert.match(css, /body\.steam-shell \.backlog-card \.game-cover \{ width: 52px; height: 68px;/);
  assert.match(css, /body\.steam-shell \.backlog-card \.table td \{[^}]*padding-top: 20px/);
  assert.match(css, /body\.steam-shell \.library-card \.game-cover \{ width: 58px; height: 74px;/);
  assert.match(css, /body\.steam-shell \.compact-select \{[^}]*appearance: none/);
  assert.match(css, /body\.steam-shell \.compact-select \{[^}]*padding-right: 34px/);
});

test("wishlist insights are consolidated and visually emphasized", () => {
  assert.match(app, /wishlist-insights/);
  assert.match(app, /const mainEnd = sideStart - 6/);
  assert.match(css, /body\.steam-shell \.wishlist-insights/);
  assert.match(css, /body\.steam-shell \.wishlist-insights-price/);
  assert.match(css, /body\.steam-shell \.wishlist-insights-genre/);
  assert.match(css, /body\.steam-shell \.wishlist-main > \.wishlist-insights/);
});

test("wishlist game cards give genre and price distinct visual emphasis", () => {
  assert.match(app, /wish-genre/);
  assert.match(app, /wish-price/);
  assert.match(css, /body\.steam-shell \.wish-grid-item \.wish-genre/);
  assert.match(css, /body\.steam-shell \.wish-grid-item \.wish-price/);
  assert.match(css, /body\.steam-shell \.wish-grid-item \.wish-price[^}]*font-size: 16px/);
  assert.match(css, /body\.steam-shell \.wish-grid \{[^}]*grid-template-columns: repeat\(3,/);
  assert.match(css, /body\.steam-shell \.wish-grid-item \.game-cover \{ width: 74px; height: 94px/);
  assert.match(css, /body\.steam-shell \.wish-grid-item \.wish-price \{[^}]*background: transparent/);
  assert.match(css, /body\.steam-shell \.wish-grid-item \.wish-price[^}]*font-weight: 800/);
  assert.match(app, /wish-match/);
});

test("wishlist card metadata reads as a vertical, playful ranking", () => {
  assert.match(css, /body\.steam-shell \.wish-grid-item \.wish-meta[^}]*flex-direction: column/);
  assert.match(css, /body\.steam-shell \.wish-match \{[^}]*position: static/);
  assert.match(css, /body\.steam-shell \.wish-match \{[^}]*background: linear-gradient/);
  assert.match(css, /body\.steam-shell \.wish-match \.wish-rank/);
});

test("light theme keeps the Steam header, wishlist cards, and genre rows readable", () => {
  assert.match(css, /body\.steam-shell\[data-theme="light"\] \.steam-header-brand/);
  assert.match(css, /body\.steam-shell\[data-theme="light"\] \.steam-nav-link\.active/);
  assert.match(css, /body\.steam-shell\[data-theme="light"\] \.wish-grid-item/);
  assert.match(css, /body\.steam-shell\[data-theme="light"\] \.wish-grid-item strong/);
  assert.match(css, /body\.steam-shell\[data-theme="light"\] \.genre-large \.genre-name/);
  assert.match(css, /body\.steam-shell\[data-theme="light"\] \.genre-large \.genre-count/);
});
