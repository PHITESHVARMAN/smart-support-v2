import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('General');
    const [priority, setPriority] = useState('Low');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // Knowledge Base Data
    const kbArticles = [
        { title: "How to reset my password?", category: "ACCOUNT", desc: "Go to login page and click 'Forgot Password'.", badgeColor: "#e1f5fe", textColor: "#01579b" },
        { title: "Internet is very slow", category: "NETWORK", desc: "Try restarting your router or check network cables.", badgeColor: "#ffebee", textColor: "#c62828" },
        { title: "Printer is not connecting", category: "HARDWARE", desc: "Ensure printer is on the same WiFi as your laptop.", badgeColor: "#f0f4f8", textColor: "#24292e" },
        { title: "Blue Screen Error", category: "SOFTWARE", desc: "Note error code and raise a High Priority ticket.", badgeColor: "#f5f5f5", textColor: "#616161" },
        { title: "VPN connection failed", category: "NETWORK", desc: "Try reconnecting to the 'IN-South' VPN server.", badgeColor: "#ffebee", textColor: "#c62828" }
    ];

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (!loggedInUser) {
            navigate('/login');
        } else {
            const userData = JSON.parse(loggedInUser);
            setUser(userData);
            fetchTickets(userData);
        }
    }, [navigate]);

    const fetchTickets = async (userData) => {
        try {
            const url = userData.role_id === 1 
                ? 'http://localhost:5000/api/tickets' 
                : `http://localhost:5000/api/my_tickets?user_id=${userData.id}`;
            const res = await axios.get(url);
            setTickets(res.data);
        } catch (err) { console.error("Fetch error:", err); }
    };

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/tickets', {
                title, description, priority, category, user_id: user.id
            });
            alert("✅ Ticket Created Successfully!");
            setTitle(''); setDescription('');
            fetchTickets(user); // Refresh the list immediately
        } catch (err) { alert("❌ Failed to create ticket."); }
    };

    // Admin Status Update
    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/tickets/${id}`, { status: newStatus });
            fetchTickets(user);
        } catch (err) { alert("Update failed"); }
    };

    const chartData = [
        { name: 'Low', count: tickets.filter(t => t.priority === 'Low').length },
        { name: 'Medium', count: tickets.filter(t => t.priority === 'Medium').length },
        { name: 'High', count: tickets.filter(t => t.priority === 'High').length },
        { name: 'Critical', count: tickets.filter(t => t.priority === 'Critical').length },
    ];

    if (!user) return <div style={{textAlign:'center', marginTop:'50px'}}>Loading...</div>;

    return (
        <div style={{ padding: '20px', backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" }}>
            
            {/* --- 1. HEADER --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '15px 25px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <h2 style={{ margin: 0, color: '#2c3e50' }}>👋 Welcome, {user.username} <span style={{ fontSize: '14px', color: '#95a5a6' }}>({user.role_id === 1 ? 'Admin' : 'Student'})</span></h2>
                <button onClick={() => { localStorage.clear(); navigate('/login'); }} style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
            </div>

            {/* --- 2. RAISE TICKET FORM (Visible if Role is 2) --- */}
            {user.role_id === 2 && (
                <div style={{ background: 'white', padding: '25px', marginTop: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderLeft: '5px solid #27ae60' }}>
                    <h3 style={{ marginTop: 0, color: '#2c3e50', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>➕ Raise New Ticket</h3>
                    <form onSubmit={handleCreateTicket} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginTop: '15px' }}>
                        <input type="text" placeholder="Title (e.g., PC Not Working)" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }} />
                        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }}>
                            <option value="General">General</option>
                            <option value="Network">Network</option>
                            <option value="Hardware">Hardware</option>
                            <option value="Software">Software</option>
                        </select>
                        <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }}>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>
                        <textarea placeholder="Describe your issue in detail..." value={description} onChange={(e) => setDescription(e.target.value)} required style={{ gridColumn: 'span 3', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', height: '80px' }} />
                        <button type="submit" style={{ gridColumn: 'span 1', backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Submit Ticket</button>
                    </form>
                </div>
            )}

            {/* --- 3. TICKET HISTORY --- */}
            <div style={{ background: 'white', padding: '25px', marginTop: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginTop: 0, color: '#2c3e50' }}>📜 Ticket History</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#007bff', color: 'white', textAlign: 'left' }}>
                            <th style={{ padding: '12px' }}>ID</th><th>Title</th><th>Category</th><th>Priority</th><th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.length > 0 ? tickets.map(t => (
                            <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px' }}>{t.id}</td><td>{t.title}</td><td>{t.category}</td>
                                <td><span style={{ padding: '3px 8px', borderRadius: '4px', backgroundColor: t.priority === 'Critical' ? '#e74c3c' : (t.priority === 'High' ? '#fd7e14' : '#28a745'), color: 'white', fontSize: '12px' }}>{t.priority}</span></td>
                                <td style={{ fontWeight: 'bold' }}>
                                    {user.role_id === 1 ? (
                                        <select value={t.status} onChange={(e) => handleStatusUpdate(t.id, e.target.value)} style={{ padding: '5px', borderRadius: '4px' }}>
                                            <option value="Open">Open</option><option value="In-Progress">In-Progress</option><option value="Resolved">Resolved</option><option value="Closed">Closed</option>
                                        </select>
                                    ) : (
                                        <span style={{ color: t.status === 'Open' ? '#e67e22' : '#27ae60' }}>{t.status}</span>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#888' }}>No tickets found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- 4. ANALYTICS --- */}
            <div style={{ background: 'white', padding: '25px', marginTop: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginTop: 0, color: '#2c3e50' }}>📊 Live Analytics</h3>
                <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                        <BarChart data={chartData}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="count" fill="#3498db" radius={[4,4,0,0]}/></BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* --- 5. KNOWLEDGE BASE --- */}
            <div style={{ background: 'white', padding: '25px', marginTop: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginTop: 0, color: '#2c3e50' }}>📚 Knowledge Base (Self-Service)</h3>
                <input type="text" placeholder="🔍 Search for solutions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', margin: '15px 0', backgroundColor: '#f9f9f9' }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    {kbArticles.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase())).map((article, index) => (
                        <div key={index} style={{ padding: '20px', border: '1px solid #eee', borderRadius: '10px', backgroundColor: '#fff' }}>
                            <h4 style={{ color: '#2980b9', margin: '0 0 10px 0' }}>{article.title}</h4>
                            <span style={{ fontSize: '10px', backgroundColor: article.badgeColor, color: article.textColor, padding: '3px 8px', borderRadius: '10px', fontWeight: 'bold' }}>{article.category}</span>
                            <p style={{ fontSize: '13px', color: '#7f8c8d', marginTop: '12px' }}>{article.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;