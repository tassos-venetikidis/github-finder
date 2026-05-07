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

async function checkIfFollowingUSer(username: string) {
  const res = await fetch(
    `${import.meta.env.VITE_GITHUB_API_URL}/user/following/${username}`,
    {
      method: "GET",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${import.meta.env.VITE_GITHUB_API_TOKEN}`,
        "X-GitHub-Api-Version": "2026-03-10",
      },
    },
  );
  if (res.status === 204) {
    return true; // following
  } else if (res.status === 404) {
    return false; // not following
  } else {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData.message || "Failed to check follow status");
  }
}

async function followUser(username: string) {
  const res = await fetch(
    `${import.meta.env.VITE_GITHUB_API_URL}/user/following/${username}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${import.meta.env.VITE_GITHUB_API_TOKEN}`,
        "X-GitHub-Api-Version": "2026-03-10",
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to follow user");
  }

  return true;
}

async function unfollowUser(username: string) {
  const res = await fetch(
    `${import.meta.env.VITE_GITHUB_API_URL}/user/following/${username}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${import.meta.env.VITE_GITHUB_API_TOKEN}`,
        "X-GitHub-Api-Version": "2026-03-10",
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to unfollow user");
  }

  return true;
}

export {
  fetchGithubUser,
  fetchUserSuggestions,
  checkIfFollowingUSer,
  followUser,
  unfollowUser,
};
