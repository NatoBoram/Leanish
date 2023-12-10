import { expect, test } from '@playwright/test'
import { admin, site } from './consts.js'

test('Admin has admin badge', async ({ page }) => {
	await page.goto(`/${site}/u/${admin}`)
	await expect(page.getByTitle('Administrator')).toBeVisible()
})
