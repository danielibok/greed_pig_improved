import { useRef } from "react";
import { useGreedyPigContext } from "src/context/useGreedyPigContext";

// Returns an Audio object for a sound effect, or undefined when sound effects
// are switched off (so callers write audio?.play()).
export default function useAudio(src) {
  const { hasSound, volume } = useGreedyPigContext();
  const audio = useRef(new Audio(src));
  if (!hasSound) return;
  audio.current.volume = volume; // follows the volume slider in the sound settings
  return audio.current;
}
