import js from '@eslint/js'
import globals from 'globals'
import pluginReact from 'eslint-plugin-react'
import { defineConfig } from 'eslint/config'
import { includeIgnoreFile } from '@eslint/compat'
import stylistic from '@stylistic/eslint-plugin'
import { fileURLToPath } from 'url'

const gitIgnorePath = fileURLToPath(new URL('.gitignore', import.meta.url))

export default defineConfig([
  includeIgnoreFile(gitIgnorePath),

  // Основной конфиг
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    plugins: {
      '@stylistic': stylistic,
      'react': pluginReact,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        process: 'readonly', // Добавляем process
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // JavaScript правила
      ...js.configs.recommended.rules,
      // Stylistic правила
      ...stylistic.configs.recommended.rules,
      // React правила
      ...pluginReact.configs.recommended.rules,
      // Кастомные React правила
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
])
