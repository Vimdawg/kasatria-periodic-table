#!/bin/bash

echo "🚀 Setting up Kasatria Periodic Table..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# Google OAuth 2.0 Client ID for Web application
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here

# CSV URL from Google Sheets (default provided)
NEXT_PUBLIC_CSV_URL=https://docs.google.com/spreadsheets/d/e/2PACX-1vSYQFf5uPRx3VOAoT2irE6Kw8LjXQse_QHHKMcyiy6qiwK07q_1JFwlNcAhkWShAoL74NurBBrQbhHR/pub?gid=8699197&single=true&output=csv
EOF
    echo "⚠️  Please update .env.local with your Google Client ID"
fi

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Get your Google OAuth Client ID from Google Cloud Console"
echo "2. Update NEXT_PUBLIC_GOOGLE_CLIENT_ID in .env.local"
echo "3. Run 'npm run dev' to start the development server"
echo ""
echo "📖 See README.md for detailed setup instructions"

