const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const tseslint = require('typescript-eslint');
const jestPlugin = require('eslint-plugin-jest');
const prettierConfig = require('eslint-config-prettier');

module.exports = defineConfig([
  ...expoConfig,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
  },
  {
    files: ['**/*.{test,spec}.{ts,tsx}'],
    plugins: { jest: jestPlugin },
    languageOptions: { globals: jestPlugin.environments.globals.globals },
    rules: {
      ...jestPlugin.configs['flat/recommended'].rules,
      'jest/expect-expect': ['warn', { assertFunctionNames: ['expect'] }],
      // Tests trade type-narrowing ceremony for brevity; production code stays strict.
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      // RNTL idioms: awaiting act() and void-returning matchers in waitFor().
      '@typescript-eslint/await-thenable': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
    },
  },
  prettierConfig,
  {
    ignores: [
      'dist/**',
      '.expo/**',
      '.stryker-tmp/**',
      'reports/**',
      'coverage/**',
      'expo-env.d.ts',
      'eslint.config.js',
      'stryker.config.mjs',
      'stryker.all.mjs',
    ],
  },
]);
