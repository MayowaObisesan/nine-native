import {Buffer} from 'buffer';
import {GITHUB_ACCESS_TOKEN} from "~/lib/constants";
import {fetch} from 'expo/fetch';

if (!GITHUB_ACCESS_TOKEN) {
  throw new Error("ACCESS TOKEN is required");
}

const BASE_URL = "https://api.github.com";
const headers = {
  Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
  Accept: "application/vnd.github.v3+json",
};

// Fetch user repositories
export const getMyRepos = async () => {
  try {
    const response = await fetch(`${BASE_URL}/user/repos`, {headers});
    return await response.json();
  } catch (error) {
    console.error("Error fetching repos:", error);
  }
};

export const getUserRepos = async (username: string) => {
  try {
    const response = await fetch(
      // `${BASE_URL}/users/${username}/repos?per_page=500&page=1`,
      `${BASE_URL}/users/${username}/repos?per_page=500`,
      {headers}
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching repos:", error);
  }
};

export const getUserFollowers = async (username: string, page?: number) => {
  try {
    const response = await fetch(
      // `${BASE_URL}/users/${username}/repos?per_page=500&page=1`,
      `${BASE_URL}/users/${username}/followers?per_page=30&&page=${page}`,
      {headers}
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching followers:", error);
  }
};

export const getRepo = async (owner: string, repo: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/repos/${owner}/${repo}`,
      {headers}
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching Repo:", error);
  }
};

export const getRepoPRs = async (owner: string, repo: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/repos/${owner}/${repo}/pulls?state=all`,
      {headers}
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching PRs:", error);
  }
};

export const getRepoReleases = async (owner: string, repo: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/repos/${owner}/${repo}/releases`,
      {headers}
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching releases:", error);
  }
};

export const getRepoTags = async (owner: string, repo: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/repos/${owner}/${repo}/tags`,
      {headers}
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching tags:", error);
  }
};

export const getRepoIssues = async (owner: string, repo: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/repos/${owner}/${repo}/issues`,
      {headers}
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching issues:", error);
  }
};

export const getRepoLanguages = async (url?: string, owner?: string, repo?: string) => {
  try {
    const response = await fetch(
      url ? url : `${BASE_URL}/repos/${owner}/${repo}/languages`,
      {headers}
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching languages:", error);
  }
}

export const getRepoReadme = async (owner: string, repo: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/repos/${owner}/${repo}/readme`,
      {headers}
    );
    const data = await response.json();

    // The content is base64 encoded, so we need to decode it
    if (data.content) {
      const decodedContent = Buffer.from(data.content, 'base64').toString('utf-8');
      return {
        ...data,
        decodedContent
      };
    }

    return data;
  } catch (error) {
    console.error("Error fetching readme:", error);
  }
};

export const getRepoContributors = async (owner: string, repo: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/repos/${owner}/${repo}/contributors`,
      {headers}
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching contributors:", error);
  }
};

export const getRepoCollaborators = async (owner: string, repo: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/repos/${owner}/${repo}/collaborators`,
      {headers}
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching collaborators:", error);
  }
};

export const getRepoSubscribers = async (owner: string, repo: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/repos/${owner}/${repo}/subscribers`,
      {headers}
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching subscribers:", error);
  }
};

// Function to get repository details including fork information
export async function getRepoDetails(owner: string, repo: string) {
  const response = await fetch(
    `${BASE_URL}/repos/${owner}/${repo}`,
    {headers}
  );

  // If the repo is a fork, data.parent will contain the original repo info
  return await response.json();
}

export async function getRepoBranches(owner: string, repo: string, page: number = 1) {
  try {
    const response = await fetch(
      `${BASE_URL}/repos/${owner}/${repo}/branches?per_page=30&&page=${page}`,
      {headers}
    );
    return await response.json();
  } catch(error) {
    console.error("Error fetching branches:", error);
  }
}

export async function getRepoStarsCount(owner: string, repo: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/repos/${owner}/${repo}/stargazers`,
      {headers}
    );
    return await response.json();
  } catch(error) {
    console.error("Error fetching stars:", error);
  }
}

export async function getBranchCommit(url?: string, owner?: string, repo?: string, commit_sha?: string) {
  try {
    const response = await fetch(
      url ? url : `${BASE_URL}/repos/${owner}/${repo}/commits/${commit_sha}`,
      {headers}
    );
    return await response.json();
  } catch(error) {
    console.error("Error fetching branch commit:", error);
  }
}
