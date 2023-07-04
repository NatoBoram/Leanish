module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'plugin:@typescript-eslint/strict',
		'plugin:svelte/recommended',
		'plugin:svelte/prettier',
		'prettier',
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		project: './tsconfig.eslint.json',
		extraFileExtensions: ['.svelte'],
	},
	env: {
		browser: true,
		es2017: true,
		node: true,
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser',
			},
		},
	],
	rules: {
		'@typescript-eslint/consistent-type-exports': 'error',
		'@typescript-eslint/consistent-type-imports': 'error',
		'@typescript-eslint/default-param-last': 'error',
		'@typescript-eslint/method-signature-style': 'error',
		'@typescript-eslint/no-import-type-side-effects': 'error',
		'@typescript-eslint/prefer-readonly': 'error',
		'@typescript-eslint/promise-function-async': ['error', { checkArrowFunctions: false }],
		'@typescript-eslint/require-array-sort-compare': 'error',
		'@typescript-eslint/return-await': 'error',
		'@typescript-eslint/sort-type-constituents': 'error',
		'@typescript-eslint/switch-exhaustiveness-check': 'error',

		// SvelteKit uses that for returning errors in routes
		'@typescript-eslint/no-throw-literal': 'off',

		// Receiving markdown from the API
		'svelte/no-at-html-tags': 'off',
	},
}
