// Choose who you're playing against: friends on the same screen, or the computer.
// Against the computer, you also pick how hard it plays.

const DIFFICULTIES = [
  { value: "easy", label: "Easy", description: "Nervous. Banks small amounts early." },
  { value: "medium", label: "Medium", description: "Sensible. Banks once it has 20 points." },
  { value: "hard", label: "Hard", description: "Reads the scoreboard and takes risks when it's behind." },
];

export default function OpponentPicker({ opponent, onOpponentChange, difficulty, onDifficultyChange }) {
  return (
    <fieldset className="text-white bg-[#ffffff10] border border-[#ffffff40] rounded-lg p-4 flex flex-col gap-3 w-full max-w-[400px]">
      <legend className="px-2 font-bold">Play against</legend>
      <div className="flex gap-6">
        {[
          { value: "friends", label: "Friends" },
          { value: "computer", label: "The computer" },
        ].map((option) => (
          <label key={option.value} className="flex gap-2 items-center cursor-pointer">
            <input
              type="radio"
              name="opponent"
              value={option.value}
              checked={opponent === option.value}
              onChange={() => onOpponentChange(option.value)}
              className="w-4 h-4 accent-[#D30CBD]"
            />
            {option.label}
          </label>
        ))}
      </div>

      {opponent === "computer" && (
        <fieldset className="flex flex-col gap-2 border-t border-[#ffffff30] pt-3">
          <legend className="text-sm font-bold">Difficulty</legend>
          {DIFFICULTIES.map((option) => (
            <label key={option.value} className="flex gap-3 items-start cursor-pointer">
              <input
                type="radio"
                name="difficulty"
                value={option.value}
                checked={difficulty === option.value}
                onChange={() => onDifficultyChange(option.value)}
                className="mt-1 w-4 h-4 accent-[#D30CBD]"
              />
              <span>
                <span className="font-bold">{option.label}</span>
                <span className="block text-sm text-[#ffffffb0]">{option.description}</span>
              </span>
            </label>
          ))}
        </fieldset>
      )}
    </fieldset>
  );
}
