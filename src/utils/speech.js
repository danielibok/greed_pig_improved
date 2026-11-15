// Speaks text out loud using the browser's built-in voice (the Web Speech API).
// No sound files or extra libraries needed: Chrome, Edge, Safari and Firefox
// all have this built in.

// Pick an English voice, preferring a British one if the device has it.
function pickVoice() {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang === "en-GB") ||
    voices.find((v) => v.lang.startsWith("en")) ||
    null
  );
}

export function canSpeak() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

// Say `text`. Anything still being spoken is cut off first,
// so the voice never falls behind a fast player.
export function speak(text, volume = 1) {
  if (!canSpeak() || !text) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.volume = volume; // 0 (silent) to 1 (full)
  utterance.rate = 1.05;     // a touch faster than normal so it keeps up with the game
  const voice = pickVoice();
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}
