// Keeps the player's sound settings and remembers them between visits
// (saved in the browser's localStorage).

import { useEffect, useState } from "react";

const STORAGE_KEY = "greedy-pig-sound-settings";
const DEFAULTS = { hasSound: true, announcerOn: true, volume: 0.8 };

function loadSettings() {
  // localStorage can be blocked (e.g. private browsing), so never let it crash the game.
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return { ...DEFAULTS, ...saved };
  } catch {
    return DEFAULTS;
  }
}

export default function useSoundSettings() {
  const [settings, setSettings] = useState(loadSettings);

  // Save whenever a setting changes.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Saving failed: the settings still work, they just won't be remembered.
    }
  }, [settings]);

  return {
    hasSound: settings.hasSound,
    setHasSound: (hasSound) => setSettings((s) => ({ ...s, hasSound })),
    announcerOn: settings.announcerOn,
    setAnnouncerOn: (announcerOn) => setSettings((s) => ({ ...s, announcerOn })),
    volume: settings.volume,
    setVolume: (volume) => setSettings((s) => ({ ...s, volume })),
  };
}
