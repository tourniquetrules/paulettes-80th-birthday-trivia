// Game State Management
class TriviaGame {
    constructor() {
        this.currentQuestionIndex = 0;
        this.selectedQuestions = [];
        this.playerAnswers = [];
        this.score = 0;
        this.selectedCategory = 'all'; // 'all' or specific category name
        this.answerStats = {}; // Will be loaded from server
        this.scoreboard = []; // Will be loaded from server
        
        this.initializeEventListeners();
        this.createConfetti();
        this.displayCategoryInfo();
        this.loadScoreboard(); // Load scoreboard from server
        this.loadAnswerStats(); // Load answer stats from server
    }

    initializeEventListeners() {
        // Welcome screen buttons
        document.getElementById('view-scores').addEventListener('click', () => this.showScoreboard());
        document.getElementById('start-game').addEventListener('click', () => this.startGame());

        // Game screen buttons
        document.getElementById('next-question').addEventListener('click', () => this.nextQuestion());

        // Results screen buttons
        document.getElementById('submit-score').addEventListener('click', () => this.submitScore());
        document.getElementById('play-again').addEventListener('click', () => this.resetGame());
        document.getElementById('view-scores-results').addEventListener('click', () => this.showScoreboard());

        // Scoreboard screen buttons
        document.getElementById('back-to-welcome').addEventListener('click', () => this.showWelcomeScreen());
        document.getElementById('clear-scores').addEventListener('click', () => this.clearScores());

        // Enter key support for name input
        document.getElementById('player-name').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitScore();
            }
        });
    }

    displayCategoryInfo() {
        const categoryInfoElement = document.getElementById('category-info');
        const categoryButtonsElement = document.getElementById('category-buttons');
        
        // Calculate total questions dynamically
        const totalQuestions = typeof triviaQuestions !== 'undefined' ? triviaQuestions.length : 50;
        categoryInfoElement.innerHTML = `<p class="total-questions">${totalQuestions} trivia questions available - Each game uses 10 random selections!</p>`;
        categoryButtonsElement.innerHTML = '<button class="category-btn all-categories" onclick="game.startGame(\'all\')">Start Playing! 🎮</button>';
    }

    createConfetti() {
        const container = document.querySelector('.confetti-container');
        const colors = ['#f39c12', '#e67e22', '#d35400', '#e74c3c', '#c0392b', '#ff9a56', '#ff6b35'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            container.appendChild(confetti);
        }
    }

    startGame() {
        this.currentQuestionIndex = 0;
        this.playerAnswers = [];
        this.score = 0;
        this.selectedQuestions = this.selectRandomQuestions();
        
        this.showScreen('game-screen');
        this.displayQuestion();
    }

    selectRandomQuestions() {
        // Always use all available questions (August 1945 trivia)
        let availableQuestions = [...triviaQuestions];
        
        // Remove duplicates based on question text
        const uniqueQuestions = this.removeDuplicateQuestions(availableQuestions);
        
        // Properly shuffle using Fisher-Yates algorithm
        const shuffled = this.fisherYatesShuffle([...uniqueQuestions]);
        return shuffled.slice(0, Math.min(10, shuffled.length));
    }

    // Fisher-Yates shuffle algorithm for truly random shuffling
    fisherYatesShuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Remove duplicate questions based on question text
    removeDuplicateQuestions(questions) {
        const seen = new Set();
        return questions.filter(question => {
            const questionText = question.question.toLowerCase().trim();
            if (seen.has(questionText)) {
                return false;
            }
            seen.add(questionText);
            return true;
        });
    }

    displayQuestion() {
        const question = this.selectedQuestions[this.currentQuestionIndex];
        
        // Update progress
        const progress = ((this.currentQuestionIndex + 1) / this.selectedQuestions.length) * 100;
        document.getElementById('progress-fill').style.width = progress + '%';
        
        // Update question counter with category info
        let counterText = `Question ${this.currentQuestionIndex + 1} of ${this.selectedQuestions.length}`;
        if (this.selectedCategory === 'all') {
            counterText += ' • Mixed Categories';
        } else {
            counterText += ` • ${this.selectedCategory}`;
        }
        if (question.category && this.selectedCategory === 'all') {
            counterText += ` (${question.category})`;
        }
        document.getElementById('question-counter').textContent = counterText;
        
        // Display question
        document.getElementById('question-text').textContent = question.question;
        
        // Create options
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
            optionElement.addEventListener('click', () => this.selectAnswer(index));
            optionsContainer.appendChild(optionElement);
        });
        
        // Hide feedback
        document.getElementById('feedback-container').classList.add('hidden');
    }

    selectAnswer(selectedIndex) {
        const question = this.selectedQuestions[this.currentQuestionIndex];
        const options = document.querySelectorAll('.option');
        
        // Find the correct answer index by matching the text
        const correctIndex = question.options.findIndex(option => option === question.correct);
        
        // Disable all options
        options.forEach(option => {
            option.classList.add('disabled');
            option.style.pointerEvents = 'none';
        });
        
        // Mark correct and incorrect answers
        if (correctIndex >= 0) {
            options[correctIndex].classList.add('correct', 'animate-correct');
        }
        
        if (selectedIndex !== correctIndex) {
            options[selectedIndex].classList.add('incorrect', 'animate-incorrect');
            this.playSound('wrong-sound');
        } else {
            this.score++;
            this.playSound('correct-sound');
        }
        
        // Record answer for statistics
        this.recordAnswer(question.question, selectedIndex);
        
        // Store player answer
        this.playerAnswers.push({
            question: question.question,
            selected: selectedIndex,
            correct: correctIndex,
            isCorrect: selectedIndex === correctIndex
        });
        
        // Show feedback
        this.showFeedback(selectedIndex === correctIndex, question);
        
        // Force show the feedback container
        setTimeout(() => {
            const feedbackContainer = document.getElementById('feedback-container');
            feedbackContainer.classList.remove('hidden');
            feedbackContainer.style.display = 'block';
        }, 100);
    }

    recordAnswer(questionText, answerIndex) {
        if (!this.answerStats[questionText]) {
            this.answerStats[questionText] = [0, 0, 0, 0];
        }
        this.answerStats[questionText][answerIndex]++;
        this.saveAnswerStats();
    }

    showFeedback(isCorrect, question) {
        const feedbackContainer = document.getElementById('feedback-container');
        const feedbackMessage = document.getElementById('feedback-message');
        const answerStats = document.getElementById('answer-stats');
        
        feedbackContainer.classList.remove('hidden', 'correct', 'incorrect');
        feedbackMessage.classList.remove('correct', 'incorrect');
        
        if (isCorrect) {
            feedbackContainer.classList.add('correct');
            feedbackMessage.classList.add('correct');
            feedbackMessage.textContent = '🎉 Correct! Well done!';
        } else {
            feedbackContainer.classList.add('incorrect');
            feedbackMessage.classList.add('incorrect');
            feedbackMessage.textContent = `❌ Incorrect. The answer was: ${question.correct}`;
        }
        
        // Show answer statistics
        const stats = this.answerStats[question.question] || [0, 0, 0, 0];
        const total = stats.reduce((a, b) => a + b, 0);
        if (total > 0) {
            const mostChosen = stats.indexOf(Math.max(...stats));
            const mostChosenPercentage = Math.round((stats[mostChosen] / total) * 100);
            answerStats.textContent = `Most chosen answer: ${String.fromCharCode(65 + mostChosen)} (${mostChosenPercentage}% of players)`;
        } else {
            answerStats.textContent = 'You\'re the first to answer this question!';
        }
        
        // Update next button text
        const nextButton = document.getElementById('next-question');
        if (this.currentQuestionIndex === this.selectedQuestions.length - 1) {
            nextButton.textContent = 'See Results 🎊';
        } else {
            nextButton.textContent = 'Next Question ➡️';
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.selectedQuestions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
        } else {
            this.showResults();
        }
    }

    showResults() {
        this.showScreen('results-screen');
        
        const finalScore = document.getElementById('final-score');
        const scoreMessage = document.getElementById('score-message');
        
        finalScore.textContent = `${this.score}/${this.selectedQuestions.length}`;
        
        let categoryText = this.selectedCategory === 'all' ? 'Mixed Categories' : this.selectedCategory;
        
        let message = '';
        const percentage = (this.score / this.selectedQuestions.length) * 100;
        if (percentage === 100) {
            message = `🏆 Perfect score in ${categoryText}! You're an expert!`;
            this.playSound('celebration-sound');
        } else if (percentage >= 80) {
            message = `🌟 Excellent work in ${categoryText}! You really know your stuff!`;
        } else if (percentage >= 60) {
            message = `👏 Good job on ${categoryText}! Solid knowledge!`;
        } else if (percentage >= 40) {
            message = `📚 Not bad! Time to brush up on ${categoryText}!`;
        } else {
            message = `🤔 ${categoryText} was tricky! Maybe give it another try?`;
        }
        
        scoreMessage.textContent = message;
        
        // Focus on name input
        setTimeout(() => {
            document.getElementById('player-name').focus();
        }, 100);
    }

    async submitScore() {
        const playerName = document.getElementById('player-name').value.trim();
        
        if (!playerName) {
            alert('Please enter your name for the scoreboard!');
            return;
        }
        
        try {
            const response = await fetch('/api/scores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: playerName,
                    score: this.score
                })
            });
            
            const result = await response.json();
            
            if (result.status === 'success') {
                this.scoreboard = result.scores;
                this.showScoreboard();
            } else {
                alert('Error saving score: ' + result.message);
            }
        } catch (error) {
            console.error('Error submitting score:', error);
            alert('Error saving score. Please try again.');
        }
    }

    async loadScoreboard() {
        try {
            const response = await fetch('/api/scores');
            const result = await response.json();
            
            if (result.status === 'success') {
                this.scoreboard = result.scores;
            }
        } catch (error) {
            console.error('Error loading scoreboard:', error);
            // Fall back to localStorage if server fails
            this.scoreboard = JSON.parse(localStorage.getItem('scoreboard')) || [];
        }
    }

    async showScoreboard() {
        this.showScreen('scoreboard-screen');
        
        // Load fresh scoreboard data
        await this.loadScoreboard();
        
        const scoreboardContent = document.getElementById('scoreboard-content');
        
        if (this.scoreboard.length === 0) {
            scoreboardContent.innerHTML = '<div class="scoreboard-empty">No scores yet! Be the first to play! 🎮</div>';
            return;
        }
        
        let html = '';
        this.scoreboard.forEach((entry, index) => {
            const isTopScore = index === 0 && entry.score === Math.max(...this.scoreboard.map(s => s.score));
            html += `
                <div class="scoreboard-item ${isTopScore ? 'top-score' : ''}">
                    <span class="player-rank">#${index + 1}</span>
                    <span class="player-name">${entry.name}</span>
                    <span class="player-score">${entry.score}/10</span>
                    <span class="player-date">${entry.date}</span>
                </div>
            `;
        });
        
        scoreboardContent.innerHTML = html;
    }

    async loadAnswerStats() {
        try {
            const response = await fetch('/api/stats');
            const data = await response.json();
            
            if (data.status === 'success') {
                this.answerStats = data.stats;
            } else {
                console.error('Failed to load answer stats:', data.message);
                this.answerStats = {};
            }
        } catch (error) {
            console.error('Error loading answer stats:', error);
            this.answerStats = {};
        }
    }

    async saveAnswerStats() {
        try {
            const response = await fetch('/api/stats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.answerStats)
            });
            
            const data = await response.json();
            
            if (data.status !== 'success') {
                console.error('Failed to save answer stats:', data.message);
            }
        } catch (error) {
            console.error('Error saving answer stats:', error);
        }
    }

    resetGame() {
        document.getElementById('player-name').value = '';
        this.showWelcomeScreen();
    }

    showWelcomeScreen() {
        this.showScreen('welcome-screen');
    }

    async clearScores() {
        if (confirm('Are you sure you want to clear all scores? This cannot be undone.')) {
            try {
                const response = await fetch('/api/scores', {
                    method: 'DELETE'
                });
                
                const result = await response.json();
                
                if (result.status === 'success') {
                    this.scoreboard = [];
                    
                    // Also clear answer stats from server
                    await fetch('/api/stats', { method: 'DELETE' });
                    this.answerStats = {};
                    
                    this.showScoreboard();
                } else {
                    alert('Error clearing scores: ' + result.message);
                }
            } catch (error) {
                console.error('Error clearing scores:', error);
                alert('Error clearing scores. Please try again.');
            }
        }
    }

    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        document.getElementById(screenId).classList.add('active');
    }

    playSound(soundId) {
        const sound = document.getElementById(soundId);
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => {
                // Audio play failed (common on mobile without user interaction)
                console.log('Audio play failed:', e);
            });
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new TriviaGame();
});
