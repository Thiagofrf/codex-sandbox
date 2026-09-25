# Steam Log

A focused, local-first Steam backlog and wishlist companion built with HTML, CSS, and vanilla JavaScript.

## What it includes

- Library overview with played, in-progress, backlog, and wishlist counts.
- Searchable, filterable backlog with one-click played status changes.
- Wishlist overview with game count, total BRL value, and price breakdown.
- A transparent AI-style wishlist ranking based on recently logged genres.
- Recently played history, session logging, genre pulse, and localStorage persistence.

## Usage

Open `index.html` directly in a browser. The page ships with sample data so the experience is immediately visible; edits stay in the current browser via `localStorage`.

## Tests

Run the dependency-free interaction suite with:

```text
node --test tests/app.test.js
```

The tests execute the real `app.js` against a small browser/DOM harness and cover navigation, loaded content, search, filters, sorting, played state changes, modals, sessions, wishlist ranking, keyboard shortcuts, responsive menu controls, themes, hash routing, and localStorage persistence.
