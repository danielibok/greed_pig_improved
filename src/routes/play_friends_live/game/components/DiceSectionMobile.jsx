import { useState } from "react";
import { useLiveGameContext } from "src/context/useLiveGameContext";
import Menu from "./Menu";
import { Dice } from "src/components/Dice";
import useServerGame from "src/hooks/useServerGame";

// Mobile dice panel. Same logic as the desktop one (via useServerGame),
// just laid out for a small screen.
function DiceSectionMobile() {
  const { playerData, setChangeBackground, maxPoints } = useLiveGameContext();
  const [isRolling, setIsRolling] = useState(false);
  const { requestRoll, showRoll, hold, canHold } = useServerGame();
  const holdDisabled = isRolling || !canHold;

  return (
    <div className=" border-r-[#ffffff40] border-r md:hidden flex flex-col items-center justify-around px-2 bg-[#00000010] h-[60vh] ">
      <button
        onClick={hold}
        disabled={holdDisabled}
        title={canHold ? "Bank your points and pass the turn" : "Roll at least once before holding"}
        className={`bg-[#056FA480] w-[200px] md:w-full text-white text-center text-base lg:text-xl xl:text-2xl font-semibold py-2 lg:py-4 rounded border duration-300 ${
          holdDisabled ? "opacity-40 cursor-not-allowed" : "hover:scale-105 active:scale-100"
        }`}
      >
        HOLD
      </button>

      <Dice
        requestRoll={requestRoll}
        onRollShown={showRoll}
        setIsRolling={setIsRolling}
        isRolling={isRolling}
        setChangeBackground={setChangeBackground}
      />

      <Menu />
      <div className="text-white flex justify-between w-full">
        <p className="text-center text-sm lg:text-lg">{playerData.length} players</p>
        <p className="text-center text-sm lg:text-lg">{maxPoints} max points</p>
      </div>
    </div>
  );
}

export default DiceSectionMobile;
