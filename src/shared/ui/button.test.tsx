import { fireEvent, render, screen } from '@testing-library/react-native';

import { Button, getButtonStyles, getMergedButtonStyles } from './button';

describe('Button', () => {
  it('renders the title with the default primary variant', () => {
    render(<Button testID="btn" title="Press me" onPress={jest.fn()} />);

    expect(screen.getByText('Press me')).toBeOnTheScreen();
    expect(screen.getByText('Press me').props.style).toContainEqual(
      expect.objectContaining({ fontSize: 16 }),
    );
    expect(screen.getByTestId('btn').props.style).toContainEqual(
      expect.objectContaining({ minHeight: 48 }),
    );
  });

  it('renders the secondary variant', () => {
    render(<Button variant="secondary" title="Secondary" onPress={jest.fn()} />);

    expect(screen.getByText('Secondary')).toBeOnTheScreen();
  });

  it('shows a white spinner instead of the title while loading (primary)', () => {
    render(<Button title="Loading" loading />);

    expect(screen.queryByText('Loading')).not.toBeOnTheScreen();
    expect(screen.getByTestId('button-spinner').props.color).toBe('#ffffff');
  });

  it('uses the petrol spinner color for non-primary loading variants', () => {
    render(<Button variant="secondary" title="Loading" loading />);

    expect(screen.getByTestId('button-spinner').props.color).toBe('#0f584f');
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    render(<Button title="Disabled" disabled onPress={onPress} />);

    fireEvent.press(screen.getByRole('button', { name: 'Disabled' }));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('applies the inactive style when disabled', () => {
    render(<Button title="Inactive" disabled />);

    expect(screen.getByRole('button', { name: 'Inactive' }).props.style).toContainEqual(
      expect.objectContaining({ opacity: 0.4 }),
    );
  });

  it('composes pressed and inactive feedback in the style logic', () => {
    expect(getButtonStyles('primary', false, true)).toContainEqual(
      expect.objectContaining({ opacity: 0.7 }),
    );
    expect(getButtonStyles('primary', false, false)).not.toContainEqual(
      expect.objectContaining({ opacity: 0.7 }),
    );
    expect(getButtonStyles('primary', true, false)).toContainEqual(
      expect.objectContaining({ opacity: 0.4 }),
    );
    expect(getButtonStyles('secondary', false, false)).toContainEqual(
      expect.objectContaining({ backgroundColor: '#e9fbf9' }),
    );
  });

  it('merges caller styles last in the style logic', () => {
    const merged = getMergedButtonStyles('primary', false, false, { marginTop: 8 });

    expect(merged).toContainEqual(expect.objectContaining({ minHeight: 48 }));
    expect(merged[merged.length - 1]).toEqual({ marginTop: 8 });
  });
});
