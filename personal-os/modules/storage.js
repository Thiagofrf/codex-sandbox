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
    localStorage.setItem(key, JSON.stringify(value));
  };

  window.PersonalOSStorage = { read, write };
})();
