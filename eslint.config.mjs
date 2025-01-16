import path from 'node:path'
import { fileURLToPath } from 'node:url'
// import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
// Definindo __filename e __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Criando compatibilidade com a configuração antiga
const compat = new FlatCompat({
  baseDirectory: __dirname,
})

// Exportando a configuração
export default [
  ...compat.extends('@rocketseat/eslint-config/react'),
  {
    files: ['**/*.{js,jsx,ts,tsx}'], // Definindo os tipos de arquivos que o ESLint irá verificar
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]

// import config from '@rocketseat/eslint-config/react.mjs'
// import simpleImportSort from 'eslint-plugin-simple-import-sort'

// export default [
//   ...config,
//   {
//     files: ['**/*.{js,jsx,ts,tsx}'],
//     languageOptions: {
//       parserOptions: {
//         ecmaVersion: 'latest',
//         sourceType: 'module',
//       },
//     },
//     plugins: {
//       'simple-import-sort': simpleImportSort,
//     },
//     rules: {
//       'simple-import-sort/imports': 'error',
//       'simple-import-sort/exports': 'error',
//       '@stylistic/max-len': 'off',
//     },
//   },
// ]
