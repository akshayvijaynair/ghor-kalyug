import {Grid2 as Grid, Link, Typography} from "@mui/material";
import Login from "../Components/Login.tsx";
import {useState} from "react";
import Register from "../Components/Register.tsx";

export default function Auth() {
    const [isNewUser, setNewUser] = useState(false);

    return (
        <Grid container spacing={3} sx={{
            margin: "auto",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: 3,
            bgcolor: "background.paper",
        }}>
            {!isNewUser && (
                <Grid size={{xs: 12, md: 12}}>
                    <Login/>
                    <Typography variant="subtitle1" sx={{ textAlign:"center", marginTop: 3 }}>
                        New User? Sign up <Link
                        component="button"
                        variant="subtitle1"
                        onClick={() => {
                            setNewUser(true)
                        }}
                    >Here
                    </Link>
                    </Typography>
                </Grid>
            )}
            {isNewUser && (
                <Grid size={{xs: 12, md: 12}}>
                    <Register/>
                    <Typography variant="subtitle1" sx={{ textAlign:"center", marginTop: 3 }}>
                        Existing user? Sign in <Link
                        component="button"
                        variant="subtitle1"
                        onClick={() => {
                            setNewUser(false)
                        }}
                    >Here
                    </Link>
                    </Typography>
                </Grid>
            )}
        </Grid>
    )
}