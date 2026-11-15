// The game's commentator. Every announcement is:
//  1. shown as a caption on screen (helps deaf players, and screen readers read it out)
//  2. spoken out loud, if the voice announcer is switched on (helps blind and low-vision players)

import { useGreedyPigContext } from "src/context/useGreedyPigContext";
import { useLiveGameContext } from "src/context/useLiveGameContext";
import { speak } from "src/utils/speech";

export default function useAnnouncer() {
  const { announcerOn, volume } = useGreedyPigContext();
  const { setAnnouncement } = useLiveGameContext();

  return function announce(text) {
    setAnnouncement(text);
    if (announcerOn) speak(text, volume);
  };
}
