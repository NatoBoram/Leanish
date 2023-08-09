import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
	appId: 'com.natoboram.leanish',
	appName: 'Leanish',
	plugins: { CapacitorCookies: { enabled: true } },
	server: { androidScheme: 'https' },
	webDir: 'build',
}

export default config
