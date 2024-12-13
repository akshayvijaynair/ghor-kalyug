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
        // Initialize the selected answers array to match the length of questions
        if (id) {
            getQuiz(id).then(r => setQuestions(r.quiz));
        }
    }, [id]);

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

    const handleSubmit = async () => {
        try {
            // Log the quizId to ensure it is valid
            console.log("Quiz ID:", id);
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
        <Grid container sx={{
            padding: 5
        }}>
            <Grid size={{xs: 12, md: 3}}>
                <Paper elevation={2}
                       sx={{
                           width: '100%',
                           display: 'flex',
                           flexDirection: 'column',
                           alignItems: 'center',
                           justifyContent: 'center',
                           minHeight: 'calc(100vh - 150px)'
                       }}
                >
                    <Box>
                        <Typography variant="h6" sx={{p: 3}}>
                            Progress
                            <LinearProgress
                                variant="determinate"
                                value={(selectedAnswers.filter((a) => a !== null).length / questions.length) * 100}
                                sx={{mb:1}}
                            />
                            <Typography variant="body2">
                                {selectedAnswers.filter((a) => a !== null).length} of {questions.length} answered
                            </Typography>
                        </Typography>
                        <Grid container spacing={1} sx={{ paddingLeft: 3, paddingRight: 3}}>
                            {questions.map((_, index) => (
                                <Grid size={1} sx={{ margin: 1}} key={index}>
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
            <Grid size={{xs: 12, md: 6}}>
                <Paper elevation={2}
                       sx={{
                           width: '100%',
                           display: 'flex',
                           flexDirection: 'column',
                           alignItems: 'center',
                           justifyContent: 'center',
                           minHeight: 'calc(100vh - 150px)',
                           marginLeft: 2
                       }}
                >
                    {/* Question Display */}
                    <StyledCard elevation={4}>
                        <CardContent sx={{p: 4}}>
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
                                            value={index}
                                            control={<Radio/>}
                                            label={option.value}
                                        />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            <Box sx={{mt: 4, display: 'flex', justifyContent: 'space-between'}}>
                                <Button
                                    variant="contained"
                                    startIcon={<ArrowBack/>}
                                    onClick={handlePrevious}
                                    disabled={currentQuestion === 0}
                                >
                                    Previous
                                </Button>

                                {currentQuestion === questions.length - 1 ? (
                                    // Last question: show submit button
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={handleSubmit}
                                        disabled={selectedAnswers[currentQuestion] === null}
                                    >
                                        Submit
                                    </Button>
                                ) : (
                                    // Not last question: show next button
                                    <Button
                                        variant="contained"
                                        endIcon={<ArrowForward/>}
                                        onClick={handleNext}
                                        disabled={selectedAnswers[currentQuestion] === null}
                                    >
                                        Next
                                    </Button>
                                )}
                            </Box>
                        </CardContent>
                    </StyledCard>
                </Paper>
            </Grid>
            <Grid size={{xs: 12, md: 3}}>
                <Paper elevation={2}
                       sx={{
                           width: '100%',
                           display: 'flex',
                           flexDirection: 'column',
                           alignItems: 'center',
                           justifyContent: 'center',
                           minHeight: 'calc(100vh - 150px)',
                           marginLeft: 4
                       }}
                >
                    {/* Quiz Share */}
                    <Box >
                        <Typography variant="h6" gutterBottom>
                            Like this Quiz? Share it with your friends
                        </Typography>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default Quiz;
