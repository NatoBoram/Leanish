/* eslint-disable @typescript-eslint/no-unsafe-assignment,
	@typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires */
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{css,html,js,postcss,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				base: { container: colors.neutral[900], DEFAULT: colors.neutral[950] },
				danger: { container: colors.rose[900], DEFAULT: colors.rose[600] },
				muted: colors.zinc[400],
				primary: { container: colors.sky[900], DEFAULT: colors.sky[600] },
				on: {
					base: { container: colors.neutral[200], DEFAULT: colors.neutral[100] },
					danger: { container: colors.rose[100], DEFAULT: colors.rose[50] },
					muted: colors.zinc[50],
					primary: { container: colors.sky[100], DEFAULT: colors.sky[50] },
				},
			},
		},
	},
	safelist: ['h-5', 'h-6', 'w-5', 'w-6'],
	plugins: [require('@tailwindcss/typography')],
}
