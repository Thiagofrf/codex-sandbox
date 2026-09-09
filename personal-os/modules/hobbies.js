(() => {
  "use strict";

  const { clamp, clone } = window.PersonalOSHelpers;
  function getProgress(item) { const checklist = Array.isArray(item.checklist) ? item.checklist : []; return checklist.length ? Math.round((checklist.filter((check) => check.done).length / checklist.length) * 100) : 0; }
  function syncProgress(targetState, fallbackChecklists) { (targetState.hobbies || []).forEach((hobby) => { if (!Array.isArray(hobby.checklist)) hobby.checklist = clone(fallbackChecklists[hobby.id] || []); if (hobby.checklist.length) hobby.progress = getProgress(hobby); }); }
  window.PersonalOSHobbies = { getProgress, syncProgress };
})();
