/*
  Sakaii OS for Jellyfin
  Optional enhancements only.
  This placeholder keeps V2 lightweight while we redesign the visual shell first.
*/

(() => {
  "use strict";

  const sakaiiState = {
    lastHiddenAt: 0,
  };

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      sakaiiState.lastHiddenAt = Date.now();
      return;
    }

    const hiddenDuration = Date.now() - sakaiiState.lastHiddenAt;
    if (hiddenDuration > 5 * 60 * 1000) {
      console.debug("[Sakaii OS] Returning from a long absence.");
    }
  });
})();
