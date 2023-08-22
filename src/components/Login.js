import React, { useState } from 'react';
import { Paper, TextField, Button, Typography, Container } from '@mui/material';
import axios from 'axios';

function Login(props) {
    const [emailOrUsername, setemailOrUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailOrUsernameChange = (event) => {
        setemailOrUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleRegisterClick = () => {
        props.navigateToRegister();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/api/login', {
                emailOrUsername: emailOrUsername,
                password: password,
            });

            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                alert('Giriş başarılı');
                window.location.href = '/dashboard';
                console.log('Başarılı giriş:', response.data);
            }
        } catch (error) {
            alert('Lütfen giriş bilgilerini kontrol ediniz.');
            console.error('Giriş hatası:', error);

        }
    };

    return (
        <Container maxWidth="xs">
            <Paper elevation={3} style={{ padding: '20px' }}>
                <Typography variant="h5" gutterBottom>
                    Giriş Yap
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Kullanıcı Adı veya Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={emailOrUsername}
                        onChange={handleEmailOrUsernameChange}
                    />
                    <TextField
                        label="Şifre"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Giriş Yap
                    </Button>

                    <Typography variant="body2" align="center">
                        Hesabınız yok mu?{' '}
                        <span style={{ color: 'blue', cursor: 'pointer' }} onClick={handleRegisterClick}>
                            Kayıt Ol
                        </span>
                    </Typography>
                </form>
            </Paper>
        </Container>
    );
}
export default Login;
