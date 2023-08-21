import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return (
        <div className="App">
            {!token ? (
                <Login onLogin={() => setToken(localStorage.getItem('token'))} />
            ) : (
                <Dashboard onLogout={handleLogout} />
            )}
        </div>
    );
}

export default App;
