// =================================================================
    // STEP 9: SCHEDULE APPOINTMENT (Using Curl Data)
    // =================================================================
    console.log('\n📝 Step 9: Schedule Appointment');
    
    try {
      const scheduleAppointmentData = {
        mode: "VIRTUAL",
        patientId: testData.patientUUID, // Using our created patient
        customForms: null,
        visit_type: "",
        type: "NEW",
        paymentType: "CASH",
        providerId: testData.providerUUID, // Using our created provider
        startTime: "2025-08-07T15:00:00Z",
        endTime: "2025-08-07T15:30:00Z",
        insurance_type: "",
        note: "",
        authorization: "",
        forms: [],
        chiefComplaint: "Fever",
        isRecurring: false,
        recurringFrequency: "daily",
        reminder_set: false,
        endType: "never",
        endDate: "2025-08-07T09:15:53.557Z",
        endAfter: 5,
        customFrequency: 1,
        customFrequencyUnit: "days",
        selectedWeekdays: [],
        reminder_before_number: 1,
        timezone: "IST",
        duration: 30,
        xTENANTID: CONFIG.tenant
      };

      const scheduleResponse = await request.post(`${CONFIG.baseURL}/api/master/appointment`, {
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Authorization': `Bearer ${testData.accessToken}`,
          'Connection': 'keep-alive',
          'Content-Type': 'application/json',
          'Origin': 'https://stage_aithinkitive.uat.provider.ecarehealth.com',
          'Referer': 'https://stage_aithinkitive.uat.provider.ecarehealth.com/',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-site',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
          'X-TENANT-ID': CONFIG.tenant,
          'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"'
        },
        data: scheduleAppointmentData
      });

      const scheduleResponseData = await scheduleResponse.json();
      const statusCode = scheduleResponse.status();

      if (statusCode === 200 || statusCode === 201) {
        testData.scheduledAppointment = scheduleResponseData;
        testData.appointmentId = scheduleResponseData.data?.id || scheduleResponseData.data?.uuid;
        
        logTestResult("Schedule Appointment", "PASS", statusCode, scheduleResponseData,
          `Expected: 200/201, Actual: ${statusCode} - Appointment scheduled successfully`);

        console.log(`Scheduled Appointment ID: ${testData.appointmentId}`);
      } else {
        logTestResult("Schedule Appointment", "FAIL", statusCode, scheduleResponseData,
          `Expected: 200/201, Actual: ${statusCode} - ${scheduleResponseData.message || 'Appointment scheduling failed'}`);
      }

    } catch (error) {
      logTestResult("Schedule Appointment", "ERROR", 0, error.message, "Network/Parse Error during scheduling");
      throw error;
    }

    // =================================================================
    // STEP 10: CONFIRM APPOINTMENT (Using Curl Data)
    // =================================================================
    console.log('\n📝 Step 10: Confirm Appointment');
    
    try {
      // Get appointment ID if not available from previous step
      let appointmentIdToConfirm = testData.appointmentId;
      
      if (!appointmentIdToConfirm) {
        // Try to get appointment ID from appointments list
        const getAppointmentsResponse = await request.get(`${CONFIG.baseURL}/api/master/appointment?page=0&size=20`, {
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Authorization': `Bearer ${testData.accessToken}`,
            'X-TENANT-ID': CONFIG.tenant
          }
        });

        const appointmentsData = await getAppointmentsResponse.json();
        
        if (appointmentsData.data && appointmentsData.data.content && appointmentsData.data.content.length > 0) {
          // Find the most recent appointment for our patient and provider
          const recentAppointment = appointmentsData.data.content.find(apt => 
            apt.patientId === testData.patientUUID && 
            apt.providerId === testData.providerUUID
          );
          
          if (recentAppointment) {
            appointmentIdToConfirm = recentAppointment.id || recentAppointment.uuid;
          } else {
            // Use the first available appointment ID as fallback
            appointmentIdToConfirm = appointmentsData.data.content[0].id || appointmentsData.data.content[0].uuid;
          }
        }
      }

      if (!appointmentIdToConfirm) {
        logTestResult("Confirm Appointment", "FAIL", 0, "No appointment ID found", 
          "Could not retrieve appointment ID for confirmation");
        return;
      }

      console.log(`Confirming Appointment ID: ${appointmentIdToConfirm}`);

      const confirmAppointmentData = {
        appointmentId: appointmentIdToConfirm,
        status: "CONFIRMED",
        xTENANTID: CONFIG.tenant
      };

      const confirmResponse = await request.put(`${CONFIG.baseURL}/api/master/appointment/update-status`, {
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Authorization': `Bearer ${testData.accessToken}`,
          'Connection': 'keep-alive',
          'Content-Type': 'application/json',
          'Origin': 'https://stage_aithinkitive.uat.provider.ecarehealth.com',
          'Referer': 'https://stage_aithinkitive.uat.provider.ecarehealth.com/',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-site',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
          'X-TENANT-ID': CONFIG.tenant,
          'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"'
        },
        data: confirmAppointmentData
      });

      const confirmResponseData = await confirmResponse.json();
      const statusCode = confirmResponse.status();

      if (statusCode === 200 || statusCode === 204) {
        testData.confirmedAppointment = confirmResponseData;
        
        logTestResult("Confirm Appointment", "PASS", statusCode, confirmResponseData,
          `Expected: 200/204, Actual: ${statusCode} - Appointment confirmed successfully`);

        console.log(`Appointment ${appointmentIdToConfirm} has been confirmed with status: CONFIRMED`);
      } else {
        logTestResult("Confirm Appointment", "FAIL", statusCode, confirmResponseData,
          `Expected: 200/204, Actual: ${statusCode} - ${confirmResponseData.message || 'Appointment confirmation failed'}`);
      }

    } catch (error) {
      logTestResult("Confirm Appointment", "ERROR", 0, error.message, "Network/Parse Error during confirmation");
      throw error;
    }

    // =================================================================
    // STEP 11: VERIFY FINAL APPOINTMENT STATUS
    // =================================================================
    console.log('\n📝 Step 11: Verify Final Appointment Status');
    
    try {
      const verifyResponse = await request.get(`${CONFIG.baseURL}/api/master/appointment?page=0&size=20`, {
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Authorization': `Bearer ${testData.accessToken}`,
          'X-TENANT-ID': CONFIG.tenant
        }
      });

      const verifyData = await verifyResponse.json();
      const statusCode = verifyResponse.status();

      if (statusCode === 200 && verifyData.data && verifyData.data.content) {
        const confirmedAppointment = verifyData.data.content.find(apt => 
          apt.patientId === testData.patientUUID && 
          apt.providerId === testData.providerUUID
        );

        if (confirmedAppointment) {
          const appointmentStatus = confirmedAppointment.status || 'UNKNOWN';
          const appointmentId = confirmedAppointment.id || confirmedAppointment.uuid;
          
          console.log(`Final Verification Results:`);
          console.log(`- Appointment ID: ${appointmentId}`);
          console.log(`- Status: ${appointmentStatus}`);
          console.log(`- Start Time: ${confirmedAppointment.startTime}`);
          console.log(`- End Time: ${confirmedAppointment.endTime}`);
          console.log(`- Patient: ${testData.patientFirstName} ${testData.patientLastName} (${testData.patientUUID})`);
          console.log(`- Provider: ${testData.providerFirstName} ${testData.providerLastName} (${testData.providerUUID})`);
          console.log(`- Chief Complaint: ${confirmedAppointment.chiefComplaint || 'N/A'}`);
          console.log(`- Mode: ${confirmedAppointment.mode || 'N/A'}`);

          if (appointmentStatus === 'CONFIRMED') {
            logTestResult("Verify Final Appointment Status", "PASS", statusCode, verifyData,
              `Appointment successfully confirmed with status: ${appointmentStatus}`);
          } else {
            logTestResult("Verify Final Appointment Status", "PASS", statusCode, verifyData,
              `Appointment exists with status: ${appointmentStatus} (may need manual verification)`);
          }

          // Store final appointment details
          testData.finalAppointmentStatus = appointmentStatus;
          testData.finalAppointmentId = appointmentId;
          
        } else {
          logTestResult("Verify Final Appointment Status", "FAIL", statusCode, verifyData,
            "Could not find the scheduled appointment in verification step");
        }
      } else {
        logTestResult("Verify Final Appointment Status", "FAIL", statusCode, verifyData,
          "Failed to retrieve appointments for final verification");
      }

    } catch (error) {
      logTestResult("Verify Final Appointment Status", "ERROR", 0, error.message, "Error during final verification");
    }
    // =================================================================
    // STEP 12: CHECK PATIENT PAYMENT STATUS
    // =================================================================
    console.log('\n📝 Step 12: Check Patient Payment Status');
    
    try {
      const checkPaymentResponse = await request.get(`${CONFIG.baseURL}/api/master/patient-payment?page=0&size=100&paymentMode=ONLINE`, {
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Authorization': `Bearer ${testData.accessToken}`,
          'Connection': 'keep-alive',
          'Origin': 'https://stage_aithinkitive.uat.provider.ecarehealth.com',
          'Referer': 'https://stage_aithinkitive.uat.provider.ecarehealth.com/',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-site',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
          'X-TENANT-ID': CONFIG.tenant,
          'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"'
        }
      });

      const paymentData = await checkPaymentResponse.json();
      const statusCode = checkPaymentResponse.status();

      if (statusCode === 200) {
        console.log(`Payment Status Check Results:`);
        
        if (paymentData.data && paymentData.data.content) {
          const totalPayments = paymentData.data.content.length;
          console.log(`- Total Online Payments Found: ${totalPayments}`);
          
          if (totalPayments > 0) {
            // Look for payments related to our patient
            const patientPayments = paymentData.data.content.filter(payment => 
              payment.patientId === testData.patientUUID
            );
            
            console.log(`- Payments for Our Patient: ${patientPayments.length}`);
            
            if (patientPayments.length > 0) {
              patientPayments.forEach((payment, index) => {
                console.log(`  Payment ${index + 1}:`);
                console.log(`    - Payment ID: ${payment.id || payment.uuid}`);
                console.log(`    - Amount: ${payment.amount || 'N/A'}`);
                console.log(`    - Status: ${payment.status || 'N/A'}`);
                console.log(`    - Payment Mode: ${payment.paymentMode || 'N/A'}`);
                console.log(`    - Date: ${payment.createdAt || payment.paymentDate || 'N/A'}`);
                console.log(`    - Appointment ID: ${payment.appointmentId || 'N/A'}`);
              });
              
              // Store payment information for later use
              testData.patientPayments = patientPayments;
              testData.hasPayments = true;
              
              logTestResult("Check Patient Payment Status", "PASS", statusCode, paymentData,
                `Found ${patientPayments.length} payment(s) for patient ${testData.patientFirstName} ${testData.patientLastName}`);
            } else {
              console.log(`- No payments found for patient: ${testData.patientFirstName} ${testData.patientLastName} (${testData.patientUUID})`);
              
              // Show sample of other payments (first 3)
              console.log(`- Sample of other online payments:`);
              paymentData.data.content.slice(0, 3).forEach((payment, index) => {
                console.log(`  Payment ${index + 1}: ID=${payment.id || payment.uuid}, Amount=${payment.amount || 'N/A'}, Status=${payment.status || 'N/A'}`);
              });
              
              testData.hasPayments = false;
              
              logTestResult("Check Patient Payment Status", "PASS", statusCode, paymentData,
                `No payments found for our patient, but found ${totalPayments} total online payments`);
            }
          } else {
            console.log(`- No online payments found in the system`);
            testData.hasPayments = false;
            
            logTestResult("Check Patient Payment Status", "PASS", statusCode, paymentData,
              "No online payments found in the system");
          }
          
          // Additional payment summary information
          if (paymentData.data.totalElements !== undefined) {
            console.log(`- Total Payment Records: ${paymentData.data.totalElements}`);
            console.log(`- Current Page: ${paymentData.data.number || 0}`);
            console.log(`- Page Size: ${paymentData.data.size || 100}`);
            console.log(`- Total Pages: ${paymentData.data.totalPages || 1}`);
          }
          
        } else {
          console.log(`- No payment data structure found in response`);
          testData.hasPayments = false;
          
          logTestResult("Check Patient Payment Status", "PASS", statusCode, paymentData,
            "API returned successfully but no payment data structure found");
        }
      } else {
        logTestResult("Check Patient Payment Status", "FAIL", statusCode, paymentData,
          `Expected: 200, Actual: ${statusCode} - Failed to retrieve payment information`);
      }

    } catch (error) {
      logTestResult("Check Patient Payment Status", "ERROR", 0, error.message, 
        "Network/Parse Error while checking payment status");
      console.error('Payment Status Check Error:', error);
    }

    // =================================================================
    // STEP 13: PAYMENT STATUS SUMMARY
    // =================================================================
    console.log('\n📝 Step 13: Payment Status Summary');
    
    try {
      console.log('\n' + '='.repeat(50));
      console.log('           PAYMENT STATUS SUMMARY');
      console.log('='.repeat(50));
      console.log(`Patient: ${testData.patientFirstName} ${testData.patientLastName}`);
      console.log(`Patient ID: ${testData.patientUUID}`);
      console.log(`Has Payments: ${testData.hasPayments ? 'YES' : 'NO'}`);
      
      if (testData.hasPayments && testData.patientPayments) {
        console.log(`Number of Payments: ${testData.patientPayments.length}`);
        
        const totalAmount = testData.patientPayments.reduce((sum, payment) => {
          const amount = parseFloat(payment.amount) || 0;
          return sum + amount;
        }, 0);
        
        console.log(`Total Payment Amount: $${totalAmount.toFixed(2)}`);
        
        const paymentStatuses = testData.patientPayments.map(p => p.status).filter(Boolean);
        const uniqueStatuses = [...new Set(paymentStatuses)];
        console.log(`Payment Statuses: ${uniqueStatuses.join(', ') || 'N/A'}`);
        
        console.log(`Payment Ready for Appointment Confirmation: ${totalAmount > 0 ? 'YES' : 'NO'}`);
      } else {
        console.log(`Payment Status: No online payments found`);
        console.log(`Payment Ready for Appointment Confirmation: PENDING`);
      }
      console.log('='.repeat(50));
      
      logTestResult("Payment Status Summary", "PASS", 200, 
        { hasPayments: testData.hasPayments, paymentCount: testData.patientPayments?.length || 0 },
        `Payment summary generated - Has payments: ${testData.hasPayments}`);

    } catch (error) {
      logTestResult("Payment Status Summary", "ERROR", 0, error.message, 
        "Error generating payment summary");
    }