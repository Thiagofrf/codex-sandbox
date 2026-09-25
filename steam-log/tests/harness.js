const fs = require("node:fs");
const vm = require("node:vm");

class FakeClassList {
  constructor(owner) { this.owner = owner; this.values = new Set(); }
  add(...values) { values.forEach((value) => this.values.add(value)); }
  remove(...values) { values.forEach((value) => this.values.delete(value)); }
  contains(value) { return this.values.has(value); }
  toggle(value, force) { const shouldAdd = force === undefined ? !this.values.has(value) : force; if (shouldAdd) this.add(value); else this.remove(value); return shouldAdd; }
}

class FakeElement {
  constructor(tagName = "div", attributes = {}) {
    this.tagName = tagName.toUpperCase(); this.id = attributes.id || ""; this.dataset = {};
    Object.entries(attributes).forEach(([key, value]) => { if (key.startsWith("data-")) this.dataset[key.slice(5).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] = value; });
    this.classList = new FakeClassList(this); if (attributes.className) this.classList.add(...attributes.className.split(" "));
    this.style = {}; this.hidden = false; this.value = ""; this._textContent = ""; this._innerHTML = ""; this.listeners = new Map(); this.children = [];
  }
  set textContent(value) { this._textContent = String(value); }
  get textContent() { return this._textContent; }
  set innerHTML(value) { this._innerHTML = String(value); }
  get innerHTML() { return this._innerHTML; }
  addEventListener(type, listener) { if (!this.listeners.has(type)) this.listeners.set(type, []); this.listeners.get(type).push(listener); }
  dispatchEvent(event) { event.target ||= this; event.currentTarget = this; (this.listeners.get(event.type) || []).forEach((listener) => listener(event)); return !event.defaultPrevented; }
  appendChild(child) { this.children.push(child); child.parentNode = this; return child; }
  removeChild(child) { this.children = this.children.filter((item) => item !== child); }
  remove() { this.parentNode?.removeChild(this); }
  focus() { this.focused = true; }
  matches(selector) {
    if (selector.startsWith("#")) return this.id === selector.slice(1);
    if (selector.startsWith(".")) return this.classList.contains(selector.slice(1));
    const dataMatch = selector.match(/^\[data-([^=\]]+)(?:=["']?([^\]"']+)["']?)?\]$/);
    if (dataMatch) { const key = dataMatch[1].replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()); return Object.prototype.hasOwnProperty.call(this.dataset, key) && (!dataMatch[2] || this.dataset[key] === dataMatch[2]); }
    return false;
  }
  closest(selector) { return this.matches(selector) ? this : null; }
}

class FakeDocument extends FakeElement {
  constructor() {
    super("document"); this.registry = new Map(); this.listeners = new Map(); this.body = this.register(new FakeElement("body"));
    ["sidebar", "close-sidebar", "open-sidebar", "page-title", "nav-backlog-count", "nav-wishlist-count", "sidebar-played-percent", "sidebar-progress", "theme-toggle", "quick-profile", "toast-region", "modal-backdrop", "modal"].forEach((id) => this.register(new FakeElement("div", { id })));
    this.registry.get("modal-backdrop").tagName = "DIV";
    this.views = ["dashboard", "backlog", "wishlist", "played", "genres"].map((view) => { const element = new FakeElement("section", { id: `view-${view}` }); element.dataset.viewPanel = view; element.classList.add("view"); this.register(element); return element; });
    this.filterElements = ["all", "backlog", "in-progress", "played"].map((filter) => new FakeElement("button", { className: "filter-pill", "data-filter": filter }));
    this.navItems = ["dashboard", "backlog", "wishlist", "played", "genres"].map((view) => { const element = new FakeElement("button", { className: "nav-item", "data-view": view }); this.register(element); return element; });
  }
  register(element) { if (element.id) this.registry.set(element.id, element); return element; }
  createElement(tagName) { return new FakeElement(tagName); }
  dynamic(id) { if (!this.registry.has(id)) this.register(new FakeElement("input", { id })); return this.registry.get(id); }
  querySelector(selector) {
    if (selector.startsWith("#")) return this.registry.get(selector.slice(1)) || this.dynamic(selector.slice(1));
    if (selector === ".nav-item") return this.navItems[0];
    if (selector === ".view") return this.views[0];
    if (selector === "[data-view-panel]") return this.views[0];
    return this.querySelectorAll(selector)[0] || null;
  }
  querySelectorAll(selector) {
    if (selector === ".nav-item") return this.navItems;
    if (selector === ".view") return this.views;
    if (selector === "[data-view-panel]") return this.views;
    if (selector === "[data-filter]") return this.filterElements;
    if (selector === ".toast") return [];
    return [];
  }
}

class FakeStorage {
  constructor(seed = {}) { this.values = { ...seed }; }
  getItem(key) { return Object.prototype.hasOwnProperty.call(this.values, key) ? this.values[key] : null; }
  setItem(key, value) { this.values[key] = String(value); }
  removeItem(key) { delete this.values[key]; }
}

function createApp(options = {}) {
  const document = new FakeDocument(); const storage = options.storage || new FakeStorage(); const window = { __STEAM_LOG_TEST__: true, location: { hash: options.hash || "" }, scrollTo() {} };
  const sandbox = { document, window, localStorage: storage, console, setTimeout, clearTimeout, Date, Intl, JSON, Math, Number, String, Object, Array, RegExp, Promise, FormData: class FakeFormData { constructor() { this.values = { ...(sandbox.__formValues || {}) }; } get(key) { return this.values[key]; } } };
  const modal = document.querySelector("#modal"); const originalModalSetter = Object.getOwnPropertyDescriptor(FakeElement.prototype, "innerHTML").set;
  Object.defineProperty(modal, "innerHTML", { configurable: true, get: () => modal._innerHTML, set: (value) => { originalModalSetter.call(modal, value); const typeMatch = String(value).match(/data-modal-type="([^"]+)"/); if (typeMatch) document.dynamic("modal-form").dataset.modalType = typeMatch[1]; } });
  vm.runInNewContext(fs.readFileSync(require.resolve("../app.js"), "utf8"), sandbox, { filename: "app.js" });
  return { document, window, storage, sandbox, api: window.__steamLogTest };
}

function event(type, target, extra = {}) { return { type, target, preventDefault() { this.defaultPrevented = true; }, ...extra }; }
function click(app, target) { app.document.dispatchEvent(event("click", target)); }
function submit(app, values) { app.sandbox.__formValues = values; const form = app.document.querySelector("#modal-form"); form.dispatchEvent(event("submit", form)); return form; }

module.exports = { FakeElement, FakeStorage, createApp, event, click, submit };
