import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import the navigation hook

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize the hook

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        try {
            // Send login request to Backend
            const res = await axios.post('http://localhost:5000/api/login', { 
                username, 
                password 
            });

            if (res.status === 200) {
                // 1. Save user info to Local Storage so Dashboard knows who is logged in
                localStorage.setItem('user', JSON.stringify(res.data.user));
                
                // 2. REDIRECT immediately to Dashboard (No alert pop-up)
                navigate('/dashboard');
            }
        } catch (err) {
            console.error(err);
            setError('Invalid username or password'); // Show error on screen instead of alert
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Smart Support Login</h2>
                
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                        style={styles.input}
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={styles.input}
                    />
                    <button type="submit" style={styles.button}>Login</button>
                </form>
            </div>
        </div>
    );
};

// Simple internal CSS for a clean look matching your screenshot
const styles = {
    container: {
        display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5'
    },
    card: {
        width: '350px', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', backgroundColor: 'white'
    },
    input: {
        padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc'
    },
    button: {
        padding: '10px', fontSize: '16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'
    }
};

export default Login;