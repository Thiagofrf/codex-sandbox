# Steam Log validation map

Validation run: `npm test`

Result: **42 passed, 0 failed**

| Area | Behavior validated | Test coverage | Result |
| --- | --- | --- | --- |
| Initial content | Dashboard, seeded library data, counts, wishlist snapshot, and AI recommendation load | `initial load renders...` | PASS |
| Primary navigation | Overview, Backlog, Wishlist, Recently played, and Genre pulse links update the active view, title, hash, and panel | `every sidebar menu link...` | PASS |
| Cross-links | Dashboard links route to each secondary view | `cross-view links...` | PASS |
| Backlog search | Title/genre search narrows rendered games | `backlog search filters...` | PASS |
| Backlog filters | All, backlog, in-progress, and played filters update the rendered subset | `backlog search filters...` | PASS |
| Backlog sorting | Recently active, title, and hours sorting work in dashboard and full backlog | `backlog sort controls...` | PASS |
| Played state | Toggle changes status, date, counts, and row state; second toggle reopens the game | `played toggle updates...` | PASS |
| Wishlist sorting | Price and AI ranking modes update the visible order and explanation | `wishlist sorting supports...` | PASS |
| Add game | Library and wishlist entries persist with title, genre, price, status, and hours | `add-game modal creates...` | PASS |
| Log session | Session creates history, updates game hours/status, and feeds genre analysis | `session modal logs...` | PASS |
| Modal dismissal | Close action, backdrop click, and Escape close modal state | `modal closes from...` | PASS |
| Responsive navigation | Mobile sidebar open and close controls update sidebar state | `mobile sidebar opens...` | PASS |
| Keyboard navigation | Ctrl/Cmd + 1–5 routes to all views | `keyboard shortcuts navigate...` | PASS |
| Theme | Theme toggle updates the document and persists the preference | `theme toggle updates...` | PASS |
| Persistence | State survives a fresh app load through localStorage | `state survives...` | PASS |
| Deep links | `#wishlist` opens Wishlist on initial load | `deep-link hash...` | PASS |
| Layout shell | Steam-style body shell, top header, horizontal navigation, and shelf classes are present | `the page declares...` | PASS |
| Layout navigation | All five primary views are exposed in the horizontal header navigation | `horizontal library navigation...` | PASS |
| Layout styling | Steam tokens, shell rules, shelf rules, and responsive rules are present | `Steam visual tokens...` | PASS |
| Layout hierarchy | Desktop hides the admin-style sidebar in favor of a full-width top navigation; sidebar remains available as a mobile drawer | `Steam visual tokens...` | PASS |
| React composition | Sync panel delegates connected and disconnected states to focused Steam components | `Steam connection components...`, `React integration...` | PASS |
| React connection flow | Steam connect, proxy error, and disconnect states update rendered content and API calls | `SteamSyncPanel.test.jsx` | PASS |
| Game-data utilities | Hours formatting, library stats, filtering, wishlist totals, and genre-affinity ranking are deterministic | `gameData.test.mjs` | PASS |
| Library visual refresh | Table gutters, header treatment, readable sans-serif metadata, and larger cover-first cards are declared | `the library table keeps readable alignment...` | PASS |
| Header clarity | The game-space context is distinct from clickable section navigation | `the logo context is visually distinct...` | PASS |
| Comfort typography | DM Mono is removed, text uses the sans-serif family, and dark-theme text has a stronger readable scale | `the comfort visual system avoids mono typography...` | PASS |
| Image-led listings | Library, wishlist, home activity, and session listings render cover-image slots backed by Steam artwork | `the comfort visual system avoids mono typography...` | PASS |
| Wishlist snapshot | Home snapshot rows use dedicated spacing, cover, title, metadata, and price treatments | `the home wishlist snapshot has a dedicated card treatment` | PASS |
| Dashboard activity highlight | Home leads with a wide GitHub-style rhythm graph, while duplicate session panels are removed from the visible dashboard | `the dashboard promotes activity history...`, `initial load renders...` | PASS |
| Spacious library browsing | Home and library listings use larger cover art, taller rows, wider game cells, and visible sort controls | `library browsing uses spacious rows and visible sorting controls` | PASS |
| Consolidated wishlist insights | Wishlist price, genre, and price-band information is embedded into the primary wishlist card | `wishlist insights are consolidated and visually emphasized` | PASS |
| Wishlist card emphasis | Each wishlist game card gives genre context and price a distinct, readable visual treatment | `wishlist game cards give genre and price distinct visual emphasis` | PASS |
| Light-theme contrast | Steam header navigation, wishlist cards, and genre rows retain readable contrast in light mode | `light theme keeps the Steam header, wishlist cards, and genre rows readable` | PASS |

## Validation notes

- The suite runs the real `steam-log/app.js`, not a duplicate implementation.
- `tests/harness.js` only supplies browser primitives absent from Node: DOM lookup, delegated events, localStorage, FormData, modal/toast nodes, and `window.location`.
- The final run also includes the Vite production build, `node --check server/steamProxy.mjs`, and `git diff --check`.
