@echo off
echo 🚀 Setting up Kasatria Periodic Table...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js detected
node --version

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Create .env.local if it doesn't exist
if not exist .env.local (
    echo 📝 Creating .env.local file...
    (
        echo # Google OAuth 2.0 Client ID for Web application
        echo NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
        echo.
        echo # CSV URL from Google Sheets ^(default provided^)
        echo NEXT_PUBLIC_CSV_URL=https://docs.google.com/spreadsheets/d/e/2PACX-1vSYQFf5uPRx3VOAoT2irE6Kw8LjXQse_QHHKMcyiy6qiwK07q_1JFwlNcAhkWShAoL74NurBBrQbhHR/pub?gid=8699197&single=true&output=csv
    ) > .env.local
    echo ⚠️  Please update .env.local with your Google Client ID
)

echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Get your Google OAuth Client ID from Google Cloud Console
echo 2. Update NEXT_PUBLIC_GOOGLE_CLIENT_ID in .env.local
echo 3. Run 'npm run dev' to start the development server
echo.
echo 📖 See README.md for detailed setup instructions
pause

