import type { PlaywrightTestConfig } from '@playwright/test'

const reporter: PlaywrightTestConfig['reporter'] = [['html']]
if (process.env.CI) reporter.push(['dot'])
else reporter.push(['list'])
if (process.env.GITHUB_ACTIONS) reporter.push(['github'])

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'pnpm run build && pnpm run preview',
		port: 4173,
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/,
	reporter,
	use: { browserName: 'firefox' },
}

export default config
