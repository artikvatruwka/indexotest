import { fireEvent, render, screen } from '@testing-library/react-native';

import { PostCard, postCardPressedStyle } from './post-card';

const post = { id: 7, userId: 1, title: 'Post title', body: 'Short body' };

describe('PostCard', () => {
  it('renders the id badge, title and body', () => {
    render(<PostCard post={post} onPress={jest.fn()} />);

    expect(screen.getByText('#7')).toBeOnTheScreen();
    expect(screen.getByText('Post title')).toBeOnTheScreen();
    expect(screen.getByText('Short body')).toBeOnTheScreen();
  });

  it('opens the post on press', () => {
    const onPress = jest.fn();
    render(<PostCard testID="post-card" post={post} onPress={onPress} />);
    const card = screen.getByTestId('post-card');

    expect(card.props.style).toBe(false);
    fireEvent.press(card);

    expect(onPress).toHaveBeenCalled();
  });

  it('pressed feedback is pure logic', () => {
    expect(postCardPressedStyle(true)).toEqual({ opacity: 0.7 });
    expect(postCardPressedStyle(false)).toBe(false);
  });
});
