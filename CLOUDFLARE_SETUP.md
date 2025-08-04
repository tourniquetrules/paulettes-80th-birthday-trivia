# Cloudflare Tunnel Setup for Paulette's 80th Birthday Trivia Game

## 🎯 Goal
Make the trivia game accessible at `https://paulette.haydd.com` from anywhere on the internet.

## 📋 Prerequisites
- Cloudflare account (✅ you have this)
- Domain `haydd.com` managed by Cloudflare (✅ you have this)
- Trivia game running on port 8090

## 🚀 Quick Setup

### Option 1: Automated Setup (Recommended)
Run the setup script I created:
```bash
./setup_cloudflare.sh
```

### Option 2: Manual Setup

#### Step 1: Install cloudflared
```bash
# Download and install cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
rm cloudflared-linux-amd64.deb
```

#### Step 2: Authenticate with Cloudflare
```bash
cloudflared tunnel login
```
This opens a browser window - log in to your Cloudflare account and authorize cloudflared.

#### Step 3: Create a tunnel
```bash
cloudflared tunnel create paulette-trivia
```

#### Step 4: Configure DNS
```bash
cloudflared tunnel route dns paulette-trivia paulette.haydd.com
```

#### Step 5: Create tunnel configuration
Create `~/.cloudflared/config.yml`:
```yaml
tunnel: paulette-trivia
credentials-file: ~/.cloudflared/[TUNNEL-ID].json

ingress:
  - hostname: paulette.haydd.com
    service: http://localhost:8090
  - service: http_status:404
```

#### Step 6: Start everything
```bash
# Terminal 1: Start the game
python3 server.py 8090

# Terminal 2: Start the tunnel
cloudflared tunnel run paulette-trivia
```

## 🎮 Usage

### Starting the Game for the Party
1. Run: `./start_tunnel.sh`
2. Share the URL: `https://paulette.haydd.com`
3. Guests can access from anywhere!

### Stopping Everything
Press `Ctrl+C` in the terminal running `start_tunnel.sh`

## 🔧 Troubleshooting

### Game not accessible
- Check that local game works: `http://localhost:8090`
- Verify tunnel is running: `cloudflared tunnel list`
- Check DNS propagation (may take 5-10 minutes)

### DNS Issues
- Log in to Cloudflare Dashboard
- Go to DNS settings for `haydd.com`
- Verify there's a CNAME record: `paulette` → `[tunnel-id].cfargotunnel.com`

### Tunnel Status
```bash
# List all tunnels
cloudflared tunnel list

# Check tunnel info
cloudflared tunnel info paulette-trivia

# View tunnel logs
cloudflared tunnel run paulette-trivia --loglevel debug
```

## 📱 Mobile Access
Once the tunnel is running, party guests can:
1. Open their phone browser
2. Go to `https://paulette.haydd.com`
3. Add to home screen for app-like experience
4. Play the trivia game!

## 🔒 Security
- HTTPS is automatically provided by Cloudflare
- Only the game is exposed (port 8090), not your entire computer
- Tunnel can be stopped anytime

## 🎉 Party Day Checklist
- [ ] Test tunnel setup beforehand
- [ ] Share `https://paulette.haydd.com` with guests
- [ ] Keep the game server and tunnel running during the party
- [ ] Monitor scores on the local machine or at the public URL

## 📞 Support
If you need help:
1. Check the Cloudflare Tunnel documentation
2. Verify your Cloudflare account has the domain configured
3. Test local access first, then tunnel access

Happy 80th Birthday, Paulette! 🎂🎉
