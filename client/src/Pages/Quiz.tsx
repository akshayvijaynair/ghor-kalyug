import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    LinearProgress,
    Paper,
    IconButton,
    Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useParams, useNavigate } from "react-router-dom";
import { getQuiz } from "../services/get-quiz";
import { QRCodeCanvas } from "qrcode.react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckIcon from "@mui/icons-material/Check";

const StyledPaper = styled(Paper)(({ theme }) => ({
    background: theme.palette.background.paper,
    borderRadius: "12px",
    width: "100%",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    padding: theme.spacing(3),
}));

const QuestionIndicator = styled(IconButton)<{ completed?: boolean }>(({ theme, completed }) => ({
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    margin: theme.spacing(0.5),
    color: completed ? theme.palette.primary.contrastText : theme.palette.text.primary,
    backgroundColor: completed ? theme.palette.primary.main : theme.palette.grey[200],
    "&:hover": {
        backgroundColor: completed ? theme.palette.primary.dark : theme.palette.grey[300],
    },
}));

const Quiz: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const url = import.meta.env.VITE_DOMAIN + "/home/" + id;

    const [questions, setQuestions] = useState<any[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState<number | null>(null);
    const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes

    useEffect(() => {
        if (id) getQuiz(id).then((r) => setQuestions(r.quiz));
    }, [id]);

    useEffect(() => {
        if (questions.length > 0) {
            setSelectedAnswers(new Array(questions.length).fill(null));
        }
    }, [questions]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 0) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestion] = event.target.value;
        setSelectedAnswers(newAnswers);
    };

    const handleSubmit = () => {
        const correctAnswers = questions.map((q) => q.answer);
        const score = selectedAnswers.filter((ans, idx) => ans === correctAnswers[idx]).length;
        setScore(score);
        setIsSubmitted(true);
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
        <Box sx={{ bgcolor: "#8C7AE6", minHeight: "100vh", p: 3 }}>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={6}>
                <Typography variant="h5" color="#FFF" fontWeight="bold">
                    Ghor Kalyug
                </Typography>
                <QRCodeCanvas value={url} size={70} />
            </Box>

            <StyledPaper sx={{ mt: 8, mx: "auto", maxWidth: 800 }}>
                {/* Timer and Progress */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography color="text.primary" fontWeight="bold">
                        Time Remaining: <span style={{ color: "#555" }}>{formatTime(timeRemaining)}</span>
                    </Typography>
                    <Typography color="text.secondary" fontWeight="bold">
                        Progress: {currentQuestion + 1}/{questions.length}
                    </Typography>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={((currentQuestion + 1) / questions.length) * 100}
                    sx={{ height: 8, borderRadius: 4, mb: 2 }}
                />

                {/* Questions */}
                {!isSubmitted && questions.length > 0 && (
                    <>
                        <Typography variant="h6" fontWeight="bold" mb={2}>
                            Question {currentQuestion + 1} of {questions.length}
                        </Typography>
                        <Typography variant="h5" mb={3}>
                            {questions[currentQuestion].question}
                        </Typography>

                        <FormControl component="fieldset" fullWidth>
                            <RadioGroup
                                value={selectedAnswers[currentQuestion] ?? ""}
                                onChange={handleAnswerChange}
                            >
                                {questions[currentQuestion].options.map((option: any, idx: number) => (
                                    <FormControlLabel
                                        key={idx}
                                        value={option.key}
                                        control={<Radio />}
                                        label={option.value}
                                        sx={{
                                            mb: 1,
                                            border: "1px solid #E5E7EB",
                                            borderRadius: "8px",
                                            px: 2,
                                            py: 1,
                                            backgroundColor:
                                                selectedAnswers[currentQuestion] === option.key
                                                    ? "#E0E7FF"
                                                    : "#FFF",
                                        }}
                                    />
                                ))}
                            </RadioGroup>
                        </FormControl>

                        {/* Navigation */}
                        <Box display="flex" justifyContent="space-between" mt={4}>
                            <Button
                                variant="outlined"
                                startIcon={<ArrowBackIcon />}
                                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                                disabled={currentQuestion === 0}
                            >
                                Previous
                            </Button>
                            {currentQuestion === questions.length - 1 ? (
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={handleSubmit}
                                    disabled={selectedAnswers.includes(null)}
                                >
                                    Submit Quiz
                                </Button>
                            ) : (
                                <Button
                                    variant="outlined"
                                    endIcon={<ArrowForwardIcon />}
                                    onClick={() => setCurrentQuestion(currentQuestion + 1)}
                                >
                                    Next
                                </Button>
                            )}
                        </Box>
                    </>
                )}

                {/* Score Display */}
                {isSubmitted && (
                    <Box textAlign="center">
                        <Typography variant="h4" fontWeight="bold" color="primary" mb={2}>
                            Quiz Completed!
                        </Typography>
                        <Typography variant="h5" mb={3}>
                            Your Score: {score} / {questions.length}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate("/home")}
                        >
                            Home
                        </Button>
                    </Box>
                )}
            </StyledPaper>
        </Box>
    );
};

export default Quiz;
