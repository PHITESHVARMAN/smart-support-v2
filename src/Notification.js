import React from 'react';

function Notification({ message, onClose }) {
  if (!message) return null;

  return (
    <div style={styles.toast}>
      <div style={styles.icon}>🔔</div>
      <div>
        <strong>New Update</strong>
        <div style={{ fontSize: '12px' }}>{message}</div>
      </div>
      <button onClick={onClose} style={styles.close}>×</button>
    </div>
  );
}

const styles = {
  toast: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    background: 'white',
    borderLeft: '5px solid #007BFF',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    borderRadius: '4px',
    padding: '15px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    zIndex: 2000,
    animation: 'slideIn 0.5s ease-out',
    minWidth: '250px'
  },
  icon: { fontSize: '20px' },
  close: { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', marginLeft: 'auto', color: '#999' }
};

export default Notification;