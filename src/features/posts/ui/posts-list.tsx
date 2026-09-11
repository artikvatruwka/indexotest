import type { Post } from '@/entities/post/model';
import { ActivityIndicator, FlatList } from 'react-native';
import { palette } from '@/shared/theme';
import { ScreenState } from '@/shared/ui/screen-state';

import { usePostsQuery, useResetPosts } from '../hooks/use-posts-query';
import { PostCard } from './post-card';
import { styles } from './posts-list.styles';

export function flattenPages(pages: { posts: Post[] }[] | undefined): Post[] {
  return pages?.flatMap((page) => page.posts) ?? [];
}

export function postKey(post: Post): string {
  return String(post.id);
}

export function PostsList({ onPostPress }: { onPostPress: (post: Post) => void }) {
  const query = usePostsQuery();
  const resetPosts = useResetPosts();
  const posts = flattenPages(query.data?.pages);

  if (query.isLoading) {
    return <ScreenState state="loading" />;
  }
  if (query.isError) {
    return (
      <ScreenState
        state="error"
        message="Could not load posts. Check your connection and try again."
        onRetry={() => {
          void query.refetch();
        }}
      />
    );
  }
  if (posts.length === 0) {
    return <ScreenState state="empty" message="No posts yet." />;
  }

  return (
    <FlatList
      testID="posts-list"
      style={styles.list}
      data={posts}
      keyExtractor={postKey}
      renderItem={({ item }) => (
        <PostCard
          post={item}
          onPress={() => {
            onPostPress(item);
          }}
        />
      )}
      contentContainerStyle={styles.content}
      onEndReached={() => {
        if (query.hasNextPage && !query.isFetchingNextPage) {
          void query.fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      refreshing={query.isRefetching}
      onRefresh={resetPosts}
      ListFooterComponent={
        query.isFetchingNextPage ? (
          <ActivityIndicator testID="list-footer" color={palette.primary} style={styles.footer} />
        ) : null
      }
    />
  );
}
