import {useQuery} from "@tanstack/react-query";
import {supabase} from "~/lib/supabase";
import {E_DBTables} from "~/types/enums";

export function useUserTimeline(user_id: string) {
  return useQuery({
    queryKey: ['user_timeline', user_id],
    queryFn: async () => {
      const {data, error} = await supabase
        .from(E_DBTables.Timeline)
        .select('*')
        .eq('user', user_id);

      if (error) {
        throw error;
      }

      return data || [];
    },
    enabled: !!user_id,
  });
}

export function useAppTimeline(app_id: string) {
  return useQuery({
    queryKey: ['app_timeline', app_id],
    queryFn: async () => {
      const {data, error} = await supabase
        .from(E_DBTables.Timeline)
        .select('*')
        .eq('app', app_id);

      if (error) {
        throw error;
      }

      return data || [];
    },
    enabled: !!app_id,
  });
}
