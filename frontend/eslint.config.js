import stylistic from '@stylistic/eslint-plugin'
import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.jsx'],
    plugins: {
      '@stylistic': stylistic,
      'react': react,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        document: 'readonly',
        window: 'readonly',
        navigator: 'readonly',
        process: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {

      '@stylistic/arrow-parens': 'error',
      '@stylistic/brace-style': 'error',
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/eol-last': 'error',
      '@stylistic/multiline-ternary': ['error', 'always-multiline'],
      '@stylistic/jsx-one-expression-per-line': 'error',

      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/react-in-jsx-scope': 'off', // Для React 17+

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      'no-unused-vars': 'error',
    },
    settings: {
      react: {
        version: 'detect', // Автоопределение версии React
      },
    },
    ignores: [
      'node_modules/',
      'build/',
      'dist/',
      'coverage/',
      '*.config.js',
    ],
  },
]
