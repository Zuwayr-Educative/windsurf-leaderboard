const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://your-netlify-app.netlify.app' : '*',
    methods: ['GET', 'POST'],
    credentials: true
}));

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/dist')));
}

// In-memory storage for scores
const scores = [];

// Function to reset scores (for testing)
const resetScores = () => {
    scores.length = 0;
};

// GET /api/scores - Get all scores sorted by highest to lowest
app.get('/api/scores', (req, res) => {
    // Sort scores in descending order
    const sortedScores = [...scores].sort((a, b) => b.score - a.score);
    res.json(sortedScores);
});

// POST /api/scores - Add a new score
app.post('/api/scores', (req, res) => {
    const { name, score } = req.body;
    
    // Basic validation
    if (!name || typeof score !== 'number' || score < 0) {
        return res.status(400).json({ 
            error: 'Invalid input. Please provide a name and a non-negative score.' 
        });
    }
    
    // Add the new score
    scores.push({ name, score });
    
    // Send success response
    res.status(201).json({ 
        message: 'Score added successfully',
        score: { name, score }
    });
});

// Serve the React app for any other routes in production
if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/dist/index.html'));
    });
}

// Start the server
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = {
    app,
    scores,
    resetScores,
    server
};
