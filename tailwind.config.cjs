/* eslint-disable @typescript-eslint/no-unsafe-assignment,
	@typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires */
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{css,html,js,postcss,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				base: colors.slate[100],
				contrast: colors.slate[800],
				danger: { container: colors.rose[200], DEFAULT: colors.rose[500] },
				muted: colors.zinc[400],
				primary: { container: colors.sky[200], DEFAULT: colors.sky[500] },
				surface: colors.slate[200],
				on: {
					base: colors.slate[900],
					contrast: colors.slate[100],
					danger: { container: colors.rose[600], DEFAULT: colors.rose[50] },
					muted: colors.zinc[50],
					primary: { container: colors.sky[700], DEFAULT: colors.sky[50] },
					surface: colors.slate[800],
				},
			},
		},
	},
	plugins: [],
}
