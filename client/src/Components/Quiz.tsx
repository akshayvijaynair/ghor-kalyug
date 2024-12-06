import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  Grid,
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import {Question} from "../types/generate-quiz.tsx";

const StyledCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  maxWidth: '800px',
  width: '100%',
  marginTop: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
}));

const ProgressButton = styled(Button)<{ completed?: boolean }>(({ theme, completed }) => ({
  minWidth: '30px',
  width: '30px',
  height: '30px',
  padding: 0,
  borderRadius: '50%',
  backgroundColor: completed ? theme.palette.primary.main : theme.palette.grey[300],
  color: completed ? theme.palette.primary.contrastText : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: completed ? theme.palette.primary.dark : theme.palette.grey[400],
  },
}));


interface QuizProps {
  questions: Question[];
}

const Quiz: React.FC<QuizProps> = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);

  useEffect(() => {
    // Initialize the selected answers array to match the length of questions
    setSelectedAnswers(new Array(questions.length).fill(null));
  }, [questions]);

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestion] = Number(event.target.value);
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleNext = () => {
    setCurrentQuestion((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const handlePrevious = () => {
    setCurrentQuestion((prev) => Math.max(prev - 1, 0));
  };

  const handleJumpToQuestion = (index: number) => {
    setCurrentQuestion(index);
  };

  if (questions.length === 0) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 64px)',
        px: 2,
        py: 4,
      }}
    >
      {/* Question Display */}
      <StyledCard elevation={4}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            {questions[currentQuestion].question}
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              value={selectedAnswers[currentQuestion]}
              onChange={handleAnswerChange}
            >
              {questions[currentQuestion].options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option.key}
                  control={<Radio />}
                  label={option.value}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="contained"
              startIcon={<ArrowBack />}
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={handleNext}
              disabled={currentQuestion === questions.length - 1}
            >
              Next
            </Button>
          </Box>
        </CardContent>
      </StyledCard>

      {/* Progress Display */}
      <Box sx={{ ml: 4, width: '200px' }}>
        <Typography variant="h6" gutterBottom>
          Progress
        </Typography>
        <LinearProgress
          variant="determinate"
          value={(selectedAnswers.filter((a) => a !== null).length / questions.length) * 100}
          sx={{ mb: 2 }}
        />
        <Typography variant="body2" gutterBottom>
          {selectedAnswers.filter((a) => a !== null).length} of {questions.length} answered
        </Typography>
        <Grid container spacing={1} sx={{ mt: 2 }}>
          {questions.map((_, index) => (
            <Grid item key={index}>
              <ProgressButton
                onClick={() => handleJumpToQuestion(index)}
                completed={selectedAnswers[index] !== null}
              >
                {index + 1}
              </ProgressButton>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Quiz;
