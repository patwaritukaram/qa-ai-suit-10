import { test, expect } from '@playwright/test';


test.describe('Appointment Scheduling – Mandatory Fields Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Set viewport size for consistent testing
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('Create Provider User - John Stark', async ({ page }) => {
    // Test data
    const testData = {
      url: 'https://stage_aithinkitive.uat.provider.ecarehealth.com/',
      email: 'rose.gomez@jourrapide.com',
      password: 'Pass@123',
      newUser: {
        firstName: 'John',
        lastName: 'Stark',
        role: 'Provider',
        gender: 'Male',
        email: 'john@xyz.com'
      }
    };

    // Step 1: Login with email and password
    await test.step('Login with email and password', async () => {
      await page.goto(testData.url);
      await page.waitForLoadState('networkidle');
      
      // Fill email field
      const emailField = page.locator('input[name="username"], input[placeholder="Email"], input[type="email"]');
      await expect(emailField).toBeVisible();
      await emailField.fill(testData.email);
      
      // Fill password field
      const passwordField = page.locator('input[type="password"]');
      await expect(passwordField).toBeVisible();
      await passwordField.fill(testData.password);
      
      // Click login button
      const loginButton = page.locator('button:has-text("Let\'s get Started"), button[type="submit"], button:has-text("Login"), button:has-text("Sign in")');
      await expect(loginButton).toBeVisible();
      await loginButton.click();
      
      // Wait for successful login
      await page.waitForLoadState('networkidle');
      
      // Verify successful login by checking for dashboard elements
      await expect(page.locator('text=Dashboard')).toBeVisible({ timeout: 10000 });
    });

    // Step 2: Click on Settings on Main Navigation Bar
    await test.step('Navigate to Settings', async () => {
      const settingsLink = page.locator('*:text-is("Settings")');
      await expect(settingsLink).toBeVisible();
      await settingsLink.click();
      
      // Wait for settings page to load
      await page.waitForLoadState('networkidle');
    });

    // Step 3: Click on User Settings
    await test.step('Click on User Settings', async () => {
      const userSettingsLink = page.locator('*:text-is("User Settings")');
      await expect(userSettingsLink).toBeVisible();
      await userSettingsLink.click();
      
      // Wait for user settings page to load
      await page.waitForLoadState('networkidle');
    });

    // Step 4: Click on Providers
    await test.step('Click on Providers', async () => {
      const providersLink = page.locator('*:text-is("Providers")');
      await expect(providersLink).toBeVisible();
      await providersLink.click();
      
      // Wait for providers page to load
      await page.waitForLoadState('networkidle');
    });

    // Step 5: Click on Add Provider User button and fill details
    await test.step('Add new provider user', async () => {
      // Click Add Provider User button
      const addProviderButton = page.locator('*:text-is("Add Provider User")');
      await expect(addProviderButton).toBeVisible();
      await addProviderButton.click();
      
      // Wait for popup to appear
      await page.waitForSelector('.MuiDialog-root, .modal, [role="dialog"]', { timeout: 5000 });
      
      // Fill First Name
      const firstNameField = page.locator('input[name="firstName"], input[placeholder="First Name"]');
      await expect(firstNameField).toBeVisible();
      await firstNameField.fill(testData.newUser.firstName);
      
      // Fill Last Name
      const lastNameField = page.locator('input[name="lastName"], input[placeholder="Last Name"]');
      await expect(lastNameField).toBeVisible();
      await lastNameField.fill(testData.newUser.lastName);
      
      // Select Role from dropdown
      const roleDropdown = page.locator('select[name="role"], .MuiSelect-root:has-text("Role"), input[name="role"]');
      await expect(roleDropdown).toBeVisible();
      await roleDropdown.click();
      await page.locator('*:text-is("Provider")').click();
      
      // Select Gender from dropdown
      const genderDropdown = page.locator('select[name="gender"], .MuiSelect-root:has-text("Gender"), input[name="gender"]');
      await expect(genderDropdown).toBeVisible();
      await genderDropdown.click();
      await page.locator('*:text-is("Male")').click();
      
      // Fill Email
      const emailField = page.locator('input[name="email"], input[placeholder*="Email"], input[type="email"]');
      await expect(emailField).toBeVisible();
      await emailField.fill(testData.newUser.email);
    });

    // Step 6: Click Save button
    await test.step('Save the new user', async () => {
      const saveButton = page.locator('button:text-is("Save")');
      await expect(saveButton).toBeVisible();
      await expect(saveButton).toBeEnabled();
      await saveButton.click();
      
      // Wait for save operation to complete
      await page.waitForLoadState('networkidle');
      
      // Wait for popup to close (optional - depends on implementation)
      await page.waitForTimeout(2000);
    });

    // Expected Result: Verify user is created and visible in the list
    await test.step('Verify user is created and visible in list', async () => {
      // Wait for the providers list to refresh
      await page.waitForTimeout(2000);
      
      // Verify the new user appears in the list by checking for the name
      const userNameInList = page.locator(text="${testData.newUser.firstName} ${testData.newUser.lastName}");
      await expect(userNameInList).toBeVisible({ timeout: 10000 });
      
      // Verify the email is also visible in the list
      const userEmailInList = page.locator(text="${testData.newUser.email}");
      await expect(userEmailInList).toBeVisible();
      
      // Take screenshot to verify the result
      await page.screenshot({ path: 'test-results/user-created-successfully.png', fullPage: true });
      
      console.log(`User ${testData.newUser.firstName} ${testData.newUser.lastName} created successfully and is visible in the list`);
    });
  });

  // Cleanup after each test
  test.afterEach(async ({ page }) => {
    // Clear any stored authentication
    await page.context().clearCookies();
    await page.context().clearPermissions();
  });
});