import { describe, expect, test } from "vitest";
import {
  filterGames,
  formatHours,
  getLibraryStats,
  getWishlistStats,
  rankWishlistByGenreAffinity,
} from "../../../src/utils/gameData.mjs";

const games = [
  { id: "1", title: "Hades", hours: 12.5, played: true, genres: ["Action", "RPG"] },
  { id: "2", title: "Portal 2", hours: 4, played: true, genres: ["Puzzle"] },
  { id: "3", title: "Stardew Valley", hours: 0, played: false, genres: ["RPG", "Simulation"] },
];

describe("game data utilities", () => {
  test("formats playtime without losing useful precision", () => {
    expect(formatHours(0)).toBe("0h");
    expect(formatHours(12.5)).toBe("12.5h");
    expect(formatHours(12.555)).toBe("12.6h");
  });

  test("summarizes library totals and played state", () => {
    expect(getLibraryStats(games)).toEqual({ total: 3, played: 2, backlog: 1, hours: 16.5 });
  });

  test("filters games by title and genre without mutating the collection", () => {
    expect(filterGames(games, "puzzle").map((game) => game.id)).toEqual(["2"]);
    expect(filterGames(games, "")).toEqual(games);
  });

  test("summarizes wishlist value and count", () => {
    expect(getWishlistStats([{ title: "Silksong", price: 14.99 }, { title: "Dredge", price: 24 }])).toEqual({ count: 2, value: 38.99 });
  });

  test("ranks wishlist items using genre affinity and preserves ties", () => {
    const wishlist = [
      { id: "a", title: "Puzzle Quest", genres: ["Puzzle"] },
      { id: "b", title: "RPG Quest", genres: ["RPG"] },
      { id: "c", title: "Unmatched", genres: ["Strategy"] },
    ];
    expect(rankWishlistByGenreAffinity(wishlist, { RPG: 4, Puzzle: 2 })).toEqual([
      { ...wishlist[1], affinityScore: 4 },
      { ...wishlist[0], affinityScore: 2 },
      { ...wishlist[2], affinityScore: 0 },
    ]);
  });
});
