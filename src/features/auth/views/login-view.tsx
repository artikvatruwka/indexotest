import { View } from 'react-native';
import { VALID_PERSONAL_CODE } from '@/shared/config/constants';

import { Screen } from '@/shared/ui/screen';
import { ThemedText } from '@/shared/ui/themed-text';

import { useLogin } from '../hooks';
import { PersonalCodeInput } from '../ui/personal-code-input';
import { styles } from './login-view.styles';

export function LoginView() {
  const { code, error, handleChange } = useLogin();

  return (
    <Screen>
      <View style={styles.hero}>
        <ThemedText variant="largeTitle">Welcome to Indexo</ThemedText>
        <ThemedText variant="subhead">Sign in with your personal ID code to continue.</ThemedText>
        <ThemedText variant="caption">Demo personal code: {VALID_PERSONAL_CODE}</ThemedText>
      </View>
      <PersonalCodeInput value={code} onChange={handleChange} error={error} />
    </Screen>
  );
}
