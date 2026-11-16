import React, { useEffect, useRef } from "react";
import useServerGame from "src/hooks/useServerGame";
import Navbar from "src/components/Navbar";
import { useLiveGameContext } from "src/context/useLiveGameContext";
import PlayerTable from "./components/PlayerTable";
import StatsSection from "./components/StatsSection";
import GameOver from "./GameOver";
import DiceSection from "./components/DiceSection";
import StatsSectionMobile from "./components/StatsSectionMobile";
import CurrentPlayerMobile from "./components/CurrentPlayerMobile";
import DiceSectionMobile from "./components/DiceSectionMobile";
import ErrorToast from "src/components/ErrorToast";
import AnnouncementBar from "src/components/AnnouncementBar";
import { Navigate } from "react-router-dom";

export default function LiveGame() {
  const { playerData, currentPlayer, isGameOver, setIsContinue, gameId } = useLiveGameContext();

  useEffect(() => {
    setIsContinue(true)
  }, [])

  // When it becomes the computer's turn, let it play. The ref makes sure only one
  // computer turn runs at a time, even though the screen re-draws during it.
  const { runComputerTurn } = useServerGame();
  const computerTurnRunning = useRef(false);
  useEffect(() => {
    const player = playerData[currentPlayer];
    if (!gameId || isGameOver || !player?.isBot || computerTurnRunning.current) return;
    computerTurnRunning.current = true;
    runComputerTurn().finally(() => {
      computerTurnRunning.current = false;
    });
  }, [currentPlayer, gameId, isGameOver, playerData]);

  // No game on the server yet (e.g. the page was refreshed): go back to setup.
  if (!gameId) return <Navigate to="/live-game/setup" replace />;
  
  return (
    <div className="md:grid md:grid-cols-[minmax(auto,_200px)_1fr_minmax(auto,_200px)] lg:grid-cols-[minmax(auto,_250px)_1fr_minmax(auto,_250px)] xl:grid-cols-[auto_1fr_minmax(auto,_300px)] relative">
      <DiceSection />
      <div className=" space-y-2 p-2">
        <Navbar showExit />
        <AnnouncementBar />
        <PlayerTable playerData={playerData} currentPlayer={currentPlayer} />
      </div>
      <CurrentPlayerMobile playerData={playerData} currentPlayer={currentPlayer}/>
      <DiceSectionMobile />

      <StatsSection playerData={playerData} currentPlayer={currentPlayer} />
      <StatsSectionMobile playerData={playerData} currentPlayer={currentPlayer} />
      <ErrorToast />
      {isGameOver ? (
        <GameOver playerData={playerData} currentPlayer={currentPlayer} setIsContinue={setIsContinue} />
      ) : (
        <></>
      )}
    </div>
  );
}
