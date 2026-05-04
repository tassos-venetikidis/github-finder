async function fetchGithubUser(username: string) {
  const res = await fetch(
    `${import.meta.env.VITE_GITHUB_API_URL}/users/${username}`,
  );
  if (!res.ok) throw new Error("User not found!");
  const data = await res.json();
  return data;
}

async function fetchUserSuggestions(inputQuery: string) {
  const res = await fetch(
    `${import.meta.env.VITE_GITHUB_API_URL}/search/users?q=${inputQuery}`,
  );
  if (!res.ok) throw new Error("User not found!");
  const data = await res.json();
  return data.items;
}

export { fetchGithubUser, fetchUserSuggestions };
