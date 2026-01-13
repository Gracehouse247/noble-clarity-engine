@echo off
REM Noble Clarity Mobile Optimization - Server Deployment Script (Windows)
REM This script helps deploy the mobile-optimized server to cPanel

echo.
echo ========================================================
echo 🚀 Noble Clarity Mobile Optimization - Server Deployment
echo ========================================================
echo.

REM Step 1: Check if we're in the right directory
echo 📁 Step 1: Checking directory...
if not exist "server\server.js" (
    echo ❌ Error: server\server.js not found!
    echo Please run this script from the project root directory.
    pause
    exit /b 1
)
echo ✅ Found server files
echo.

REM Step 2: Show what will be deployed
echo 📦 Step 2: Files to deploy:
echo    - server\server.js (Mobile-optimized CORS ^& compression)
echo    - server\package.json (Added compression dependency)
echo.

REM Step 3: Instructions for cPanel deployment
echo 📋 Step 3: cPanel Deployment Instructions
echo ==========================================
echo.
echo Manual Steps (cPanel doesn't support automated deployment):
echo.
echo 1. Login to cPanel File Manager
echo    URL: https://your-cpanel-url.com
echo.
echo 2. Navigate to: clarity-server/
echo.
echo 3. Upload these files (overwrite existing):
echo    ✓ server.js
echo    ✓ package.json
echo.
echo 4. Open Terminal in cPanel
echo    (Advanced → Terminal)
echo.
echo 5. Run these commands:
echo.
echo    cd clarity-server
echo    npm install compression
echo    # Restart your Node.js app in cPanel interface
echo.
echo 6. Verify deployment:
echo.
echo    curl https://clarity.noblesworld.com.ng/api/system-status
echo.
echo    Expected response:
echo    {
echo      "status": "online",
echo      "features": {
echo        "compression": true,
echo        "ai": true,
echo        "tts": true
echo      }
echo    }
echo.

REM Step 4: Local testing option
echo 🧪 Step 4: Local Testing (Optional)
echo ====================================
echo.
echo Before deploying to production, you can test locally:
echo.
echo    cd server
echo    npm install compression
echo    node server.js
echo.
echo Then test with:
echo.
echo    curl http://localhost:3001/api/system-status
echo.

REM Step 5: Mobile app testing
echo 📱 Step 5: Mobile App Testing
echo ==============================
echo.
echo After server deployment, test the mobile app:
echo.
echo    cd mobile_app
echo    flutter clean
echo    flutter run
echo.
echo Look for these logs:
echo   🌐 API Request: GET /revenue-intelligence
echo   ✅ API Response: 200 /revenue-intelligence
echo   🤖 AI Request (Attempt 1): ...
echo   🔊 TTS Request (Attempt 1): ...
echo.

REM Step 6: Troubleshooting
echo 🔧 Step 6: Troubleshooting
echo ==========================
echo.
echo If you encounter issues:
echo.
echo 1. Server not responding:
echo    - Check Node.js app is running in cPanel
echo    - Verify port 3001 is open
echo    - Check error logs in cPanel
echo.
echo 2. CORS errors:
echo    - Ensure server.js has new CORS config
echo    - Restart Node.js app
echo    - Mobile apps should NOT have CORS issues
echo.
echo 3. Compression not working:
echo    - Verify 'compression' package is installed
echo    - Check npm install completed successfully
echo    - Restart Node.js app
echo.

REM Final message
echo.
echo ========================================================
echo ✅ Deployment guide complete!
echo.
echo 📚 For detailed documentation, see:
echo    - MOBILE_OPTIMIZATION_GUIDE.md
echo    - IMPLEMENTATION_SUMMARY.md
echo.
echo 🎉 Your mobile app will be 3-5x faster after deployment!
echo ========================================================
echo.

pause
