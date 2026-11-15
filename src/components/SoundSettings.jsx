// Sound settings on the setup page: sound effects, voice announcer and volume.
// Uses real <input> controls with labels, so they work with a keyboard
// (Tab and Space) and with screen readers.

import { useGreedyPigContext } from "src/context/useGreedyPigContext";
import { canSpeak, speak } from "src/utils/speech";

export default function SoundSettings() {
  const { hasSound, setHasSound, announcerOn, setAnnouncerOn, volume, setVolume } =
    useGreedyPigContext();

  return (
    <fieldset className="text-white bg-[#ffffff10] border border-[#ffffff40] rounded-lg p-4 mt-2 flex flex-col gap-3 w-full max-w-[400px]">
      <legend className="px-2 font-bold">Sound</legend>

      <label className="flex items-center justify-between gap-4">
        Sound effects
        <input
          type="checkbox"
          checked={hasSound}
          onChange={(e) => setHasSound(e.target.checked)}
          className="w-5 h-5 accent-[#D30CBD]"
        />
      </label>

      <label className="flex items-center justify-between gap-4">
        Voice announcer (reads out rolls and scores)
        <input
          type="checkbox"
          checked={announcerOn}
          disabled={!canSpeak()}
          onChange={(e) => setAnnouncerOn(e.target.checked)}
          className="w-5 h-5 accent-[#D30CBD]"
        />
      </label>
      {!canSpeak() && (
        <p className="text-sm text-[#ffffffa0]">This browser cannot speak, but captions still show on screen.</p>
      )}

      <label className="flex items-center justify-between gap-4">
        Volume
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="accent-[#D30CBD]"
          aria-valuetext={`${Math.round(volume * 100)} percent`}
        />
      </label>

      <button
        type="button"
        onClick={() => speak("Welcome to Greedy Pig. Good luck!", volume)}
        disabled={!canSpeak()}
        className="self-start text-sm px-3 py-1 rounded border border-[#ffffff80] hover:bg-[#ffffff20] duration-300"
      >
        Test voice
      </button>
    </fieldset>
  );
}
