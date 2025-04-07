// hooks/useGetAppByName.ts
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useNineContext} from '~/contexts';
import {E_DBTables} from "~/types/enums";
import {supabase} from "~/lib/supabase";

export function useGetLatestApps(page: number = 1) {
  const DEFAULT_LOAD_COUNT = 10;
  const startRange = DEFAULT_LOAD_COUNT * (page - 1);
  const endRange = (DEFAULT_LOAD_COUNT * page) - 1;

  return useQuery({
    queryKey: ['latest_apps'],
    queryFn: async () => {
      const {data, error} = await supabase
        .from(E_DBTables.Apps)
        .select('*')
        .range(startRange, endRange);

      if (error) {
        throw error;
      }

      return data || [];
    }
  });
}

export function useGetUserApps(owner_email: string, page: number = 1) {
  const DEFAULT_LOAD_COUNT = 10;
  // if page === 1, startRange = 10 * (1-1) = 0
  // if page === 1, endRange = (10 * 1) - 1 = 9
  // if page === 2, startRange = 10 * (2-1) = 10
  // if page === 1, endRange = (10 * 2) - 1 = 19
  const startRange = DEFAULT_LOAD_COUNT * (page - 1);
  const endRange = (DEFAULT_LOAD_COUNT * page) - 1;

  return useQuery({
    queryKey: ['apps', owner_email],
    queryFn: async () => {
      const {data, error} = await supabase
        .from(E_DBTables.Apps)
        .select('*')
        .eq('owner', owner_email)
        .range(startRange, endRange);

      if (error) {
        throw error;
      }

      return data || [];
    },
    enabled: !!owner_email,
  });
}

export function useGetAppByName(appName: string) {
  return useQuery({
    queryKey: ['app', appName],
    queryFn: async () => {
      const {data, error} = await supabase
        .from(E_DBTables.Apps)
        .select('*')
        .eq('name', appName)
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    enabled: !!appName,
  });
}

export function useCreateApp() {
  const queryClient = useQueryClient();
  const {supabaseClient} = useNineContext();

  return useMutation<any[], Error>({
    mutationFn: async (newApp) => {
      const {data, error} = await supabaseClient
        .from(E_DBTables.Apps)
        .insert(newApp)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate all app queries to refresh lists
      queryClient.invalidateQueries({queryKey: ['latest_apps']});
    },
  });
}

interface UpdateAppParams {
  id: string;
  updates: {
    [key: string]: any;
  };
}

export function useUpdateApp() {
  const queryClient = useQueryClient();
  const {supabaseClient} = useNineContext();

  return useMutation<any, Error, UpdateAppParams>({
    mutationFn: async ({id, updates}) => {
      const {data, error} = await supabaseClient
        .from(E_DBTables.Apps)
        .update(updates)
        .eq('name', id)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate only the specific app that was updated
      queryClient.invalidateQueries({
        queryKey: ['app', variables.id]
      });
    },
  });
}

export function useUpdateAppAndRefreshApps() {
  const queryClient = useQueryClient();
  const {supabaseClient} = useNineContext();

  return useMutation<any, Error, UpdateAppParams>({
    mutationFn: async (updatedApp) => {
      const {data, error} = await supabaseClient
        .from(E_DBTables.Apps)
        .update(updatedApp)
        .eq('id', updatedApp.id)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate all app queries to refresh lists
      queryClient.invalidateQueries({queryKey: ['app', 'apps', 'latest_apps']});
    },
  });
}

interface SubscribeAppParams {
  [key: string]: any;
}

export function useSubscribeToApp() {
  const queryClient = useQueryClient();
  const {supabaseClient} = useNineContext();

  return useMutation<any, Error, SubscribeAppParams>({
    mutationFn: async (newSubscribe) => {
      const {data, error} = await supabaseClient
        .from(E_DBTables.Subscribe)
        .insert(newSubscribe)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate all app queries to refresh lists
      queryClient.invalidateQueries({queryKey: ['latest_apps', 'apps']});
    },
  });
}

export function useIsSubscribedToApp(app_id: string, subscriber_email: string) {
  return useQuery({
    queryKey: ['subscribed_app'],
    queryFn: async () => {
      const {count, data, error} = await supabase
        .from(E_DBTables.Subscribe)
        .select('*', {count: "exact", head: false})
        .match({'app_id': app_id, 'subscriber_email': subscriber_email});

      if (error) {
        console.error("Get IsSubscribedToApp error:", error.message);
        throw error;
      }

      return {data, count};
    },
    enabled: !!subscriber_email,
  });
}
