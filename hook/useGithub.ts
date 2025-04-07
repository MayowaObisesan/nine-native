// hooks/useGetAppByName.ts
import {useQuery} from '@tanstack/react-query';
import {getBranchCommit, getRepo, getRepoBranches, getRepoStarsCount, getUserFollowers} from "~/api/github";

const GITHUB_QUERY_KEY = 'nine_github';

interface GithubFollower {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  type: string;
  site_admin: boolean;
}

interface GithubBranches {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  type: string;
  site_admin: boolean;
}

export function useGetGithubFollowers(username: string, page: number) {
  return useQuery<GithubFollower[], Error>({
    queryKey: [GITHUB_QUERY_KEY, 'followers', username, page],
    queryFn: async () => {
      try {
        const data = await getUserFollowers(username, page);
        if (!data) {
          throw new Error('No data returned from GitHub API');
        }
        if ('message' in data) {
          throw new Error(data.message);
        }
        return data;
      } catch (error) {
        throw error instanceof Error
          ? error
          : new Error('Failed to fetch GitHub followers');
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useGetGithubRepoBranches(owner: string, repo: string, page: number) {
  return useQuery<GithubBranches[], Error>({
    queryKey: [GITHUB_QUERY_KEY, 'branches', repo, page],
    queryFn: async () => {
      try {
        const data = await getRepoBranches(owner, repo, page);
        if (!data) {
          throw new Error('No data returned from GitHub API');
        }
        if ('message' in data) {
          throw new Error(data.message);
        }
        return data;
      } catch (error) {
        throw error instanceof Error
          ? error
          : new Error('Failed to fetch GitHub branches');
      }
    },
    retry: 2,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useGetGithubRepoStarsCount(owner: string, repo: string) {
  return useQuery<GithubBranches[], Error>({
    queryKey: [GITHUB_QUERY_KEY, 'stars_count', repo],
    queryFn: async () => {
      try {
        const data = await getRepoStarsCount(owner, repo);
        if (!data) {
          throw new Error('No data returned from GitHub API');
        }
        if ('message' in data) {
          throw new Error(data.message);
        }
        return data;
      } catch (error) {
        throw error instanceof Error
          ? error
          : new Error('Failed to fetch GitHub repo stars');
      }
    },
    retry: 2,
    staleTime: 60 * 60 * 1000, // 60 minutes
  });
}

export function useGetGithubRepo(owner: string, repo: string) {
  return useQuery<GithubBranches, Error>({
    queryKey: [GITHUB_QUERY_KEY, 'repo', repo],
    queryFn: async () => {
      try {
        const data = await getRepo(owner, repo);
        if (!data) {
          throw new Error('No data returned from GitHub API');
        }
        if ('message' in data) {
          throw new Error(data.message);
        }
        return data;
      } catch (error) {
        throw error instanceof Error
          ? error
          : new Error('Failed to fetch GitHub repo');
      }
    },
    retry: 2,
    staleTime: 60 * 60 * 1000, // 60 minutes
  });
}

export function useGetGithubCommit(url: string) {
  return useQuery<GithubBranches, Error>({
    queryKey: [GITHUB_QUERY_KEY, 'commit', url],
    queryFn: async () => {
      try {
        const data = await getBranchCommit(url);
        if (!data) {
          throw new Error('No data returned from GitHub API');
        }
        if ('message' in data) {
          throw new Error(data.message);
        }

        return data;
      } catch (error) {
        throw error instanceof Error
          ? error
          : new Error('Failed to fetch GitHub repo');
      }
    },
    retry: 2,
    staleTime: 60 * 60 * 1000, // 60 minutes
  });
}
