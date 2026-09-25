# Steam Log validation map

Validation run: `node --test tests/app.test.js`

Result: **15 passed, 0 failed**

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

## Validation notes

- The suite runs the real `steam-log/app.js`, not a duplicate implementation.
- `tests/harness.js` only supplies browser primitives absent from Node: DOM lookup, delegated events, localStorage, FormData, modal/toast nodes, and `window.location`.
- The final run also includes `node --check app.js` and `git diff --check`.
