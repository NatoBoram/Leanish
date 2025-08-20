import eslint from '@eslint/js'
import prettier from 'eslint-config-prettier'
import svelte from 'eslint-plugin-svelte'
import globals from 'globals'
import svelteParser from 'svelte-eslint-parser'
import tseslint from 'typescript-eslint'

export default tseslint.config(
	{
		extends: [
			eslint.configs.recommended,
			...tseslint.configs.strictTypeChecked,
			...tseslint.configs.stylisticTypeChecked,
			prettier,
		],
		files: ['.js', '.mjs', '.mts', '.svelte', '.ts'].flatMap(e => [`**/*${e}`, `*${e}`]),
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
			parser: tseslint.parser,
			parserOptions: { extraFileExtensions: ['.svelte'], project: './tsconfig.eslint.json' },
		},

		rules: {
			'@typescript-eslint/class-methods-use-this': [
				'error',
				{ ignoreClassesThatImplementAnInterface: true, ignoreOverrideMethods: true },
			],
			'@typescript-eslint/consistent-type-exports': 'error',
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{ fixStyle: 'separate-type-imports' },
			],
			'@typescript-eslint/default-param-last': 'error',
			'@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],
			'@typescript-eslint/method-signature-style': 'error',
			'@typescript-eslint/no-import-type-side-effects': 'error',
			'@typescript-eslint/no-unnecessary-qualifier': 'error',
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
			'@typescript-eslint/no-useless-empty-export': 'error',
			'@typescript-eslint/prefer-nullish-coalescing': ['error', { ignorePrimitives: true }],
			'@typescript-eslint/prefer-readonly': 'error',
			'@typescript-eslint/prefer-regexp-exec': 'error',
			'@typescript-eslint/promise-function-async': ['error', { checkArrowFunctions: false }],
			'@typescript-eslint/require-array-sort-compare': 'error',
			'@typescript-eslint/restrict-template-expressions': [
				'error',
				{ allowBoolean: true, allowNullish: true, allowNumber: true, allowRegExp: true },
			],
			'@typescript-eslint/return-await': 'error',
			'@typescript-eslint/sort-type-constituents': 'error',
			'@typescript-eslint/switch-exhaustiveness-check': 'error',
			'func-style': ['error', 'declaration'],

			'@typescript-eslint/no-throw-literal': 'off',
			'@typescript-eslint/only-throw-error': 'off',
			'@typescript-eslint/unbound-method': 'off',
			'@typescript-eslint/use-unknown-in-catch-callback-variable': 'off',
		},
	},

	{
		extends: [...svelte.configs['flat/recommended'], ...svelte.configs['flat/prettier']],
		files: ['.svelte'].flatMap(e => [`**/*${e}`, `*${e}`]),
		languageOptions: {
			parser: svelteParser,
			parserOptions: { project: './tsconfig.eslint.json', parser: tseslint.parser },
		},
		rules: {
			'@typescript-eslint/no-empty-function': 'off', // This is how you do optional events in SvelteKit
			'@typescript-eslint/no-unsafe-assignment': 'off', // This rule is broken when using `$props()`.
			'prefer-const': 'off', // This rule is broken when using `$props()`.
			'svelte/no-at-html-tags': 'off',
		},
	},

	{
		rules: {
			'@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
		},
		ignores: ['**/*.test.ts'],
	},

	{
		ignores: [
			'.pnpm-store/',
			'.svelte-kit/',
			'android/app/build/',
			'android/app/src/main/assets/public/',
			'build/',
			'capacitor-cordova-android-plugins/',
			'coverage/',
			'dist/',
			'node_modules/',
			'package/',
			'playwright-report/',
			'test-results/',

			'*.cjs',
			'*.tsbuildinfo',
			'**/$types.d.ts',
			'vite.config.js.timestamp-*',
			'vite.config.ts.timestamp-*',
		],
	},
)
