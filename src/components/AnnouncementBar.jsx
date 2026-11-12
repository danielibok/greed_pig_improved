// Shows the latest announcement as a caption, e.g. "Ruby rolled a 4. Turn total 10."
// aria-live="polite" makes screen readers read each new caption out loud
// automatically, without the player having to move to it.

import { useLiveGameContext } from "src/context/useLiveGameContext";

export default function AnnouncementBar() {
  const { announcement } = useLiveGameContext();

  return (
    <p
      aria-live="polite"
      className="text-white text-center text-base lg:text-lg bg-[#ffffff10] border border-[#ffffff40] rounded-lg px-4 py-3 min-h-[3rem]"
    >
      {announcement || "Roll the dice to start."}
    </p>
  );
}
