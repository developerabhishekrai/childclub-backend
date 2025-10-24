@echo off
echo ================================================
echo Backend Server Complete Restart
echo ================================================
echo.

echo Step 1: Killing any existing Node processes on port 3001...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do taskkill /F /PID %%a 2>nul
timeout /t 2 /nobreak >nul
echo Done!
echo.

echo Step 2: Rebuilding backend...
cd C:\xampp\htdocs\kidsclub\backend
call npm run build
echo.

echo Step 3: Checking compiled file...
findstr /C:"Fetching school for user ID" dist\auth\auth.service.js
if %ERRORLEVEL% EQU 0 (
    echo ✅ New code compiled successfully!
) else (
    echo ❌ New code NOT found in compiled file!
)
echo.

echo ================================================
echo Now manually start the server:
echo   cd C:\xampp\htdocs\kidsclub\backend
echo   npm run start:dev
echo ================================================
echo.
echo After server starts, test with browser console:
echo   fetch('http://localhost:3001/auth/login', {
echo     method: 'POST',
echo     headers: {'Content-Type': 'application/json'},
echo     body: JSON.stringify({
echo       email: 'aakash@yomail.com',
echo       password: 'Abhishek@123',
echo       role: 'school_admin'
echo     })
echo   }).then(r =^> r.json()).then(d =^> console.log('School ID:', d.user?.schoolId))
echo.
pause


