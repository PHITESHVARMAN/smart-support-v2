import React, { useState } from 'react';

function KnowledgeBase() {
  const [searchTerm, setSearchTerm] = useState('');

  // 🧠 Static Knowledge Data (Simulating a Database of answers)
  const articles = [
    { id: 1, title: "How to reset my password?", category: "Account", content: "Go to the login page and click 'Forgot Password'. Follow the email instructions." },
    { id: 2, title: "Internet is very slow", category: "Network", content: "Try restarting your router. If the issue persists, raise a ticket with your IP address." },
    { id: 3, title: "Printer is not connecting", category: "Hardware", content: "Ensure the printer is on the same WiFi network as your laptop." },
    { id: 4, title: "Blue Screen Error", category: "Software", content: "Take a photo of the error code and raise a High Priority ticket immediately." },
    { id: 5, title: "VPN connection failed", category: "Network", content: "Check if your internet is active. Try reconnecting to the VPN server 'US-East'." },
  ];

  // 🔍 Search Logic (Filters articles instantly)
  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ marginTop: '30px', padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #ddd' }}>
      <h3>📚 Knowledge Base (Self-Service)</h3>
      <p>Search for solutions before raising a ticket.</p>
      
      {/* Search Bar */}
      <input 
        type="text" 
        placeholder="🔍 Search for 'printer', 'slow', 'password'..." 
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '95%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc' }}
      />

      {/* Results Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {filteredArticles.map(article => (
          <div key={article.id} style={{ padding: '15px', border: '1px solid #eee', borderRadius: '5px', background: '#f9f9f9' }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#007BFF' }}>{article.title}</h4>
            <span style={{ fontSize: '12px', background: '#ddd', padding: '2px 6px', borderRadius: '4px' }}>{article.category}</span>
            <p style={{ fontSize: '14px', marginTop: '10px', color: '#555' }}>{article.content}</p>
          </div>
        ))}
      </div>
      
      {filteredArticles.length === 0 && <p style={{ color: 'red' }}>No articles found. Please raise a ticket.</p>}
    </div>
  );
}

export default KnowledgeBase;