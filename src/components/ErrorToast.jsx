// A small pop-up at the bottom of the screen that shows errors
// (e.g. "Can't reach the server") instead of the game silently failing.

import { useEffect } from "react";
import { useLiveGameContext } from "src/context/useLiveGameContext";

export default function ErrorToast() {
  const { errorMessage, setErrorMessage } = useLiveGameContext();

  // Hide the message automatically after 5 seconds.
  useEffect(() => {
    if (!errorMessage) return;
    const timer = setTimeout(() => setErrorMessage(""), 5000);
    return () => clearTimeout(timer);
  }, [errorMessage, setErrorMessage]);

  if (!errorMessage) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-[90vw] flex items-center gap-4 bg-[#D30C0C] text-white px-4 py-3 rounded-lg shadow-lg"
    >
      <p>{errorMessage}</p>
      <button
        onClick={() => setErrorMessage("")}
        className="font-bold"
        aria-label="Close message"
      >
        ✕
      </button>
    </div>
  );
}
