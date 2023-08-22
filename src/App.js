import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Register from './components/Register';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [showRegister, setShowRegister] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    const navigateToRegister = () => {
        setShowRegister(true);
    };

    const navigateToLogin = () => {
        setShowRegister(false);
    };

    return (
        <div className="App">
            {!token && !showRegister && <Login onLogin={() => setToken(localStorage.getItem('token'))} navigateToRegister={navigateToRegister} />}
            {!token && showRegister && <Register navigateToLogin={navigateToLogin} />}
            {token && <Dashboard onLogout={handleLogout} />}
        </div>
    );
}

export default App;
