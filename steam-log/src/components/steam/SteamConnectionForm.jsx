import { useState } from "react";

export function SteamConnectionForm({ status, error, connect }) {
  const [steamId, setSteamId] = useState("");
  const isLoading = status === "loading";

  function handleSubmit(event) {
    event.preventDefault();
    const trimmedId = steamId.trim();
    if (trimmedId) connect(trimmedId);
  }

  return (
    <form className="react-sync" onSubmit={handleSubmit}>
      <span className="react-sync-label">{isLoading ? "Syncing…" : "Steam not connected"}</span>
      <input aria-label="Steam ID" value={steamId} onChange={(event) => setSteamId(event.target.value)} placeholder="Steam ID" />
      <button type="submit" disabled={isLoading}>{isLoading ? "…" : "Connect Steam"}</button>
      {status === "error" && <span className="react-sync-error" role="alert">{error}</span>}
    </form>
  );
}
