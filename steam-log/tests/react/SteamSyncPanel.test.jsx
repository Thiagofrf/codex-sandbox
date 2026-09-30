import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { SteamSyncPanel } from "../../src/components/SteamSyncPanel";
import { SteamProvider } from "../../src/context/SteamContext";

function renderPanel() { return render(<SteamProvider><SteamSyncPanel /></SteamProvider>); }

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("SteamSyncPanel", () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn(async (url) => {
      if (url.includes("/profile")) return { ok: true, json: async () => ({ response: { players: [{ steamid: "123", personaname: "Thiago" }] } }) };
      return { ok: true, json: async () => ({ response: { game_count: 1, games: [{ appid: 10, name: "Portal", playtime_forever: 120 }] } }) };
    });
  });

  test("connects with a Steam ID and shows normalized account state", async () => {
    renderPanel(); fireEvent.change(screen.getByLabelText("Steam ID"), { target: { value: "123" } }); fireEvent.click(screen.getByRole("button", { name: "Connect Steam" }));
    await waitFor(() => expect(screen.getByText(/Thiago/)).toBeInTheDocument());
    expect(screen.getByText(/1 games/)).toBeInTheDocument(); expect(globalThis.fetch).toHaveBeenCalledTimes(2); expect(globalThis.fetch.mock.calls[0][0]).toContain("/api/steam/profile?steamId=123");
  });

  test("shows a useful error when the proxy rejects a request", async () => {
    globalThis.fetch = vi.fn(async () => ({ ok: false, status: 500, json: async () => ({ error: "offline" }) }));
    renderPanel(); fireEvent.change(screen.getByLabelText("Steam ID"), { target: { value: "123" } }); fireEvent.click(screen.getByRole("button", { name: "Connect Steam" }));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Steam request failed (500)"));
  });

  test("disconnects and returns to the connect state", async () => {
    renderPanel(); fireEvent.change(screen.getByLabelText("Steam ID"), { target: { value: "123" } }); fireEvent.click(screen.getByRole("button", { name: "Connect Steam" })); await waitFor(() => screen.getByText(/Thiago/)); fireEvent.click(screen.getByRole("button", { name: "Disconnect" })); expect(screen.getByText("Steam not connected")).toBeInTheDocument();
  });
});
