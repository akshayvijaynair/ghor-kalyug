import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Card, 
  CardContent, 
  CardHeader, 
  Grid, 
  Chip, 
  Avatar, 
  Badge,
  Container
} from '@mui/material';
import { Gamepad, EmojiEvents } from '@mui/icons-material';

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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!quizzes || quizzes.length === 0) {
    return (
        
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)' }}>
        <Typography color="textSecondary">No recent quizzes found.</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Discover
        </Typography>
        <Badge badgeContent={quizzes.length} color="secondary" sx={{ '& .MuiBadge-badge': { fontSize: '0.8rem', height: '22px', minWidth: '22px' } }}>
          <Chip
            icon={<EmojiEvents fontSize="small" />}
            label="Quizzes Completed"
            variant="outlined"
          />
        </Badge>
      </Box>
      <Grid container spacing={3}>
        {quizzes.map((quiz) => (
          <Grid item xs={12} sm={6} md={4} key={quiz._id}>
            <Card>
              <CardHeader
                title={`${quiz.topics[0]} Quiz`}
                action={
                  <Chip
                    icon={<Gamepad fontSize="small" />}
                    label={`${quiz.numQuestions} Questions`}
                    size="small"
                  />
                }
                sx={{ bgcolor: 'action.hover' }}
              />
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Difficulty</Typography>
                    <Chip label={quiz.difficulty} size="small" variant="outlined" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">Topics</Typography>
                    <Box>
                      {quiz.topics.map((topic) => (
                        <Chip key={topic} label={topic} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                      ))}
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', pt: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Avatar sx={{ width: 32, height: 32, mr: 1 }}>U</Avatar>
                  <Box>
                    <Typography variant="body2">Created by You</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(quiz.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default RecentQuizzes;

