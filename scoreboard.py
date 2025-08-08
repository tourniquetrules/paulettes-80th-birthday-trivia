#!/usr/bin/env python3
"""
Scoreboard API for Paulette's 80th Birthday Trivia Game
Simple file-based storage for scores that persist across sessions
"""

import json
import os
from datetime import datetime
from http.server import BaseHTTPRequestHandler
import urllib.parse

class ScoreboardHandler:
    def __init__(self, scores_file='scores.json'):
        self.scores_file = scores_file
        self.ensure_scores_file()
    
    def ensure_scores_file(self):
        """Create scores file if it doesn't exist."""
        if not os.path.exists(self.scores_file):
            with open(self.scores_file, 'w') as f:
                json.dump([], f)
    
    def load_scores(self):
        """Load scores from file."""
        try:
            with open(self.scores_file, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return []
    
    def save_scores(self, scores):
        """Save scores to file."""
        with open(self.scores_file, 'w') as f:
            json.dump(scores, f, indent=2)
    
    def add_score(self, name, score):
        """Add a new score to the scoreboard."""
        scores = self.load_scores()
        
        new_score = {
            'name': name,
            'score': score,
            'timestamp': datetime.now().isoformat(),
            'date': datetime.now().strftime('%Y-%m-%d %H:%M')
        }
        
        scores.append(new_score)
        
        # Sort by score (highest first), then by timestamp (earliest first)
        scores.sort(key=lambda x: (-x['score'], x['timestamp']))
        
        # Keep only top 20 scores
        scores = scores[:20]
        
        self.save_scores(scores)
        return scores
    
    def get_scores(self):
        """Get all scores."""
        return self.load_scores()
    
    def clear_scores(self):
        """Clear all scores."""
        self.save_scores([])
        return []

# Create global scoreboard instance
scoreboard = ScoreboardHandler()

class StatsHandler:
    def __init__(self, stats_file='answer_stats.json'):
        self.stats_file = stats_file
        self.ensure_stats_file()
    
    def ensure_stats_file(self):
        """Create stats file if it doesn't exist."""
        if not os.path.exists(self.stats_file):
            with open(self.stats_file, 'w') as f:
                json.dump({}, f)
    
    def load_stats(self):
        """Load stats from file."""
        try:
            with open(self.stats_file, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return {}
    
    def save_stats(self, stats):
        """Save stats to file."""
        with open(self.stats_file, 'w') as f:
            json.dump(stats, f, indent=2)
    
    def get_stats(self):
        """Get all stats."""
        return self.load_stats()
    
    def update_stats(self, stats):
        """Update answer statistics."""
        self.save_stats(stats)
        return stats
    
    def clear_stats(self):
        """Clear all stats."""
        self.save_stats({})
        return {}

# Create global instances
stats_handler = StatsHandler()

def handle_scoreboard_request(method, path, post_data=None):
    """Handle scoreboard API requests."""
    
    if path == '/api/scores' and method == 'GET':
        # Get scores
        return {
            'status': 'success',
            'scores': scoreboard.get_scores()
        }
    
    elif path == '/api/scores' and method == 'POST':
        # Add score
        try:
            data = json.loads(post_data.decode('utf-8'))
            name = data.get('name', '').strip()[:20]  # Limit name length
            score = int(data.get('score', 0))
            
            if not name:
                return {'status': 'error', 'message': 'Name is required'}
            
            scores = scoreboard.add_score(name, score)
            return {
                'status': 'success',
                'message': 'Score added successfully',
                'scores': scores
            }
        except (json.JSONDecodeError, ValueError) as e:
            return {'status': 'error', 'message': 'Invalid data'}
    
    elif path == '/api/scores' and method == 'DELETE':
        # Clear scores
        scores = scoreboard.clear_scores()
        return {
            'status': 'success',
            'message': 'Scores cleared',
            'scores': scores
        }
    
    else:
        return {'status': 'error', 'message': 'Not found'}

def handle_stats_request(method, path, post_data=None):
    """Handle answer stats API requests."""
    
    if path == '/api/stats' and method == 'GET':
        # Get stats
        return {
            'status': 'success',
            'stats': stats_handler.get_stats()
        }
    
    elif path == '/api/stats' and method == 'POST':
        # Update stats
        try:
            data = json.loads(post_data.decode('utf-8'))
            stats = stats_handler.update_stats(data)
            return {
                'status': 'success',
                'message': 'Stats updated successfully',
                'stats': stats
            }
        except (json.JSONDecodeError, ValueError) as e:
            return {'status': 'error', 'message': 'Invalid data'}
    
    elif path == '/api/stats' and method == 'DELETE':
        # Clear stats
        stats = stats_handler.clear_stats()
        return {
            'status': 'success',
            'message': 'Stats cleared',
            'stats': stats
        }
    
    else:
        return {'status': 'error', 'message': 'Not found'}
