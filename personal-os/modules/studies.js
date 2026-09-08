(() => {
  "use strict";

  const { clamp } = window.PersonalOSHelpers;
  function getProgress(item) { const checklist = Array.isArray(item.checklist) ? item.checklist : []; return checklist.length ? Math.round((checklist.filter((check) => check.done).length / checklist.length) * 100) : clamp(item.progress); }
  function syncProgress(targetState) { (targetState.studies || []).forEach((study) => { if (Array.isArray(study.checklist) && study.checklist.length) study.progress = getProgress(study); }); }
  window.PersonalOSStudies = { getProgress, syncProgress };
})();
