import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Alert,
} from "@mui/material";

const submitQuizAPI = async (answers) => {
  const res = await axios.post("http://localhost:8080/submit", { answers });
  return res.data;
};

function QuizPage() {
  const { state } = useLocation();
  const { quiz, topic } = state;

  const [answers, setAnswers] = useState(Array(quiz.length).fill(""));
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    try {
      const res = await submitQuizAPI(answers);
      setResult(res);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit quiz");
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Quiz on {topic}
      </Typography>

      {quiz.map((q, index) => (
        <Card key={q.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="body1" gutterBottom>
              {index + 1}. {q.question}
            </Typography>
            <RadioGroup
              value={answers[index]}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
            >
              {q.options.map((option, idx) => (
                <FormControlLabel
                  key={idx}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      ))}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={answers.some((a) => a === "")}
        sx={{ mt: 2 }}
      >
        Submit Quiz
      </Button>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      {result && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Your Score: {result.score}/{quiz.length}
          </Typography>
          {result.gradedQuiz.map((q, index) => (
            <Card key={q.id} sx={{ mb: 2, borderColor: q.isCorrect ? "green" : "red" }}>
              <CardContent>
                <Typography variant="body1" gutterBottom>
                  {index + 1}. {q.question}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Your Answer: {q.studentAnswer}
                </Typography>
                <Typography variant="body2" color="primary">
                  Correct Answer: {q.correct}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default QuizPage;
