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
				danger: { container: colors.rose[800], DEFAULT: colors.rose[600] },
				muted: colors.zinc[400],
				primary: { container: colors.sky[900], DEFAULT: colors.sky[600] },
				secondary: { container: colors.yellow[700], DEFAULT: colors.yellow[400] },
				success: { container: colors.emerald[950], DEFAULT: colors.emerald[400] },
				surface: { container: colors.neutral[800], DEFAULT: colors.neutral[200] },
				warning: { container: colors.amber[900], DEFAULT: colors.amber[600] },
				on: {
					base: { container: colors.neutral[200], DEFAULT: colors.neutral[100] },
					danger: { container: colors.rose[50], DEFAULT: colors.rose[50] },
					muted: colors.zinc[50],
					primary: { container: colors.sky[100], DEFAULT: colors.sky[50] },
					secondary: { container: colors.yellow[200], DEFAULT: colors.yellow[800] },
					success: { container: colors.emerald[50], DEFAULT: colors.emerald[950] },
					surface: { container: colors.neutral[200], DEFAULT: colors.neutral[950] },
					warning: { container: colors.amber[100], DEFAULT: colors.amber[50] },
				},
			},
		},
	},
	// safelist: ['h-5', 'h-6', 'w-5', 'w-6'],
	plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
