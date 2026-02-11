import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TicketModal({ ticket, user, onClose }) {
  const [comments, setComments] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // 1. Load chat history when the window opens
  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/comments/${ticket.ticket_id}`);
      setComments(res.data);
    } catch (err) {
      console.error("Error loading chat", err);
    }
  };

  // 2. Send a new message
  const handleSend = async () => {
    if (!newMessage) return;
    
    try {
      await axios.post('http://localhost:5000/api/comments', {
        ticket_id: ticket.ticket_id,
        user_id: user.user_id,
        role_id: user.role_id,
        message: newMessage
      });
      setNewMessage(''); // Clear input
      fetchComments();   // Refresh chat immediately
    } catch (err) {
      alert("Failed to send message");
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <h3>💬 Chat: Ticket #{ticket.ticket_id}</h3>
          <button onClick={onClose} style={styles.closeBtn}>X</button>
        </div>

        {/* Ticket Info */}
        <div style={{background: '#f8f9fa', padding: '10px', marginBottom: '10px', borderRadius: '5px', fontSize: '14px'}}>
            <strong>Topic:</strong> {ticket.title} <br/>
            <strong>Status:</strong> {ticket.status}
        </div>

        {/* Chat History Box */}
        <div style={styles.chatBox}>
          {comments.length === 0 ? <p style={{color: '#888', textAlign: 'center'}}>No messages yet.</p> : null}
          
          {comments.map(c => (
            <div key={c.comment_id} style={{
              textAlign: c.user_id === user.user_id ? 'right' : 'left',
              margin: '8px 0'
            }}>
              <div style={{
                display: 'inline-block',
                padding: '8px 12px',
                borderRadius: '15px',
                background: c.user_id === user.user_id ? '#007BFF' : '#E9ECEF',
                color: c.user_id === user.user_id ? '#fff' : '#000',
                maxWidth: '80%'
              }}>
                <small style={{display: 'block', fontSize: '10px', opacity: 0.8, marginBottom: '2px'}}>
                    {c.username} ({c.role_id === 1 ? 'Admin' : 'User'})
                </small>
                {c.message}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div style={styles.inputArea}>
          <input 
            value={newMessage} 
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Type your reply here..." 
            style={styles.input}
          />
          <button onClick={handleSend} style={styles.sendBtn}>Send</button>
        </div>
      </div>
    </div>
  );
}

// Simple CSS Styles for the Modal
const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#fff', width: '500px', height: '600px', borderRadius: '10px', padding: '20px', display: 'flex', flexDirection: 'column', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' },
  closeBtn: { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#999' },
  chatBox: { flex: 1, overflowY: 'auto', border: '1px solid #ddd', padding: '10px', borderRadius: '5px', marginBottom: '10px', backgroundColor: '#fff' },
  inputArea: { display: 'flex', gap: '10px' },
  input: { flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' },
  sendBtn: { padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }
};

export default TicketModal;