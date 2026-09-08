(() => {
  "use strict";

  const { clone, uid, currentISO } = window.PersonalOSHelpers;
  const CURRENT_SCHEMA_VERSION = 3;

  function migrate(incoming = {}) {
    const migrated = clone(incoming || {});
    const version = Number(migrated.version || 1);
    if (version < 2) migrated.completionLog = migrated.completionLog || {};
    if (version < 3) migrated.outputLog = migrated.outputLog || null;
    migrated.version = CURRENT_SCHEMA_VERSION;
    return migrated;
  }

  function merge(base, incoming) {
    const migrated = migrate(incoming);
    const output = clone(base);
    Object.keys(migrated || {}).forEach((key) => { if (migrated[key] !== undefined) output[key] = migrated[key]; });
    output.settings = { ...base.settings, ...(migrated.settings || {}) };
    if (!Array.isArray(migrated?.outputLog) && migrated?.outputs) output.outputLog = null;
    return output;
  }

  function ensureOutputState(targetState, defaultOutputs, outputTypes) {
    const legacyOutputs = { ...defaultOutputs, ...(targetState.outputs || {}) };
    if (!Array.isArray(targetState.outputLog)) targetState.outputLog = Object.entries(legacyOutputs).map(([type, quantity]) => ({ id: uid("output"), type, title: `Legacy ${type} output`, quantity: Math.max(0, Number(quantity) || 0), sourceType: "manual", sourceId: "", date: currentISO, notes: "Migrated from the previous output counters." }));
    targetState.outputLog = targetState.outputLog.filter((entry) => entry && outputTypes.includes(entry.type)).map((entry) => ({ id: entry.id || uid("output"), type: entry.type, title: entry.title || "Untitled output", quantity: Math.max(1, Number(entry.quantity) || 1), automatic: Boolean(entry.automatic), sourceType: entry.sourceType || "manual", sourceId: entry.sourceId || "", sourceTaskId: entry.sourceTaskId || "", date: entry.date || currentISO, notes: entry.notes || "" }));
  }

  function ensureCompletionState(targetState) { targetState.completionLog = { ...(targetState.completionLog || {}) }; }

  function validateImported(candidate, version) {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) throw new Error("Formato inválido");
    if (Number(candidate.version || 1) > version) throw new Error("Versão futura não suportada");
    ["studies", "projects", "hobbies", "routine"].forEach((key) => { if (candidate[key] !== undefined && !Array.isArray(candidate[key])) throw new Error(`Campo inválido: ${key}`); });
    if (candidate.metrics !== undefined && (typeof candidate.metrics !== "object" || Array.isArray(candidate.metrics))) throw new Error("Campo inválido: metrics");
    return candidate;
  }

  window.PersonalOSState = { CURRENT_SCHEMA_VERSION, migrate, merge, ensureOutputState, ensureCompletionState, validateImported };
})();
