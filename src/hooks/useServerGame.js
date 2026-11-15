// Connects the game screen to the server.
// Both the desktop and the mobile dice sections use this, so the
// rolling and holding logic lives in one place instead of two.

import { useLiveGameContext } from "src/context/useLiveGameContext";
import { rollDice, holdTurn, playComputerTurn } from "src/api/client";
import useAudio from "src/hooks/useAudio";
import useAnnouncer from "src/hooks/useAnnouncer";
import addPlayerSound from "src/sound_effect/add_player.mp3";
import loseSound from "src/sound_effect/lose_sound.mp3";
import celebrationSound from "src/sound_effect/celebration.mp3";
import diceRollSound from "src/sound_effect/dice_roll.mp3";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// How long each of the computer's moves stays on screen, so players can follow it.
const COMPUTER_STEP_MS = 1100;

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
    isComputerThinking,
    setIsComputerThinking,
  } = useLiveGameContext();

  const holdAudio = useAudio(addPlayerSound);
  const loseAudio = useAudio(loseSound);
  const celebrationAudio = useAudio(celebrationSound);
  const diceAudio = useAudio(diceRollSound);
  const announce = useAnnouncer();

  // The name to read out: what the player typed, or their pig's name.
  function nameOf(seat) {
    const player = playerData[seat];
    return player?.name?.trim() || player?.tag || `Player ${seat + 1}`;
  }

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

  // The caption for a roll. In "Even out the Odds" it also says what the
  // special numbers did, e.g. "Iggy rolled a 4. Double! Turn total 12."
  function describeRoll(roller, { dice, bust, category, game }) {
    if (bust) return `${roller} rolled a ${dice}. Bust! ${nameOf(game.currentSeat)}'s turn.`;
    if (category === "double") return `${roller} rolled a ${dice}. Double! Turn total ${game.turnTotal}.`;
    if (category === "negative") return `${roller} rolled a ${dice}. Minus ${dice}! Turn total ${game.turnTotal}.`;
    return `${roller} rolled a ${dice}. Turn total ${game.turnTotal}.`;
  }

  // Step 2 of a roll: once the dice animation lands, update the screen.
  function showRoll(result) {
    const roller = nameOf(currentPlayer);
    setDiceValue(result.dice);
    if (result.bust) loseAudio?.play();
    announce(describeRoll(roller, result));
    applyServerGame(result.game);
  }

  // The computer's turn. The server plays the whole turn in one go and sends back
  // every step; we then replay those steps one by one with a pause, so players
  // can see (and hear) what the computer did, then show the final state.
  async function runComputerTurn() {
    const bot = nameOf(currentPlayer);
    setIsComputerThinking(true);
    announce(`${bot} is thinking...`);
    await wait(900);

    // Try up to 3 times if the connection drops, so the game can't get stuck.
    let result = null;
    for (let attempt = 1; attempt <= 3 && !result; attempt++) {
      try {
        result = await playComputerTurn(gameId);
      } catch (err) {
        setErrorMessage(err.message);
        await wait(2000);
      }
    }
    if (!result) {
      setIsComputerThinking(false);
      return;
    }

    for (const step of result.steps) {
      if (step.action === "roll") {
        diceAudio?.play();
        setDiceValue(step.dice);
        if (step.bust) loseAudio?.play();
        announce(describeRoll(bot, { ...step, game: { currentSeat: result.game.currentSeat, turnTotal: step.turnTotal } }));
        setPlayerData((players) =>
          players.map((p, i) => (i === currentPlayer ? { ...p, running_points: step.turnTotal } : p))
        );
      } else {
        holdAudio?.play();
        announce(
          result.game.status === "finished"
            ? `${bot} banks ${step.banked} points and wins with ${step.score}!`
            : `${bot} banks ${step.banked} points, ${step.score} in total. ${nameOf(result.game.currentSeat)}'s turn.`
        );
      }
      await wait(COMPUTER_STEP_MS);
    }

    applyServerGame(result.game);
    setIsComputerThinking(false);
  }

  // Bank the points and pass the turn on.
  async function hold() {
    try {
      const holder = nameOf(currentPlayer);
      const result = await holdTurn(gameId);
      holdAudio?.play();
      const total = result.game.players[currentPlayer].score;
      if (result.game.status === "finished") {
        announce(`${holder} banks ${result.banked} points and wins with ${total}!`);
      } else {
        announce(`${holder} banks ${result.banked} points, ${total} in total. ${nameOf(result.game.currentSeat)}'s turn.`);
      }
      applyServerGame(result.game);
    } catch (err) {
      setErrorMessage(err.message);
    }
  }

  // You can only hold with points to bank (in "Even out the Odds" the total can drop below 0),
  // so the button is disabled until then.
  // On the computer's turn the human's dice and HOLD button are switched off.
  const isComputersTurn = Boolean(playerData[currentPlayer]?.isBot) || isComputerThinking;
  const canHold = !isComputersTurn && (playerData[currentPlayer]?.running_points ?? 0) > 0;

  return { requestRoll, showRoll, hold, canHold, isComputersTurn, runComputerTurn };
}
