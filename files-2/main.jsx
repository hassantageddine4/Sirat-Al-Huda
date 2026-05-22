// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { initDeepLinkHandler } from "./services/deepLinkHandler";

// Register the native deep-link listener BEFORE mounting React.
// This ensures any cold-start auth callback (sirat://auth/callback?code=...)
// is processed before the app's auth state listeners run.
initDeepLinkHandler().catch(err => {
  // eslint-disable-next-line no-console
  console.error("Deep link handler failed to init:", err);
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
