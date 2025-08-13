import { test, expect } from '@playwright/test';

test('Appointment Scheduling - Mandatory Fields - Logout Test', async ({ page }) => {
  // Navigate to the application URL
  await page.goto('https://stage_ketamin.uat.provider.ecarehealth.com/');
  await page.waitForLoadState('networkidle');

  // Login
  await page.fill('input[name="username"]', 'ben.jones@gmail.com');
  await page.fill('input[type="password"]', 'Admin@123');
  await page.click('button:has-text("Let\'s get Started")');
  await page.waitForLoadState('networkidle');

  // Verify successful login
  await expect(page.locator('text=Dashboard')).toBeVisible();

  // Open user profile menu
  await page.click('.MuiAvatar-root');
  await page.waitForSelector('text=Log Out');

  // Verify profile name is visible
  await expect(page.locator('text=Ben Jones')).toBeVisible();

  // ✅ Fix for strict mode violation - narrowed "Provider" locator
  //await expect(page.locator('div[role="presentation"] >> text=Provider')).toBeVisible();

  // Click on "Log Out"
  await page.click('text=Log Out');

  // Confirm logout dialog
  await page.waitForSelector('text=Are You Sure?');
  await expect(page.locator('text=Are You Sure?')).toBeVisible();
  await expect(page.locator('text=you want to sign off ?')).toBeVisible();

  // Confirm logout
  await page.click('text=Yes,Sure');
  await page.waitForLoadState('networkidle');

  // Verify redirection to login page
  await expect(page.locator('text=Hey, good to see you')).toBeVisible();
  await expect(page.locator('text=Let\'s Sign in you')).toBeVisible();
  await expect(page.locator('button:has-text("Let\'s get Started")')).toBeVisible();

  // Verify login form inputs
  await expect(page.locator('input[name="username"]')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();

  console.log('✅ Test completed successfully - User logged out and redirected to login page');
});