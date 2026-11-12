// Connects the game screen to the server.
// Both the desktop and the mobile dice sections use this, so the
// rolling and holding logic lives in one place instead of two.

import { useLiveGameContext } from "src/context/useLiveGameContext";
import { rollDice, holdTurn } from "src/api/client";
import useAudio from "src/hooks/useAudio";
import addPlayerSound from "src/sound_effect/add_player.mp3";
import loseSound from "src/sound_effect/lose_sound.mp3";
import celebrationSound from "src/sound_effect/celebration.mp3";

export default function useServerGame() {
  const {
    gameId,
    playerData,
    setPlayerData,
    currentPlayer,
    setCurrentPlayer,
    setDiceValue,
    setIsGameOver,
    setErrorMessage,
  } = useLiveGameContext();

  const holdAudio = useAudio(addPlayerSound);
  const loseAudio = useAudio(loseSound);
  const celebrationAudio = useAudio(celebrationSound);

  // The server is the source of truth. After every move we copy its scores
  // into the screen's existing playerData, keeping each player's local name
  // and pig picture. Players are in the same order on both sides (seat = index).
  function applyServerGame(game) {
    setPlayerData((players) =>
      players.map((player, index) => {
        const serverPlayer = game.players[index];
        const isTheirTurn = serverPlayer.seat === game.currentSeat;
        return {
          ...player,
          total_points: serverPlayer.score,
          running_points: isTheirTurn ? game.turnTotal : 0,
        };
      })
    );
    setCurrentPlayer(game.currentSeat);

    if (game.status === "finished") {
      // Short pause so players see the final score before the win screen.
      setTimeout(() => {
        celebrationAudio?.play();
        setIsGameOver(true);
      }, 1000);
    }
  }

  // Step 1 of a roll: ask the server. The Dice animates while this waits.
  // Returns the server's result, or null if it failed.
  async function requestRoll() {
    try {
      return await rollDice(gameId);
    } catch (err) {
      setErrorMessage(err.message);
      return null;
    }
  }

  // Step 2 of a roll: once the dice animation lands, update the screen.
  function showRoll(result) {
    setDiceValue(result.dice);
    if (result.bust) loseAudio?.play();
    applyServerGame(result.game);
  }

  // Bank the points and pass the turn on.
  async function hold() {
    try {
      const result = await holdTurn(gameId);
      holdAudio?.play();
      applyServerGame(result.game);
    } catch (err) {
      setErrorMessage(err.message);
    }
  }

  // Holding with 0 points isn't allowed, so the button is disabled until you roll.
  const canHold = (playerData[currentPlayer]?.running_points ?? 0) > 0;

  return { requestRoll, showRoll, hold, canHold };
}
