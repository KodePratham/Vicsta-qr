class MemoryGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedCards = [];
        this.moves = 0;
        this.gameStarted = false;
        this.gameWon = false;
        this.timeElapsed = 0;
        this.timer = null;
        
        this.cardSymbols = ['🔧', '⚡', '🌐', '📡', '🤖', '💡', '🔋', '📱'];
        this.colors = [
            'bg-blue-500', 'bg-red-500', 'bg-yellow-500', 'bg-green-500',
            'bg-blue-600', 'bg-red-600', 'bg-yellow-500', 'bg-green-600'
        ];
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        // Page navigation
        document.getElementById('startGameBtn').addEventListener('click', () => {
            this.showGamePage();
        });
        
        document.getElementById('backToClubBtn').addEventListener('click', () => {
            this.showClubPage();
        });
        
        // Game controls
        document.getElementById('startChallengeBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.startGame();
        });
    }
    
    showGamePage() {
        document.getElementById('clubPage').style.display = 'none';
        document.getElementById('gamePage').style.display = 'block';
        this.resetGame();
    }
    
    showClubPage() {
        document.getElementById('gamePage').style.display = 'none';
        document.getElementById('clubPage').style.display = 'block';
        this.stopTimer();
    }
    
    resetGame() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedCards = [];
        this.moves = 0;
        this.timeElapsed = 0;
        this.gameStarted = false;
        this.gameWon = false;
        this.stopTimer();
        
        this.updateDisplay();
        this.showStartScreen();
    }
    
    startGame() {
        this.resetGame();
        this.initializeCards();
        this.renderGameGrid();
        this.gameStarted = true;
        this.startTimer();
        this.showGameGrid();
    }
    
    initializeCards() {
        this.cards = [];
        
        this.cardSymbols.forEach((symbol, index) => {
            this.cards.push(
                { id: index * 2, symbol, color: this.colors[index], matched: false },
                { id: index * 2 + 1, symbol, color: this.colors[index], matched: false }
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
            cardElement.className = 'memory-tile bg-gray-300';
            cardElement.dataset.cardId = card.id;
            cardElement.innerHTML = '<span class="text-xl text-gray-600">?</span>';
            
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
        
        // Flip card
        this.flippedCards.push(cardId);
        this.updateCardDisplay(cardElement, card, true);
        
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateDisplay();
            
            const [firstCardId, secondCardId] = this.flippedCards;
            const firstCard = this.cards.find(c => c.id === firstCardId);
            const secondCard = this.cards.find(c => c.id === secondCardId);
            
            if (firstCard.symbol === secondCard.symbol) {
                // Match found
                this.matchedCards.push(...this.flippedCards);
                this.flippedCards = [];
                
                // Add matched styling
                setTimeout(() => {
                    document.querySelector(`[data-card-id="${firstCardId}"]`).classList.add('ring-4', 'ring-yellow-400');
                    document.querySelector(`[data-card-id="${secondCardId}"]`).classList.add('ring-4', 'ring-yellow-400');
                }, 300);
                
                // Check for win
                if (this.matchedCards.length === 16) {
                    this.gameWon = true;
                    this.gameStarted = false;
                    this.stopTimer();
                    setTimeout(() => {
                        this.showWinScreen();
                    }, 500);
                }
            } else {
                // No match
                setTimeout(() => {
                    this.flippedCards.forEach(id => {
                        const element = document.querySelector(`[data-card-id="${id}"]`);
                        const card = this.cards.find(c => c.id === id);
                        this.updateCardDisplay(element, card, false);
                    });
                    this.flippedCards = [];
                }, 1000);
            }
        }
    }
    
    updateCardDisplay(cardElement, card, flipped) {
        if (flipped || this.matchedCards.includes(card.id)) {
            cardElement.className = `memory-tile ${card.color}`;
            cardElement.innerHTML = `<span class="text-2xl text-white">${card.symbol}</span>`;
        } else {
            cardElement.className = 'memory-tile bg-gray-300';
            cardElement.innerHTML = '<span class="text-xl text-gray-600">?</span>';
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
        document.getElementById('movesCount').textContent = this.moves;
        document.getElementById('timeCount').textContent = this.formatTime(this.timeElapsed);
    }
    
    showStartScreen() {
        document.getElementById('startScreen').style.display = 'block';
        document.getElementById('gameGrid').style.display = 'none';
        document.getElementById('winScreen').style.display = 'none';
    }
    
    showGameGrid() {
        document.getElementById('startScreen').style.display = 'none';
        document.getElementById('gameGrid').style.display = 'grid';
        document.getElementById('winScreen').style.display = 'none';
    }
    
    showWinScreen() {
        document.getElementById('startScreen').style.display = 'none';
        document.getElementById('gameGrid').style.display = 'none';
        document.getElementById('winScreen').style.display = 'block';
        
        document.getElementById('finalMoves').textContent = this.moves;
        document.getElementById('finalTime').textContent = this.formatTime(this.timeElapsed);
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
    
    // Add fade-in animation to cards
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
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        observer.observe(el);
    });
});

// Add some interactive animations
document.addEventListener('DOMContentLoaded', () => {
    // Floating animation for emojis
    const floatingElements = document.querySelectorAll('.animate-float');
    floatingElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.5}s`;
    });
    
    // Add hover effects to cards
    document.querySelectorAll('.card-feature').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});
