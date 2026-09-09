(() => {
  "use strict";

  const { clamp } = window.PersonalOSHelpers;
  function getProgress(item) { const tasks = Array.isArray(item.tasks) ? item.tasks : []; return tasks.length ? Math.round((tasks.filter((task) => task.done).length / tasks.length) * 100) : 0; }
  function syncProgress(targetState) { (targetState.projects || []).forEach((project) => { if (!Array.isArray(project.tasks)) project.tasks = []; if (project.tasks.length) project.progress = getProgress(project); }); }
  function syncStatuses(targetState) { (targetState.projects || []).forEach((project) => { const tasks = Array.isArray(project.tasks) ? project.tasks : []; if (!tasks.length) return; if (tasks.every((task) => task.done)) project.status = "done"; else if (project.status === "done") { project.status = "active"; tasks.forEach((task) => { task.done = false; }); } }); }
  window.PersonalOSProjects = { getProgress, syncProgress, syncStatuses };
})();
