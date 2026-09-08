(() => {
  "use strict";

  function workspaceTaskSummary(state) { const items = [...state.tasks.map((task) => ({ done: task.done })), ...state.studies.flatMap((study) => study.checklist || []), ...state.projects.flatMap((project) => project.tasks || []), ...state.hobbies.flatMap((hobby) => hobby.checklist || [])]; return { completed: items.filter((item) => item.done).length, open: items.filter((item) => !item.done).length }; }
  window.PersonalOSDashboard = { workspaceTaskSummary };
})();
