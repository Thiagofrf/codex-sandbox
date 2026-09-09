(() => {
  "use strict";

  const { clamp } = window.PersonalOSHelpers;
  function getProgress(item) { const tasks = Array.isArray(item.tasks) ? item.tasks : []; return tasks.length ? Math.round((tasks.filter((task) => task.done).length / tasks.length) * 100) : 0; }
  function syncProgress(targetState) { (targetState.projects || []).forEach((project) => { if (!Array.isArray(project.tasks)) project.tasks = []; if (project.tasks.length) project.progress = getProgress(project); }); }
  window.PersonalOSProjects = { getProgress, syncProgress };
})();
