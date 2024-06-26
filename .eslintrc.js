const MicrosoftGraph = require('@microsoft/eslint-config-msgraph');
module.exports = {
    env: {
      browser: true,
      es6: true,
      node: true
    },
    extends: MicrosoftGraph.extends.filter((ext) => ext !== 'plugin:react/recommended'),
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: [
        'packages/abstractions/tsconfig.json',
        'packages/authentication/azure/tsconfig.json',
        'packages/authentication/azure/tsconfig.json',
        'packages/http/fetch/tsconfig.json',
        'packages/serialization/form/tsconfig.json',
        'packages/serialization/json/tsconfig.json',
        'packages/serialization/multipart/tsconfig.json',
        'packages/authentication/azure/tsconfig.json',
        'packages/test/tsconfig.json'
      ],
      sourceType: 'module'
    },
    plugins: ['eslint-plugin-jsdoc', 'eslint-plugin-prefer-arrow', '@typescript-eslint', 'header'],
    root: true,
    ignorePatterns: ['.eslintrc.js', '*.mjs'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      'prefer-arrow/prefer-arrow-functions': 'warn',
      // prefer-nullish-coalescing requires strictNullChecking to be turned on
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      'header/header': [
        2,
        'block',
        [
          '*',
          ' * -------------------------------------------------------------------------------------------',
          ' * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.',
          ' * See License in the project root for license information.',
          ' * -------------------------------------------------------------------------------------------',
          ' '
        ],
        1
      ]
    }
  };
