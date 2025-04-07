// hooks/useGetAppCategories.ts
import {useQuery} from '@tanstack/react-query';
import {fetch} from "expo/fetch";

export function useGetAppCategories() {
  return useQuery<string[]>({
    queryKey: ['app-categories'],
    queryFn: async () => {
      const response = await fetch(`${process.env.EXPO_PUBLIC_RAILWAY_APP_BASE_URL}/app/category_list/`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      return data || [];
    },
  });
}
