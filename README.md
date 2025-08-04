# 🎉 Paulette's 80th Birthday Trivia Game 🎂

A personalized, mobile-friendly trivia game created for Paulette's 80th birthday celebration. The game features questions spanning multiple decades and is accessible worldwide via Cloudflare tunnel at [paulette.haydd.com](https://paulette.haydd.com).

![Birthday Game Screenshot](https://img.shields.io/badge/Birthday-80th%20Celebration-ff69b4)
![Status](https://img.shields.io/badge/Status-Live-brightgreen)
![Questions](https://img.shields.io/badge/Questions-176-blue)

## 🎮 Live Game

**Play now:** [https://paulette.haydd.com](https://paulette.haydd.com)

## ✨ Features

- 🎂 **Personalized**: Custom birthday theme for Paulette's 80th
- 📱 **Mobile-First**: Optimized for phones and tablets
- 🎲 **Multiple Categories**: 
  - 1940s Trivia Questions (26 questions)
  - 1950s Trivia Questions (100 questions)  
  - August 1945 Pop Culture Questions (50 questions)
- 🎯 **Category Selection**: Choose specific decades or mix all categories
- 📊 **Live Statistics**: See popular answers after each question
- 🏆 **Live Scoreboard**: Real-time competition tracking
- 🎨 **Birthday Theme**: Balloons, confetti, and festive animations
- 🌐 **Global Access**: Available worldwide via Cloudflare tunnel
- 💾 **Persistent Data**: Scores and stats saved between sessions

## 🚀 Quick Start

### Option 1: Use the Live Version
Simply visit [paulette.haydd.com](https://paulette.haydd.com) - no setup required!

### Option 2: Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tourniquetrules/80th.git
   cd 80th
   ```

2. **Start the game server:**
   ```bash
   python3 server.py
   ```

3. **Open in browser:**
   ```
   http://localhost:8000
   ```

### Option 3: Deploy with Cloudflare Tunnel

1. **Set up Cloudflare tunnel:**
   ```bash
   ./setup_cloudflare.sh
   ```

2. **Start everything:**
   ```bash
   ./start_tunnel.sh
   ```

## 📁 Project Structure

```
80th/
├── index.html              # Main game interface
├── styles.css              # Birthday party themed styling  
├── game.js                 # Game logic and functionality
├── questions.js            # Auto-generated question database
├── server.py               # Python HTTP server
├── parse_questions.py      # Question extraction from markdown
├── create_questions.py     # Interactive question creator
├── questions/              # Trivia question source files
│   ├── 1940s_trivia_questions.md
│   ├── 1950s_trivia_questions.md
│   └── august_1945_pop_culture_questions.md
├── setup_cloudflare.sh     # Automated Cloudflare tunnel setup
├── start_tunnel.sh         # Convenience script for going live
└── sounds/                 # Audio files (optional)
```

## 🎯 How to Play

1. **Choose Category**: Select from 1940s, 1950s, August 1945, or "All Categories"
2. **Answer Questions**: 10 multiple choice questions
3. **Get Feedback**: See correct answers and popular choices
4. **Enter Name**: Submit your score to the leaderboard
5. **Compete**: Compare scores with other party guests

## 🔧 Adding More Questions

### Method 1: Interactive Creator
```bash
python3 create_questions.py
```

### Method 2: Manual Addition
1. Add questions to existing files in `questions/` directory
2. Use the markdown format (see existing files for examples)
3. Restart server to automatically include new questions

## 🌐 Technical Details

- **Frontend**: Vanilla HTML5, CSS3, JavaScript
- **Backend**: Python 3 HTTP server
- **Deployment**: Cloudflare Tunnel for global access
- **Data Storage**: LocalStorage for persistence
- **Mobile Support**: Responsive design with touch-friendly interface

## 🎂 Birthday Party Features

- **Real-time Scoreboard**: Track all guests' scores
- **Category Variety**: Questions span multiple decades
- **Mobile Access**: Everyone can play on their phone
- **Instant Feedback**: Learn interesting facts after each question
- **Global Access**: Friends and family can join from anywhere

## 🔒 Security & Privacy

- HTTPS automatically provided by Cloudflare
- Only the game is exposed (not the entire computer)
- Cloudflare credentials excluded from repository
- Can be stopped instantly after the party

## 🎉 Special Thanks

Created with love for Paulette's 80th birthday celebration. May this game bring joy, laughter, and friendly competition to your special day!

## 📞 Support

For technical issues or questions about the game, please open an issue in this repository.

---

**Happy 80th Birthday, Paulette!** 🎂✨🎉
