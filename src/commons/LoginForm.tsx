import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase"; 
import { useNavigate } from "react-router-dom"; 
import { Box, Button, Container, TextField, Typography } from "@mui/material";

function LoginForm() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate(); 

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("kirjautminen onnistui")
            navigate("/");
        } catch (error) {
            console.error("Kirjautuminen epäonnistui", error);

        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                    padding: 2,
                }}
            >
                <Typography variant="h5" sx={{ marginBottom: 2 }}>
                    Kirjaudu sisään
                </Typography>
                
                <form onSubmit={handleLogin} style={{ width: "100%" }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Sähköposti"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Salasana"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />


                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: 3 }}
                    >
                        Kirjaudu sisään
                    </Button>

                    <Typography variant="body2" sx={{ marginBottom: 2 }}>
                    testi@testi.testi || password  (Jukka)
                    <br/>testi2@testi.testi || password  (Pekka)
                    </Typography>

                </form>
            </Box>
        </Container>
    );
}

export default LoginForm;