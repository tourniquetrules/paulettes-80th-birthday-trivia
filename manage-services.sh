#!/bin/bash

# Enhanced Service Manager for Paulette's 80th Birthday Trivia Game
# Manages both the trivia game server and Cloudflare tunnel
# Usage: ./manage-services.sh [action] [service]

TRIVIA_SERVICE="paulette-trivia"
TUNNEL_SERVICE="cloudflare-tunnel"
TRIVIA_SERVICE_FILE="/home/tourniquetrules/80th/paulette-trivia.service"
TUNNEL_SERVICE_FILE="/home/tourniquetrules/80th/cloudflare-tunnel.service"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

show_header() {
    echo -e "${BLUE}============================================================${NC}"
    echo -e "${BLUE}🎉 Paulette's 80th Birthday Trivia - Complete Service Manager 🎂${NC}"
    echo -e "${BLUE}============================================================${NC}"
}

show_status() {
    echo -e "\n${YELLOW}📊 Services Status:${NC}"
    echo -e "${CYAN}🎮 Trivia Game Server:${NC}"
    sudo systemctl status $TRIVIA_SERVICE --no-pager -l --lines=3
    echo -e "\n${CYAN}🌐 Cloudflare Tunnel:${NC}"
    sudo systemctl status $TUNNEL_SERVICE --no-pager -l --lines=3
}

show_logs() {
    local service=$1
    if [ -z "$service" ]; then
        echo -e "${YELLOW}📋 Combined Logs (Press Ctrl+C to exit):${NC}"
        sudo journalctl -u $TRIVIA_SERVICE -u $TUNNEL_SERVICE -f --no-pager
    else
        echo -e "${YELLOW}📋 ${service} Logs (Press Ctrl+C to exit):${NC}"
        sudo journalctl -u $service -f --no-pager
    fi
}

install_service() {
    local service=$1
    local service_file=$2
    
    echo -e "${YELLOW}📁 Installing ${service} service...${NC}"
    sudo cp "$service_file" "/etc/systemd/system/${service}.service"
    
    echo -e "${YELLOW}🔄 Reloading systemd configuration...${NC}"
    sudo systemctl daemon-reload
    
    echo -e "${YELLOW}✅ Enabling ${service} to start on boot...${NC}"
    sudo systemctl enable $service
    
    echo -e "${YELLOW}🚀 Starting ${service}...${NC}"
    sudo systemctl start $service
    
    sleep 2
}

case "$1" in
    install-all)
        show_header
        echo -e "${YELLOW}🔧 Installing All Services...${NC}"
        
        # Stop any running processes
        echo -e "${YELLOW}⏹️  Stopping any existing processes...${NC}"
        pkill -f "python3 server.py" 2>/dev/null || true
        pkill -f "cloudflared tunnel run" 2>/dev/null || true
        sleep 2
        
        # Install trivia service
        install_service $TRIVIA_SERVICE "$TRIVIA_SERVICE_FILE"
        
        # Install tunnel service
        install_service $TUNNEL_SERVICE "$TUNNEL_SERVICE_FILE"
        
        show_status
        
        echo -e "\n${GREEN}✅ All services installed successfully!${NC}"
        echo -e "${GREEN}🌐 Game available at:${NC}"
        echo -e "${GREEN}  - Local: http://localhost:8000${NC}"
        echo -e "${GREEN}  - Network: http://$(hostname -I | awk '{print $1}'):8000${NC}"
        echo -e "${GREEN}  - Public: https://paulette.haydd.com${NC}"
        echo -e "${YELLOW}💡 Use './manage-services.sh logs' to view combined logs${NC}"
        ;;
        
    install-trivia)
        show_header
        echo -e "${YELLOW}🎮 Installing Trivia Game Service Only...${NC}"
        pkill -f "python3 server.py" 2>/dev/null || true
        install_service $TRIVIA_SERVICE "$TRIVIA_SERVICE_FILE"
        sudo systemctl status $TRIVIA_SERVICE --no-pager -l
        ;;
        
    install-tunnel)
        show_header
        echo -e "${YELLOW}🌐 Installing Cloudflare Tunnel Service Only...${NC}"
        pkill -f "cloudflared tunnel run" 2>/dev/null || true
        install_service $TUNNEL_SERVICE "$TUNNEL_SERVICE_FILE"
        sudo systemctl status $TUNNEL_SERVICE --no-pager -l
        ;;
        
    uninstall-all)
        show_header
        echo -e "${YELLOW}🗑️  Uninstalling All Services...${NC}"
        
        sudo systemctl stop $TRIVIA_SERVICE 2>/dev/null || true
        sudo systemctl disable $TRIVIA_SERVICE 2>/dev/null || true
        sudo rm -f "/etc/systemd/system/${TRIVIA_SERVICE}.service"
        
        sudo systemctl stop $TUNNEL_SERVICE 2>/dev/null || true
        sudo systemctl disable $TUNNEL_SERVICE 2>/dev/null || true
        sudo rm -f "/etc/systemd/system/${TUNNEL_SERVICE}.service"
        
        sudo systemctl daemon-reload
        
        echo -e "${GREEN}✅ All services uninstalled successfully!${NC}"
        ;;
        
    start)
        show_header
        echo -e "${YELLOW}🚀 Starting All Services...${NC}"
        sudo systemctl start $TRIVIA_SERVICE
        sudo systemctl start $TUNNEL_SERVICE
        sleep 2
        show_status
        ;;
        
    stop)
        show_header
        echo -e "${YELLOW}⏹️  Stopping All Services...${NC}"
        sudo systemctl stop $TRIVIA_SERVICE
        sudo systemctl stop $TUNNEL_SERVICE
        show_status
        ;;
        
    restart)
        show_header
        echo -e "${YELLOW}🔄 Restarting All Services...${NC}"
        sudo systemctl restart $TRIVIA_SERVICE
        sudo systemctl restart $TUNNEL_SERVICE
        sleep 2
        show_status
        ;;
        
    restart-trivia)
        show_header
        echo -e "${YELLOW}🔄 Restarting Trivia Game Service...${NC}"
        sudo systemctl restart $TRIVIA_SERVICE
        sleep 2
        sudo systemctl status $TRIVIA_SERVICE --no-pager -l
        ;;
        
    status)
        show_header
        show_status
        echo -e "\n${CYAN}🔗 Quick Links:${NC}"
        echo -e "  - Local: http://localhost:8000"
        echo -e "  - Public: https://paulette.haydd.com"
        ;;
        
    logs)
        show_header
        show_logs $2
        ;;
        
    *)
        show_header
        echo -e "${YELLOW}Usage: $0 {install-all|install-trivia|install-tunnel|uninstall-all|start|stop|restart|restart-trivia|status|logs [service]}${NC}"
        echo
        echo -e "${BLUE}Service Management:${NC}"
        echo -e "  ${GREEN}install-all${NC}    - Install both trivia and tunnel services"
        echo -e "  ${GREEN}install-trivia${NC}  - Install only trivia game service"
        echo -e "  ${GREEN}install-tunnel${NC}  - Install only Cloudflare tunnel service"
        echo -e "  ${GREEN}uninstall-all${NC}  - Remove all services"
        echo -e "  ${GREEN}start${NC}          - Start all services"
        echo -e "  ${GREEN}stop${NC}           - Stop all services"
        echo -e "  ${GREEN}restart${NC}        - Restart all services"
        echo -e "  ${GREEN}restart-trivia${NC} - Restart only trivia game (after adding questions)"
        echo -e "  ${GREEN}status${NC}         - Show status of all services"
        echo
        echo -e "${BLUE}Logging:${NC}"
        echo -e "  ${GREEN}logs${NC}           - Show combined logs from both services"
        echo -e "  ${GREEN}logs trivia${NC}    - Show only trivia game logs"
        echo -e "  ${GREEN}logs tunnel${NC}    - Show only Cloudflare tunnel logs"
        echo
        echo -e "${YELLOW}Examples:${NC}"
        echo -e "  $0 install-all      # Complete setup"
        echo -e "  $0 restart-trivia   # After adding questions"
        echo -e "  $0 logs             # Monitor all activity"
        exit 1
        ;;
esac
