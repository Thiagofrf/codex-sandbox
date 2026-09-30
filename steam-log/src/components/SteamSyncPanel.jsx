import { useState } from "react";
import { useSteam } from "../context/SteamContext";

export function SteamSyncPanel() {
  const { status, profile, library, error, connect, disconnect } = useSteam();
  const [steamId, setSteamId] = useState("");
  if (status === "connected") return <div className="react-sync react-sync-connected"><span className="react-sync-dot" /><span>{profile?.personaname || "Steam connected"} · {library?.gameCount || 0} games</span><button type="button" onClick={disconnect}>Disconnect</button></div>;
  return <form className="react-sync" onSubmit={(event) => { event.preventDefault(); if (steamId.trim()) connect(steamId.trim()); }}><span className="react-sync-label">{status === "loading" ? "Syncing…" : "Steam not connected"}</span><input aria-label="Steam ID" value={steamId} onChange={(event) => setSteamId(event.target.value)} placeholder="Steam ID" /><button type="submit" disabled={status === "loading"}>{status === "loading" ? "…" : "Connect Steam"}</button>{status === "error" && <span className="react-sync-error" role="alert">{error}</span>}</form>;
}
