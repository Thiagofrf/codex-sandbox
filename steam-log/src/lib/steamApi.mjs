export class SteamApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "SteamApiError";
    this.status = status;
  }
}

export class SteamApiClient {
  constructor({ fetcher = globalThis.fetch, basePath = "/api/steam" } = {}) {
    this.fetcher = fetcher;
    this.basePath = basePath;
  }

  async request(path, params) {
    const query = new URLSearchParams(params).toString();
    const response = await this.fetcher(`${this.basePath}${path}?${query}`);
    if (!response.ok) throw new SteamApiError(`Steam request failed (${response.status})`, response.status);
    return response.json();
  }

  async getProfile(steamId) {
    const payload = await this.request("/profile", { steamId });
    return payload.response?.players?.[0] || payload.profile || payload;
  }

  async getOwnedGames(steamId) {
    const payload = await this.request("/owned-games", { steamId });
    const data = payload.response || payload;
    const games = (data.games || []).map((item) => ({
      id: String(item.appid),
      title: item.name,
      hours: Math.round(((item.playtime_forever || 0) / 60) * 100) / 100,
      playtimeMinutes: item.playtime_forever || 0,
      coverUrl: item.img_icon_url ? `https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/${item.appid}/${item.img_icon_url}.jpg` : "",
    }));
    return { ...data, gameCount: data.game_count ?? games.length, games };
  }
}
