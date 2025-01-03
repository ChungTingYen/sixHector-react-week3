import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'no-unused-vars': 'warn', // 警告未使用的變數
      'no-console': 'off', // 允許使用 console.log
      // 'quotes': ['error', 'single'], // 強制使用單引號
      'semi': ['error', 'always'], // 強制每行末尾使用分號
      'indent': ['error', 2], // 強制使用2個空格的縮進
      'no-var': 'error', 
      'no-multiple-empty-lines': ['error', { 'max': 1 }], 
      'prefer-const': 'error',
	        'object-curly-spacing': ['error', 'always'], // 強制使用{}需要空格
      'space-infix-ops': ['error', { 'int32Hint': false }],
      'brace-style': ['error', '1tbs', { 'allowSingleLine': false }], 
      'object-curly-newline': ['error', { 'multiline': true, 'consistent': true }]
    },
  },
];
