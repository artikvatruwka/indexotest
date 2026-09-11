# Indexo Demo

A small Expo (React Native + TypeScript) demo app: sign in with a personal ID code, browse posts, view post details.

## Demo

[Watch demo video](demo_record.mov)

## Stack

- Expo SDK 57 · React Native · TypeScript · expo-router
- TanStack Query v5 · Zod
- expo-secure-store (keychain session) · expo-crypto (token generation)
- Plain `StyleSheet` UI kit (no styling libraries); styles split into co-located `.styles.ts` files,
  excluded from mutation testing via the `src/**/*.styles.ts` pattern
- ESLint (strict type-checked) · Prettier
- jest-expo · @testing-library/react-native · Stryker mutation testing

## Testing

- 120 unit tests, **100% coverage enforced** by jest thresholds
- Mutation score **100%** in the gated run (Stryker, jest runner, break threshold 80)

```bash
npm test               # unit tests
npm run test:coverage  # tests + coverage gates (100%)
npm run test:mutation  # mutation testing (~4 min)
```

## Run

```bash
npm install
npm start      # Expo Go / simulator
```

Demo personal code: `010203-12345`
