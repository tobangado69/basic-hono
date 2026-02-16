@echo off
call "C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\vcvars64.bat" >nul 2>&1
set GYP_MSVS_VERSION=2022
cd /d "C:\Users\Administrator\devscale\week-3\basic-hono\my-app\node_modules\.pnpm\better-sqlite3@12.6.2\node_modules\better-sqlite3"
echo Current dir: %CD%
echo Rebuilding better-sqlite3...
npx --yes node-gyp rebuild 2>&1
echo Exit code: %errorlevel%
dir build\Release\better_sqlite3.node 2>nul
if not exist build\Release\better_sqlite3.node echo BUILD FAILED - no .node file produced
