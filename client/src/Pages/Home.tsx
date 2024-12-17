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
  AppBar,
  Toolbar,
  Avatar,
} from '@mui/material';
import { generateQuiz } from '../services/generate-quiz';
import { QuizRequest } from "../types/quiz";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Overview from "../Components/Overview";

enum DifficultyLevel {
  ElementarySchool = 1,
  MiddleSchool,
  HighSchool,
  College,
  Advanced,
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(DifficultyLevel.MiddleSchool);
  const [numQuestions, setNumQuestions] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartQuiz = async () => {
    if (subject.trim()) {
      setLoading(true);
      setError(null);

      try {
        const payload: QuizRequest = {
          topics: [subject],
          difficulty: difficulty,
          numQuestions: numQuestions
        };

        const data = await generateQuiz(payload);
        navigate(`/home/${data._id}`);
      } catch (error: any) {
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

  const renderContent = () => {
    if (activeTab === 'overview') {
      return <Overview />;
    }

    return (
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
                bgcolor: '#7C4DFF',
                '&:hover': { bgcolor: '#6B42E0' },
                fontWeight: 500,
              }}
            >
              Next Step
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <Box sx={{ flexGrow: 1, ml: '250px' }}>
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar sx={{ justifyContent: 'flex-end' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography>
                Good Morning, User
              </Typography>
              <Avatar sx={{ bgcolor: '#7C4DFF' }}>U</Avatar>
            </Box>
          </Toolbar>
        </AppBar>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default Home;

