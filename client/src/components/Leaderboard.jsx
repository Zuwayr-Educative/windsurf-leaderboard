import { useEffect, useState } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchScores = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/scores');
      // Sort scores in descending order
      const sortedScores = [...response.data].sort((a, b) => b.score - a.score);
      setScores(sortedScores);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch scores');
      setLoading(false);
      console.error('Error fetching scores:', err);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const handleScoreAdded = () => {
    fetchScores();
  };

  if (loading) return <div>Loading leaderboard...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Leaderboard</h2>
      <AddScoreForm onScoreAdded={handleScoreAdded} />
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Rank</th>
              <th style={styles.th}>Player</th>
              <th style={styles.th}>Score</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <tr key={score._id || index} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{score.name}</td>
                <td style={styles.td}>{score.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AddScoreForm = ({ onScoreAdded }) => {
  const [name, setName] = useState('');
  const [score, setScore] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim()) {
      setError('Please enter a player name');
      return;
    }
    
    const scoreNum = parseInt(score, 10);
    if (isNaN(scoreNum) || scoreNum < 0) {
      setError('Please enter a valid positive score');
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/scores', {
        name: name.trim(),
        score: scoreNum
      });
      
      // Reset form and fetch updated scores
      setName('');
      setScore('');
      setError('');
      onScoreAdded();
    } catch (err) {
      setError('Failed to add score. Please try again.');
      console.error('Error adding score:', err);
    }
  };

  return (
    <div style={styles.formContainer}>
      <h3>Add New Score</h3>
      {error && <div style={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="name" style={styles.label}>Player Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="score" style={styles.label}>Score:</label>
          <input
            type="number"
            id="score"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            min="0"
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>Add Score</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '30px',
  },
  tableContainer: {
    marginTop: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: '#f5f5f5',
    padding: '12px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
    fontWeight: 'bold',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #eee',
  },
  evenRow: {
    backgroundColor: '#f9f9f9',
  },
  oddRow: {
    backgroundColor: '#fff',
  },
  formContainer: {
    backgroundColor: '#f5f5f5',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '14px',
  },
  button: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '10px',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#45a049',
  },
  error: {
    color: '#d32f2f',
    marginBottom: '10px',
    padding: '8px',
    backgroundColor: '#ffebee',
    borderRadius: '4px',
    borderLeft: '4px solid #d32f2f',
  },
};

export default Leaderboard;
