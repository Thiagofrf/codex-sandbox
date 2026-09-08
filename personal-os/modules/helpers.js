(() => {
  "use strict";

  const uid = (prefix = "id") => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const today = new Date();
  const isoDate = (date) => new Date(date).toISOString().slice(0, 10);
  const currentISO = isoDate(today);
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const esc = (value = "") => String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" }[char]));
  const formatDate = (value, options = { day: "2-digit", month: "short" }) => new Intl.DateTimeFormat("pt-BR", options).format(new Date(`${value}T12:00:00`));
  const formatLongDate = (value = currentISO) => new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long" }).format(new Date(`${value}T12:00:00`));
  const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, Number(value) || 0));

  window.PersonalOSHelpers = {
    uid,
    today,
    isoDate,
    currentISO,
    clone,
    esc,
    formatDate,
    formatLongDate,
    clamp,
  };
})();
