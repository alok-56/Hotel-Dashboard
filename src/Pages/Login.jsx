import { useState } from 'react';
import * as React from 'react';
import { Box, TextField, Button, Typography, Link, Container, CssBaseline } from '@mui/material';
import Loader from '../Components/Loader';
import { LoginApi } from '../Api/Services/Admin';
import { toast } from 'react-toastify';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';


export default function LoginPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const navigate=useNavigate()

    const HandleLogin = async () => {
        if (!username) {
            toast.error("Oops, Username is required!");
            return
        } else if (!password) {
            toast.error("Oops, Password is required!");
            return
        }
        setLoading(true)
        try {
            let res = await LoginApi({
                "Username": username,
                "Password": password
            })
            if (res.status) {
                Cookies.set("token", res.token, { expires: 12 / 24 });
                Cookies.set("data", JSON.stringify(res.data), { expires: 12 / 24 });
                navigate('/dashboard')
                toast.success(`${res.message}`);
            } else {
                toast.error(`${res.message}`);
            }
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }
    return (
        <main>

            <Loader loading={loading}></Loader>
            <CssBaseline />
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to top, #fff, #cce7ff)',
                    filter: 'brightness(0.9)',
                }}
            />
            <Container
                maxWidth="xs"
                sx={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        padding: 4,
                        borderRadius: 2,
                        boxShadow: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        backgroundColor: 'white',
                        opacity: 0.9,
                    }}
                >
                    <Typography variant="h4" align="center" fontWeight="bold">
                        Welcome!
                    </Typography>
                    <Typography variant="body1" align="center" sx={{ mb: 3 }}>
                        Sign in to continue.
                    </Typography>


                    <TextField
                        label="Username"
                        fullWidth
                        variant="outlined"
                        placeholder="Enter Your Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />


                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />


                    <Button variant="contained" sx={{ mt: 2 }} fullWidth onClick={HandleLogin}>
                        Log in
                    </Button>


                    <Typography
                        variant="body2"
                        align="center"
                        sx={{ fontSize: '0.875rem', mt: 2 }}
                    >
                        Don&apos;t have an account?{' '}
                        <Link href="/sign-up" variant="body2">
                            Sign up
                        </Link>
                    </Typography>
                </Box>
            </Container>
        </main>
    );
}
