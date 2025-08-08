# Paulette's 80th Birthday Trivia Game - Complete Service Management

## 🚀 Quick Start

The trivia game and Cloudflare tunnel are now running as system services that automatically start on boot and restart if they crash.

## 📋 Service Management Commands

### New Enhanced Manager: `./manage-services.sh`

```bash
# Check status of both services
./manage-services.sh status

# View combined logs from both services
./manage-services.sh logs

# View logs from specific service
./manage-services.sh logs trivia
./manage-services.sh logs tunnel

# Restart trivia game after adding questions
./manage-services.sh restart-trivia

# Restart both services
./manage-services.sh restart

# Start/stop all services
./manage-services.sh start
./manage-services.sh stop
```

### Legacy Single Service Manager: `./trivia-service.sh`

```bash
# Still available for trivia game only
./trivia-service.sh status
./trivia-service.sh restart
./trivia-service.sh logs
```

### Simple Log Viewer: `./view-logs.sh`

```bash
# Quick trivia game logs only
./view-logs.sh
```

## 🎮 Game Access

- **Local**: http://localhost:8000
- **Network**: http://192.168.2.180:8000
- **Public** (via Cloudflare): https://paulette.haydd.com

## 📝 Adding Questions

1. **Edit any markdown file** in the `/questions/` folder:
   - `august_1945_pop_culture_questions.md`
   - `august_1945_movies_radio.md`
   - `august_1945_music.md`
   - `august_1945_sports_recreation.md`

2. **Restart the trivia service** to regenerate questions:
   ```bash
   ./manage-services.sh restart-trivia
   ```

3. **Check the logs** to see the new question count:
   ```bash
   ./manage-services.sh logs trivia
   ```

## 🔧 Service Benefits

✅ **Auto-start**: Both services start automatically when server boots  
✅ **Auto-restart**: Services restart automatically if they crash  
✅ **Logging**: All activity logged to systemd journal  
✅ **Security**: Services run with restricted permissions  
✅ **Monitoring**: Easy status checking and log viewing  
✅ **Public Access**: Cloudflare tunnel maintains public URL  

## 📊 Monitoring

Both services log all activity including:
- Server startup/shutdown
- Question generation statistics
- HTTP requests
- Tunnel connections
- Error messages

Use `./manage-services.sh logs` to monitor both services in real-time.

## ⚠️ Important: Terminal Independence

**Before this setup**: 
- ❌ Cloudflare tunnel required keeping a terminal open
- ❌ Closing terminal would break public access
- ❌ Manual restart needed after server reboot

**Now with systemd services**:
- ✅ Both services run independently of terminals
- ✅ Safe to close all terminals - services keep running
- ✅ Automatic startup after server reboot
- ✅ Automatic restart if services crash

## Current Status

- **Questions**: 59 total across 4 categories
- **Trivia Service**: Running and enabled (`paulette-trivia.service`)
- **Tunnel Service**: Running and enabled (`cloudflare-tunnel.service`)
- **Auto-start**: Both services enabled on boot
- **Public URL**: https://paulette.haydd.com (always available)
