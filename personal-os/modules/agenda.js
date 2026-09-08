(() => {
  "use strict";

  function todayIndex(date = new Date()) { const day = date.getDay(); return day === 0 ? 6 : day - 1; }
  window.PersonalOSAgenda = { todayIndex };
})();
