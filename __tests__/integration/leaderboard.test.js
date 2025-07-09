const request = require('supertest');
const { app, resetScores, scores } = require('../../server');

let server;

// Start the server before tests
beforeAll((done) => {
    // The server is already created in server.js, we just need to start it
    server = app.listen(3001, done);
});

// Close the server after all tests are done
afterAll((done) => {
    if (server) {
        server.close(done);
    } else {
        done();
    }
});

describe('Leaderboard API Integration Tests', () => {
    // Clear the scores array before each test
    beforeEach(() => {
        resetScores();
    });

    describe('GET /api/scores', () => {
        it('should return an empty array when no scores exist', async () => {
            const response = await request(app).get('/api/scores');
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });

        it('should return scores sorted in descending order', async () => {
            // Add some test scores
            scores.push(
                { name: 'Alice', score: 100 },
                { name: 'Bob', score: 200 },
                { name: 'Charlie', score: 150 }
            );

            const response = await request(app).get('/api/scores');
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(3);
            
            // Check if scores are sorted in descending order
            expect(response.body[0].score).toBe(200);
            expect(response.body[1].score).toBe(150);
            expect(response.body[2].score).toBe(100);
        });
    });

    describe('POST /api/scores', () => {
        it('should add a new score', async () => {
            const newScore = { name: 'Test User', score: 500 };
            
            const response = await request(app)
                .post('/api/scores')
                .send(newScore);
            
            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Score added successfully');
            expect(response.body.score).toMatchObject(newScore);
            
            // Verify the score was actually added
            expect(scores).toContainEqual(newScore);
        });

        it('should return 400 for missing name', async () => {
            const response = await request(app)
                .post('/api/scores')
                .send({ score: 100 });
            
            expect(response.status).toBe(400);
            expect(response.body.error).toContain('Invalid input');
        });

        it('should return 400 for missing score', async () => {
            const response = await request(app)
                .post('/api/scores')
                .send({ name: 'Test User' });
            
            expect(response.status).toBe(400);
            expect(response.body.error).toContain('Invalid input');
        });

        it('should return 400 for negative score', async () => {
            const response = await request(app)
                .post('/api/scores')
                .send({ name: 'Test User', score: -100 });
            
            expect(response.status).toBe(400);
            expect(response.body.error).toContain('non-negative');
        });
        
        it('should handle multiple score submissions correctly', async () => {
            const testScores = [
                { name: 'Player1', score: 100 },
                { name: 'Player2', score: 200 },
                { name: 'Player3', score: 300 }
            ];
            
            // Submit all scores
            for (const score of testScores) {
                await request(app)
                    .post('/api/scores')
                    .send(score);
            }
            
            // Verify all scores were added
            const response = await request(app).get('/api/scores');
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(3);
            
            // Verify scores are in descending order
            const sortedScores = [...testScores].sort((a, b) => b.score - a.score);
            expect(response.body).toMatchObject(sortedScores);
        });
        
        it('should handle empty name string', async () => {
            const response = await request(app)
                .post('/api/scores')
                .send({ name: '', score: 100 });
            
            expect(response.status).toBe(400);
            expect(response.body.error).toContain('Invalid input');
        });
        
        it('should handle non-numeric score', async () => {
            const response = await request(app)
                .post('/api/scores')
                .send({ name: 'Test', score: 'not-a-number' });
            
            expect(response.status).toBe(400);
            expect(response.body.error).toContain('Invalid input');
        });
        
        it('should handle very large scores', async () => {
            const largeScore = { name: 'High Scorer', score: 999999999 };
            const response = await request(app)
                .post('/api/scores')
                .send(largeScore);
            
            expect(response.status).toBe(201);
            
            const getResponse = await request(app).get('/api/scores');
            expect(getResponse.body[0]).toMatchObject(largeScore);
        });
    });
});
