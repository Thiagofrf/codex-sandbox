import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { SteamConnectionForm } from "../../../src/components/steam/SteamConnectionForm";
import { SteamConnectedStatus } from "../../../src/components/steam/SteamConnectedStatus";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Steam connection components", () => {
  test("submits a trimmed Steam ID and disables itself while syncing", () => {
    const connect = vi.fn();
    render(<SteamConnectionForm status="loading" error="" connect={connect} />);
    fireEvent.change(screen.getByLabelText("Steam ID"), { target: { value: " 123 " } });
    fireEvent.submit(screen.getByRole("button", { name: "…" }).closest("form"));
    expect(connect).toHaveBeenCalledWith("123");
    expect(screen.getByRole("button", { name: "…" })).toBeDisabled();
  });

  test("does not submit an empty Steam ID and exposes errors", () => {
    const connect = vi.fn();
    render(<SteamConnectionForm status="error" error="Proxy offline" connect={connect} />);
    fireEvent.submit(screen.getByRole("button", { name: "Connect Steam" }).closest("form"));
    expect(connect).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent("Proxy offline");
  });

  test("renders connected account details and delegates disconnect", () => {
    const disconnect = vi.fn();
    render(<SteamConnectedStatus profile={{ personaname: "Thiago" }} library={{ gameCount: 7 }} disconnect={disconnect} />);
    expect(screen.getByText("Thiago · 7 games")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Disconnect" }));
    expect(disconnect).toHaveBeenCalledOnce();
  });
});
