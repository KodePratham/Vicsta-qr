class MemoryGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedCards = [];
        this.moves = 0;
        this.gameStarted = false;
        this.timeElapsed = 0;
        this.timer = null;
        
        this.cardSymbols = ['🔧', '⚡', '🌐', '📡', '🤖', '💡', '🔋', '📱'];
        
        this.initializeEventListeners();
        this.resetGame();
    }
    
    initializeEventListeners() {
        const startBtn = document.getElementById('startChallengeBtn');
        const playAgainBtn = document.getElementById('playAgainBtn');
        
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
        this.gameStarted = true;
        this.startTimer();
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
        const gameGrid = document.getElementById('gameGrid');
        const winScreen = document.getElementById('winScreen');
        
        if (startScreen) startScreen.style.display = 'block';
        if (gameGrid) gameGrid.style.display = 'none';
        if (winScreen) winScreen.style.display = 'none';
    }
    
    showGameGrid() {
        const startScreen = document.getElementById('startScreen');
        const gameGrid = document.getElementById('gameGrid');
        const winScreen = document.getElementById('winScreen');
        
        if (startScreen) startScreen.style.display = 'none';
        if (gameGrid) gameGrid.style.display = 'grid';
        if (winScreen) winScreen.style.display = 'none';
    }
    
    showWinScreen() {
        const startScreen = document.getElementById('startScreen');
        const gameGrid = document.getElementById('gameGrid');
        const winScreen = document.getElementById('winScreen');
        
        if (startScreen) startScreen.style.display = 'none';
        if (gameGrid) gameGrid.style.display = 'none';
        if (winScreen) winScreen.style.display = 'block';
        
        const finalMovesElement = document.getElementById('finalMoves');
        const finalTimeElement = document.getElementById('finalTime');
        
        if (finalMovesElement) finalMovesElement.textContent = this.moves;
        if (finalTimeElement) finalTimeElement.textContent = this.formatTime(this.timeElapsed);
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
