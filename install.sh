#!/bin/bash

# Sort System Installation Script
# This script sets up the Sort System file organization platform

echo "🚀 Installing Sort System..."
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create data directory
echo "📁 Creating data directory..."
mkdir -p data

# Set up database
echo "🗄️  Setting up database..."
npm run dev &
DEV_PID=$!

# Wait for server to start
sleep 10

# Initialize database by making a request to scan files
echo "🔍 Initializing database..."
curl -s -X POST http://localhost:3000/api/scan-files > /dev/null 2>&1

# Stop the development server
kill $DEV_PID 2>/dev/null

echo "✅ Database initialized"

# Create desktop shortcut (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🖥️  Creating desktop shortcut..."
    
    # Create a simple script to start the application
    cat > start-sort-system.sh << 'EOF'
#!/bin/bash
cd "$(dirname "$0")"
npm run dev
EOF
    
    chmod +x start-sort-system.sh
    
    echo "✅ Desktop shortcut created: start-sort-system.sh"
fi

# Create system directories for organization
echo "📂 Creating system directories..."
mkdir -p ~/Sort-System/{Documents,Media,Code,Projects,Archives,Finance}

echo "✅ System directories created in ~/Sort-System/"

# Final setup
echo ""
echo "🎉 Sort System installation completed!"
echo "================================"
echo ""
echo "📋 Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Open http://localhost:3000 in your browser"
echo "3. Click 'Scan All Files' to organize your existing files"
echo "4. Create your first project in the Projects section"
echo "5. Start tracking your finances and todos"
echo ""
echo "🔧 Quick start commands:"
echo "  npm run dev     - Start development server"
echo "  npm run build   - Build for production"
echo "  npm run start   - Start production server"
echo ""
echo "📖 For more information, see README.md"
echo ""
echo "✨ Enjoy your new organized digital life!"
