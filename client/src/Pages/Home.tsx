import React, { useState } from 'react';
import {Box, Typography, Button, CardContent, CircularProgress} from '@mui/material';
import { ArrowForward, Chat } from '@mui/icons-material';
import Quiz from '@components/Quiz';
import StyledCard from '@components/StyledCard'
import StyledTextField from '@components/StyledTextField';

const Home: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleStartQuiz = async () => {
    if (subject.trim()) {
      console.log('Fetching quiz for subject:', subject);
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/generate-quiz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ topic: subject }),
        });

        console.log('API response status:', response.status);

        if (!response.ok) {
          throw new Error('Failed to fetch quiz data');
        }

        const data = await response.json();
        console.log('API response data:', data);

        setQuestions(data.quiz);
        setQuizStarted(true);
      } catch (error) {
        console.error('Error fetching quiz:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (quizStarted) {
    return <Quiz questions={questions} />;
  }

  return (
    <Box sx={{ 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 64px)',
      px: 2
    }}>
      <StyledCard elevation={4}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Chat sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Ghor Kalyug
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Enter your subject of interest and get a personalized quiz instantly
          </Typography>
          <StyledTextField
            fullWidth
            placeholder="Enter subject"
            variant="outlined"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
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
          >
            Start Quiz
          </Button>
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default Home;
