@echo off
set "PATH=%PATH%;C:\Program Files\nodejs"
echo Starting EduPortal AI (Backend + Frontend)...
start "EduPortal Backend" cmd /k "cd /d %~dp0back && npm run dev"
start "EduPortal Frontend" cmd /k "cd /d %~dp0dash && npm start"
