# 🎉 August 17th Trivia Challenge 🎂

A personalized, mobile-friendly trivia game featuring 100 historically accurate questions about events that happened on August 17th throughout history. Created for Paulette's 80th birthday celebration and accessible worldwide at [trivia.haydd.com](https://trivia.haydd.com).

![Birthday Game Screenshot](https://img.shields.io/badge/Birthday-80th%20Celebration-ff9a56)
![Status](https://img.shields.io/badge/Status-Live-brightgreen)
![Questions](https://img.shields.io/badge/Questions-100-orange)

## 🎮 Live Game

**Play now:** [https://trivia.haydd.com](https://trivia.haydd.com)

## ✨ Features

- 🎂 **Personalized**: Custom theme for Paulette's 80th birthday celebration
- 📱 **Mobile-First**: Optimized for phones and tablets
- 🎲 **Historical Focus**: 
  - 100 August 17th historical questions spanning over 2000 years
  - Events from ancient Rome to modern times  
  - Verified for historical accuracy
- 🎯 **Educational**: Learn about significant events that happened on August 17th
- 📊 **Live Statistics**: See popular answers after each question
- 🏆 **Live Scoreboard**: Real-time competition tracking
- 🎨 **Autumn Theme**: Warm orange and golden color scheme with festive animations
- 🌐 **Global Access**: Available worldwide via Cloudflare tunnel
- 💾 **Persistent Data**: Scores and stats saved between sessions

## 🚀 Quick Start

### Option 1: Use the Live Version
Simply visit [trivia.haydd.com](https://trivia.haydd.com) - no setup required!

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
