import React, { useState, useEffect } from 'react';

function Game({ onBack }) {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const cardSymbols = ['🔧', '⚡', '🌐', '📡', '🤖', '💡', '🔋', '📱'];
  const colors = [
    'bg-blue-500', 'bg-red-500', 'bg-yellow-500', 'bg-green-500',
    'bg-blue-600', 'bg-red-600', 'bg-yellow-600', 'bg-green-600'
  ];

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    let timer;
    if (gameStarted && !gameWon) {
      timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, gameWon]);

  useEffect(() => {
    if (matchedCards.length === 16 && gameStarted) {
      setGameWon(true);
      setGameStarted(false);
    }
  }, [matchedCards, gameStarted]);

  const initializeGame = () => {
    const gameCards = [];
    cardSymbols.forEach((symbol, index) => {
      gameCards.push(
        { id: index * 2, symbol, color: colors[index], matched: false },
        { id: index * 2 + 1, symbol, color: colors[index], matched: false }
      );
    });
    
    // Shuffle cards
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }
    
    setCards(gameCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setTimeElapsed(0);
    setGameWon(false);
  };

  const startGame = () => {
    setGameStarted(true);
    initializeGame();
  };

  const flipCard = (cardId) => {
    if (!gameStarted || flippedCards.length === 2 || flippedCards.includes(cardId) || matchedCards.includes(cardId)) {
      return;
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      const [firstCard, secondCard] = newFlippedCards.map(id => cards.find(card => card.id === id));
      
      if (firstCard.symbol === secondCard.symbol) {
        setMatchedCards(prev => [...prev, ...newFlippedCards]);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen gradient-bg p-4 sm:p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
          <button
            onClick={onBack}
            className="btn-secondary flex items-center gap-2 order-2 sm:order-1"
          >
            <span className="text-xl">←</span>
            <span className="font-medium">Back to Club</span>
          </button>

          <div className="text-center order-1 sm:order-2">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">IoT Memory Challenge</h1>
            <p className="text-gray-600 text-sm sm:text-base">Match the technology pairs!</p>
          </div>

          <div className="card text-center order-3 min-w-[120px]">
            <div className="text-sm text-gray-600">
              Moves: <span className="font-bold text-blue-600">{moves}</span>
            </div>
            <div className="text-sm text-gray-600">
              Time: <span className="font-bold text-green-600">{formatTime(timeElapsed)}</span>
            </div>
          </div>
        </div>

        {/* Game Content */}
        <div className="card">
          {!gameStarted && !gameWon ? (
            <div className="text-center py-12 sm:py-16">
              <div className="text-4xl sm:text-6xl mb-6">🧠</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">IoT Memory Challenge</h2>
              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto">
                Test your memory by matching pairs of IoT technology symbols. Challenge yourself to complete it in the fewest moves!
              </p>
              <button
                onClick={startGame}
                className="btn-primary text-lg"
              >
                Start Challenge
              </button>
            </div>
          ) : gameWon ? (
            <div className="text-center py-12 sm:py-16">
              <div className="text-4xl sm:text-6xl mb-6">🎉</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Congratulations!</h2>
              <div className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
                <p className="mb-2">
                  You completed the challenge in <span className="font-bold text-blue-600">{moves}</span> moves
                </p>
                <p>
                  Time taken: <span className="font-bold text-green-600">{formatTime(timeElapsed)}</span>
                </p>
              </div>
              <button
                onClick={startGame}
                className="bg-green-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Play Again
              </button>
            </div>
          ) : (
            // Game Grid
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {cards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => flipCard(card.id)}
                  className={`
                    relative h-16 sm:h-24 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105
                    ${flippedCards.includes(card.id) || matchedCards.includes(card.id) 
                      ? `${card.color} text-white shadow-lg` 
                      : "bg-gray-300 hover:bg-gray-400 shadow-md"}
                    ${matchedCards.includes(card.id) ? "ring-4 ring-yellow-400" : ""}
                  `}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    {flippedCards.includes(card.id) || matchedCards.includes(card.id) ? (
                      <span className="text-2xl sm:text-3xl">{card.symbol}</span>
                    ) : (
                      <span className="text-xl sm:text-2xl text-gray-600">?</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">📋</span>
            How to Play:
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-gray-600">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Click cards to reveal IoT technology symbols
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                Match two cards with the same symbol
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                Complete all pairs to win the challenge
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Try to minimize your moves and time!
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;
