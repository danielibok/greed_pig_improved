// Shows the special numbers in an "Even out the Odds" game, under the dice,
// so players always know what each number does. Shows nothing in classic games.

import { useLiveGameContext } from "src/context/useLiveGameContext";

export default function ModeInfo() {
  const { gameSettings } = useLiveGameContext();
  if (gameSettings.rules !== "even-odds") return null;

  return (
    <section
      aria-label="Even out the Odds special numbers"
      className="text-white w-full bg-[#ffffff10] border border-[#ffffff40] rounded-lg p-3 text-sm lg:text-base"
    >
      <p className="font-bold text-center mb-1">Even out the Odds</p>
      <ul className="space-y-1">
        <li><span className="font-bold text-[#7CFC9A]">{gameSettings.specialEven}</span> scores double</li>
        <li><span className="font-bold text-[#FF8A8A]">{gameSettings.specialOdd}</span> takes points away</li>
        <li><span className="font-bold">1</span> and <span className="font-bold">6</span> are busts</li>
      </ul>
    </section>
  );
}
