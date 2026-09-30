const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (...segments) => fs.readFileSync(path.join(root, ...segments), "utf8");

test("React/Vite foundation is declared without removing the legacy behavior suite", () => {
  const packageJson = JSON.parse(read("package.json"));
  assert.ok(packageJson.dependencies.react);
  assert.ok(packageJson.dependencies["react-dom"]);
  assert.ok(packageJson.devDependencies.vite);
  assert.ok(packageJson.devDependencies["@vitejs/plugin-react"]);
  assert.match(packageJson.scripts.dev, /vite/);
  assert.match(packageJson.scripts.build, /vite build/);
  assert.match(packageJson.scripts.test, /tests\/app\.test\.js/);
  assert.match(read("index.html"), /id="react-sync-root"/);
  assert.match(read("index.html"), /type="module"[^>]*src="\/src\/main\.jsx"/);
});

test("React integration has a provider, hook, app entry, and Steam sync panel", () => {
  const main = read("src", "main.jsx");
  const context = read("src", "context", "SteamContext.jsx");
  const app = read("src", "App.jsx");
  const panel = read("src", "components", "SteamSyncPanel.jsx");
  assert.match(main, /createRoot/); assert.match(main, /<App \/>/); assert.match(main, /SteamProvider/);
  assert.match(context, /export function SteamProvider/); assert.match(context, /export function useSteam/); assert.match(context, /SteamApiClient/);
  assert.match(app, /SteamSyncPanel/); assert.match(panel, /useSteam/); assert.match(panel, /SteamConnectionForm/); assert.match(panel, /SteamConnectedStatus/);
  assert.match(read("src", "components", "steam", "SteamConnectionForm.jsx"), /Connect Steam/);
  assert.match(read("src", "components", "steam", "SteamConnectedStatus.jsx"), /Disconnect/);
});

test("Steam API client never exposes the Steam Web API key to the browser", () => {
  const client = read("src", "lib", "steamApi.mjs"); const proxy = read("server", "steamProxy.mjs");
  assert.match(client, /class SteamApiClient/); assert.match(client, /owned-games/); assert.match(client, /profile/); assert.doesNotMatch(client, /STEAM_API_KEY|apiKey/);
  assert.match(proxy, /STEAM_API_KEY/); assert.match(proxy, /GetPlayerSummaries|GetOwnedGames/); assert.match(proxy, /api\/steam/);
  assert.match(read(".env.example"), /STEAM_API_KEY=/);
});

test("Steam API client requests go through the local proxy and normalize responses", async () => {
  const { SteamApiClient } = await import("../src/lib/steamApi.mjs"); const calls = [];
  const client = new SteamApiClient({ fetcher: async (url) => { calls.push(url); return { ok: true, async json() { return { response: { players: [{ steamid: "123", personaname: "Thiago" }], game_count: 1, games: [{ appid: 10, name: "Portal", playtime_forever: 120 }] } }; } }; } });
  const profile = await client.getProfile("123"); const library = await client.getOwnedGames("123");
  assert.equal(calls[0], "/api/steam/profile?steamId=123"); assert.equal(calls[1], "/api/steam/owned-games?steamId=123"); assert.equal(profile.personaname, "Thiago"); assert.equal(library.games[0].title, "Portal"); assert.equal(library.games[0].hours, 2);
});
