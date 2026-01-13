# Noble Clarity Mobile App - Feature Testing & Debugging Guide

## 🔧 Pre-Testing Setup

### 1. Verify Backend Server Status
```bash
# Test if your backend is running
curl https://clarity.noblesworld.com.ng/revenue-intelligence
```

**Expected:** Should return JSON data or at least a 200 response
**If it fails:** Your backend server is down or not accessible

### 2. Check Server Logs
- Login to your cPanel
- Navigate to `clarity-server` directory
- Check if Node.js app is running
- Review error logs

---

## 📋 Feature Testing Checklist

### ✅ Authentication Features

#### Test 1: Google Sign-In
- [ ] Open app
- [ ] Tap "Sign in with Google"
- [ ] Select Google account
- [ ] **Expected:** Should login successfully
- [ ] **Actual Result:** _____________

#### Test 2: Email/Password Login
- [ ] Tap "Sign in with Email"
- [ ] Enter email and password
- [ ] **Expected:** Should login successfully
- [ ] **Actual Result:** _____________

#### Test 3: New User Auto-Redirect
- [ ] Login with brand new Google account
- [ ] **Expected:** Auto-redirect to Data Entry screen
- [ ] **Actual Result:** _____________

---

### ✅ Dashboard Features

#### Test 4: Dashboard Loading
- [ ] After login, dashboard should load
- [ ] **Expected:** See KPI cards (Revenue, Runway, Net Margin)
- [ ] **Actual Result:** _____________

#### Test 5: Pull-to-Refresh
- [ ] Swipe down on dashboard
- [ ] **Expected:** Loading indicator, then refreshed data
- [ ] **Actual Result:** _____________

#### Test 6: Action Buttons
- [ ] Tap "Business Profile" button
- [ ] **Expected:** Navigate to Business Profile screen
- [ ] **Actual Result:** _____________

- [ ] Tap "Cash Flow" button
- [ ] **Expected:** Navigate to Cash Flow screen
- [ ] **Actual Result:** _____________

- [ ] Tap "Update Data" button
- [ ] **Expected:** Navigate to Data Entry screen
- [ ] **Actual Result:** _____________

---

### ✅ AI Coach Features

#### Test 7: AI Coach Chat
- [ ] Tap the purple AI button (center bottom)
- [ ] Type a question: "What is my current runway?"
- [ ] **Expected:** AI responds with analysis
- [ ] **Actual Result:** _____________

**If it fails with "trouble connecting":**
- Backend `/gemini` endpoint is not working
- Check if Gemini API key is set in server environment variables

---

### ✅ Data Entry Features

#### Test 8: Manual Data Entry
- [ ] Navigate to Data Entry screen
- [ ] Switch to "Manual Entry" tab
- [ ] Fill in all fields:
  - Revenue: 100000
  - COGS: 30000
  - Operating Expenses: 40000
  - Current Assets: 200000
  - Current Liabilities: 50000
  - Leads: 500
  - Conversions: 50
  - Marketing Spend: 10000
- [ ] Tap "UPDATE ENGINE DATA"
- [ ] **Expected:** Success message, data saved
- [ ] **Actual Result:** _____________

#### Test 9: Integrations Tab
- [ ] Switch to "Integrations" tab
- [ ] Tap "Google Sheets"
- [ ] **Expected:** "Coming soon" message
- [ ] **Actual Result:** _____________

---

### ✅ ROI Intelligence Features

#### Test 10: ROI Dashboard
- [ ] Tap "ROI" in bottom navigation
- [ ] **Expected:** See Efficiency Funnel, Platform Performance
- [ ] **Actual Result:** _____________

#### Test 11: Social Media ROI
- [ ] Tap "Social" segment
- [ ] **Expected:** Navigate to Social Media ROI screen
- [ ] **Actual Result:** _____________

#### Test 12: Email Marketing ROI
- [ ] Tap "Email" segment
- [ ] **Expected:** Navigate to Email Marketing ROI screen
- [ ] **Actual Result:** _____________

---

### ✅ Scenario Planner Features

#### Test 13: Adjust Variables
- [ ] Tap "Lab" in bottom navigation
- [ ] Adjust "Marketing Spend" slider
- [ ] Adjust "New Hires" slider
- [ ] Adjust "Pricing Adjustment" slider
- [ ] **Expected:** Projected runway updates in real-time
- [ ] **Actual Result:** _____________

#### Test 14: AI Simulation
- [ ] Tap "PREDICT FUTURE IMPACT" button
- [ ] **Expected:** AI analyzes scenario and provides verdict
- [ ] **Actual Result:** _____________

---

### ✅ Goals Features

#### Test 15: View Goals
- [ ] Tap "Goals" in bottom navigation
- [ ] **Expected:** See list of financial goals
- [ ] **Actual Result:** _____________

#### Test 16: Add New Goal
- [ ] Tap "+" button
- [ ] Fill in goal details
- [ ] Tap "Save"
- [ ] **Expected:** Goal added to list
- [ ] **Actual Result:** _____________

---

### ✅ Settings Features

#### Test 17: Profile Settings
- [ ] Tap "Settings" in bottom navigation
- [ ] **Expected:** See user profile, business context
- [ ] **Actual Result:** _____________

#### Test 18: Business Profile
- [ ] Tap "Business Profile" from settings
- [ ] Edit company name
- [ ] Tap "SAVE PROFILE"
- [ ] **Expected:** Success message
- [ ] **Actual Result:** _____________

#### Test 19: Logout
- [ ] Scroll to bottom of Settings
- [ ] Tap "LOG OUT" button
- [ ] **Expected:** Return to login screen
- [ ] **Actual Result:** _____________

---

## 🐛 Common Issues & Fixes

### Issue 1: "Connection timed out"
**Cause:** Backend server not responding
**Fix:**
1. Check if server is running in cPanel
2. Verify `https://clarity.noblesworld.com.ng` is accessible
3. Check server logs for errors

### Issue 2: "AI trouble connecting"
**Cause:** Gemini API endpoint failing
**Fix:**
1. Verify `/gemini` endpoint exists in server.js
2. Check if `GEMINI_API_KEY` is set in environment variables
3. Test endpoint manually: `curl -X POST https://clarity.noblesworld.com.ng/gemini`

### Issue 3: Data not saving
**Cause:** `/revenue-intelligence` POST endpoint not working
**Fix:**
1. Check server.js for POST handler
2. Verify database connection
3. Check server logs

### Issue 4: Auto-redirect not working
**Cause:** Logic requires both revenue AND assets to be 0
**Fix:** Already implemented in latest build

---

## 📊 Testing Results Summary

| Feature | Status | Notes |
|---------|--------|-------|
| Google Sign-In | ⬜ | |
| Email Login | ⬜ | |
| Dashboard Load | ⬜ | |
| AI Coach | ⬜ | |
| Data Entry | ⬜ | |
| ROI Intelligence | ⬜ | |
| Scenario Planner | ⬜ | |
| Goals | ⬜ | |
| Settings | ⬜ | |

Legend: ✅ Working | ❌ Broken | ⚠️ Partial | ⬜ Not Tested

---

## 🔍 Next Steps

1. **Test Backend First:**
   ```bash
   curl https://clarity.noblesworld.com.ng/revenue-intelligence
   ```

2. **If backend is down:**
   - Login to cPanel
   - Restart Node.js application
   - Check logs

3. **If backend is up but app still fails:**
   - The issue is in the mobile app code
   - We'll need to add more error logging

4. **Report Results:**
   - Fill out the checklist above
   - Note which features work vs fail
   - I'll fix the broken ones
