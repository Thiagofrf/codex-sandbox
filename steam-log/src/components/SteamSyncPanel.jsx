import { useSteam } from "../context/SteamContext";
import { SteamConnectedStatus } from "./steam/SteamConnectedStatus";
import { SteamConnectionForm } from "./steam/SteamConnectionForm";

export function SteamSyncPanel() {
  const { status, profile, library, error, connect, disconnect } = useSteam();
  if (status === "connected") return <SteamConnectedStatus profile={profile} library={library} disconnect={disconnect} />;
  return <SteamConnectionForm status={status} error={error} connect={connect} />;
}
