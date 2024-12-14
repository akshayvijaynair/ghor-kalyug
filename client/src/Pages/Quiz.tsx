import React, {useState, useEffect} from 'react';
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
    Grid2 as Grid, Paper,
} from '@mui/material';
import {ArrowBack, ArrowForward} from '@mui/icons-material';
import {styled} from '@mui/material/styles';
import {Question} from "../types/quiz.tsx";
import {useParams} from "react-router-dom";
import {getQuiz} from "../services/get-quiz.tsx";
import {submitQuizAndGetAnswers} from "../services/get-quiz-answers.tsx";
import {QRCodeCanvas} from "qrcode.react";

const StyledCard = styled(Card)(({theme}) => ({
    background: theme.palette.background.paper,
    maxWidth: '800px',
    width: '100%',
    marginTop: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
}));

const ProgressButton = styled(Button)<{ completed?: boolean }>(({theme, completed}) => ({
    minWidth: '40px',
    width: '40px',
    height: '40px',
    padding: 0,
    borderRadius: '50%',
    backgroundColor: completed ? theme.palette.primary.main : theme.palette.grey[300],
    color: completed ? theme.palette.primary.contrastText : "000000",
    fontSize: '18px',
    '&:hover': {
        backgroundColor: completed ? theme.palette.primary.dark : theme.palette.grey[400],
    },
}));

const Quiz: React.FC = () => {
    const {id} = useParams();
    const url = import.meta.env.VITE_DOMAIN + "/home/"+id;
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState<number | null>(null);

    useEffect(() => {
        // Initialize the selected answers array to match the length of questions
        if (questions) {
            setSelectedAnswers(new Array(questions.length).fill(null));
        }
    }, [questions]);

    useEffect(() => {
        if (id) {
            getQuiz(id).then((r) => setQuestions(r.quiz));
        }
    }, [id]);

    const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSelectedAnswers = [...selectedAnswers];
        newSelectedAnswers[currentQuestion] = Number(event.target.value);
        setSelectedAnswers(newSelectedAnswers);
    };

    const handleClearAnswer = () => {
        const newSelectedAnswers = [...selectedAnswers];
        newSelectedAnswers[currentQuestion] = null; // Reset the current question's answer
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

    const handleSubmit = async () => {
        try {
            // Log the quizId to ensure it is valid
            console.log("Quiz ID:", id);
            console.log(questions)
            console.log(selectedAnswers);
            const data = await submitQuizAndGetAnswers();
            // Handle grading logic here...
            console.log("Fetched Quiz Data:", data);

            // Process answers and calculate score
            // @ts-ignore
            const correctAnswers = data.quiz.map((q: any) => q.answer); // Extract correct answers
            let correctCount = 0;

            for (let i = 0; i < questions.length; i++) {
                const userSelectedOptionIndex = selectedAnswers[i];
                if (userSelectedOptionIndex !== null) {
                    const userAnswerKey = questions[i].options[userSelectedOptionIndex].key;
                    if (userAnswerKey === correctAnswers[i]) {
                        correctCount++;
                    }
                }
            }

            setScore(correctCount);
            setIsSubmitted(true);
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error verifying answers:", error.message);
            } else {
                console.error("Error verifying answers:", error);
            }
            alert("An error occurred while fetching the quiz. Please try again.");
        }
    };


    if (questions.length === 0) {
        return <Typography>Loading...</Typography>;
    }

    // If submitted, display the result
    if (isSubmitted && score !== null) {
        return (
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 'calc(100vh - 64px)',
                    p: 4,
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Quiz Completed!
                </Typography>
                <Typography variant="h6">
                    Your Score: {score} / {questions.length}
                </Typography>
            </Box>
        );
    }

    return (
        <Grid
            container
            spacing={2}
            sx={{
                padding: { xs: 2, md: 5 },
            }}
        >
            {/* Progress Section */}
            <Grid size={{ xs:12, md:3, lg:3 }}>
                <Paper
                    elevation={2}
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: { xs: 'auto', md: 'calc(100vh - 150px)' }, // Adjust height
                        padding: { xs: 2, md: 3 },
                    }}
                >
                    <Box>
                        <Typography variant="h6" sx={{ p: 2 }}>
                            Progress
                            <LinearProgress
                                variant="determinate"
                                value={(selectedAnswers.filter((a) => a !== null).length / questions.length) * 100}
                                sx={{ mb: 1 }}
                            />
                            <Typography variant="body2">
                                {selectedAnswers.filter((a) => a !== null).length} of {questions.length} answered
                            </Typography>
                        </Typography>
                        <Grid container spacing={1}>
                            {questions.map((_, index) => (
                                <Grid size={{xs: 1}} sx={{ m: 2 }} key={index}>
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
                </Paper>
            </Grid>

            {/* Question Section */}
            <Grid size={{ xs:12, md:5, lg:6}}>
                <Paper
                    elevation={2}
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: { xs: 'auto', md: 'calc(100vh - 150px)' },
                        marginLeft: { xs: 0, md: 2 },
                        padding: { xs: 2, md: 4 },
                    }}
                >
                    <StyledCard elevation={4}>
                        <CardContent>
                            <Grid container>
                                <Grid size={{xs: 12 }}>
                                    <Typography variant="h5" gutterBottom>
                                        {questions[currentQuestion]?.question}
                                    </Typography>
                                </Grid>
                                <Grid size={{xs: 12 }}>
                                    <FormControl component="fieldset">
                                        <RadioGroup
                                            value={selectedAnswers[currentQuestion] ?? ''}
                                            onChange={handleAnswerChange}
                                        >
                                            {questions[currentQuestion]?.options.map((option, index) => (
                                                <FormControlLabel
                                                    key={index}
                                                    value={index}
                                                    control={<Radio />}
                                                    label={option.value}
                                                />
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid size={{xs: 12}} sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                                    <Button
                                        variant="contained"
                                        startIcon={<ArrowBack />}
                                        onClick={handlePrevious}
                                        disabled={currentQuestion === 0}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={handleClearAnswer}
                                        disabled={selectedAnswers[currentQuestion] === null}
                                    >
                                        Clear Answer
                                    </Button>
                                    <Button
                                        variant="contained"
                                        endIcon={<ArrowForward />}
                                        onClick={handleNext}
                                        disabled={currentQuestion === questions.length-1}
                                    >
                                        Next
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid size={{xs: 12}} sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    sx={{ width: "100%" }}
                                    onClick={handleSubmit}
                                    disabled={selectedAnswers.filter(x => x !== null).length!==questions.length}
                                >
                                    Submit
                                </Button>
                            </Grid>
                        </CardContent>
                    </StyledCard>
                </Paper>
            </Grid>

            {/* Share Section */}
            <Grid size={{ xs:12, md:4, lg:3 }}>
                <Paper
                    elevation={2}
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: { xs: 'auto', md: 'calc(100vh - 150px)' },
                        marginLeft: { xs: 0, md: 4 },
                        padding: { xs: 2, md: 3 },
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Like this Quiz? Share it with your friends
                    </Typography>
                    <Box
                        sx={{
                            width: { xs: 128, md: 256 },
                            height: { xs: 128, md: 256 },
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                        }}
                    >
                        <QRCodeCanvas
                            value={url}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                            }}
                        />
                    </Box>
                </Paper>
            </Grid>
        </Grid>

    );
};

export default Quiz;