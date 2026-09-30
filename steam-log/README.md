# Steam Log

A focused, local-first Steam backlog and wishlist companion built with a Steam-style shell, a React/Vite integration layer, and the existing local data experience.

## What it includes

- Library overview with played, in-progress, backlog, and wishlist counts.
- Searchable, filterable backlog with one-click played status changes.
- Wishlist overview with game count, total BRL value, and price breakdown.
- A transparent AI-style wishlist ranking based on recently logged genres.
- Recently played history, session logging, genre pulse, and localStorage persistence.

## Usage

Run the React/Vite app with `npm install` followed by `npm run dev`. The local data experience is still available inside the app while React takes ownership of the Steam connection layer.

To enable Steam API sync, copy `.env.example` to `.env`, add your server-side `STEAM_API_KEY`, and run `npm run dev:api` in a second terminal. Vite proxies `/api` requests to that local server; the key never enters browser code. React modules are organized under `src/components`, `src/context`, `src/lib`, and `src/utils`.

## Tests

Run the complete validation suite with:

```text
npm test
```

The tests execute the real `app.js` against a small browser/DOM harness and cover navigation, loaded content, search, filters, sorting, played state changes, modals, sessions, wishlist ranking, keyboard shortcuts, responsive menu controls, themes, hash routing, and localStorage persistence. The layout suite checks the Steam-style shell, horizontal navigation, shelf framing, visual tokens, and responsive rules. React tests use jsdom and React Testing Library to cover connect, error, disconnect, modular connection components, and pure game-data utilities.
