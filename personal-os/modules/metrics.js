(() => {
  "use strict";

  const OUTPUT_TYPES = ["features", "published", "articles", "exercises"];
  const definitions = [{ key: "features", label: "features implementadas" }, { key: "published", label: "projetos publicados" }, { key: "articles", label: "artigos escritos" }, { key: "exercises", label: "exercícios resolvidos" }];

  function calculateTotals(state) {
    const totals = OUTPUT_TYPES.reduce((result, type) => ({ ...result, [type]: 0 }), {});
    (state.outputLog || []).forEach((entry) => { if (totals[entry.type] !== undefined) totals[entry.type] += Math.max(0, Number(entry.quantity) || 0); });
    return totals;
  }

  function inferOutputType(item, context = {}) { const text = `${item?.text || item?.title || ""} ${context.name || ""}`.toLowerCase(); if (/(artigo|article|post|texto)/.test(text) && context.kind === "project") return "articles"; if (/(publicar|publicado|publish|demo|lançar|lancamento|release)/.test(text)) return "published"; if (/(exercício|exercicio|exercise|questão|questao|challenge)/.test(text)) return "exercises"; if (context.kind === "project") return "features"; return ""; }
  function completionMetric(context) { if (context.kind === "study") return "programming"; if (context.kind === "project") return "project"; if (context.kind === "hobby") return "audiovisual"; if (context.kind === "task") return ({ Estudos: "programming", "Side Project": "project", Audiovisual: "audiovisual", Leitura: "reading", Lazer: "leisure" })[context.category] || ""; return ""; }

  window.PersonalOSMetrics = { OUTPUT_TYPES, definitions, calculateTotals, inferOutputType, completionMetric };
})();
