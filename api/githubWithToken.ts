import axios from "axios";

const GITHUB_API_URL = "https://api.github.com";

export const fetchUserRepos = async (token: string) => {
  const response = await axios.get(`${GITHUB_API_URL}/user/repos`, {
    headers: {Authorization: `Bearer ${token}`},
  });
  console.log(response.data)
  return response.data;
};

// Fetch repository details
export const fetchRepoDetails = async (token: string, owner: string, repo: string) => {
  const response = await axios.get(`${GITHUB_API_URL}/repos/${owner}/${repo}`, {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data;
};

// Fetch list of contributors
export const fetchRepoContributors = async (token: string, owner: string, repo: string) => {
  const response = await axios.get(`${GITHUB_API_URL}/repos/${owner}/${repo}/contributors`, {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data;
};

// Fetch README content
export const fetchRepoReadme = async (token: string, owner: string, repo: string) => {
  const response = await axios.get(`${GITHUB_API_URL}/repos/${owner}/${repo}/readme`, {
    headers: {Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3.raw"},
  });
  return response.data;
};

// Fetch merged PRs
export const fetchMergedPRs = async (token: string, owner: string, repo: string) => {
  const response = await axios.get(`${GITHUB_API_URL}/repos/${owner}/${repo}/pulls?state=closed`, {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data.filter((pr: any) => pr.merged_at !== null);
};

// Fetch issues
export const fetchRepoIssues = async (token: string, owner: string, repo: string) => {
  const response = await axios.get(`${GITHUB_API_URL}/repos/${owner}/${repo}/issues`, {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data;
};

// Fetch tags
export const fetchRepoTags = async (token: string, owner: string, repo: string) => {
  const response = await axios.get(`${GITHUB_API_URL}/repos/${owner}/${repo}/tags`, {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data;
};

// Fetch releases (new versions)
export const fetchRepoReleases = async (token: string, owner: string, repo: string) => {
  const response = await axios.get(`${GITHUB_API_URL}/repos/${owner}/${repo}/releases`, {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data;
};

// Fetch all repository metadata
export const fetchAllRepoData = async (token: string, owner: string, repo: string) => {
  const [details, contributors, readme, mergedPRs, issues, tags, releases] = await Promise.all([
    fetchRepoDetails(token, owner, repo),
    fetchRepoContributors(token, owner, repo),
    fetchRepoReadme(token, owner, repo),
    fetchMergedPRs(token, owner, repo),
    fetchRepoIssues(token, owner, repo),
    fetchRepoTags(token, owner, repo),
    fetchRepoReleases(token, owner, repo),
  ]);

  return {details, contributors, readme, mergedPRs, issues, tags, releases};
};
