import stylistic from '@stylistic/eslint-plugin'
import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.jsx'], // ← Исправил путь
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
        process: 'readonly', // ← Добавил для Node.js
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // Stylistic правила
      '@stylistic/arrow-parens': 'error',
      '@stylistic/brace-style': 'error',
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/eol-last': 'error',
      '@stylistic/multiline-ternary': ['error', 'always-multiline'],
      '@stylistic/jsx-one-expression-per-line': 'error',
      
      // React правила
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/react-in-jsx-scope': 'off', // Для React 17+
      
      // React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      
      // Базовые правила
      'no-unused-vars': 'error',
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    },
    settings: {
      react: {
        version: 'detect', // Автоопределение версии React
      },
    },
    ignores: [ // ← Изменил с ignorePatterns
      'node_modules/',
      'build/',
      'dist/',
      'coverage/',
      '*.config.js',
    ],
  },
]