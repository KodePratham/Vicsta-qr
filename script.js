class MemoryGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedCards = [];
        this.moves = 0;
        this.gameStarted = false;
        this.timeElapsed = 0;
        this.timer = null;
        this.playerName = '';
        this.previewMode = false;
        
        this.cardSymbols = ['🔧', '⚡', '🌐', '📡', '🤖', '💡', '🔋', '📱'];
        
        this.initializeEventListeners();
        this.loadLeaderboard();
        this.resetGame();
    }
    
    initializeEventListeners() {
        const startBtn = document.getElementById('startChallengeBtn');
        const playAgainBtn = document.getElementById('playAgainBtn');
        const nameSubmitBtn = document.getElementById('nameSubmitBtn');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.showNameInput();
            });
        }
        
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => {
                this.showNameInput();
            });
        }

        if (nameSubmitBtn) {
            nameSubmitBtn.addEventListener('click', () => {
                this.submitName();
            });
        }

        const nameInput = document.getElementById('playerNameInput');
        if (nameInput) {
            nameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.submitName();
                }
            });
        }
    }

    showNameInput() {
        const nameScreen = document.getElementById('nameScreen');
        const startScreen = document.getElementById('startScreen');
        const gameGrid = document.getElementById('gameGrid');
        const winScreen = document.getElementById('winScreen');
        
        if (nameScreen) nameScreen.style.display = 'block';
        if (startScreen) startScreen.style.display = 'none';
        if (gameGrid) gameGrid.style.display = 'none';
        if (winScreen) winScreen.style.display = 'none';
    }

    submitName() {
        const nameInput = document.getElementById('playerNameInput');
        const name = nameInput.value.trim();
        
        if (name.length < 2) {
            alert('Please enter a name with at least 2 characters');
            return;
        }
        
        this.playerName = name;
        this.startGame();
    }
    
    resetGame() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedCards = [];
        this.moves = 0;
        this.timeElapsed = 0;
        this.gameStarted = false;
        this.stopTimer();
        
        this.updateDisplay();
        this.showStartScreen();
    }
    
    startGame() {
        this.resetGame();
        this.initializeCards();
        this.renderGameGrid();
        this.showGameGrid();
        this.previewCards();
    }

    previewCards() {
        this.previewMode = true;
        const gameGrid = document.getElementById('gameGrid');
        
        // Show all cards for 2 seconds
        this.cards.forEach(card => {
            const cardElement = document.querySelector(`[data-card-id="${card.id}"]`);
            cardElement.className = 'memory-tile flipped';
            cardElement.innerHTML = card.symbol;
        });

        setTimeout(() => {
            // Hide all cards and start the game
            this.cards.forEach(card => {
                const cardElement = document.querySelector(`[data-card-id="${card.id}"]`);
                cardElement.className = 'memory-tile';
                cardElement.innerHTML = '?';
            });
            this.previewMode = false;
            this.gameStarted = true;
            this.startTimer();
        }, 2000);
    }
    
    initializeCards() {
        this.cards = [];
        
        this.cardSymbols.forEach((symbol, index) => {
            this.cards.push(
                { id: index * 2, symbol, matched: false },
                { id: index * 2 + 1, symbol, matched: false }
            );
        });
        
        // Shuffle cards
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
    
    renderGameGrid() {
        const gameGrid = document.getElementById('gameGrid');
        gameGrid.innerHTML = '';
        
        this.cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'memory-tile';
            cardElement.dataset.cardId = card.id;
            cardElement.innerHTML = '?';
            
            cardElement.addEventListener('click', () => {
                this.flipCard(card.id);
            });
            
            gameGrid.appendChild(cardElement);
        });
    }
    
    flipCard(cardId) {
        if (!this.gameStarted || 
            this.previewMode ||
            this.flippedCards.length === 2 || 
            this.flippedCards.includes(cardId) || 
            this.matchedCards.includes(cardId)) {
            return;
        }
        
        const card = this.cards.find(c => c.id === cardId);
        const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
        
        this.flippedCards.push(cardId);
        cardElement.className = 'memory-tile flipped';
        cardElement.innerHTML = card.symbol;
        
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateDisplay();
            
            const [firstCardId, secondCardId] = this.flippedCards;
            const firstCard = this.cards.find(c => c.id === firstCardId);
            const secondCard = this.cards.find(c => c.id === secondCardId);
            
            if (firstCard.symbol === secondCard.symbol) {
                // Match found
                setTimeout(() => {
                    this.matchedCards.push(...this.flippedCards);
                    this.flippedCards = [];
                    
                    const firstElement = document.querySelector(`[data-card-id="${firstCardId}"]`);
                    const secondElement = document.querySelector(`[data-card-id="${secondCardId}"]`);
                    firstElement.className = 'memory-tile matched';
                    secondElement.className = 'memory-tile matched';
                    
                    if (this.matchedCards.length === 16) {
                        this.gameStarted = false;
                        this.stopTimer();
                        this.saveScore();
                        setTimeout(() => {
                            this.showWinScreen();
                        }, 500);
                    }
                }, 300);
            } else {
                // No match
                setTimeout(() => {
                    this.flippedCards.forEach(id => {
                        const element = document.querySelector(`[data-card-id="${id}"]`);
                        element.className = 'memory-tile';
                        element.innerHTML = '?';
                    });
                    this.flippedCards = [];
                }, 1000);
            }
        }
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
        const movesElement = document.getElementById('movesCount');
        const timeElement = document.getElementById('timeCount');
        
        if (movesElement) movesElement.textContent = this.moves;
        if (timeElement) timeElement.textContent = this.formatTime(this.timeElapsed);
    }
    
    showStartScreen() {
        const startScreen = document.getElementById('startScreen');
        const nameScreen = document.getElementById('nameScreen');
        const gameGrid = document.getElementById('gameGrid');
        const winScreen = document.getElementById('winScreen');
        
        if (startScreen) startScreen.style.display = 'block';
        if (nameScreen) nameScreen.style.display = 'none';
        if (gameGrid) gameGrid.style.display = 'none';
        if (winScreen) winScreen.style.display = 'none';
    }
    
    showGameGrid() {
        const startScreen = document.getElementById('startScreen');
        const nameScreen = document.getElementById('nameScreen');
        const gameGrid = document.getElementById('gameGrid');
        const winScreen = document.getElementById('winScreen');
        
        if (startScreen) startScreen.style.display = 'none';
        if (nameScreen) nameScreen.style.display = 'none';
        if (gameGrid) gameGrid.style.display = 'grid';
        if (winScreen) winScreen.style.display = 'none';
    }
    
    showWinScreen() {
        const startScreen = document.getElementById('startScreen');
        const nameScreen = document.getElementById('nameScreen');
        const gameGrid = document.getElementById('gameGrid');
        const winScreen = document.getElementById('winScreen');
        
        if (startScreen) startScreen.style.display = 'none';
        if (nameScreen) nameScreen.style.display = 'none';
        if (gameGrid) gameGrid.style.display = 'none';
        if (winScreen) winScreen.style.display = 'block';
        
        const finalMovesElement = document.getElementById('finalMoves');
        const finalTimeElement = document.getElementById('finalTime');
        const playerNameElement = document.getElementById('winPlayerName');
        
        if (finalMovesElement) finalMovesElement.textContent = this.moves;
        if (finalTimeElement) finalTimeElement.textContent = this.formatTime(this.timeElapsed);
        if (playerNameElement) playerNameElement.textContent = this.playerName;
    }

    async saveScore() {
        const scoreData = {
            name: this.playerName,
            moves: this.moves,
            time: this.timeElapsed,
            date: new Date().toISOString()
        };

        try {
            // In a real application, you would send this to a server
            // For demo purposes, we'll use localStorage
            let scores = JSON.parse(localStorage.getItem('memoryGameScores') || '{"scores": []}');
            scores.scores.push(scoreData);
            
            // Keep only top 10 scores
            scores.scores.sort((a, b) => {
                const scoreA = (a.moves * 1000) + a.time; // Lower is better
                const scoreB = (b.moves * 1000) + b.time;
                return scoreA - scoreB;
            });
            scores.scores = scores.scores.slice(0, 10);
            
            localStorage.setItem('memoryGameScores', JSON.stringify(scores));
            this.loadLeaderboard();
        } catch (error) {
            console.error('Error saving score:', error);
        }
    }

    loadLeaderboard() {
        try {
            const scores = JSON.parse(localStorage.getItem('memoryGameScores') || '{"scores": []}');
            this.displayLeaderboard(scores.scores);
        } catch (error) {
            console.error('Error loading leaderboard:', error);
        }
    }

    displayLeaderboard(scores) {
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
                <span class="stats">${score.moves} moves • ${this.formatTime(score.time)}</span>
            `;
            leaderboardElement.appendChild(listItem);
        });
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
    
    // Simplified animations for the new layout
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
    
    // Enhanced hover effects for simple cards
    document.querySelectorAll('.simple-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});
