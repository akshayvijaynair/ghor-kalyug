import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Card, CardContent, List, ListItem, ListItemText } from '@mui/material';

interface Quiz {
  _id: string;
  topics: string[];
  difficulty: string;
  numQuestions: number;
  createdAt: string;
  quiz: any[]; // Adjust type as per your quiz schema
}

const RecentQuizzes: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const idToken = localStorage.getItem('idToken');
        const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/user-quizzes-full`, {
          headers: {
            'Authorization': `Bearer ${idToken}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch quizzes.');
        }

        const data = await response.json();
        setQuizzes(data.quizzes);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p:4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p:4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!quizzes || quizzes.length === 0) {
    return (
      <Box sx={{ p:4 }}>
        <Typography>No recent quizzes found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p:4 }}>
      <Typography variant="h4" sx={{ mb:2 }}>Recent Quizzes</Typography>
      {quizzes.map((quiz) => (
        <Card key={quiz._id} sx={{ mb:2 }}>
          <CardContent>
            <Typography variant="h6">{quiz.topics.join(', ')} Quiz</Typography>
            <Typography variant="body2">
              Difficulty: {quiz.difficulty}, Questions: {quiz.numQuestions}
            </Typography>
            <Typography variant="body2">
              Created At: {new Date(quiz.createdAt).toLocaleString()}
            </Typography>
            <List>
              {quiz.quiz.map((q, idx) => (
                <ListItem key={idx}>
                  <ListItemText 
                    primary={q.question}
                    secondary={`Correct Answer: ${q.answer}`} 
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default RecentQuizzes;
