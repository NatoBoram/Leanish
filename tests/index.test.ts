import { expect, test } from '@playwright/test'

test('Home page has site form', async ({ page }) => {
	await page.goto('/')

	await expect(page.getByRole('heading', { name: 'Leanish' })).toBeVisible()
	await expect(page.getByRole('textbox')).toBeVisible()
	await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible()
})
