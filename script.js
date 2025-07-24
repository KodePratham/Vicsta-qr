class PasswordGame {
    constructor() {
        this.password = '';
        this.currentGuess = '';
        this.attempts = 0;
        this.gameStarted = false;
        this.timeElapsed = 0;
        this.timer = null;
        this.playerName = 'Anonymous Player';
        this.hints = [];
        this.selectedHints = [];
        
        // 20 specific questions with answers
        this.allHints = [
            { digit: 1, hint: "How many noses does a person have?", answer: "1" },
            { digit: 2, hint: "How many eyes does a normal cat have?", answer: "2" },
            { digit: 3, hint: "How many wheels does a tricycle have?", answer: "3" },
            { digit: 4, hint: "How many legs does a chair usually have?", answer: "4" },
            { digit: 5, hint: "How many fingers are on one hand?", answer: "5" },
            { digit: 6, hint: "How many sides does a regular hexagon have?", answer: "6" },
            { digit: 2, hint: "How many days are there in a week that start with the letter 'S'?", answer: "2" },
            { digit: 6, hint: "How many legs does an insect have?", answer: "6" },
            { digit: 3, hint: "How many colors are there in traffic lights?", answer: "3" },
            { digit: 2, hint: "How many thumbs does a person have?", answer: "2" },
            { digit: 1, hint: "How many moons does Earth have?", answer: "1" },
            { digit: 1, hint: "How many horns does a unicorn have?", answer: "1" },
            { digit: 2, hint: "How many wings does a bird have?", answer: "2" },
            { digit: 2, hint: "How many hands does a clock usually have?", answer: "2" },
            { digit: 1, hint: "How many tails does a dog have?", answer: "1" },
            { digit: 1, hint: "How many zeroes are there in the number 10?", answer: "1" },
            { digit: 1, hint: "How many seasons are there in a year starting with the letter 'W'?", answer: "1" },
            { digit: 2, hint: "How many ears does a normal human have?", answer: "2" },
            { digit: 3, hint: "How many letters are in the word \"cat\"?", answer: "3" },
            { digit: 2, hint: "How many legs does a bird usually have?", answer: "2" }
        ];
        
        this.initializeEventListeners();
        this.resetGame();
    }
    
    initializeEventListeners() {
        const startBtn = document.getElementById('startChallengeBtn');
        const playAgainBtn = document.getElementById('playAgainBtn');
        const submitGuessBtn = document.getElementById('submitGuessBtn');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startGame();
            });
        }
        
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => {
                this.startGame();
            });
        }

        if (submitGuessBtn) {
            submitGuessBtn.addEventListener('click', () => {
                this.submitGuess();
            });
        }

        const passwordInput = document.getElementById('passwordInput');
        if (passwordInput) {
            passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.submitGuess();
                }
            });
            
            passwordInput.addEventListener('input', (e) => {
                // Only allow digits and limit to 4 characters
                e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
            });
        }
    }

    resetGame() {
        this.password = '';
        this.currentGuess = '';
        this.attempts = 0;
        this.timeElapsed = 0;
        this.gameStarted = false;
        this.hints = [];
        this.selectedHints = [];
        this.stopTimer();
        
        // Clear feedback container
        const feedbackContainer = document.getElementById('feedbackContainer');
        if (feedbackContainer) feedbackContainer.innerHTML = '';
        
        // Clear password input
        const passwordInput = document.getElementById('passwordInput');
        if (passwordInput) passwordInput.value = '';
        
        this.updateDisplay();
        this.showStartScreen();
    }
    
    startGame() {
        this.resetGame();
        this.generatePassword();
        this.showGameContent();
        this.gameStarted = true;
        this.startTimer();
    }

    generatePassword() {
        // Shuffle all hints and pick 4 random ones
        const shuffledHints = [...this.allHints].sort(() => Math.random() - 0.5);
        this.selectedHints = shuffledHints.slice(0, 4);
        
        // Create password from selected hints - use the digit property directly
        this.password = this.selectedHints.map(hint => hint.digit.toString()).join('');
        
        console.log('Generated Password:', this.password);
        console.log('Selected Hints:', this.selectedHints.map((hint, index) => 
            `Position ${index + 1}: ${hint.hint} = ${hint.digit}`
        ));
        
        this.displayHints();
    }

    displayHints() {
        const hintsContainer = document.getElementById('hintsContainer');
        if (!hintsContainer) return;

        hintsContainer.innerHTML = '';
        
        this.selectedHints.forEach((hint, index) => {
            const hintElement = document.createElement('div');
            hintElement.className = 'hint-item';
            hintElement.innerHTML = `
                <div class="hint-number">Position ${index + 1}:</div>
                <div class="hint-text">${hint.hint}</div>
            `;
            hintsContainer.appendChild(hintElement);
        });
    }

    submitGuess() {
        const passwordInput = document.getElementById('passwordInput');
        const guess = passwordInput.value.trim();
        
        if (guess.length !== 4) {
            alert('Please enter a 4-digit password');
            return;
        }
        
        this.attempts++;
        this.updateDisplay();
        
        console.log('Your guess:', guess);
        console.log('Correct password:', this.password);
        console.log('Match?', guess === this.password);
        
        if (guess === this.password) {
            this.gameStarted = false;
            this.stopTimer();
            this.saveScore();
            setTimeout(() => {
                this.showWinScreen();
            }, 500);
        } else {
            // Show feedback
            this.showFeedback(guess);
            passwordInput.value = '';
            passwordInput.focus();
        }
    }

    showFeedback(guess) {
        const feedbackContainer = document.getElementById('feedbackContainer');
        if (!feedbackContainer) return;

        let correctPositions = 0;
        let correctDigits = 0;
        
        // Check correct positions
        for (let i = 0; i < 4; i++) {
            if (guess[i] === this.password[i]) {
                correctPositions++;
            }
        }
        
        // Check correct digits in wrong positions
        const passwordDigits = this.password.split('');
        const guessDigits = guess.split('');
        
        for (let digit of guessDigits) {
            if (passwordDigits.includes(digit)) {
                correctDigits++;
                passwordDigits.splice(passwordDigits.indexOf(digit), 1);
            }
        }
        
        const feedbackElement = document.createElement('div');
        feedbackElement.className = 'feedback-item';
        feedbackElement.innerHTML = `
            <div class="guess-attempt">Attempt ${this.attempts}: ${guess}</div>
            <div class="feedback-details">
                <span class="correct-position">🎯 ${correctPositions} correct positions</span>
                <span class="correct-digits">✅ ${correctDigits} correct digits</span>
            </div>
        `;
        
        feedbackContainer.insertBefore(feedbackElement, feedbackContainer.firstChild);
        
        // Keep only last 5 attempts visible
        const feedbackItems = feedbackContainer.querySelectorAll('.feedback-item');
        if (feedbackItems.length > 5) {
            feedbackItems[feedbackItems.length - 1].remove();
        }
    }

    saveScore() {
        const scores = JSON.parse(localStorage.getItem('passwordChallengeScores') || '[]');
        const newScore = {
            name: this.playerName,
            attempts: this.attempts,
            time: this.timeElapsed,
            date: new Date().toISOString()
        };
        
        scores.push(newScore);
        
        // Sort by attempts (fewer is better), then by time
        scores.sort((a, b) => {
            if (a.attempts === b.attempts) {
                return a.time - b.time;
            }
            return a.attempts - b.attempts;
        });
        
        // Keep only top 10 scores
        const topScores = scores.slice(0, 10);
        localStorage.setItem('passwordChallengeScores', JSON.stringify(topScores));
        
        this.displayLeaderboard();
    }

    displayLeaderboard() {
        const scores = JSON.parse(localStorage.getItem('passwordChallengeScores') || '[]');
        const leaderboardElement = document.getElementById('leaderboardList');
        if (!leaderboardElement) return;

        leaderboardElement.innerHTML = '';
        
        if (scores.length === 0) {
            leaderboardElement.innerHTML = '<li class="leaderboard-item">No scores yet! Be the first to play!</li>';
            return;
        }

        scores.forEach((score, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'leaderboard-item';
            listItem.innerHTML = `
                <span class="rank">#${index + 1}</span>
                <span class="name">${score.name}</span>
                <span class="stats">${score.attempts} attempts • ${this.formatTime(score.time)}</span>
            `;
            leaderboardElement.appendChild(listItem);
        });
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeElapsed++;
            this.updateDisplay();
        }, 1000);
    }
    
    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    updateDisplay() {
        const attemptsElement = document.getElementById('attemptsCount');
        const timeElement = document.getElementById('timeCount');
        
        if (attemptsElement) attemptsElement.textContent = this.attempts;
        if (timeElement) timeElement.textContent = this.formatTime(this.timeElapsed);
    }
    
    showStartScreen() {
        const startScreen = document.getElementById('startScreen');
        const nameScreen = document.getElementById('nameScreen');
        const gameContent = document.getElementById('gameContent');
        const winScreen = document.getElementById('winScreen');
        
        if (startScreen) startScreen.style.display = 'block';
        if (nameScreen) nameScreen.style.display = 'none';
        if (gameContent) gameContent.style.display = 'none';
        if (winScreen) winScreen.style.display = 'none';
    }
    
    showGameContent() {
        const startScreen = document.getElementById('startScreen');
        const nameScreen = document.getElementById('nameScreen');
        const gameContent = document.getElementById('gameContent');
        const winScreen = document.getElementById('winScreen');
        
        if (startScreen) startScreen.style.display = 'none';
        if (nameScreen) nameScreen.style.display = 'none';
        if (gameContent) gameContent.style.display = 'block';
        if (winScreen) winScreen.style.display = 'none';
        
        // Focus on password input
        setTimeout(() => {
            const passwordInput = document.getElementById('passwordInput');
            if (passwordInput) passwordInput.focus();
        }, 100);
    }
    
    showWinScreen() {
        const startScreen = document.getElementById('startScreen');
        const nameScreen = document.getElementById('nameScreen');
        const gameContent = document.getElementById('gameContent');
        const winScreen = document.getElementById('winScreen');
        
        if (startScreen) startScreen.style.display = 'none';
        if (nameScreen) nameScreen.style.display = 'none';
        if (gameContent) gameContent.style.display = 'none';
        if (winScreen) winScreen.style.display = 'block';
        
        const finalAttemptsElement = document.getElementById('finalAttempts');
        const finalTimeElement = document.getElementById('finalTime');
        const playerNameElement = document.getElementById('winPlayerName');
        const finalPasswordElement = document.getElementById('finalPassword');
        
        if (finalAttemptsElement) finalAttemptsElement.textContent = this.attempts;
        if (finalTimeElement) finalTimeElement.textContent = this.formatTime(this.timeElapsed);
        if (playerNameElement) playerNameElement.textContent = this.playerName;
        if (finalPasswordElement) finalPasswordElement.textContent = this.password;
        
        // Show answers after winning
        this.showAnswers();
    }

    showAnswers() {
        const answersContainer = document.getElementById('answersContainer');
        if (answersContainer) {
            answersContainer.innerHTML = '';
            
            const answersTitle = document.createElement('h3');
            answersTitle.textContent = '💡 Correct Answers:';
            answersTitle.style.color = '#137333';
            answersTitle.style.marginBottom = '1rem';
            answersContainer.appendChild(answersTitle);
            
            this.selectedHints.forEach((hint, index) => {
                const answerElement = document.createElement('div');
                answerElement.className = 'answer-item';
                answerElement.style.cssText = `
                    background: #f8f9fa;
                    border-radius: 8px;
                    padding: 12px 16px;
                    margin-bottom: 8px;
                    border-left: 3px solid #137333;
                `;
                answerElement.innerHTML = `
                    <div style="font-weight: 500; color: #202124; margin-bottom: 4px;">
                        Position ${index + 1}: ${hint.hint}
                    </div>
                    <div style="font-weight: 600; color: #137333;">
                        Answer: ${hint.digit}
                    </div>
                `;
                answersContainer.appendChild(answerElement);
            });
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PasswordGame();
    
    // Simple fade-in animation for elements
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    document.querySelectorAll('.fade-in').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});
