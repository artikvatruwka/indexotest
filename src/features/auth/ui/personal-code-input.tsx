import { Fragment } from 'react';
import { Pressable, View } from 'react-native';

import { PERSONAL_CODE_LENGTH } from '@/entities/session/model';

import { ThemedText } from '@/shared/ui/themed-text';
import { styles } from './personal-code-input.styles';

const NUMPAD_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', null, '0', '⌫'] as const;

export function numpadKeyPressedStyle(pressed: boolean) {
  return pressed && styles.keyPressed;
}

export function keyLabel(key: string): string {
  return key === '⌫' ? 'Delete digit' : `Digit ${key}`;
}

export function isDashCell(index: number): boolean {
  return index === 5;
}

export function PersonalCodeInput({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (digits: string) => void;
  error?: string | null;
}) {
  const cells = Array.from({ length: PERSONAL_CODE_LENGTH }, (_, index) => value[index] ?? '');

  const pressDigit = (digit: string) => {
    if (value.length < PERSONAL_CODE_LENGTH) {
      onChange(value + digit);
    }
  };

  const pressBackspace = () => {
    if (value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.cellsSection}>
        <View
          accessibilityLabel={`Personal ID code, ${String(value.length)} of ${String(PERSONAL_CODE_LENGTH)} digits entered`}
          style={styles.cells}
        >
          {cells.map((char, index) => (
            <Fragment key={index}>
              <View
                testID={`cell-${String(index)}`}
                style={[styles.cell, index === value.length && styles.cellActive]}
              >
                {char !== '' && <ThemedText style={styles.cellDigit}>{char}</ThemedText>}
              </View>
              {isDashCell(index) && (
                <ThemedText variant="headline" style={styles.dash}>
                  -
                </ThemedText>
              )}
            </Fragment>
          ))}
        </View>

        <View testID="error-slot" style={styles.errorSlot}>
          {!!error && (
            <ThemedText variant="caption" style={styles.error}>
              {error}
            </ThemedText>
          )}
        </View>
      </View>

      <View style={styles.pad}>
        {NUMPAD_KEYS.map((key) =>
          key === null ? (
            <View key="spacer" testID="key-spacer" style={styles.keySpacer} />
          ) : (
            <Pressable
              key={key}
              testID={key === '⌫' ? 'key-backspace' : `key-${key}`}
              accessibilityRole="button"
              accessibilityLabel={keyLabel(key)}
              onPress={() => {
                if (key === '⌫') {
                  pressBackspace();
                } else {
                  pressDigit(key);
                }
              }}
              style={({ pressed }) => [styles.key, numpadKeyPressedStyle(pressed)]}
            >
              <ThemedText style={styles.keyLabel}>{key}</ThemedText>
            </Pressable>
          ),
        )}
      </View>
    </View>
  );
}
