@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js is required to view this site.
  echo Install Node.js 20 or newer, then run this file again.
  pause
  exit /b 1
)

echo Starting Houston Mold Remediation Pros at http://localhost:4173/
echo Your default browser will open automatically.
echo Keep this window open while viewing the site.
echo Press Ctrl+C in this window when you are finished.
echo.

call npm run view

if errorlevel 1 (
  echo.
  echo The local preview could not start.
  pause
)
