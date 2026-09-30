export function formatHours(hours) {
  const value = Number(hours) || 0;
  return `${Math.round(value * 10) / 10}h`;
}

export function getLibraryStats(games = []) {
  return games.reduce((stats, game) => ({
    total: stats.total + 1,
    played: stats.played + (game.played ? 1 : 0),
    backlog: stats.backlog + (game.played ? 0 : 1),
    hours: Math.round((stats.hours + (Number(game.hours) || 0)) * 10) / 10,
  }), { total: 0, played: 0, backlog: 0, hours: 0 });
}

export function filterGames(games = [], query = "") {
  const normalizedQuery = String(query).trim().toLowerCase();
  if (!normalizedQuery) return games;
  return games.filter((game) => [game.title, ...(game.genres || [])]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(normalizedQuery)));
}

export function getWishlistStats(wishlist = []) {
  const value = wishlist.reduce((total, game) => total + (Number(game.price) || 0), 0);
  return { count: wishlist.length, value: Math.round(value * 100) / 100 };
}

export function rankWishlistByGenreAffinity(wishlist = [], affinity = {}) {
  return wishlist
    .map((game, index) => ({
      ...game,
      affinityScore: (game.genres || []).reduce((score, genre) => score + (Number(affinity[genre]) || 0), 0),
      sourceIndex: index,
    }))
    .sort((left, right) => right.affinityScore - left.affinityScore || left.sourceIndex - right.sourceIndex)
    .map(({ sourceIndex, ...game }) => game);
}
