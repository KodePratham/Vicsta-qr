import React, { useState } from 'react';
import Game from './Game';

function App() {
  const [showGame, setShowGame] = useState(false);

  const handleShowGame = () => {
    console.log('Starting game...'); // Debug log
    setShowGame(true);
  };

  const handleBackToClub = () => {
    console.log('Back to club...'); // Debug log
    setShowGame(false);
  };

  return (
    <div className="min-h-screen gradient-bg">
      {!showGame ? (
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Header */}
          <header className="text-center mb-12 sm:mb-16">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl sm:text-3xl text-white">⚡</span>
              </div>
              <h1 className="text-5xl sm:text-7xl font-bold bg-gradient-to-r from-blue-600 via-red-500 to-green-600 bg-clip-text text-transparent">
                VICSTA
              </h1>
            </div>
            <div className="card inline-block">
              <p className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                Departmental IoT Club
              </p>
              <p className="text-base sm:text-lg text-gray-600 flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                VIT Pune
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              </p>
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-6xl mx-auto">
            {/* Welcome Section */}
            <div className="card mb-8 sm:mb-12">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                  Welcome to Vicsta IoT Club!
                  <span className="text-4xl sm:text-5xl ml-3">🚀</span>
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Empowering innovation through Internet of Things technology. We connect minds, ideas, and devices to build the future.
                </p>
              </div>
              
              {/* Feature Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                <div className="text-center p-4 sm:p-6 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl sm:text-3xl text-white">🔧</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">Innovation Hub</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    State-of-the-art IoT lab with cutting-edge sensors, microcontrollers, and development boards for hands-on learning.
                  </p>
                </div>

                <div className="text-center p-4 sm:p-6 bg-red-50 rounded-2xl border border-red-100">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl sm:text-3xl text-white">🌐</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">Global Network</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Connected with industry leaders and tech communities worldwide to bring real-world experience to our members.
                  </p>
                </div>

                <div className="text-center p-4 sm:p-6 bg-green-50 rounded-2xl border border-green-100 sm:col-span-2 lg:col-span-1">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl sm:text-3xl text-white">🎯</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">Career Focus</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Industry mentorship, internship opportunities, and skill development programs to launch your tech career.
                  </p>
                </div>
              </div>
            </div>

            {/* Activities and Achievements */}
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-3">
                  <span className="text-2xl sm:text-3xl">💡</span>
                  What We Do
                </h3>
                <ul className="space-y-3 sm:space-y-4">
                  {[
                    'IoT Project Development & Prototyping',
                    'Technical Workshops & Industry Sessions',
                    'National & International Hackathons',
                    'Research Collaboration & Publications',
                    'Industry Partnerships & Internships'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0"></span>
                      <span className="text-sm sm:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-3">
                  <span className="text-2xl sm:text-3xl">🏆</span>
                  Our Achievements
                </h3>
                <ul className="space-y-3 sm:space-y-4">
                  {[
                    '50+ Successful IoT Projects Deployed',
                    'Winner of National IoT Innovation Contest',
                    'Published 20+ Research Papers',
                    'Partnerships with Google, Microsoft, AWS',
                    '100% Placement Rate for Active Members'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0"></span>
                      <span className="text-sm sm:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Game CTA */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-500 via-blue-600 to-purple-600 rounded-3xl p-8 sm:p-12 transform hover:scale-[1.02] transition-all duration-300 shadow-2xl">
                <div className="text-4xl sm:text-6xl mb-4 sm:mb-6 animate-bounce">🎮</div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready for a Challenge?</h3>
                <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
                  Test your cognitive skills with our IoT Memory Challenge! A fun way to exercise your brain while learning about IoT technologies.
                </p>
                <button
                  onClick={handleShowGame}
                  className="bg-white text-gray-800 font-bold py-3 sm:py-4 px-8 sm:px-10 rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 shadow-lg text-base sm:text-lg"
                >
                  Start Memory Challenge 🧠
                </button>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="text-center mt-12 sm:mt-16 py-6 sm:py-8 border-t border-gray-200">
            <div className="flex justify-center items-center gap-4 mb-4">
              {['blue', 'red', 'yellow', 'green'].map((color) => (
                <span key={color} className={`w-3 h-3 bg-${color}-500 rounded-full`}></span>
              ))}
            </div>
            <p className="text-gray-600 font-medium">© 2024 Vicsta IoT Club - VIT Pune</p>
            <p className="text-sm text-gray-500 mt-2">Building tomorrow's connected world, today.</p>
          </footer>
        </div>
      ) : (
        <Game onBack={handleBackToClub} />
      )}
    </div>
  );
}

export default App;
