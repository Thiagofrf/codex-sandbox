export function SteamConnectedStatus({ profile, library, disconnect }) {
  return (
    <div className="react-sync react-sync-connected">
      <span className="react-sync-dot" />
      <span>{profile?.personaname || "Steam connected"} · {library?.gameCount || 0} games</span>
      <button type="button" onClick={disconnect}>Disconnect</button>
    </div>
  );
}
