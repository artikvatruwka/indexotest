import { useQuery } from '@tanstack/react-query';

import { fetchPost } from '@/entities/post/api';
import { useSession } from '@/entities/session/session-provider';

export function usePostQuery(id: string) {
  const { session } = useSession();
  const token = session?.token;

  return useQuery({
    queryKey: ['post', id, token],
    queryFn: () => fetchPost(id),
    staleTime: 60_000, // 1 min for demo purposes
    retry: 1,
  });
}
