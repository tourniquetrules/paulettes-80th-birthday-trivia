#!/bin/bash

# Paulette's 80th Birthday Trivia Game - Service Management Script
# Usage: ./trivia-service.sh [start|stop|restart|status|logs|install|uninstall]

SERVICE_NAME="paulette-trivia"
SERVICE_FILE="/home/tourniquetrules/80th/paulette-trivia.service"
SYSTEMD_PATH="/etc/systemd/system/$SERVICE_NAME.service"
SCRIPT_DIR="/home/tourniquetrules/80th"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

show_header() {
    echo -e "${BLUE}============================================================${NC}"
    echo -e "${BLUE}🎉 Paulette's 80th Birthday Trivia Game - Service Manager 🎂${NC}"
    echo -e "${BLUE}============================================================${NC}"
}

show_status() {
    echo -e "\n${YELLOW}📊 Service Status:${NC}"
    sudo systemctl status $SERVICE_NAME --no-pager -l
}

show_logs() {
    echo -e "\n${YELLOW}📋 Recent Logs (Press Ctrl+C to exit):${NC}"
    sudo journalctl -u $SERVICE_NAME -f --no-pager
}

case "$1" in
    install)
        show_header
        echo -e "${YELLOW}🔧 Installing Paulette's Trivia Service...${NC}"
        
        # Stop any running Python server processes
        echo -e "${YELLOW}⏹️  Stopping any existing server processes...${NC}"
        pkill -f "python3 server.py" 2>/dev/null || true
        
        # Copy service file to systemd directory
        echo -e "${YELLOW}📁 Installing service file...${NC}"
        sudo cp "$SERVICE_FILE" "$SYSTEMD_PATH"
        
        # Reload systemd and enable service
        echo -e "${YELLOW}🔄 Reloading systemd configuration...${NC}"
        sudo systemctl daemon-reload
        
        echo -e "${YELLOW}✅ Enabling service to start on boot...${NC}"
        sudo systemctl enable $SERVICE_NAME
        
        echo -e "${YELLOW}🚀 Starting service...${NC}"
        sudo systemctl start $SERVICE_NAME
        
        sleep 2
        show_status
        
        echo -e "\n${GREEN}✅ Installation complete!${NC}"
        echo -e "${GREEN}🌐 Game should be available at: http://localhost:8000${NC}"
        echo -e "${GREEN}📱 Network access: http://$(hostname -I | awk '{print $1}'):8000${NC}"
        echo -e "${YELLOW}💡 Use './trivia-service.sh logs' to view real-time logs${NC}"
        ;;
        
    uninstall)
        show_header
        echo -e "${YELLOW}🗑️  Uninstalling Paulette's Trivia Service...${NC}"
        
        sudo systemctl stop $SERVICE_NAME 2>/dev/null || true
        sudo systemctl disable $SERVICE_NAME 2>/dev/null || true
        sudo rm -f "$SYSTEMD_PATH"
        sudo systemctl daemon-reload
        
        echo -e "${GREEN}✅ Service uninstalled successfully!${NC}"
        ;;
        
    start)
        show_header
        echo -e "${YELLOW}🚀 Starting Paulette's Trivia Service...${NC}"
        sudo systemctl start $SERVICE_NAME
        sleep 2
        show_status
        ;;
        
    stop)
        show_header
        echo -e "${YELLOW}⏹️  Stopping Paulette's Trivia Service...${NC}"
        sudo systemctl stop $SERVICE_NAME
        show_status
        ;;
        
    restart)
        show_header
        echo -e "${YELLOW}🔄 Restarting Paulette's Trivia Service...${NC}"
        sudo systemctl restart $SERVICE_NAME
        sleep 2
        show_status
        ;;
        
    status)
        show_header
        show_status
        ;;
        
    logs)
        show_header
        show_logs
        ;;
        
    *)
        show_header
        echo -e "${YELLOW}Usage: $0 {install|uninstall|start|stop|restart|status|logs}${NC}"
        echo
        echo -e "${BLUE}Commands:${NC}"
        echo -e "  ${GREEN}install${NC}   - Install and start the service (run once)"
        echo -e "  ${GREEN}uninstall${NC} - Remove the service completely"
        echo -e "  ${GREEN}start${NC}     - Start the trivia game server"
        echo -e "  ${GREEN}stop${NC}      - Stop the trivia game server"
        echo -e "  ${GREEN}restart${NC}   - Restart the trivia game server"
        echo -e "  ${GREEN}status${NC}    - Show current service status"
        echo -e "  ${GREEN}logs${NC}      - Show real-time logs (Ctrl+C to exit)"
        echo
        echo -e "${YELLOW}Examples:${NC}"
        echo -e "  $0 install    # First time setup"
        echo -e "  $0 logs       # View real-time logs"
        echo -e "  $0 restart    # Restart after adding questions"
        exit 1
        ;;
esac
