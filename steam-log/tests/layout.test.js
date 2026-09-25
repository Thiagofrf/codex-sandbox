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
  for (const view of ["dashboard", "backlog", "wishlist", "played", "genres"]) {
    assert.match(html, new RegExp(`class="steam-nav-link[^"]*"[^>]*data-view="${view}"`));
  }
});

test("Steam visual tokens and responsive layout rules exist", () => {
  assert.match(css, /--steam-blue:/);
  assert.match(css, /--steam-deep:/);
  assert.match(css, /\.steam-shell/);
  assert.match(css, /\.steam-header-nav/);
  assert.match(css, /\.shelf-grid/);
  assert.match(css, /@media \(max-width:760px\)/);
});
