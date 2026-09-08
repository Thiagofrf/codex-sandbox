(() => {
  "use strict";

  function getFormData(form) { return Object.fromEntries(new FormData(form).entries()); }
  window.PersonalOSModals = { getFormData };
})();
