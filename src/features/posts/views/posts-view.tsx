import { Pressable, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';

import { useSignOut } from '@/features/auth/hooks';

import { Screen } from '@/shared/ui/screen';
import { ThemedText } from '@/shared/ui/themed-text';

import { PostsList } from '../ui/posts-list';
import { screenEdges, styles } from './posts-view.styles';

const screenOptions = { headerShown: false, title: 'Posts' };

export function PostsView() {
  const router = useRouter();
  const signOut = useSignOut();

  return (
    <Screen style={styles.fullBleed} edges={screenEdges}>
      <Stack.Screen options={screenOptions} />
      <View style={styles.header}>
        <ThemedText variant="headline">Posts</ThemedText>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            void signOut();
          }}
        >
          <ThemedText variant="headline" style={styles.signOut}>
            Sign out
          </ThemedText>
        </Pressable>
      </View>
      <PostsList
        onPostPress={(post) => {
          router.push({ pathname: '/post/[id]', params: { id: String(post.id) } });
        }}
      />
    </Screen>
  );
}
