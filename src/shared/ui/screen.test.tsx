import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { Screen } from './screen';

it('renders children inside the safe area', () => {
  render(
    <Screen>
      <Text>Content</Text>
    </Screen>,
  );

  expect(screen.getByText('Content')).toBeOnTheScreen();
});
