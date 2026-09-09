(() => {
  "use strict";

  const { clamp, clone } = window.PersonalOSHelpers;
  function getProgress(item) { const checklist = Array.isArray(item.checklist) ? item.checklist : []; return checklist.length ? Math.round((checklist.filter((check) => check.done).length / checklist.length) * 100) : 0; }
  function syncProgress(targetState, fallbackChecklists) { (targetState.hobbies || []).forEach((hobby) => { if (!Array.isArray(hobby.checklist)) hobby.checklist = clone(fallbackChecklists[hobby.id] || []); if (hobby.checklist.length) hobby.progress = getProgress(hobby); }); }
  function syncStatuses(targetState) { (targetState.hobbies || []).forEach((hobby) => { const checklist = Array.isArray(hobby.checklist) ? hobby.checklist : []; if (!checklist.length) return; if (checklist.every((check) => check.done)) hobby.status = "done"; else if (hobby.status === "done") { hobby.status = "active"; checklist.forEach((check) => { check.done = false; }); } }); }
  window.PersonalOSHobbies = { getProgress, syncProgress, syncStatuses };
})();
