import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route: Redirect straight to Login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* The Login Page */}
        <Route path="/login" element={<Login />} />
        
        {/* The Dashboard Page (Where you go after login) */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Catch-all: If user types random URL, go to Login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;