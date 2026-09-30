import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { SteamApiClient } from "../lib/steamApi.mjs";

const SteamContext = createContext(null);

export function SteamProvider({ children }) {
  const api = useMemo(() => new SteamApiClient(), []);
  const [status, setStatus] = useState("idle");
  const [profile, setProfile] = useState(null);
  const [library, setLibrary] = useState(null);
  const [error, setError] = useState("");

  const connect = useCallback(async (steamId) => {
    setStatus("loading"); setError("");
    try {
      const [nextProfile, nextLibrary] = await Promise.all([api.getProfile(steamId), api.getOwnedGames(steamId)]);
      setProfile(nextProfile); setLibrary(nextLibrary); setStatus("connected");
    } catch (cause) {
      setError(cause.message || "Could not connect to Steam."); setStatus("error");
    }
  }, [api]);

  const disconnect = useCallback(() => { setProfile(null); setLibrary(null); setError(""); setStatus("idle"); }, []);
  const value = useMemo(() => ({ status, profile, library, error, connect, disconnect }), [status, profile, library, error, connect, disconnect]);
  return <SteamContext.Provider value={value}>{children}</SteamContext.Provider>;
}

export function useSteam() {
  const context = useContext(SteamContext);
  if (!context) throw new Error("useSteam must be used inside SteamProvider");
  return context;
}
