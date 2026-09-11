import { fireEvent, render, screen } from '@testing-library/react-native';

import { ScreenState } from './screen-state';

describe('ScreenState', () => {
  it('shows only the spinner while loading', () => {
    render(<ScreenState state="loading" message="ignored" onRetry={jest.fn()} />);

    expect(screen.getByTestId('loading-state')).toBeOnTheScreen();
    expect(screen.getByTestId('loading-spinner').props.size).toBe('large');
    expect(screen.queryByText('ignored')).not.toBeOnTheScreen();
    expect(screen.queryByRole('button')).not.toBeOnTheScreen();
  });

  it('shows the message and retry button for errors', () => {
    const onRetry = jest.fn();
    render(<ScreenState state="error" message="Something broke" onRetry={onRetry} />);

    expect(screen.getByTestId('error-state')).toBeOnTheScreen();
    expect(screen.queryByTestId('loading-spinner')).not.toBeOnTheScreen();
    expect(screen.getByText('Something broke')).toBeOnTheScreen();
    expect(screen.queryByTestId('loading-state')).not.toBeOnTheScreen();

    fireEvent.press(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalled();
  });

  it('shows the error message without a retry button when no handler is given', () => {
    render(<ScreenState state="error" message="Broken without retry" />);

    expect(screen.getByText('Broken without retry')).toBeOnTheScreen();
    expect(screen.queryByRole('button')).not.toBeOnTheScreen();
  });

  it('shows the empty message without any action', () => {
    render(<ScreenState state="empty" message="Nothing here" onRetry={jest.fn()} />);

    expect(screen.getByTestId('empty-state')).toBeOnTheScreen();
    expect(screen.queryByTestId('loading-spinner')).not.toBeOnTheScreen();
    expect(screen.getByText('Nothing here')).toBeOnTheScreen();
    expect(screen.queryByRole('button')).not.toBeOnTheScreen();
  });
});
