import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Container,
  Alert,
} from '@mui/material';
import { generateQuiz } from '../services/generate-quiz';
import { QuizRequest } from "../types/quiz";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";

// Enum to match backend DifficultyLevel
enum DifficultyLevel {
  ElementarySchool = 1,
  MiddleSchool,
  HighSchool,
  College,
  Advanced,
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(DifficultyLevel.MiddleSchool);
  const [numQuestions, setNumQuestions] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartQuiz = async () => {
    if (subject.trim()) {
      console.log('Fetching quiz for subject:', subject);
      setLoading(true);
      setError(null);

      try {
        const payload: QuizRequest = {
          topics: [subject],
          difficulty: difficulty,
          numQuestions: numQuestions
        };

        console.log("Payload being sent to API:", payload);
        const data = await generateQuiz(payload);

        navigate(`/home/${data._id}`);
      } catch (error: any) {
        console.error('Error generating quiz:', error);
        setError(error.message || 'Failed to generate quiz. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please enter a subject.');
    }
  };

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F3F4F6' }}>
      <Header />
      <Container maxWidth="md" sx={{ pt: 4, pb: 8 }}>
        <Paper sx={{
          p: 4,
          borderRadius: 2,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)'
        }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
            Create Quiz
          </Typography>

          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Enter Subject"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                if (error) setError(null);
              }}
              error={!!error}
              helperText={error}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#F9FAFB',
                }
              }}
            />

            <FormControl fullWidth>
              <InputLabel>Difficulty Level</InputLabel>
              <Select
                value={difficulty}
                label="Difficulty Level"
                onChange={(e) => setDifficulty(Number(e.target.value))}
                sx={{
                  bgcolor: '#F9FAFB',
                }}
              >
                <MenuItem value={DifficultyLevel.ElementarySchool}>Elementary School</MenuItem>
                <MenuItem value={DifficultyLevel.MiddleSchool}>Middle School</MenuItem>
                <MenuItem value={DifficultyLevel.HighSchool}>High School</MenuItem>
                <MenuItem value={DifficultyLevel.College}>College</MenuItem>
                <MenuItem value={DifficultyLevel.Advanced}>Advanced</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Number of Questions</InputLabel>
              <Select
                value={numQuestions}
                label="Number of Questions"
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                sx={{
                  bgcolor: '#F9FAFB',
                }}
              >
                {[5, 10, 15, 20].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num} Questions
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {error && (
              <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              variant="contained"
              size="large"
              onClick={handleStartQuiz}
              sx={{
                mt: 2,
                py: 1.5,
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.dark' },
                fontWeight: 500,
              }}
            >
              Next Step
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Home;

