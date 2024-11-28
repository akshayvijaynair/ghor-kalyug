import React, { useState } from "react";
import axios from "axios";
import { Box, TextField, Button, Typography, Alert, CircularProgress } from "@mui/material";

// Helper function to sanitize and format input
const sanitizeInput = (input) => {
  return input
    .trim() // Remove leading/trailing whitespace
    .replace(/[\n\r]+/g, "\\n") // Replace newline characters with \n
    .replace(/"/g, '\\"'); // Escape double quotes
};

// API call to generate quiz
const generateQuizAPI = async ({ topic, courseMaterial }) => {
  const sanitizedTopic = sanitizeInput(topic);
  const sanitizedCourseMaterial = sanitizeInput(courseMaterial);
  const res = await axios.post("http://localhost:8080/generate", {
    topic: sanitizedTopic,
    courseMaterial: sanitizedCourseMaterial,
  });
  return res.data;
};

function QuizGenerator() {
  const [topic, setTopic] = useState("");
  const [courseMaterial, setCourseMaterial] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quiz, setQuiz] = useState(null);

  const handleGenerateQuiz = async () => {
    setIsLoading(true);
    setError(null);
    setQuiz(null);

    try {
      const response = await generateQuizAPI({ topic, courseMaterial });
      setQuiz(response.quiz);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred while generating the quiz.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 5, p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Quiz Generator
      </Typography>
      <Typography variant="body1" gutterBottom>
        Enter a topic and course material to generate a quiz.
      </Typography>

      <TextField
        fullWidth
        label="Enter the Topic"
        variant="outlined"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        sx={{ mt: 2 }}
      />

      <TextField
        fullWidth
        label="Enter the Course Material"
        variant="outlined"
        multiline
        rows={4}
        value={courseMaterial}
        onChange={(e) => setCourseMaterial(e.target.value)}
        sx={{ mt: 2 }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleGenerateQuiz}
        disabled={!topic || !courseMaterial || isLoading}
        sx={{ mt: 2 }}
      >
        {isLoading ? <CircularProgress size={24} /> : "Generate Quiz"}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {quiz && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Quiz on {topic}
          </Typography>
          {quiz.map((q, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="body1">
                {index + 1}. {q.question}
              </Typography>
              <ul>
                {q.options.map((option, idx) => (
                  <li key={idx}>{option}</li>
                ))}
              </ul>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default QuizGenerator;
