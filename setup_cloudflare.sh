#!/bin/bash
# Cloudflare Tunnel Setup Script for Paulette's 80th Birthday Trivia Game

echo "🎂 Setting up Cloudflare Tunnel for Paulette's Birthday Trivia Game"
echo "=================================================================="
echo ""

# Check if running as root (required for some operations)
if [[ $EUID -eq 0 ]]; then
    echo "⚠️  Please run this script as a regular user, not as root"
    exit 1
fi

# Step 1: Download and install cloudflared
echo "📥 Step 1: Installing cloudflared..."
echo ""

# Download cloudflared for Linux
if ! command -v cloudflared &> /dev/null; then
    echo "Downloading cloudflared..."
    wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
    
    if [ $? -eq 0 ]; then
        echo "Installing cloudflared (may require sudo password)..."
        sudo dpkg -i cloudflared-linux-amd64.deb
        
        # Clean up downloaded file
        rm cloudflared-linux-amd64.deb
        
        echo "✅ cloudflared installed successfully!"
    else
        echo "❌ Failed to download cloudflared"
        exit 1
    fi
else
    echo "✅ cloudflared is already installed"
fi

echo ""
echo "🔐 Step 2: Authenticate with Cloudflare"
echo "========================================"
echo ""
echo "You need to authenticate cloudflared with your Cloudflare account."
echo "This will open a browser window where you'll log in to Cloudflare."
echo ""
read -p "Press Enter to continue..."

# Authenticate with Cloudflare
cloudflared tunnel login

if [ $? -eq 0 ]; then
    echo "✅ Successfully authenticated with Cloudflare!"
else
    echo "❌ Authentication failed. Please try again."
    exit 1
fi

echo ""
echo "🚇 Step 3: Create the tunnel"
echo "============================"
echo ""

# Create a tunnel named 'paulette-trivia'
TUNNEL_NAME="paulette-trivia"
echo "Creating tunnel named: $TUNNEL_NAME"

cloudflared tunnel create $TUNNEL_NAME

if [ $? -eq 0 ]; then
    echo "✅ Tunnel '$TUNNEL_NAME' created successfully!"
else
    echo "❌ Failed to create tunnel. It may already exist."
    echo "Listing existing tunnels..."
    cloudflared tunnel list
fi

echo ""
echo "🔗 Step 4: Configure DNS"
echo "========================"
echo ""
echo "Now you need to create a DNS record to point paulette.haydd.com to your tunnel."
echo ""

# Get tunnel ID
TUNNEL_ID=$(cloudflared tunnel list | grep $TUNNEL_NAME | awk '{print $1}')

if [ -n "$TUNNEL_ID" ]; then
    echo "Tunnel ID: $TUNNEL_ID"
    echo ""
    echo "Creating DNS record for paulette.haydd.com..."
    
    cloudflared tunnel route dns $TUNNEL_NAME paulette.haydd.com
    
    if [ $? -eq 0 ]; then
        echo "✅ DNS record created successfully!"
    else
        echo "⚠️  DNS record creation may have failed. You can create it manually in Cloudflare dashboard."
        echo "   Domain: paulette.haydd.com"
        echo "   Type: CNAME"
        echo "   Target: $TUNNEL_ID.cfargotunnel.com"
    fi
else
    echo "❌ Could not find tunnel ID"
fi

echo ""
echo "📝 Step 5: Create tunnel configuration"
echo "======================================"
echo ""

# Create config directory
mkdir -p ~/.cloudflared

# Create tunnel configuration
cat > ~/.cloudflared/config.yml << EOF
tunnel: $TUNNEL_NAME
credentials-file: ~/.cloudflared/$TUNNEL_ID.json

ingress:
  - hostname: paulette.haydd.com
    service: http://localhost:8000
  - service: http_status:404
EOF

echo "✅ Tunnel configuration created at ~/.cloudflared/config.yml"

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Your Cloudflare tunnel is now configured!"
echo ""
echo "To start the tunnel and make your trivia game accessible at paulette.haydd.com:"
echo ""
echo "1. Start your trivia game server:"
echo "   python3 server.py 8090"
echo ""
echo "2. In another terminal, start the tunnel:"
echo "   cloudflared tunnel run $TUNNEL_NAME"
echo ""
echo "3. Your game will be available at: https://paulette.haydd.com"
echo ""
echo "💡 Pro tip: You can run both commands in the background or use the"
echo "   start_tunnel.sh script that will be created for you."
echo ""

# Create a convenience script to start everything
cat > start_tunnel.sh << 'EOF'
#!/bin/bash
echo "🎂 Starting Paulette's Birthday Trivia Game with Cloudflare Tunnel"
echo "================================================================="
echo ""

# Change to the game directory
cd "$(dirname "$0")"

# Start the game server in background
echo "🎮 Starting trivia game server..."
python3 server.py 8090 &
GAME_PID=$!

# Wait a moment for server to start
sleep 3

# Start the cloudflare tunnel
echo "🌐 Starting Cloudflare tunnel..."
echo "Game will be available at: https://paulette.haydd.com"
echo ""
echo "Press Ctrl+C to stop both services"
echo ""

cloudflared tunnel run paulette-trivia

# Clean up when script exits
echo ""
echo "🛑 Stopping services..."
kill $GAME_PID 2>/dev/null
echo "✅ Services stopped"
EOF

chmod +x start_tunnel.sh

echo "📜 Created start_tunnel.sh script for easy startup"
echo ""
echo "🔧 Troubleshooting:"
echo "==================="
echo ""
echo "If the tunnel doesn't work:"
echo "1. Check that your game server is running on port 8090"
echo "2. Verify DNS propagation (may take a few minutes)"
echo "3. Check tunnel status: cloudflared tunnel list"
echo "4. View tunnel logs for errors"
echo ""
echo "Useful commands:"
echo "- List tunnels: cloudflared tunnel list"
echo "- Delete tunnel: cloudflared tunnel delete $TUNNEL_NAME"
echo "- Check config: cat ~/.cloudflared/config.yml"
echo ""
echo "🎉 Happy 80th Birthday to Paulette! 🎂"
