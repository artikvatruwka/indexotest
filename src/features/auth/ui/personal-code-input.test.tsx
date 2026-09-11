import { fireEvent, render, screen, within } from '@testing-library/react-native';

import {
  isDashCell,
  keyLabel,
  numpadKeyPressedStyle,
  PersonalCodeInput,
} from './personal-code-input';

function renderInput(value = '', onChange = jest.fn()) {
  return render(<PersonalCodeInput value={value} onChange={onChange} />);
}

function pressDigits(digits: string) {
  for (const digit of digits) {
    fireEvent.press(screen.getByTestId(`key-${digit}`));
  }
}

describe('isDashCell', () => {
  it('marks only the 6th cell as the dash slot', () => {
    expect(isDashCell(5)).toBe(true);
    expect(isDashCell(4)).toBe(false);
    expect(isDashCell(6)).toBe(false);
  });
});

describe('keyLabel', () => {
  it('maps numpad keys to accessibility labels', () => {
    expect(keyLabel('1')).toBe('Digit 1');
    expect(keyLabel('⌫')).toBe('Delete digit');
  });
});

describe('PersonalCodeInput', () => {
  it('renders 11 cells with a dash separator after the 6th', () => {
    renderInput();

    expect(screen.getByLabelText('Personal ID code, 0 of 11 digits entered')).toBeOnTheScreen();
    expect(screen.getAllByText('-')).toHaveLength(1);
  });

  it('appends pressed digits to the value', () => {
    const onChange = jest.fn();
    renderInput('010', onChange);

    pressDigits('2');

    expect(onChange).toHaveBeenCalledWith('0102');
  });

  it('renders exactly the entered digits in the cells', () => {
    renderInput('0102');

    expect(within(screen.getByTestId('cell-0')).getByText('0')).toBeOnTheScreen();
    expect(within(screen.getByTestId('cell-1')).getByText('1')).toBeOnTheScreen();
    expect(within(screen.getByTestId('cell-2')).getByText('0')).toBeOnTheScreen();
    expect(within(screen.getByTestId('cell-3')).getByText('2')).toBeOnTheScreen();
    expect(within(screen.getByTestId('cell-4')).queryByText(/^\d$/)).not.toBeOnTheScreen();
    expect(screen.getByTestId('cell-4').children).toHaveLength(0);
  });

  it('highlights only the next cell to fill', () => {
    renderInput('0102');

    expect(screen.getByTestId('cell-4').props.style).toContainEqual(
      expect.objectContaining({ borderColor: '#0f584f' }),
    );
    expect(screen.getByTestId('cell-0').props.style).not.toContainEqual(
      expect.objectContaining({ borderColor: '#0f584f' }),
    );
  });

  it('keeps a spacer slot in the numpad bottom row', () => {
    renderInput();

    expect(screen.getByTestId('key-spacer')).toBeOnTheScreen();
  });

  it('applies the key base style to numpad buttons', () => {
    renderInput();

    expect(screen.getByTestId('key-1').props.style).toContainEqual(
      expect.objectContaining({ width: '30%' }),
    );
  });

  it('ignores digits beyond 11 characters', () => {
    const onChange = jest.fn();
    renderInput('12345678901', onChange);

    pressDigits('5');

    expect(onChange).not.toHaveBeenCalled();
  });

  it('removes the last digit on backspace', () => {
    const onChange = jest.fn();
    renderInput('010203', onChange);

    fireEvent.press(screen.getByTestId('key-backspace'));

    expect(onChange).toHaveBeenCalledWith('01020');
  });

  it('backspace on an empty value does nothing', () => {
    const onChange = jest.fn();
    renderInput('', onChange);

    fireEvent.press(screen.getByTestId('key-backspace'));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('highlights the next cell to fill', () => {
    renderInput('0102');

    expect(screen.getByLabelText('Personal ID code, 4 of 11 digits entered')).toBeOnTheScreen();
  });

  it('shows the error message when provided', () => {
    render(<PersonalCodeInput value="" onChange={jest.fn()} error="Wrong code" />);

    expect(screen.getByText('Wrong code')).toBeOnTheScreen();
  });

  it('keeps the error slot reserved when there is no error (no layout shift)', () => {
    renderInput();

    expect(screen.getByTestId('error-slot')).toBeOnTheScreen();
  });

  it('pressed numpad feedback is pure logic', () => {
    expect(numpadKeyPressedStyle(true)).toEqual(
      expect.objectContaining({ backgroundColor: '#e9fbf9' }),
    );
    expect(numpadKeyPressedStyle(false)).toBe(false);
  });
});
