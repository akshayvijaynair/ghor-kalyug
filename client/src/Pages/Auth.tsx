import { Box } from "@mui/material";
import Login from "../Components/Login.tsx";

export default function Auth() {
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
        }}>
            <Login />
        </Box>
    );
}

