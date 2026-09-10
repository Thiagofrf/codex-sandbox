# Personal OS

MVP local de um planner pessoal para rotina, foco, estudos, side projects, hobbies e métricas.

## Executar

Abra [index.html](./index.html) diretamente no navegador. Não há build, backend ou dependências para instalar.

## Estrutura

- `index.html` — shell da aplicação e views.
- `styles.css` — design system, componentes e responsividade.
- `app.js` — composição das views, eventos, CRUD e fluxo da aplicação.
- `modules/state.js` — versão do schema, migrações, merge e validação de importação.
- `modules/storage.js` — leitura, persistência, metadados e snapshots locais.
- `modules/metrics.js` — outputs e regras de métricas.
- `modules/studies.js`, `modules/projects.js`, `modules/hobbies.js` — progresso e regras das entidades.
- `modules/agenda.js`, `modules/dashboard.js`, `modules/modals.js` — helpers específicos de agenda, dashboard e formulários.

Os dados ficam no `localStorage` com a chave `personal-os:v1`. A tela Configurações permite exportar/importar um backup JSON.
O tema claro/escuro pode ser alternado pelo botão no topo ou em Configurações e é persistido junto com os demais dados locais.
A última seção aberta também é preservada localmente e refletida no hash da URL, permitindo recarregar o `index.html` sem voltar automaticamente ao Dashboard.
O progresso do ciclo atual é derivado automaticamente da média dos checklists/tarefas concluídos nos estudos, project e hobby vinculados; não existe um percentual manual para o ciclo.
Quando todas as tarefas de um estudo, project ou hobby são concluídas, o item é movido automaticamente para `DONE`.
Se uma conclusão foi feita por engano, use `Reabrir` no card `DONE`: o item volta para `ACTIVE` com o checklist limpo para começar novamente.
Os itens de checklist podem ser arrastados para alterar a prioridade; referências da Agenda e registros automáticos são atualizados junto com a nova ordem.

A Agenda usa uma grade semanal de 06:00 a 24:00. Os blocos da rotina aparecem de segunda a sexta por padrão; arraste qualquer bloco para outro dia ou horário para salvar uma variação da semana.
As mudanças de dados são normalizadas antes de salvar, e os últimos snapshots ficam disponíveis localmente para recuperação futura.

## Próxima iteração sugerida

1. Adicionar busca e filtros quando o backlog crescer.
2. Criar testes de contrato para migrações e regras de conclusão.
3. Avaliar uma camada de sincronização somente depois de o modelo local estar estável.
