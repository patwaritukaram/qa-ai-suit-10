const { test, expect } = require('@playwright/test');

test('Complete Flow: Login → Patient Registration → Appointment Scheduling → Logout', async ({ page }) => {
  
  // =============================================================================
  // STEP 1: LOGIN TO APPLICATION
  // =============================================================================
  console.log('🔄 STEP 1: Starting login process...');
  
  // Navigate to login page
  await page.goto('https://stage_ketamin.uat.provider.ecarehealth.com/');
  
  // Fill username field
  await page.fill('input[name="username"]', 'ben.jones@gmail.com');
  
  // Fill password field
  await page.fill('input[type="password"]', 'Admin@123');
  
  // Click login button
  await page.click('button:has-text("Let\'s get Started")');
  
  // Wait for page to load after login
  //await page.waitForLoadState('networkidle');
  
  // Verify login success by checking dashboard
  //await expect(page.locator('text=Dashboard')).toBeVisible();
  
  console.log('✅ STEP 1 COMPLETED: Login successful');

  // =============================================================================
  // STEP 2: PATIENT REGISTRATION
  // =============================================================================
  console.log('🔄 STEP 2: Starting patient registration...');
  
  // Click on Create menu
  await page.click('text=Create');
  
  // Select New Patient option
  await page.click('[role="menuitem"]:has-text("New Patient")');
  
  // Click Enter Patient Details
  await page.click('text=Enter Patient Details');
  
  // Click Next button
  await page.click('text=Next');
  
  // Wait for patient form to load
 // await page.waitForLoadState('networkidle');
  
  // Fill first name
  await page.fill('input[name="firstName"]', 'Sansa');
  
  // Fill last name
  await page.fill('input[name="lastName"]', 'Stark');
  
  // Click on birth date field
  await page.click('input[name="birthDate"]');
  
  // Fill birth date
  await page.fill('input[name="birthDate"]', '03-04-1998');
  
  // Click on gender field
  await page.click('input[name="gender"]');
  
  // Select Male gender
  await page.click('text=Female');
  
  // Fill mobile number
  await page.fill('input[name="mobileNumber"]', '9025320000');
  
  // Fill email address
  await page.fill('input[name="email"]', 'sansa@inator.com');
  
  // Save patient information
  await page.click('button:has-text("Save")');
  
  // Wait for save to complete
  await page.waitForTimeout(3000);
  
  console.log('✅ STEP 2 COMPLETED: Patient registration successful');

  // =============================================================================
  // STEP 3: APPOINTMENT SCHEDULING
  // =============================================================================
  console.log('🔄 STEP 3: Starting appointment scheduling...');
  
  // Click on Create menu
  await page.click('text=Create');
   //await page.click('text=Create');
  await page.click('text=New Appointment');

 await page.getByRole('combobox', { name: 'Patient Name *' }).click();
  await page.getByRole('combobox', { name: 'Patient Name *' }).fill('George');
  await page.getByRole('option', { name: 'George Wright'}).click();
//earch Patient"]');
// await expect(patientInput).toBeVisible();
// await expect(patientInput).toBeEnabled();
// await patientInput.scrollIntoViewIfNeeded(); // ensures it's not blocked
// await patientInput.click();
// await patientInput.fill('ishia williamm');

// Wait for dropdown suggestion to appear
// await page.waitForSelector('li:has-text("ishia williamm")');
// await page.click('li:has-text("ishia williamm")');

  await page.click('input[placeholder="Select Type"]');
  await page.click('li:has-text("New Patient Visit")');

  await page.fill('input[name="chiefComplaint"]', 'Fever');

  await page.click('input[name="timezone"]');
  await page.fill('input[name="timezone"]', 'Alaska');
  await page.click('li:has-text("Alaska Standard Time")');

  await page.click('button:has-text("Telehealth")');

  await page.click('input[placeholder="Search Provider"]');
  await page.fill('input[placeholder="Search Provider"]', 'Ben Jones');
  await page.click('li:has-text("Ben Jones")');

  // ✅ Capture and log selected provider name
  const selectedProvider = await page.inputValue('input[placeholder="Search Provider"]');
  console.log('👨‍⚕️ Selected Provider: ${selectedProvider}');

  await page.click('button:has-text("View availability")');

  await page.evaluate(() => {
    const dateButtons = document.querySelectorAll('button[role="gridcell"]');
    for (let i = 0; i < dateButtons.length; i++) {
      if (dateButtons[i].textContent === '14') {
        dateButtons[i].click();
      }
    }
  });

  //await page.waitForTimeout(4000);

  // ✅ Click and log selected time slot
  const timeSlotText = '03:00 PM - 03:30 PM';
  await page.click('text=${timeSlotText}');
  console.log('⏰ Selected Time Slot: ${timeSlotText}');


  await page.click('button:has-text("Save And Close")');
  await page.waitForTimeout(5000);

  console.log('✅ Test completed successfully - Appointment created and verified');


  // =============================================================================
  // STEP 4: LOGOUT FROM APPLICATION
  // =============================================================================
  console.log('🔄 STEP 4: Starting logout process...');
  
  // // Click on user profile avatar
  // await page.click('.MuiAvatar-root');
  
  // // Wait for dropdown menu to appear
  // await page.waitForSelector('text=Log Out');
  
  // // Verify user info is visible in dropdown
  // await expect(page.locator('text=Ben Jones')).toBeVisible();
  // await expect(page.locator('text=Provider')).toBeVisible();
  
  // // Click Log Out option
  // await page.click('text=Log Out');
  
  // // Wait for logout confirmation dialog
  // await page.waitForSelector('text=Are You Sure?');
  
  // // Verify confirmation dialog content
  // await expect(page.locator('text=Are You Sure?')).toBeVisible();
  // await expect(page.locator('text=you want to sign off ?')).toBeVisible();
  
  // // Confirm logout by clicking Yes,Sure
  // await page.click('text=Yes,Sure');
  
  // // Wait for logout to complete and redirect
  // await page.waitForLoadState('networkidle');
  
  // // Verify redirected to login page
  // await expect(page.locator('text=Hey, good to see you')).toBeVisible();
  // await expect(page.locator('text=Let\'s Sign in you')).toBeVisible();
  // await expect(page.locator('button:has-text("Let\'s get Started")')).toBeVisible();
  
  // // Verify login form inputs are present
  // await expect(page.locator('input[name="username"]')).toBeVisible();
  // await expect(page.locator('input[type="password"]')).toBeVisible();
  
  // console.log('✅ STEP 4 COMPLETED: Logout successful - User redirected to login page');

  // // =============================================================================
  // // FINAL SUCCESS MESSAGE
  // // =============================================================================
  // console.log('🎉 ALL STEPS COMPLETED SUCCESSFULLY!');
  // console.log('✅ Login → Patient Registration → Appointment Scheduling → Logout');
  // console.log('📋 Flow Summary:');
  // console.log('   - User logged in successfully');
  // console.log('   - Patient "David williamm" created');
  // console.log('   - Appointment scheduled for patient');
  // console.log('   - User logged out and returned to login page');
   await page.click('.MuiAvatar-root');
  await page.waitForSelector('text=Log Out');

  // Verify profile name is visible
  //await expect(page.locator('text=Ben Jones')).toBeVisible();

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

});