import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { fetchGithubUser, fetchUserSuggestions } from "../api/github.ts";
import UserCard from "./UserCard.tsx";
import RecentSearches from "./RecentSearches.tsx";
import SuggestionDropdown from "./SuggestionDropdown.tsx";

function UserSearch() {
  const [username, setUsername] = useState("");
  const [submittedUsername, setSubmittedUsername] = useState("");
  const [recentUsers, setRecentUsers] = useState<string[]>(() => {
    const stored = localStorage.getItem("recentUserSearches");
    return stored ? JSON.parse(stored) : [];
  });
  const [debouncedUsername] = useDebounce(username, 300);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    localStorage.setItem("recentUserSearches", JSON.stringify(recentUsers));
  }, [recentUsers]);

  // Query to fetch specific user
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["users", submittedUsername],
    queryFn: () => fetchGithubUser(submittedUsername),
    enabled: !!submittedUsername,
  });

  // Query to fetch suggestions to user search
  const { data: suggestions } = useQuery({
    queryKey: ["github-user-suggestions", debouncedUsername],
    queryFn: () => fetchUserSuggestions(debouncedUsername),
    enabled: debouncedUsername.length > 1,
  });

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;
    setSubmittedUsername(trimmed);
    setUsername("");
    setRecentUsers((prev) => {
      return [trimmed, ...prev.filter((item) => item !== trimmed)].slice(0, 5);
    });
  }
  return (
    <>
      <form onSubmit={handleSubmit} className="form">
        <div className="dropdown-wrapper">
          <input
            type="text"
            placeholder="Enter GitHub Username..."
            value={username}
            onChange={(e) => {
              const val = e.target.value;
              setUsername(val);
              setShowSuggestions(val.trim().length > 1);
            }}
          />
          <SuggestionDropdown
            show={showSuggestions}
            suggestions={suggestions}
            onSelect={(userlogin) => {
              setUsername("");
              setShowSuggestions(false);
              if (submittedUsername !== userlogin) {
                setSubmittedUsername(userlogin);
              } else {
                refetch();
              }
              setRecentUsers((prev) => {
                return [
                  userlogin,
                  ...prev.filter((item) => item !== userlogin),
                ].slice(0, 5);
              });
            }}
          />
        </div>
        <button type="submit">Search</button>
      </form>
      {isLoading && <p className="status">Loading...</p>}
      {isError && <p className="status error">{error.message}</p>}

      {data && <UserCard user={data} />}
      {recentUsers.length > 0 && (
        <RecentSearches
          users={recentUsers}
          onSelect={(user) => {
            setUsername("");
            setSubmittedUsername(user);
            setRecentUsers((prev) =>
              [user, ...prev.filter((item) => item !== user)].slice(0, 5),
            );
          }}
        />
      )}
    </>
  );
}

export default UserSearch;
