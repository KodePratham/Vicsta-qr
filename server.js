const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = 3000;
const LEADERBOARD_FILE = path.join(__dirname, 'leaderboard.json');

app.use(express.json());
app.use(express.static(__dirname)); // Serve static files from the project root

// API endpoint to get leaderboard
app.get('/api/leaderboard', async (req, res) => {
    try {
        const data = await fs.readFile(LEADERBOARD_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error reading leaderboard:', error);
        res.status(500).json({ message: 'Error reading leaderboard' });
    }
});

// API endpoint to save a score
app.post('/api/leaderboard', async (req, res) => {
    try {
        const newScore = req.body;
        if (!newScore || !newScore.name || typeof newScore.attempts !== 'number' || typeof newScore.time !== 'number') {
            return res.status(400).json({ message: 'Invalid score data' });
        }

        const data = await fs.readFile(LEADERBOARD_FILE, 'utf8');
        const leaderboard = JSON.parse(data);
        
        leaderboard.scores.push(newScore);

        // Sort scores - lower is better (attempts are primary, time is secondary)
        leaderboard.scores.sort((a, b) => {
            const scoreA = (a.attempts * 10000) + a.time;
            const scoreB = (b.attempts * 10000) + b.time;
            return scoreA - scoreB;
        });

        // Keep only top 10
        leaderboard.scores = leaderboard.scores.slice(0, 10);

        await fs.writeFile(LEADERBOARD_FILE, JSON.stringify(leaderboard, null, 4), 'utf8');
        
        res.status(201).json(leaderboard);
    } catch (error) {
        console.error('Error saving score:', error);
        res.status(500).json({ message: 'Error saving score' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Open index.html in your browser to play the game.');
});
