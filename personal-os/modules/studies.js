(() => {
  "use strict";

  const { clamp } = window.PersonalOSHelpers;
  function getProgress(item) { const checklist = Array.isArray(item.checklist) ? item.checklist : []; return checklist.length ? Math.round((checklist.filter((check) => check.done).length / checklist.length) * 100) : 0; }
  function syncProgress(targetState) { (targetState.studies || []).forEach((study) => { if (Array.isArray(study.checklist) && study.checklist.length) study.progress = getProgress(study); }); }
  function syncStatuses(targetState) { (targetState.studies || []).forEach((study) => { const checklist = Array.isArray(study.checklist) ? study.checklist : []; if (checklist.length && checklist.every((check) => check.done)) study.status = "done"; }); }
  window.PersonalOSStudies = { getProgress, syncProgress, syncStatuses };
})();
