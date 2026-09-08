# Personal OS

MVP local de um planner pessoal para rotina, foco, estudos, side projects, hobbies e métricas.

## Executar

Abra [index.html](./index.html) diretamente no navegador. Não há build, backend ou dependências para instalar.

## Estrutura

- `index.html` — shell da aplicação e views.
- `styles.css` — design system, componentes e responsividade.
- `app.js` — estado inicial, renderização, eventos, CRUD e persistência.

Os dados ficam no `localStorage` com a chave `personal-os:v1`. A tela Configurações permite exportar/importar um backup JSON.

## Próxima iteração sugerida

1. Extrair o estado e os módulos de domínio em arquivos separados (`store`, `entities`, `views`, `components`).
2. Adicionar uma visão de revisão semanal com notas, outputs e aprendizados.
3. Adicionar filtros e busca quando o backlog crescer.
