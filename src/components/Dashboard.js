// Dashboard.js
import React, { useEffect } from 'react';

function Dashboard({ onLogout }) {
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            window.location.href = '/login';
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        onLogout();
        window.location.href = '/login';
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={handleLogout}>Çıkış Yap</button>
        </div>
    );
}

export default Dashboard;
