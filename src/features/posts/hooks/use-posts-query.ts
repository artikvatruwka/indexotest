import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { fetchPosts } from '@/entities/post/api';
import { useSession } from '@/entities/session/session-provider';

export function usePostsQuery() {
  const { session } = useSession();
  const token = session?.token;

  return useInfiniteQuery({
    queryKey: ['posts', token],
    queryFn: ({ pageParam }) => fetchPosts(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.hasMore ? lastPageParam + 1 : undefined,
    staleTime: 60_000, // 1 min
    retry: 1,
  });
}

export function useResetPosts() {
  const queryClient = useQueryClient();
  const { session } = useSession();
  const token = session?.token;

  return useCallback(() => {
    void queryClient.resetQueries({ queryKey: ['posts', token] });
  }, [queryClient, token]);
}
