import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { SteamProvider } from "./context/SteamContext";

const root = document.getElementById("react-sync-root");
if (root) createRoot(root).render(<React.StrictMode><SteamProvider><App /></SteamProvider></React.StrictMode>);
