import type { GitHubUser } from "../types.ts";

type SuggestionDropdownProps = {
  suggestions: GitHubUser[];
  show: boolean;
  onSelect: (user: string) => void;
};

function SuggestionDropdown({
  suggestions,
  show,
  onSelect,
}: SuggestionDropdownProps) {
  return (
    show &&
    suggestions?.length > 0 && (
      <ul className="suggestions">
        {suggestions.slice(0, 5).map((userSuggestion: GitHubUser) => (
          <li
            key={userSuggestion.login}
            onClick={() => onSelect(userSuggestion.login)}
          >
            <img
              src={userSuggestion.avatar_url}
              alt={userSuggestion.name}
              className="avatar-xs"
            />
            {userSuggestion.login}
          </li>
        ))}
      </ul>
    )
  );
}

export default SuggestionDropdown;
