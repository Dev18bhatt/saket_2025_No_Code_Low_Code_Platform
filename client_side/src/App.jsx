import { useState } from "react";
import { TextField, Button, Typography, CircularProgress, Box } from "@mui/material";
import './App.css';

function App() {
  const [question, setQuestion] = useState('');
  const [schema, setSchema] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:3000/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();
      setSchema(data.result);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError("An error occurred while generating the schema.");
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #6C6E6F, #1A2D56)',
          color: 'white',
        }}
      >
        <Typography variant="h3" gutterBottom>
          Database Schema Generator
        </Typography>
        <TextField
          label="Enter your question"
          variant="filled"
          fullWidth
          sx={{ marginBottom: '20px', backgroundColor: 'white', borderRadius: '5px' }}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ padding: '10px 20px', color: "black" }}
        >
          Generate Schema
        </Button>

        {loading && (
          <Box sx={{ marginTop: '20px' }}>
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Typography sx={{ color: 'red', marginTop: '20px' }}>
            {error}
          </Typography>
        )}

        {schema && (
          <Box sx={{ marginTop: '20px', width: '80%', textAlign: 'left', backgroundColor: '#f4f4f4', borderRadius: '5px', padding: '20px' }}>
            <Typography variant="h6">Generated Schema:</Typography>
            <pre>{JSON.stringify(schema, null, 2)}</pre>
          </Box>
        )}
      </Box>
    </div>
  );
}

export default App;
