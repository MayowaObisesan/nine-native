// hooks/useGetAppSocials.ts
import {useQuery} from '@tanstack/react-query';
import {fetch} from "expo/fetch";

export function useGetAppSocials() {
  return useQuery<string[]>({
    queryKey: ['app-socials'],
    queryFn: async () => {
      const response = await fetch(`${process.env.EXPO_PUBLIC_RAILWAY_APP_BASE_URL}/app/social_list/`);
      if (!response.ok) {
        throw new Error('Failed to fetch social list');
      }
      const data = await response.json();
      return data || [];
    },
  });
}
