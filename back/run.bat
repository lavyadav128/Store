@echo off
set "PATH=%PATH%;C:\Program Files\nodejs"
cd /d "%~dp0"
echo Starting Backend Server on http://localhost:5000 ...
npm run dev
pause
