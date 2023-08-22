import React, { useState } from 'react';
import { Paper, TextField, Button, Typography, Container } from '@mui/material';
import axios from 'axios';

function Register(props) {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handlePasswordConfirmationChange = (event) => {
        setPasswordConfirmation(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!name || !username || !email || !password || !passwordConfirmation) {
            alert('Tüm alanları doldurun.');
            return;
        }

        if (password !== passwordConfirmation) {
            alert('Şifreler eşleşmiyor.');
            return;
        }

        if (password.length < 6 || username.length < 6) {
            alert('Şifre ve kullanıcı adı en az 6 karakter olmalıdır.');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            alert('Geçerli bir email adresi girin.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/register', {
                name: name,
                username: username,
                email: email,
                password: password,
            });

            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                alert('Kayıt işlemi başarılı.');
                window.location.href = '/dashboard';
                console.log('Başarılı kayıt:', response.data);
            }

        } catch (error) {
            alert('Kayıt işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
            console.error('Kayıt Hatası:', error);
        }
    };

    return (
        <Container maxWidth="xs">
            <Paper elevation={3} style={{ padding: '20px' }}>
                <Typography variant="h5" gutterBottom>
                    Kayıt Ol
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="İsim"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={name}
                        onChange={handleNameChange}
                    />
                    <TextField
                        label="Kullanıcı Adı (En az 6 karakter)"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={handleUsernameChange}
                    />
                    <TextField
                        label="Email"
                        type="email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={handleEmailChange}
                    />
                    <TextField
                        label="Şifre (En az 6 karakter)"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <TextField
                        label="Şifre Onayı"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={passwordConfirmation}
                        onChange={handlePasswordConfirmationChange}
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Kayıt Ol
                    </Button>
                    <Typography variant="body2" align="center">
                        Zaten bir hesabınız var mı?{' '}
                        <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => props.navigateToLogin()}>
                            Giriş Yap
                        </span>
                    </Typography>
                </form>
            </Paper>
        </Container>
    );
}

export default Register;
