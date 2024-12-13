import { useState } from "react";
import { TextField, Button, Typography, CircularProgress, Box, Paper } from "@mui/material";
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
          padding: '20px',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: '30px',
            borderRadius: '15px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            width: '100%',
            maxWidth: '600px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Title centered */}
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Database Schema Generator
          </Typography>

          {/* Input centered */}
          <TextField
            label="Enter your question"
            variant="filled"
            fullWidth
            sx={{
              marginBottom: '20px',
              backgroundColor: 'white',
              borderRadius: '8px',
              '& .MuiFilledInput-root': { borderRadius: '8px' },
            }}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            error={!!error}
          />

          {/* Generate button centered */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              padding: '10px 20px',
              fontWeight: 'bold',
              color: "white",
              backgroundColor: '#3f51b5',
              '&:hover': { backgroundColor: '#2c387e' },
              borderRadius: '8px',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              marginBottom: '20px', // Adding space between button and next content
            }}
          >
            Generate Schema
          </Button>

          {/* Loading indicator centered */}
          {loading && (
            <Box sx={{ marginTop: '20px' }}>
              <CircularProgress sx={{ color: '#fff' }} />
            </Box>
          )}

          {/* Error message centered */}
          {error && (
            <Typography sx={{ color: 'red', marginTop: '20px', fontWeight: 'bold' }}>
              {error}
            </Typography>
          )}

          {/* Schema display centered */}
          {schema && (
            <Box
              sx={{
                marginTop: '20px',
                width: '100%',
                padding: '20px',
                backgroundColor: '#f4f4f4',
                borderRadius: '8px',
                color: 'white',
                overflow: 'auto',
                textAlign: 'left', // Keeping text left-aligned in the schema block
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Generated Schema:
              </Typography>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginTop: '10px' }}>
                {JSON.stringify(schema, null, 2)}
              </pre>
            </Box>
          )}
        </Paper>
      </Box>
    </div>
  );
}

export default App;
