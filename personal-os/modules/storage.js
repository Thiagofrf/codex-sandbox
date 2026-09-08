(() => {
  "use strict";

  const { clone } = window.PersonalOSHelpers;

  const read = (key, fallback, merge) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? merge(fallback, JSON.parse(saved)) : clone(fallback);
    } catch (error) {
      return clone(fallback);
    }
  };

  const write = (key, value) => {
    const serialized = JSON.stringify(value);
    try {
      const previous = localStorage.getItem(key);
      const backups = JSON.parse(localStorage.getItem(`${key}:backups`) || "[]");
      if (previous) backups.push({ savedAt: new Date().toISOString(), data: JSON.parse(previous) });
      localStorage.setItem(`${key}:backups`, JSON.stringify(backups.slice(-5)));
    } catch (error) {
      // A failed snapshot must not prevent the current state from being saved.
    }
    localStorage.setItem(key, serialized);
    localStorage.setItem(`${key}:meta`, JSON.stringify({ lastSavedAt: new Date().toISOString() }));
  };

  const readMeta = (key) => {
    try { return JSON.parse(localStorage.getItem(`${key}:meta`) || "{}"); } catch (error) { return {}; }
  };

  const readBackups = (key) => {
    try { return JSON.parse(localStorage.getItem(`${key}:backups`) || "[]"); } catch (error) { return []; }
  };

  window.PersonalOSStorage = { read, write, readMeta, readBackups };
})();
