// Game State Management
class TriviaGame {
    constructor() {
        this.currentQuestionIndex = 0;
        this.selectedQuestions = [];
        this.playerAnswers = [];
        this.score = 0;
        this.selectedCategory = 'all'; // 'all' or specific category name
        this.answerStats = JSON.parse(localStorage.getItem('answerStats')) || {};
        this.scoreboard = JSON.parse(localStorage.getItem('scoreboard')) || [];
        
        this.initializeEventListeners();
        this.createConfetti();
        this.displayCategoryInfo();
    }

    initializeEventListeners() {
        // Welcome screen buttons
        document.getElementById('view-scores').addEventListener('click', () => this.showScoreboard());

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
        
        if (typeof questionCategories === 'undefined') {
            categoryInfoElement.innerHTML = '<p class="total-questions">Trivia questions loaded!</p>';
            categoryButtonsElement.innerHTML = '<button class="category-btn all-categories" onclick="game.startGame(\'all\')">Start Playing! 🎮</button>';
            return;
        }
        
        const totalQuestions = Object.values(questionCategories).reduce((sum, count) => sum + count, 0);
        
        // Display category information
        let html = '<h4>Available Question Categories:</h4>';
        html += '<div class="category-list">';
        
        for (const [category, count] of Object.entries(questionCategories)) {
            html += `<span class="category-item">${category} (${count})</span>`;
        }
        
        html += '</div>';
        html += `<p class="total-questions">Total: ${totalQuestions} questions available!</p>`;
        
        categoryInfoElement.innerHTML = html;
        
        // Create category selection buttons
        let buttonsHtml = '<button class="category-btn all-categories" onclick="game.startGame(\'all\')">🌟 All Categories (Random Mix) 🌟</button>';
        
        for (const [category, count] of Object.entries(questionCategories)) {
            const buttonText = `${category} (${count} questions)`;
            buttonsHtml += `<button class="category-btn" onclick="game.startGame('${category}')">${buttonText}</button>`;
        }
        
        categoryButtonsElement.innerHTML = buttonsHtml;
    }

    createConfetti() {
        const container = document.querySelector('.confetti-container');
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
        
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

    startGame(category = 'all') {
        this.currentQuestionIndex = 0;
        this.playerAnswers = [];
        this.score = 0;
        this.selectedCategory = category;
        this.selectedQuestions = this.selectRandomQuestions(category);
        
        this.showScreen('game-screen');
        this.displayQuestion();
    }

    selectRandomQuestions(category = 'all') {
        let availableQuestions = [];
        
        if (category === 'all') {
            // Use all questions from all categories
            if (typeof getRandomQuestions === 'function') {
                return getRandomQuestions(10);
            } else {
                availableQuestions = [...triviaQuestions];
            }
        } else {
            // Use questions from specific category
            if (typeof getQuestionsByCategory === 'function') {
                availableQuestions = getQuestionsByCategory(category);
            } else {
                // Fallback: filter questions by category if available
                availableQuestions = triviaQuestions.filter(q => q.category === category);
            }
        }
        
        // Shuffle and select 10 questions
        const shuffled = [...availableQuestions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(10, shuffled.length));
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
        
        // Disable all options
        options.forEach(option => {
            option.classList.add('disabled');
            option.style.pointerEvents = 'none';
        });
        
        // Mark correct and incorrect answers
        options[question.correct].classList.add('correct', 'animate-correct');
        
        if (selectedIndex !== question.correct) {
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
            correct: question.correct,
            isCorrect: selectedIndex === question.correct
        });
        
        // Show feedback
        this.showFeedback(selectedIndex === question.correct, question);
    }

    recordAnswer(questionText, answerIndex) {
        if (!this.answerStats[questionText]) {
            this.answerStats[questionText] = [0, 0, 0, 0];
        }
        this.answerStats[questionText][answerIndex]++;
        localStorage.setItem('answerStats', JSON.stringify(this.answerStats));
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
            feedbackMessage.textContent = `❌ Incorrect. The answer was: ${question.answer}`;
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

    submitScore() {
        const playerName = document.getElementById('player-name').value.trim();
        
        if (!playerName) {
            alert('Please enter your name for the scoreboard!');
            return;
        }
        
        const scoreEntry = {
            name: playerName,
            score: this.score,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString()
        };
        
        this.scoreboard.push(scoreEntry);
        this.scoreboard.sort((a, b) => b.score - a.score); // Sort by highest score
        
        localStorage.setItem('scoreboard', JSON.stringify(this.scoreboard));
        
        this.showScoreboard();
    }

    showScoreboard() {
        this.showScreen('scoreboard-screen');
        
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
                </div>
            `;
        });
        
        scoreboardContent.innerHTML = html;
    }

    resetGame() {
        document.getElementById('player-name').value = '';
        this.showWelcomeScreen();
    }

    showWelcomeScreen() {
        this.showScreen('welcome-screen');
    }

    clearScores() {
        if (confirm('Are you sure you want to clear all scores? This cannot be undone.')) {
            this.scoreboard = [];
            this.answerStats = {};
            localStorage.removeItem('scoreboard');
            localStorage.removeItem('answerStats');
            this.showScoreboard();
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
