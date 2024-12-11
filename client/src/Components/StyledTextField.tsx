import {styled} from "@mui/material/styles";
import {alpha, TextField} from "@mui/material";

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: theme.shape.borderRadius * 2,
        backgroundColor: alpha(theme.palette.background.paper, 0.6),
        '&:hover': {
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
        },
        '&.Mui-focused': {
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
        },
    },
}));

export default StyledTextField