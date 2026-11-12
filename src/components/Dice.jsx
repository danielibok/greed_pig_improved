import { useState } from "react";
import { useGreedyPigContext } from "src/context/useGreedyPigContext";
import diceRollSound from "src/sound_effect/dice_roll.mp3";
import useAudio from "src/hooks/useAudio";

// How long the dice spins at least, so the animation still feels like a roll
// even when the server answers very quickly.
const MIN_SPIN_MS = 1200;

// The dice no longer decides the number itself. It asks the server
// (requestRoll), spins while waiting, then lands on the server's number.
export function Dice({ requestRoll, onRollShown, setIsRolling, isRolling, setChangeBackground }) {
  const { preloadSrcList } = useGreedyPigContext();
  const [currentDice, setCurrentDice] = useState(0);
  const die = preloadSrcList.filter((dice) => dice.includes("dice"));
  const diceRollAudio = useAudio(diceRollSound);

  async function handleDiceClick() {
    if (isRolling) return;
    setIsRolling(true);
    setChangeBackground(true);

    // Spin through random faces. This is only for show:
    // the real number comes from the server.
    const spin = setInterval(() => {
      diceRollAudio?.play();
      setCurrentDice(Math.floor(Math.random() * 6));
    }, 100);

    // Ask the server and wait at least MIN_SPIN_MS, whichever takes longer.
    const [result] = await Promise.all([
      requestRoll(),
      new Promise((resolve) => setTimeout(resolve, MIN_SPIN_MS)),
    ]);

    clearInterval(spin);
    if (result) {
      setCurrentDice(result.dice - 1); // dice images are numbered from 0
      onRollShown(result);
    }
    setIsRolling(false);
    setChangeBackground(false);
  }

  return (
    <>
      <button
        className={`hover:scale-105 active:scale-100 duration-300 md:w-auto w-[200px]`}
        onClick={handleDiceClick}
        disabled={isRolling}
        aria-label={isRolling ? "Rolling the dice" : "Roll the dice"}
      >
        {die.map((dice, index) => (
          <img
            key={index}
            src={dice}
            alt={`Dice showing ${currentDice + 1}`}
            className={`${currentDice === index ? "" : "hidden"}`}
          />
        ))}
      </button>
    </>
  );
}
