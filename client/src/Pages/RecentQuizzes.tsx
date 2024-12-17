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
  Modal,
  Divider,
  Button,
  Container,
  useTheme,
  alpha,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Gamepad, EmojiEvents} from '@mui/icons-material';
import Sidebar from '../Components/Sidebar';

interface Quiz {
  _id: string;
  topics: string[];
  difficulty: string;
  numQuestions: number;
  createdAt: string;
  quiz: {
    question: string;
    answer: string;
    userAnswer?: string;
    options: (string | { key: string; value: string })[]; // Updated to handle both strings and objects
  }[];
}

const RecentQuizzes: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const idToken = localStorage.getItem('idToken');
        const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/user-quizzes-full`, {
          headers: { 'Authorization': `Bearer ${idToken}` },
        });
        if (!response.ok) throw new Error('Failed to fetch quizzes.');
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

  const handleQuizClick = async (quizId: string) => {
    setModalLoading(true);
    setSelectedQuiz(null);
    try {
      const idToken = localStorage.getItem('idToken');
      const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/quizzes/${quizId}`, {
        headers: { 'Authorization': `Bearer ${idToken}` },
      });
      if (!response.ok) throw new Error('Failed to fetch quiz details.');
      const data = await response.json();
      setSelectedQuiz(data);
    } catch (error: any) {
      console.error('Error fetching quiz details:', error.message);
      setError('Failed to load quiz details.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedQuiz(null);
  };

  const calculateScore = (quiz: Quiz) => {
    const correctAnswers = quiz.quiz.filter(q => q.userAnswer === q.answer).length;
    return `${correctAnswers}/${quiz.quiz.length}`;
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar activeTab="recentQuizzes" onTabChange={() => {}} />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, ml: { sm: '250px' } }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Recent Quizzes
          </Typography>
          {quizzes && quizzes.length > 0 && (
            <Chip
              icon={<EmojiEvents sx={{ color: theme.palette.primary.main }} />}
              label={`${quizzes.length} Quizzes Completed`}
              variant="outlined"
              sx={{ borderColor: theme.palette.primary.main, color: theme.palette.primary.main }}
            />
          )}
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress sx={{ color: theme.palette.primary.main }} />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : !quizzes || quizzes.length === 0 ? (
          <Typography color="textSecondary">No recent quizzes found.</Typography>
        ) : (
          <Grid container spacing={3}>
            {quizzes.map((quiz) => (
              <Grid item xs={12} sm={6} md={4} key={quiz._id}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: theme.shadows[4] },
                    transition: 'all 0.3s ease-in-out',
                  }}
                  onClick={() => handleQuizClick(quiz._id)}
                >
                  <CardHeader
                    title={`${quiz.topics[0]} Quiz`}
                    titleTypographyProps={{ fontWeight: 'bold' }}
                    action={
                      <Chip
                        icon={<Gamepad sx={{ color: theme.palette.primary.main }} />}
                        label={`${quiz.numQuestions} Questions`}
                        size="small"
                        sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}
                      />
                    }
                  />
                  <CardContent>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Difficulty</Typography>
                      <Chip
                        label={quiz.difficulty}
                        size="small"
                        sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Created At</Typography>
                      <Typography variant="caption">{new Date(quiz.createdAt).toLocaleDateString()}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Modal to Display Full Quiz */}
      <Modal open={!!selectedQuiz || modalLoading} onClose={handleCloseModal} aria-labelledby="quiz-modal-title">
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 800,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          maxHeight: '90vh',
          overflow: 'auto',
          borderRadius: 2,
        }}>
          {modalLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress />
            </Box>
          ) : selectedQuiz ? (
            <>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {selectedQuiz.topics[0]} Quiz Review
              </Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Score: {calculateScore(selectedQuiz)}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <List>
                {selectedQuiz.quiz.map((question, index) => (
                  <ListItem key={index} alignItems="flex-start" sx={{ flexDirection: 'column', mb: 3 }}>
                    <Typography variant="h6">Question {index + 1}: {question.question}</Typography>
                    <Typography variant="body1" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                      Correct Answer: {question.answer}
                    </Typography>
                    {question.userAnswer && (
                      <Typography
                        variant="body1"
                        sx={{
                          color: question.userAnswer === question.answer ? 'success.main' : 'error.main',
                          fontWeight: 'bold',
                        }}
                      >
                        Your Answer: {question.userAnswer}
                      </Typography>
                    )}
                    <List>
                      {question.options.map((option, idx) => {
                        // Handle option being either a string or an object
                        const optionText = typeof option === 'string' ? option : option.value || 'Invalid Option';

                        return (
                          <ListItem
                            key={idx}
                            sx={{
                              color: optionText === question.answer ? 'success.main' : 'inherit',
                              pl: 0,
                            }}
                          >
                            <ListItemText
                              primary={optionText}
                              primaryTypographyProps={{
                                fontWeight: optionText === question.answer ? 'bold' : 'normal',
                              }}
                            />
                          </ListItem>
                        );
                      })}
                    </List>
                  </ListItem>
                ))}
              </List>
              <Box sx={{ textAlign: 'right' }}>
                <Button onClick={handleCloseModal} variant="contained" sx={{ bgcolor: 'primary.main' }}>
                  Close
                </Button>
              </Box>
            </>
          ) : (
            <Typography>Unable to load quiz details.</Typography>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default RecentQuizzes;
