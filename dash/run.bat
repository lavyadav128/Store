@echo off
set "PATH=%PATH%;C:\Program Files\nodejs"
cd /d "%~dp0"
echo Starting Frontend on http://localhost:3000 ...
npm start
pause
