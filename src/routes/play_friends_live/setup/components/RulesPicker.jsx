// Lets players choose how the game is played before it starts:
// the classic rules, or Richard's "Even out the Odds" mode.
// Real radio buttons with labels, so it works with a keyboard and screen readers.

const OPTIONS = [
  {
    value: "classic",
    label: "Classic",
    description: "Roll as often as you like. A 1 loses your turn's points.",
  },
  {
    value: "even-odds",
    label: "Even out the Odds",
    description:
      "Each game picks a special even (2 or 4) that scores double and a special odd (3 or 5) that takes points away. A 1 loses your turn's points.",
  },
];

export default function RulesPicker({ rules, onChange }) {
  return (
    <fieldset className="text-white bg-[#ffffff10] border border-[#ffffff40] rounded-lg p-4 flex flex-col gap-3 w-full max-w-[400px]">
      <legend className="px-2 font-bold">Game mode</legend>
      {OPTIONS.map((option) => (
        <label key={option.value} className="flex gap-3 items-start cursor-pointer">
          <input
            type="radio"
            name="rules"
            value={option.value}
            checked={rules === option.value}
            onChange={() => onChange(option.value)}
            className="mt-1 w-4 h-4 accent-[#D30CBD]"
          />
          <span>
            <span className="font-bold">{option.label}</span>
            <span className="block text-sm text-[#ffffffb0]">{option.description}</span>
          </span>
        </label>
      ))}
    </fieldset>
  );
}
