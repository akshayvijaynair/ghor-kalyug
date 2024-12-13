import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CardContent,
  CircularProgress,
  Chip,
  Slider,
} from '@mui/material';
import { Add, ArrowForward, Delete } from '@mui/icons-material';
import Quiz from './Quiz';
import StyledCard from '../Components/StyledCard';
import StyledTextField from '../Components/StyledTextField';
import { generateQuiz } from '../services/generate-quiz';
import {Question, QuizRequest} from "../types/quiz.tsx";

const Home: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState(3);
  const [numQuestions, setNumQuestions] = useState(10);
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Disable submit button if there's an error or no subjects
  const isSubmitDisabled = !!error || subjects.length === 0;

  const handleAddSubject = () => {
    const trimmedSubject = subject.trim();

    // Check if maximum subjects reached
    if (subjects.length >= 3) {
      setError('You can add up to 3 subjects only.');
      return;
    }

    // Validation for empty input
    if (!trimmedSubject) {
      setError('Subject cannot be empty.');
      return;
    }

    // Validation for allowed characters
    if (!/^[a-zA-Z0-9\s]+$/.test(trimmedSubject)) {
      setError('Subject can only contain letters, numbers, and spaces.');
      return;
    }

    // Validation for maximum length
    if (trimmedSubject.length > 100) {
      setError('Subject cannot exceed 100 characters.');
      return;
    }

    // Check for duplicates
    if (subjects.includes(trimmedSubject)) {
      setError('Subject already added.');
      return;
    }

    // If validation passes, add the subject
    setSubjects([...subjects, trimmedSubject]);
    setSubject('');
    setError(null);
  };

  const handleRemoveSubject = (subjectToRemove: string) => {
    setSubjects(subjects.filter((sub) => sub !== subjectToRemove));
    // Clear error if any
    if (error) setError(null);
  };

  const handleStartQuiz = async () => {
    if (subjects.length > 0) {
      console.log('Fetching quiz for subjects:', subjects);
      setLoading(true);
      setError(null);
      try {
        const payload: QuizRequest = {
          topics: subjects,
          difficulty: difficulty || 1,
          numQuestions: numQuestions || 5
        };

        const data = await generateQuiz(payload);
        setQuestions(data.quiz);
        setQuizStarted(true);
      } catch (error) {
        setError(`Failed to fetch quiz data: ${error}`);
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please add at least one subject.');
    }
  };

  if (loading) {
    return (
        <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
            }}
        >
          <CircularProgress />
        </Box>
    );
  }

  if (quizStarted) {
    return <Quiz questions={questions} quizId="test"/>;
  }

  return (
      <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 64px)',
            px: 2,
          }}
      >
        <StyledCard elevation={4} sx={{ maxWidth: 600, width: '100%' }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Typography
                variant="h3"
                component="h1"
                gutterBottom
                fontWeight="bold"
            >
              Ghor Kalyug
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Enter your subjects of interest, choose difficulty, and set the
              number of questions to get a personalized quiz instantly.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <StyledTextField
                  fullWidth
                  placeholder="Enter subject"
                  variant="outlined"
                  value={subject}
                  // @ts-ignore
                  onChange={(e) => {
                    setSubject(e.target.value);
                    // Clear error when user types
                    if (error) setError(null);
                  }}
                  error={!!error}
                  helperText={error}
                  sx={{ flex: 1 }}
              />
              <Button
                  variant="contained"
                  size="small"
                  startIcon={<Add />}
                  onClick={handleAddSubject}
                  disabled={subjects.length >= 3}
              >
                Add
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
              {subjects.map((sub) => (
                  <Chip
                      key={sub}
                      label={sub}
                      onDelete={() => handleRemoveSubject(sub)}
                      deleteIcon={<Delete />}
                      color="primary"
                  />
              ))}
            </Box>
            <Typography gutterBottom>Difficulty Level</Typography>
            <Slider
                value={difficulty}
                onChange={(_, newValue) => setDifficulty(newValue as number)}
                step={1}
                marks
                min={1}
                max={5}
                valueLabelDisplay="on"
                sx={{ mb: 4 }}
            />
            <Typography gutterBottom>Number of Questions</Typography>
            <Slider
                value={numQuestions}
                onChange={(_, newValue) => setNumQuestions(newValue as number)}
                step={1}
                marks
                min={5}
                max={20}
                valueLabelDisplay="on"
                sx={{ mb: 4 }}
            />
            <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={handleStartQuiz}
                sx={{
                  minWidth: 200,
                  py: 1.5,
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
                disabled={isSubmitDisabled}
            >
              Start Quiz
            </Button>
          </CardContent>
        </StyledCard>
      </Box>
  );
};

export default Home;
