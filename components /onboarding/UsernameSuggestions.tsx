type UsernameSuggestionsProps = {
  suggestions: string[],
  onSelect: (username: string) => void,
}

export function UsernameSuggestions({ suggestions, onSelect, }: UsernameSuggestionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          type="button"
          onClick={() => onSelect(suggestion)}
          className="
        rounded-full
        px-3
        py-1
        text-sm
        text-text
        transition-colors
        border
        border-dashed
        border-divider
      hover:border-primary

        cursor-pointer
      "
        >
          @{suggestion}
        </button>
      ))}
    </div>
  )
}