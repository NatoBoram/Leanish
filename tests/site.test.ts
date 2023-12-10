import { expect, test } from '@playwright/test'
import { site } from './consts.js'

test('Site page has login button', async ({ page }) => {
	await page.goto(`/${site}`)

	await expect(page.getByRole('link', { name: 'Login' })).toBeVisible()
})

test('Site page can nagivate to post page', async ({ page }) => {
	await page.goto(`/${site}`)

	const title = page.getByRole('article').getByRole('heading').getByRole('link').first()
	await expect(title).toBeVisible()

	await title.click()
	await page.waitForURL(`**/${site}/post/**`)
})
