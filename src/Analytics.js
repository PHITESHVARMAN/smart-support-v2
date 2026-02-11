import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

function Analytics({ tickets }) {
  // 1. Calculate Data for "Tickets by Priority"
  const data = [
    { name: 'Low', count: tickets.filter(t => t.priority === 'Low').length },
    { name: 'Medium', count: tickets.filter(t => t.priority === 'Medium').length },
    { name: 'High', count: tickets.filter(t => t.priority === 'High').length },
    { name: 'Critical', count: tickets.filter(t => t.priority === 'Critical').length },
  ];

  return (
    <div style={{ marginTop: '30px', padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3>📊 Live Analytics: Ticket Priority</h3>
      <BarChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </div>
  );
}

export default Analytics;