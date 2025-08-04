#!/usr/bin/env python3
"""
Simple HTTP Server for the 80th Birthday Trivia Game
Run this script to serve the trivia game on your local network.
"""

import http.server
import socketserver
import webbrowser
import socket
import os
import sys
import subprocess

def get_local_ip():
    """Get the local IP address of this machine."""
    try:
        # Connect to a remote address to get local IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        return local_ip
    except Exception:
        return "localhost"

def start_server(port=8000):
    """Start the HTTP server."""
    # Change to the directory containing the game files
    game_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(game_dir)
    
    # Check if questions directory exists and regenerate questions.js if needed
    questions_dir = os.path.join(game_dir, 'questions')
    parse_script = os.path.join(game_dir, 'parse_questions.py')
    
    if os.path.exists(questions_dir) and os.path.exists(parse_script):
        print("🔄 Updating questions from markdown files...")
        try:
            subprocess.run([sys.executable, 'parse_questions.py'], check=True)
            print("✅ Questions updated successfully!")
        except subprocess.CalledProcessError:
            print("⚠️  Warning: Could not update questions. Using existing questions.js")
        print()
    
    # Create server
    Handler = http.server.SimpleHTTPRequestHandler
    
    with socketserver.TCPServer(("", port), Handler) as httpd:
        local_ip = get_local_ip()
        
        print("=" * 60)
        print("🎉 80th Birthday Trivia Game Server Started! 🎂")
        print("=" * 60)
        print(f"Server running on port {port}")
        print()
        print("Access the game at:")
        print(f"  Local computer: http://localhost:{port}")
        print(f"  Network access: http://{local_ip}:{port}")
        print()
        print("Share the network URL with mobile devices on the same WiFi!")
        print()
        print("Press Ctrl+C to stop the server")
        print("=" * 60)
        
        # Try to open the game in the default browser
        try:
            webbrowser.open(f"http://localhost:{port}")
        except Exception:
            pass
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n🛑 Server stopped. Thanks for playing!")

if __name__ == "__main__":
    port = 8000
    
    # Allow custom port via command line argument
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print("Invalid port number. Using default port 8000.")
    
    start_server(port)
