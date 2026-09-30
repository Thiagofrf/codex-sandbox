import http from "node:http";

const port = Number(process.env.PORT || 8787);
const apiKey = process.env.STEAM_API_KEY;

function steamEndpoint(kind, steamId) {
  const method = kind === "profile" ? "ISteamUser/GetPlayerSummaries/v0002/" : "IPlayerService/GetOwnedGames/v0001/";
  const params = new URLSearchParams({ key: apiKey || "", steamids: steamId, steamid: steamId, format: "json", include_appinfo: "1", include_played_free_games: "1" });
  return `https://api.steampowered.com/${method}?${params}`;
}

export async function handleSteamProxy(requestUrl, response) {
  const url = new URL(requestUrl, "http://localhost"); const kind = url.pathname.endsWith("/profile") ? "profile" : url.pathname.endsWith("/owned-games") ? "owned-games" : null; const steamId = url.searchParams.get("steamId");
  if (!kind || !steamId) { response.writeHead(400, { "content-type": "application/json" }); response.end(JSON.stringify({ error: "Expected /api/steam/profile or /api/steam/owned-games with steamId." })); return; }
  if (!apiKey) { response.writeHead(503, { "content-type": "application/json" }); response.end(JSON.stringify({ error: "STEAM_API_KEY is not configured." })); return; }
  try { const upstream = await fetch(steamEndpoint(kind, steamId)); const body = await upstream.text(); response.writeHead(upstream.status, { "content-type": "application/json", "access-control-allow-origin": "*" }); response.end(body); } catch (error) { response.writeHead(502, { "content-type": "application/json" }); response.end(JSON.stringify({ error: error.message })); }
}

if (process.argv[1] && process.argv[1].endsWith("steamProxy.mjs")) {
  http.createServer((request, response) => { if (request.url?.startsWith("/api/steam/")) return handleSteamProxy(request.url, response); response.writeHead(404); response.end(); }).listen(port, () => console.log(`Steam proxy listening on http://localhost:${port}`));
}
