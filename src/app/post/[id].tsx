import { Stack, useLocalSearchParams } from 'expo-router';

import { PostDetailsView } from '@/features/post-details/views/post-details-view';

export default function PostDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const postId = Array.isArray(id) ? id[0] : (id ?? '');

  return (
    <>
      <Stack.Screen options={{ title: '' }} />
      <PostDetailsView id={postId} />
    </>
  );
}
