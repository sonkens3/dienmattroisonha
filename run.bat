@echo off
setlocal
chcp 65001 >nul

cd /d "%~dp0"

echo.
echo ========================================
echo  Solar website runner
echo ========================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js is not installed or not available in PATH.
  goto fail
)

where npm >nul 2>&1
if errorlevel 1 (
  echo [ERROR] npm is not installed or not available in PATH.
  goto fail
)

if not exist "node_modules\" (
  echo [1/3] Installing dependencies...
  call npm install
  if errorlevel 1 goto fail
) else (
  echo [1/3] Dependencies already installed.
)

echo.
echo [2/3] Running lint...
call npm run lint
if errorlevel 1 goto fail

echo.
echo [3/3] Running production build...
call npm run build
if errorlevel 1 goto fail

echo.
echo ========================================
echo  All checks passed.
echo ========================================
echo.

if /I "%~1"=="--ci" goto done

for /f %%p in ('powershell -NoProfile -Command "if (Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue) { '3000' } else { '' }"') do set EXISTING_PORT=%%p

if defined EXISTING_PORT (
  echo Website is already running:
  echo   http://localhost:%EXISTING_PORT%
  start "" "http://localhost:%EXISTING_PORT%"
  goto done
)

echo Starting development server...
echo   http://localhost:3000
echo.
start "Solar Website Dev Server" cmd /k "cd /d "%~dp0" && npm run dev -- --port 3000"

echo Waiting for server to respond...
powershell -NoProfile -Command "$ok=$false; for($i=0;$i -lt 30;$i++){ try { $r=Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 2; if($r.StatusCode -eq 200){$ok=$true; break} } catch {}; Start-Sleep -Seconds 1 }; if(-not $ok){ exit 1 }"
if errorlevel 1 (
  echo [WARN] Server did not respond yet. Check the dev server window.
  goto done
)

start "" "http://localhost:3000"
echo Website opened in your browser.
goto done

:fail
echo.
echo ========================================
echo  Checks failed. See the error above.
echo ========================================
echo.
if /I not "%~1"=="--ci" pause
exit /b 1

:done
if /I not "%~1"=="--ci" pause
exit /b 0
