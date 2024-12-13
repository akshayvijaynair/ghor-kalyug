import {styled} from "@mui/material/styles";
import {alpha, Card} from "@mui/material";

const StyledCard = styled(Card)(({ theme }) => ({
    background: alpha(theme.palette.background.paper, 0.8),
    backdropFilter: 'blur(10px)',
    maxWidth: '500px',
    width: '100%',
    marginTop: theme.spacing(4),
}));

export default StyledCard