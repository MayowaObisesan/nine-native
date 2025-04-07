import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {supabase} from "~/lib/supabase";
import {E_DBTables} from "~/types/enums";
import {useNineContext} from "~/contexts";

export function useGetUserByEmail(email: string) {
  return useQuery({
    queryKey: ['nine_user', email],
    queryFn: async () => {
      const {data, error} = await supabase
        .from(E_DBTables.User)
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        console.error("Get User By Email error:", error.message);
        throw error;
      }

      return data;
    },
    enabled: !!email,
  });
}

export function useGetUserByUsername(username: string) {
  return useQuery({
    queryKey: ['nine_user', username],
    queryFn: async () => {
      const {data, error} = await supabase
        .from(E_DBTables.User)
        .select('*')
        .eq('username', username)
        .single();

      if (error) {
        console.error("Get User By Username error:", error.message);
        throw error;
      }

      return data;
    },
    enabled: !!username,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  const {supabaseClient} = useNineContext();

  return useMutation({
    mutationFn: async (newUser) => {
      const {data, error} = await supabaseClient
        .from(E_DBTables.User)
        .insert(newUser)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate all app queries to refresh lists
      queryClient.invalidateQueries({queryKey: ['nine_user']});
    },
  });
}

interface UpdateAppParams {
  username: string;
  updates: {
    [key: string]: any;
  };
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const {supabaseClient} = useNineContext();

  return useMutation<any, Error, UpdateAppParams>({
    mutationFn: async ({username, updates}) => {
      const {data, error} = await supabaseClient
        .from(E_DBTables.User)
        .update(updates)
        .eq('username', username)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate only the specific app that was updated
      queryClient.invalidateQueries({
        queryKey: ['nine_user', variables.username]
      });
    },
  });
}

interface FollowUserParams {
    [key: string]: any;
}

export function useFollowUser() {
  const queryClient = useQueryClient();
  const {supabaseClient} = useNineContext();

  return useMutation<any, Error, FollowUserParams>({
    mutationFn: async (newFollow) => {
      const {data, error} = await supabaseClient
        .from(E_DBTables.Follow)
        .insert(newFollow)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate all app queries to refresh lists
      queryClient.invalidateQueries({queryKey: ['nine_user']});
    },
  });
}

export function useIsFollowingUser(follower_email: string, followed_user_email: string) {
  return useQuery({
    queryKey: ['nine_user', follower_email],
    queryFn: async () => {
      const {count, data, error} = await supabase
        .from(E_DBTables.Follow)
        .select('*', {count: "exact", head: false})
        .match({'follower': follower_email, 'followed_user': followed_user_email});

      if (error) {
        console.error("Get IsFollowingUser error:", error.message);
        throw error;
      }

      return {data, count};
    },
    enabled: !!follower_email,
  });
}
