#!/bin/bash

# Simple log viewer for Paulette's Trivia Game
# This script shows logs without requiring sudo commands

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}🎉 Paulette's 80th Birthday Trivia Game - Live Logs 📋${NC}"
echo -e "${BLUE}============================================================${NC}"
echo -e "${YELLOW}Press Ctrl+C to exit${NC}\n"

# Follow the logs in real-time
sudo journalctl -u paulette-trivia -f --no-pager --since "1 hour ago"
