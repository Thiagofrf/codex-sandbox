(() => {
  "use strict";

  function normalized(value) { return String(value || "").trim().toLowerCase(); }
  function linkedNames(value) { return String(value || "").split(/[\/,;+]/).map((item) => normalized(item)).filter(Boolean); }
  function matchesCycleItem(item, names) { const itemName = normalized(item.name); return names.some((name) => itemName === name || itemName.includes(name) || name.includes(itemName)); }
  function checklistProgress(items) { const checklist = Array.isArray(items) ? items : []; return checklist.length ? (checklist.filter((item) => item.done).length / checklist.length) * 100 : 0; }

  function calculateProgress(state, cycle = state.currentCycle) {
    const progressValues = [];
    state.studies.filter((item) => matchesCycleItem(item, linkedNames(cycle.study))).forEach((item) => progressValues.push(checklistProgress(item.checklist)));
    state.projects.filter((item) => matchesCycleItem(item, linkedNames(cycle.project))).forEach((item) => progressValues.push(checklistProgress(item.tasks)));
    state.hobbies.filter((item) => matchesCycleItem(item, linkedNames(cycle.hobby))).forEach((item) => progressValues.push(checklistProgress(item.checklist)));
    return progressValues.length ? Math.round(progressValues.reduce((sum, value) => sum + value, 0) / progressValues.length) : 0;
  }

  function syncProgress(state) {
    if (state.currentCycle) state.currentCycle.progress = calculateProgress(state, state.currentCycle);
    if (state.nextCycle) state.nextCycle.progress = calculateProgress(state, state.nextCycle);
  }

  window.PersonalOSCycles = { calculateProgress, syncProgress };
})();
