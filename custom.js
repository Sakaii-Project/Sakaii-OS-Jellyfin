/*
  Sakaii OS for Jellyfin — Optional UX Enhancements

  This script is entirely optional. The theme works fully without it.
  To use: add via the JavaScript Injector plugin (see README).
*/

(() => {
  "use strict";

  const SAKAII_VERSION = "2.0.0";
  const LONG_ABSENCE_MS = 15 * 60 * 1000; // 15 minutes

  const state = {
    lastHiddenAt: 0,
  };

  // Soft-refresh artwork after returning from a long absence
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      state.lastHiddenAt = Date.now();
      return;
    }

    if (state.lastHiddenAt && Date.now() - state.lastHiddenAt > LONG_ABSENCE_MS) {
      const event = new CustomEvent("sakaii:returned", { detail: { absentMs: Date.now() - state.lastHiddenAt } });
      document.dispatchEvent(event);
    }
  });

  console.info(`[Sakaii OS] v${SAKAII_VERSION} enhancements loaded.`);
})();
