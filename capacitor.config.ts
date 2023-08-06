import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
	appId: 'com.natoboram.leanish',
	appName: 'Leanish',
	webDir: 'build',
	server: {
		androidScheme: 'https',
	},
}

export default config
